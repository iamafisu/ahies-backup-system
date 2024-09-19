import os
import io
import zipfile
import base64
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from dotenv import load_dotenv
load_dotenv()  # Loads environment variables from a .env file

app = Flask(__name__)
CORS(app)

SCOPES = ['https://www.googleapis.com/auth/drive.file']
# SERVICE_ACCOUNT_FILE = 'credentials.json'
SHARED_FOLDER_ID = os.getenv('SHARED_GOOGLE_DRIVE_FOLDER_ID')

# Load Google Drive service account credentials from environment variable
encoded_credentials = os.getenv('GOOGLE_CREDENTIALS')
if not encoded_credentials:
    raise ValueError("No Google credentials provided")

# Decode the Base64 string and load it as JSON
credentials_json = base64.b64decode(encoded_credentials).decode('utf-8')
credentials_info = json.loads(credentials_json)

# Create the credentials object
credentials = service_account.Credentials.from_service_account_info(
    credentials_info, scopes=SCOPES)

# # Load Google Drive service account credentials
# credentials = service_account.Credentials.from_service_account_file(
#     SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('drive', 'v3', credentials=credentials)

def get_or_create_team_folder(team_name):
    # Check if a folder for the team already exists
    query = f"mimeType='application/vnd.google-apps.folder' and name='{team_name}' and '{SHARED_FOLDER_ID}' in parents"
    response = service.files().list(q=query, fields="files(id, name)").execute()
    folders = response.get('files', [])
    
    if folders:
        # Folder exists, return its ID
        return folders[0]['id']
    else:
        # Folder doesn't exist, create it
        folder_metadata = {
            'name': team_name,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [SHARED_FOLDER_ID]
        }
        folder = service.files().create(body=folder_metadata, fields='id').execute()
        return folder['id']

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        files = request.files.getlist('files')
        user_id = request.form['id']
        team_name = request.form['team']
        replace = request.form.get('replace', 'false')  # Check if user wants to replace the existing file
        
        if not files or not user_id or not team_name:
            return jsonify({"error": "No files, ID, or team provided"}), 400

        # Get or create the team folder
        team_folder_id = get_or_create_team_folder(team_name)

        # Check if a file with the same user ID already exists in the team folder
        query = f"name = '{user_id}.zip' and '{team_folder_id}' in parents"
        response = service.files().list(q=query, fields="files(id, name)").execute()
        existing_files = response.get('files', [])

        if existing_files and replace == 'false':
            return jsonify({"exists": True, "message": "File already exists"}), 200

        # If the file exists and the user wants to replace it, delete the old file
        if existing_files and replace == 'true':
            for file in existing_files:
                service.files().delete(fileId=file['id']).execute()

        # Create a ZIP file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for file in files:
                filename = f"{user_id}_{file.filename}"
                zip_file.writestr(filename, file.read())

        zip_buffer.seek(0)  # Rewind the buffer

        # Upload the zip file to Google Drive in the team folder
        media = MediaIoBaseUpload(zip_buffer, mimetype='application/zip')
        file_metadata = {
            'name': f'{user_id}.zip',
            'mimeType': 'application/zip',
            'parents': [team_folder_id]  # Upload to the team folder
        }

        uploaded_file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()

        return jsonify({"message": "Files uploaded successfully", "file_id": uploaded_file.get('id')}), 200
    
    except Exception as e:
        print(f"Error during file upload: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

import React from 'react';

function Help() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">How to Use the AHIES Backup System</h1>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Step 1: Select Your Team</h2>
          <p>Use the dropdown to select your team from the list. Each team has its own designated folder where your files will be uploaded.</p>
        </div>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Step 2: Enter Your 4-digit Login ID</h2>
          <p>Input your 4-digit login ID in the text field. This ID will be used to rename and zip your files before uploading.</p>
        </div>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Step 3: Select Files to Upload</h2>
          <p>Click on the "Choose Files" button to select the files you wish to upload. You can select multiple files at once.</p>
        </div>
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Step 4: Upload</h2>
          <p>Once you've selected your files and entered your login ID, click the "Upload" button. You will see a message confirming the upload status.</p>
        </div>
        <div className="text-center">
          <a href="/" className="text-blue-500 underline">Back to Upload Page</a>
        </div>
      </div>
    </div>
  );
}

export default Help;

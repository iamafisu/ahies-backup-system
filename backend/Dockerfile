# backend/Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .

# Use Gunicorn to serve Flask app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "app:app"]


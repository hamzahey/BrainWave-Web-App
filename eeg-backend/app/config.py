import os

# Configuration for the Flask app
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "uploads")
DEBUG = True
PORT = 5001
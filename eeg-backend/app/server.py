from flask import Flask, request, jsonify
import wfdb
import os
import traceback
from flask_cors import CORS
from inference_utils import load_model, run_inference
import tempfile
import zipfile
from helper_code import find_data_folders
from team_code import load_challenge_models, run_challenge_models

app = Flask(__name__)

CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model_path = "./eeg_model.pth"
try:
    model = load_model(model_path)
except Exception as e:
    print(f"Warning: Could not load model from {model_path}: {e}")
    model = None

# Initialize models flag
_models_loaded = False
models = None
MODEL_FOLDER = './model'

# Model loading functions
def load_models():
    global models, _models_loaded
    if not _models_loaded:
        try:
            models = load_challenge_models(MODEL_FOLDER, verbose=1)
            _models_loaded = True
        except Exception as e:
            print(f"Error loading models: {e}")
            traceback.print_exc()
            # Initialize with default models to avoid crashing
            models = {
                'imputer': None,
                'scaler': None,
                'outcome_model': None,
                'cpc_model': None,
                'dl_model': None
            }

@app.before_request
def initialize_models():
    load_models()

def find_root_folder(base_path):
    if find_data_folders(base_path):
        return base_path

    items = os.listdir(base_path)
    for item in items:
        item_path = os.path.join(base_path, item)
        if os.path.isdir(item_path) and find_data_folders(item_path):
            return item_path
    
    for root, dirs, files in os.walk(base_path):
        if find_data_folders(root):
            return root
    return base_path

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    with tempfile.TemporaryDirectory() as temp_dir:
        # Save uploaded zip
        zip_path = os.path.join(temp_dir, 'upload.zip')
        file.save(zip_path)
        
        # Extract all contents
        data_folder = os.path.join(temp_dir, 'extracted')
        os.makedirs(data_folder, exist_ok=True)
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(data_folder)
        except zipfile.BadZipFile:
            return jsonify({'error': 'Invalid ZIP file format'}), 400

        # Find the actual data root folder
        data_root = find_root_folder(data_folder)
        if not find_data_folders(data_root):
            return jsonify({'error': 'No valid patient data found in ZIP structure'}), 400

        # Process each patient
        results = []
        for pid in find_data_folders(data_root):
            try:
                outcome, prob, cpc = run_challenge_models(
                    models, data_root, pid, verbose=1  # Set verbose to 1 for debugging output
                )
                results.append({
                    'patient_id': pid,
                    'outcome': int(outcome),
                    'outcome_probability': float(prob),
                    'cpc': float(cpc)
                })
            except Exception as e:
                print(f"Error processing patient {pid}: {e}")
                traceback.print_exc()
                results.append({
                    'patient_id': pid,
                    'error': str(e),
                    'traceback': traceback.format_exc()
                })

        return jsonify({'patients': results})

@app.route("/upload", methods=["POST"])
def upload_file():
    if "files" not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")
    if len(files) < 2:
        return jsonify({"error": "Please upload both .hea and .dat files"}), 400

    file_paths = {}
    for file in files:
        file_ext = file.filename.split(".")[-1]
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        file_paths[file_ext] = file_path

    if "hea" not in file_paths or "mat" not in file_paths:
        return jsonify({"error": "Both .hea and .mat files are required"}), 400

    try:
        record_name = file_paths["hea"].replace(".hea", "")
        record = wfdb.rdrecord(record_name)
        signal = record.p_signal.tolist()
        fs = record.fs  # Sampling frequency

        return jsonify({"fs": fs, "eeg_data": signal})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/infer", methods=["POST"])
def infer():
    try:
        data = request.json
        root_dir = data.get("directory_path")

        test_preds = run_inference(model, root_dir)

        return jsonify({"test_preds": test_preds})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
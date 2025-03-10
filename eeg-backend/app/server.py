from flask import Flask, request, jsonify
import wfdb
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

if __name__ == "__main__":
    app.run(debug=True, port=5001)

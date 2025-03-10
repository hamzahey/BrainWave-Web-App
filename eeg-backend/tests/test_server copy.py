import requests

url = "http://localhost:5001/upload"

hea_file_path = "/home/hamzahey/FYP WEB APP/eeg-backend/app/0296_005_006_EEG.hea"
dat_file_path = "/home/hamzahey/FYP WEB APP/eeg-backend/app/0296_005_006_EEG.dat"

files = [
    ("files", open(hea_file_path, "rb")),
    ("files", open(dat_file_path, "rb"))
]


response = requests.post(url, files=files)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
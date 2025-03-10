import requests
import os 

url = "http://localhost:5001/upload"

current_dir = os.path.dirname(__file__)
hea_file_path = os.path.join(current_dir, '0296_005_006_EEG.hea')
dat_file_path = os.path.join(current_dir, '0296_005_006_EEG.mat')

files = [
    ("files", open(hea_file_path, "rb")),
    ("files", open(dat_file_path, "rb"))
]


response = requests.post(url, files=files)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
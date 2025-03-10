import requests

url = "http://127.0.0.1:5001/infer"
data = {"directory_path": "/home/hamzahey/Test data/training"}

response = requests.post(url, json=data)

print("Response:", response.json())

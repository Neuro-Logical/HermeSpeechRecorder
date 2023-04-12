import json
import requests
import sys

assign_task_url = "http://localhost:3000/user/assign_task"

request_data = json.dumps({"user_id": str(sys.argv[1]), "script_id": str(sys.argv[2])})
print(request_data)
res = requests.post(assign_task_url, data=request_data, headers={"Content-Type": "application/json"})
print(res.json())
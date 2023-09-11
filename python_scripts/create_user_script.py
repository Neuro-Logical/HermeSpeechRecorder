import json
import requests
import sys

create_user_url = "/api/user/create"

request_data = json.dumps({"user_id": str(sys.argv[1])})
res = requests.post(create_user_url, data=request_data, headers={"Content-Type": "application/json"})
print(res.json())
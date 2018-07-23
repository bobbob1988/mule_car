import os
import redis
import json

data_keys = ["VehicleState", "BatteryState", "ThermoState"]

r = redis.Redis()

for redis_key in data_keys:
    filename = redis_key + ".json"
    if os.path.isfile(filename) and os.access(filename, os.R_OK):
        print (filename)
        data = json.loads(open(filename, 'r').read())
        r.set(redis_key, json.dumps(data))


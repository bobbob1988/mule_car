import sys
import redis
import json

data_keys = ["VehicleState", "BatteryState", "ThermoState"]

if len(sys.argv) < 2:
    print ("Usage: %s [redis host]" % sys.argv[0])
    sys.exit(0)

r = redis.Redis(
    host=sys.argv[1]
)

for redis_key in data_keys:
    data = r.get(redis_key)
    if data is not None:
        with open(redis_key + ".json", 'w') as fd:
            fd.write(json.dumps(json.loads(data), indent=2))


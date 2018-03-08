import redis
import json
import threading
import random

def setValue():
	threading.Timer(1, setValue).start()

	r = redis.StrictRedis(host='10.21.51.156', port=6379, db=0)

	gear = ['P', 'N', 'R', 'D', 'S']

	# Set the key `obj` to some object
	r.set('speed', random.randint(0, 200))
	r.set('power', random.randint(20, 800))
	#r.set('gear', random.choice(gear) )

	data= [
       {'battery_mile': 500, 'battery_percentage': '37%'}
	]

	batteryData = {'battery_mile': 500, 'battery_percentage': '37%'}

	json_data = json.dumps(batteryData)
	r.set('battery_status', json_data)

def setTepValue():
	threading.Timer(10, setTepValue).start()

	r = redis.StrictRedis(host='10.21.51.156', port=6379, db=0)

	temperature = {'frontphA': random.randint(-40, 20), 'frontphB': random.randint(-40, 216),
                  'frontphC': random.randint(-40, 216), 'frontcoolant': random.randint(-40, 100),
                  'frontwinding1': random.randint(150, 216), 'frontwinding2': random.randint(-40, 216),
                  'rearphA': random.randint(-40, 20), 'rearphB': random.randint(-40, 216),
                  'rearphC': random.randint(-40, 216), 'rearcoolant': random.randint(-40, 100),
                  'rearwinding1': random.randint(150, 216), 'rearwinding2': random.randint(-40, 216)
                  }
	json_data_temperature = json.dumps(temperature)
	r.set('thermal', json_data_temperature)


setValue()
setTepValue()



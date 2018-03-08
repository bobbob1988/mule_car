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


def setTepValue():
	threading.Timer(10, setTepValue).start()

	r = redis.StrictRedis(host='10.21.51.156', port=6379, db=0)

	temperature = {'frontMotorSinkPhaseATemp': random.randint(-40, 20), 'frontMotorSinkPhaseBTemp': random.randint(-40, 216),
                  'frontMotorSinkPhaseCTemp': random.randint(-40, 216), 'frontMotorCoolantTemp': random.randint(-40, 100),
                  'frontMotorWindingTemp1': random.randint(150, 216), 'frontMotorWindingTemp2': random.randint(-40, 216),
                  'rearMotorSinkPhaseATemp': random.randint(-40, 20), 'rearMotorSinkPhaseBTemp': random.randint(-40, 216),
                  'rearMotorSinkPhaseCTemp': random.randint(-40, 216), 'rearMotorCoolantTemp': random.randint(-40, 100),
                  'rearMotorWindingTemp1': random.randint(150, 216), 'rearMotorWindingTemp2': random.randint(-40, 216)
                  }
	json_data_temperature = json.dumps(temperature)
	r.set('thermal', json_data_temperature)


	batteryData = {'battery_mile': 500, 'battery_percentage': random.randint(0, 100)}

	json_data = json.dumps(batteryData)
	r.set('battery_status', json_data)

setValue()
setTepValue()



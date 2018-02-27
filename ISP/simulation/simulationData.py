import redis
import json
import threading
import random

def setValue():
	threading.Timer(1, setValue).start()

	r = redis.StrictRedis(host='10.21.51.156', port=6379, db=0)

	# Set the key `obj` to some object
	r.set('speed', random.randint(0, 200))
	r.set('power', random.randint(-80, 200))

setValue()




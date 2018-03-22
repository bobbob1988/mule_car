import time 
import redis
import string
import csv
import numpy as np
from redis import StrictRedis

redis = StrictRedis(host='127.0.0.1', port=6379, db=0)
client = StrictRedis(host='127.0.0.1', port=6379, db=0)
pubsub = redis.pubsub()
string = list()

f = open('log.csv', 'w')

def event_handler(msg):
    msgArray = str(msg).split(':')
    msgSubArray = msgArray[2].split("'")
    msg = msgSubArray[0]  
    print('Handler', msg)
    value = redis.get(msg)
    #print(value)
    string.append(value)
    if(len(string) == 200):
    	print(string)
    	np.savetxt(f,string, delimiter=",", fmt="%s")
    	string[:] = []

pubsub.psubscribe(**{'__keyspace@0__:FrontMotorData': event_handler})
pubsub.psubscribe(**{'__keyspace@0__:RearMotorData': event_handler})
pubsub.psubscribe(**{'__keyspace@0__:VehicleState': event_handler})

print('Starting message loop') 
while True:  
    message = pubsub.get_message()
    if message:
        #print(message)
        value = redis.get('testFrontMotorData')
        #print(value)
    else:
        time.sleep(0.01)
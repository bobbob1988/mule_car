import time 
import redis
import string
import csv
import numpy as np
from redis import StrictRedis

redis = StrictRedis(host='10.21.51.156', port=6379, db=0)
client = StrictRedis(host='127.0.0.1', port=6379, db=0)
pubsub = redis.pubsub()
string = list()

#define log file with current timestamp
now = time.strftime('%d%m%Y%H%M%S')
filename = 'C:/Project/mule-car/log/' + now + '.csv'
#file create
f = open(filename, 'w')

def event_handler(msg):
    msgArray = str(msg).split(':')
    msgSubArray = msgArray[2].split("'")
    msg = msgSubArray[0]  
    #print('Handler', msg)
    value = redis.get(msg)
    #Find the gear value
    gearArray = value.split(':')
    gear = gearArray[2]
    gearNumberArray = gear.split(',')
    gearNumber = gearNumberArray[0]
    print(gearNumber)
    string.append(value)
    #print(string)
    if(len(string) == 200):
    	#print(string)
    	pass#np.savetxt(f,gearNumber, delimiter=",", fmt="%s")
    	#string[:] = []

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
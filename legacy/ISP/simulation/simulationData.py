import redis
import json
import threading
import random
import time

def setValue():
    threading.Timer(1, setValue).start()

    r = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)

    gear = ['P', 'N', 'R', 'D', 'S']

    # Set the key `obj` to some object
    r.set('speed', random.randint(0, 200))
    r.set('power', random.randint(20, 800))
    #r.set('gear', random.choice(gear) )

    data= [
             {'battery_mile': 500, 'battery_percentage': '37%'}
    ]

    motorData = {'frontMotorTorque': 50.8, 'rearMotorTorque': 300.8, 'frontMotorSpeed': 0,'frontMotorTemperature' : {'frontMotorWindingTemp1':0,'frontMotorWindingTemp2':0,'frontMotorCoolantTemp':0,'frontMotorSinkPhaseATemp':0,'frontMotorSinkPhaseBTemp':0,'frontMotorSinkPhaseCTemp':0},'timestamp':0}

    json_data = json.dumps(motorData)
    r.set('MotorExampleTest', json_data)


def setTepValue():
    threading.Timer(0.05, setTepValue).start()

    gear = [0,1,2,3]

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
    vehicleData = {'vehicleSpeed':random.randint(-50,200), 'stateOfCharge':33.7, 'vehicleGear': 0, 'timestamp':0}
    frontMotorData = {'frontMotorTorque':random.uniform(-40,400)}
    rearMotorData = {'rearMotorTorque':random.uniform(-40,400)}

    json_data = json.dumps(batteryData)
    json_vehicle_data = json.dumps(vehicleData)
    json_front_data = json.dumps(frontMotorData)
    json_rear_data = json.dumps(rearMotorData)
    r.set('battery_status', json_data)
    r.set('VehicleState', json_vehicle_data)
    r.set('testFrontMotorData', json_front_data)
    r.set('testRearMotorData', json_rear_data)

def setFlagValue():
    threading.Timer(1, setFlagValue).start()

    r = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)
    flag = {'flag': 0}
    data = json.dumps(flag)
    r.set('flag', data)

    time.sleep(10)

    flag1 = {'flag': 1}
    data = json.dumps(flag1)
    r.set('flag', data)


setValue()
setTepValue()
setFlagValue()



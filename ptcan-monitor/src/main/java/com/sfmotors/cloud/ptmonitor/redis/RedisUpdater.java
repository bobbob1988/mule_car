package com.sfmotors.cloud.ptmonitor.redis;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class RedisUpdater {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private VehicleStatusFactory vehicleStatusFactory;
    @Autowired
    private BatteryModuleFactory batteryModuleFactory;
    @Autowired
    private ThermoStateFactory thermoStateFactory;

    public static final String VEHICLE_STATUS_KEY = "VehicleState";
    public static final String BATTERY_STATUS_KEY = "BatteryState";
    public static final String THERMO_STATUS_KEY = "ThermoState";
    public static final String[] MCU_IDS = {"F0", "R0"};

    @Scheduled(fixedRate = 1000)
    public void update1Hz() {
        long startTime = System.currentTimeMillis();
        Map<String, BatteryModule> batteryModules = new HashMap<>();
        for (int moduleId = 1; moduleId <= 13; moduleId++){
            BatteryModule batteryModule = batteryModuleFactory.buildBatteryModule(moduleId);
            batteryModules.put("module_"+ moduleId, batteryModule);
        }
        redisTemplate.opsForValue().set(BATTERY_STATUS_KEY, batteryModules);
        Map<String, ThermoState> thermoStates = new HashMap<>();
        for (String mcuId : MCU_IDS){
            ThermoState thermoState = thermoStateFactory.buildThermoStae(mcuId);
            thermoStates.put("MCU_"+mcuId, thermoState);
        }
        redisTemplate.opsForValue().set(THERMO_STATUS_KEY, thermoStates);
        log.debug("1Hz thread elapse: " + (System.currentTimeMillis() - startTime));
    }


    @Scheduled(fixedRate = 200)
    public void update5Hz(){
        long startTime = System.currentTimeMillis();
        VehicleStatus vehicleStatus = vehicleStatusFactory.buildVehicleStatus();
        redisTemplate.opsForValue().set(VEHICLE_STATUS_KEY, vehicleStatus);
        log.debug("5Hz thread elapse: " + (System.currentTimeMillis() - startTime));
    }
}

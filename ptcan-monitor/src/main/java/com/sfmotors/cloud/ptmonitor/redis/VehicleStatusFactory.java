package com.sfmotors.cloud.ptmonitor.redis;

import com.sfmotors.cloud.ptmonitor.comm.PTSignalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class VehicleStatusFactory {

    @Autowired
    private PTSignalUtil ptSignalUtil;

    public static final String SPEED_SIGNAL_PROP = "vcu_vehicleSpeed";
    public static final String GEAR_SIGNAL_PROP = "vcu_gear";
    public static final String BATTERY_PERCENT_PROP = "bms_soc";
    public static final String FRONT_TORQUE = "mcuf0_Torque";
    public static final String REAR_TORQUE = "mcur0_Torque";


    public VehicleStatus buildVehicleStatus(){
        Optional<Float> vehicleSpeed = Optional.ofNullable(ptSignalUtil.getSignalByPropName(SPEED_SIGNAL_PROP));
        Optional<String> vehicleGear = Optional.ofNullable(ptSignalUtil.getSignalValueByPropName(GEAR_SIGNAL_PROP));
        Optional<Float> batteryCharge = Optional.ofNullable(ptSignalUtil.getSignalByPropName(BATTERY_PERCENT_PROP));
        Optional<Float> frontTorque = Optional.ofNullable(ptSignalUtil.getSignalByPropName(FRONT_TORQUE));
        Optional<Float> rearTorque = Optional.ofNullable(ptSignalUtil.getSignalByPropName(REAR_TORQUE));
        VehicleStatus vehicleStatus = VehicleStatus.builder()
                .vehicleSpeed(vehicleSpeed.orElse(Float.valueOf(0)))
                .vehicleGear(vehicleGear.orElse("-"))
                .stateOfCharge(batteryCharge.orElse(Float.valueOf(0)))
                .frontMotorTorque(frontTorque.orElse(Float.valueOf(0)))
                .rearMotorTorque(rearTorque.orElse(Float.valueOf(0)))
                .timestamp(System.currentTimeMillis()).build();
        return vehicleStatus;
    }
}

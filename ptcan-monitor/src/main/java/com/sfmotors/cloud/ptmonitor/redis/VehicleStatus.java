package com.sfmotors.cloud.ptmonitor.redis;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleStatus {
    private float vehicleSpeed;
    private String vehicleGear;
    private float stateOfCharge;
    private float frontMotorTorque;
    private float rearMotorTorque;
    private long timestamp;
}

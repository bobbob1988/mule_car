package com.sfmotors.cloud.ptmonitor.redis;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class BatteryModule {
    private int moduleId;
    private Map<String, Float> cellBlockVolt;
    private Map<String, Float> tempSensor;
    private long timestamp;
}

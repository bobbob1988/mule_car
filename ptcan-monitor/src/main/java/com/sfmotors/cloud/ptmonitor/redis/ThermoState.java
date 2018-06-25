package com.sfmotors.cloud.ptmonitor.redis;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ThermoState {
    private Map<String, Float> temperatures;
    private long timestamp;
}

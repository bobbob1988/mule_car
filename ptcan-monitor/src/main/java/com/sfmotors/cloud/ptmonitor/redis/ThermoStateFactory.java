package com.sfmotors.cloud.ptmonitor.redis;

import com.sfmotors.cloud.ptmonitor.comm.PTSignalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class ThermoStateFactory {
    @Autowired
    private PTSignalUtil ptSignalUtil;

    @Autowired
    private SigNameMapper sigNameMapper;

    public static final String MCU_TEMP_PROP = "mcu_temperature";
    public static final String[] thermoKeys = {
        "HeatSinkPhA",
        "HeatSinkPhB",
        "HeatSinkPhC",
        "EndWinding1",
        "EndWinding2",
        "Coolant"
    };

    public ThermoState buildThermoStae(String mcuId) {
        String mcuIdUpper = mcuId.toUpperCase();
        String mcuIdLower = mcuId.toLowerCase();
        Map<String, Float> temperatures = new HashMap<>();
        for (String thermoKey : thermoKeys) {
            String tempKey = String.format(sigNameMapper.getProp(MCU_TEMP_PROP), mcuIdUpper, mcuIdLower, thermoKey);
            Optional<Float> mcuTemp = Optional.ofNullable(ptSignalUtil.getSignalBySigName(tempKey));
            temperatures.put(thermoKey, mcuTemp.orElse(Float.valueOf(0)));
        }
        return ThermoState.builder().temperatures(temperatures)
                .timestamp(System.currentTimeMillis()).build();
    }
}

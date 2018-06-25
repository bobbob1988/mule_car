package com.sfmotors.cloud.ptmonitor.redis;

import com.sfmotors.cloud.ptmonitor.comm.PTSignalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class BatteryModuleFactory {

    @Autowired
    private PTSignalUtil ptSignalUtil;

    @Autowired
    private SigNameMapper sigNameMapper;

    public static final String MODULE_VOLT_PROP = "bms_moduleVolt";
    public static final String MODULE_TEMP_PROP = "bms_moduleTemp";

    public BatteryModule buildBatteryModule(int moduleId) {
        Map<String, Float> cellBlockVolt = new HashMap<>();
        for (int blockId=1; blockId<=12; blockId++){
            int muxId = (moduleId - 1) * 2 + ((blockId -1) / 6);
            String blockVoltKey = String.format(sigNameMapper.getProp(MODULE_VOLT_PROP), moduleId, blockId, muxId);
            Optional<Float> cellVolt = Optional.ofNullable(ptSignalUtil.getSignalBySigName(blockVoltKey));
            cellBlockVolt.put("block-"+blockId, cellVolt.orElse(Float.valueOf(0)));
        }
        Map<String, Float> moduleTemp = new HashMap<>();
        for (int sensorId=1; sensorId<=5; sensorId++) {
            int muxId = moduleId - 1;
            String tempSensorKey = String.format(sigNameMapper.getProp(MODULE_TEMP_PROP), moduleId, sensorId, muxId);
            Optional<Float> sensorTemp = Optional.ofNullable(ptSignalUtil.getSignalBySigName(tempSensorKey));
            moduleTemp.put("sensor-"+sensorId, sensorTemp.orElse(Float.valueOf(0)));
        }
        BatteryModule batteryModule = BatteryModule.builder()
                .moduleId(moduleId)
                .cellBlockVolt(cellBlockVolt)
                .tempSensor(moduleTemp)
                .timestamp(System.currentTimeMillis()).build();
        return batteryModule;
    }
}

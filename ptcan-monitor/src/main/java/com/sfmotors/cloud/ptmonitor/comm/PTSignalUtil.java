package com.sfmotors.cloud.ptmonitor.comm;

import com.sfmotors.cloud.ptmonitor.PTDataCache;
import com.sfmotors.cloud.ptmonitor.redis.SigNameMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PTSignalUtil {

    @Autowired
    PTDataCache ptDataCache;
    @Autowired
    private PTSignalConfManager ptSignalConfManager;
    @Autowired
    private SigNameMapper sigNameMapper;

    public Float getSignalBySigName(String sigName) {
        try {
            PTSignalConf ptSignalConf = ptSignalConfManager.getSignalConfig(sigName);
            PTMessage ptMessage = ptDataCache.get(ptSignalConf.getMsgId());
            return ptMessage.getSignal(ptSignalConf);
        } catch (NullPointerException e) {
            return null;
        }
    }

    public String getSignalValueBySigName(String sigName) {
        try {
            PTSignalConf ptSignalConf = ptSignalConfManager.getSignalConfig(sigName);
            PTMessage ptMessage = ptDataCache.get(ptSignalConf.getMsgId());
            return ptMessage.getSignalValue(ptSignalConf);
        } catch (NullPointerException e) {
            return null;
        }
    }

    public Float getSignalByPropName(String signalPropName) {
        try {
            String sigName = sigNameMapper.getProp(signalPropName);
            return getSignalBySigName(sigName);
        } catch (NullPointerException e) {
            return null;
        }
    }

    public String getSignalValueByPropName(String signalPropName) {
        try {
            String sigName = sigNameMapper.getProp(signalPropName);
            return getSignalValueBySigName(sigName);
        } catch (NullPointerException e) {
            return null;
        }
    }
}

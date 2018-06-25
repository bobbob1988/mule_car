package com.sfmotors.cloud.ptmonitor.comm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ConfigurationProperties
public class PTSignalConfManager {

    private ConcurrentHashMap<String, PTSignalConf> configTable = new ConcurrentHashMap<>();
    private ConcurrentHashMap<Integer, PTMuxIdConfig> muxMsgIdConfig = new ConcurrentHashMap<>();

    @Value("${ptmonitor.config.ptcan}")
    private String configFileName;

    @PostConstruct
    protected void init() throws java.io.IOException {
        String configFile = Paths.get(System.getProperty("user.home"), configFileName).toString();
        File file = new File(configFile);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(new File(configFile));
        for (JsonNode node: root.get("allSignals")) {
            PTSignalConf signal = objectMapper.treeToValue(node, PTSignalConf.class);
            configTable.put(signal.getName(), signal);
        }
        Iterator<Map.Entry<String, JsonNode>> it = root.get("muxConfigs").fields();
        while (it.hasNext()) {
            Map.Entry<String, JsonNode> entry = it.next();
            JsonNode value = entry.getValue();
            PTMuxIdConfig ptMuxIdConfig = new PTMuxIdConfig(value.get(0).asInt(), value.get(1).asInt());
            muxMsgIdConfig.put(Integer.parseInt(entry.getKey()), ptMuxIdConfig);
        }
    }

    public boolean isMuxMessage(int msgId) {
        return muxMsgIdConfig.containsKey(msgId);
    }

    public PTSignalConf getSignalConfig(String sigName) {
        return configTable.get(sigName);
    }

    public PTMuxIdConfig getMuxMessageConfig(int msgId){
        return muxMsgIdConfig.get(msgId);
    }

    public String toString(){
        StringBuffer buf = new StringBuffer();
        configTable.forEach((key,value)-> {
            buf.append(key + ": ");
            buf.append(value + "\n");
        });
        buf.append("\n mux message configuration:\n" + muxMsgIdConfig.toString());
        return buf.toString();
    }
}

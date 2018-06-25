package com.sfmotors.cloud.ptmonitor;

import com.sfmotors.cloud.ptmonitor.comm.PTMessage;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PTDataCache {

    private ConcurrentHashMap<String, PTMessage> cache = new ConcurrentHashMap<>();

    public void set(String id, PTMessage message) {
        message.setTimestamp(System.currentTimeMillis());
        cache.put(id, message);
    }

    public PTMessage get(String id) {
        if (cache.containsKey(id)) {
            PTMessage message = cache.get(id);
            // Check message expiration time
            if (!message.isExpired()) {
                return message;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

}

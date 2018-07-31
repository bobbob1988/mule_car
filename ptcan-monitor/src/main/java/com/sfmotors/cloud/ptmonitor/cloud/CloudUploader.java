package com.sfmotors.cloud.ptmonitor.cloud;

import com.google.common.collect.EvictingQueue;
import com.sfmotors.cloud.ptmonitor.MuleConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@ConfigurationProperties
public class CloudUploader {

    @Autowired
    private DataLogger dataLogger;

    @Autowired
    private MuleConfig muleConfig;
    private String VIN;
    private String aliCloud;

    @PostConstruct
    protected void init() {
        VIN = muleConfig.getProp("VIN");
        aliCloud = muleConfig.getProp("alicloud");
    }

    private RestTemplate restTemplate = new RestTemplate();

    //Upload every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void uploadAliCloud(){
        EvictingQueue<LogEntry> data = dataLogger.getDataAndClear();
        // upload to cloud
        if (data.size() > 0) {
            log.debug("Uploading data size: " + data.size());
            Map<String, Object> postObj = new HashMap<>();
            postObj.put("data", data);
            postObj.put("vin", VIN);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(postObj);
            try {
                ResponseEntity<String> response = restTemplate.exchange(aliCloud, HttpMethod.POST, request, String.class);
                if (response.getStatusCode() != HttpStatus.OK) {
                    logToFile(data);
                } else {
                    log.debug("cloud upload succeeded");
                }
            } catch(Exception e) {
                logToFile(data);
            }
        } else {
            log.debug("no data");
        }
    }

    protected void logToFile(EvictingQueue<LogEntry> data) {
        log.trace(data.toString());
    }

}

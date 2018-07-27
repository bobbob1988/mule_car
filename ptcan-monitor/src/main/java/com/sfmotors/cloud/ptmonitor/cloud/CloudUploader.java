package com.sfmotors.cloud.ptmonitor.cloud;

import com.google.common.collect.EvictingQueue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@ConfigurationProperties
public class CloudUploader {

    @Value("${cloud.alicloud}")
    private String aliCloud;

    @Autowired
    private DataLogger dataLogger;

    private RestTemplate restTemplate = new RestTemplate();

    //Upload every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void uploadAliCloud(){
        EvictingQueue<LogEntry> data = dataLogger.getDataAndClear();
        // upload to cloud
        if (data.size() > 0) {
            log.debug("Uploading data size: " + data.size());
            HttpEntity<EvictingQueue<LogEntry>> request = new HttpEntity<>(data);
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

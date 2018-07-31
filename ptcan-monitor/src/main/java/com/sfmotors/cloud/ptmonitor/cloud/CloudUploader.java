package com.sfmotors.cloud.ptmonitor.cloud;

import com.google.common.collect.EvictingQueue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Slf4j
@Component
@ConfigurationProperties
public class CloudUploader {

    @Value("${cloud.alicloud}")
    private String aliCloud;

    @Autowired
    private DataLogger dataLogger;

    private RestTemplate restTemplate = new RestTemplate();

    private Properties muleConfig = new Properties();
    private String MULE_CONFIG_FILE = "mule.properties";

    private String VIN;

    @PostConstruct
    protected void init() throws IOException {
        try {
            String propFile = Paths.get(System.getProperty("user.home"), MULE_CONFIG_FILE).toString();
            this.muleConfig.load(new FileInputStream(propFile));
            System.out.println("Loading mule car configuration file: ~/" + MULE_CONFIG_FILE);
            this.VIN = muleConfig.getProperty("VIN");
        } catch (IOException e) {
            System.err.println("Cannot read mule car config file: ~/" + MULE_CONFIG_FILE + "\n" + e.getMessage());
            System.err.println("You can find the sample configuration in gitroot/config directory");
            throw e;
        }
    }

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

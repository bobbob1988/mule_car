package com.sfmotors.cloud.ptmonitor.redis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Properties;

@Component
@ConfigurationProperties
public class SigNameMapper {

    @Value("${ptmonitor.config.signame}")
    private String tableFileName;

    private Properties prop = new Properties();

    @PostConstruct
    protected void init() throws IOException{
        String propFile = Paths.get(System.getProperty("user.home"), tableFileName).toString();
        System.out.println("---" + propFile);
        this.prop.load(new FileInputStream(propFile));
    }

    public String getProp(String propName) {
        return this.prop.getProperty(propName);
    }
}

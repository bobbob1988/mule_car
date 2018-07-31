package com.sfmotors.cloud.ptmonitor;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Properties;

@Component
public class MuleConfig {

    private Properties muleConfig = new Properties();
    private String MULE_CONFIG_FILE = "mule.properties";

    @PostConstruct
    protected void init() throws IOException {
        try {
            String propFile = Paths.get(System.getProperty("user.home"), MULE_CONFIG_FILE).toString();
            this.muleConfig.load(new FileInputStream(propFile));
            System.out.println("Loading mule car configuration file: ~/" + MULE_CONFIG_FILE);
        } catch (IOException e) {
            System.err.println("Cannot read mule car config file: ~/" + MULE_CONFIG_FILE + "\n" + e.getMessage());
            System.err.println("You can find the sample configuration in gitroot/config directory");
            throw e;
        }
    }

    public String getProp(String key) {
        return muleConfig.getProperty(key);
    }

}

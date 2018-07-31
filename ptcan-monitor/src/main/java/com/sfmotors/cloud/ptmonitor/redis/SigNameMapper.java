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
    protected void init() throws IOException {
        try {
            String propFile = Paths.get(System.getProperty("user.home"), tableFileName).toString();
            this.prop.load(new FileInputStream(propFile));
            System.out.println("Loading signal name mapping table from: ~/" + tableFileName);
        } catch (IOException e) {
            System.err.println("Cannot load signal name mapping table from ~/" + tableFileName + "\n" + e.getMessage());
            System.err.println("You can find the sample configuration in gitroot/config directory");
            throw e;
        }
    }

    public String getProp(String propName) {
        return this.prop.getProperty(propName);
    }
}

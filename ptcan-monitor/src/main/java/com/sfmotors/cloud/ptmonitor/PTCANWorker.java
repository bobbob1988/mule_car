package com.sfmotors.cloud.ptmonitor;

import com.sfmotors.cloud.ptmonitor.cloud.DataLogger;
import com.sfmotors.cloud.ptmonitor.cloud.LogEntry;
import com.sfmotors.cloud.ptmonitor.comm.PTMessage;
import com.sfmotors.cloud.ptmonitor.comm.PTSignalConfManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import peak.can.basic.*;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Properties;

@Component
public class PTCANWorker implements Runnable{

    @Autowired
    private PTSignalConfManager signalConfManager;

    @Autowired
    private PTDataCache ptDataCache;

    @Autowired
    private PTCanBus ptCanBus;

    @Autowired
    private DataLogger dataLogger;

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


    public void run() {
        PCANBasic pcanBasic = ptCanBus.getPcanBasic();
        TPCANHandle canBus = ptCanBus.getCANBus();
        System.out.println("Worker thread started... " + Thread.currentThread().getId());
        TPCANMsg msg = new TPCANMsg();
        while (true) {
            //long startTime = System.currentTimeMillis();
            TPCANTimestamp timestamp = new TPCANTimestamp();
            while (pcanBasic.Read(canBus, msg, timestamp) == TPCANStatus.PCAN_ERROR_OK) {
                int msgId = msg.getID();
                // Normal Message
                if (!signalConfManager.isMuxMessage(msgId)) {
                    String id = String.valueOf(msgId);
                    byte[] data = msg.getData();
                    ptDataCache.set(id, new PTMessage(id, data));
                    LogEntry logEntry = LogEntry.builder().VIN(this.VIN).msgId(id).data(data).timestamp(timestamp.getMillis()).build();
                    dataLogger.addMessage(logEntry);
                }
                // Mux Message
                else {
                    int muxId = PTMessage.getMuxId(msg.getData(), signalConfManager.getMuxMessageConfig(msgId));
                    String id = String.valueOf(msgId) + "_m" + muxId;
                    byte[] data = msg.getData();
                    ptDataCache.set(id, new PTMessage(id, data));
                    LogEntry logEntry = LogEntry.builder().VIN(this.VIN).msgId(id).data(data).timestamp(timestamp.getMillis()).build();
                    dataLogger.addMessage(logEntry);
                }
            }
            //System.out.println("Worker thread elapse: " + (System.currentTimeMillis()-startTime));
        }
    }

}

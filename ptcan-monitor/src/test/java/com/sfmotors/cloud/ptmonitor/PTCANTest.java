package com.sfmotors.cloud.ptmonitor;

import com.sfmotors.cloud.ptmonitor.comm.PTMessage;
import com.sfmotors.cloud.ptmonitor.comm.PTSignalConf;
import com.sfmotors.cloud.ptmonitor.comm.PTSignalConfManager;
import peak.can.basic.*;

public class PTCANTest {

    private static PTDataCache cache = new PTDataCache();
    private static final TPCANHandle canBus = TPCANHandle.PCAN_USBBUS1;

    public static void main(String[] args) throws Exception {
        System.out.println("PCAN Driver Test...");
        PCANBasic can = new PCANBasic();
        TPCANMsg msg;
        TPCANStatus status;

        PTSignalConfManager signalConfManager= new PTSignalConfManager();
        //signalConfManager.init("C:\\Users\\oliver.su\\test.json");
        //System.out.println(signalConfManager);

        if (!can.initializeAPI()) {
            System.err.println("Unable to initialize PCAN");
            System.exit(1);
        } else {
            System.out.println("PCAN initialization successful");
        }
        status = can.Initialize(canBus, TPCANBaudrate.PCAN_BAUD_500K, TPCANType.PCAN_TYPE_NONE, 0, (short) 0);
        if (status == TPCANStatus.PCAN_ERROR_INITIALIZE) {
            System.err.println("Cannot initialize CAN BUS");
            System.exit(2);
        } else {
          Runtime.getRuntime().addShutdownHook(new Thread(){
              public void run(){
                  System.out.println("Shutting down PCAN...");
                  can.Uninitialize(canBus);
              }
          });
        }
        msg = new TPCANMsg();
        TPCANTimestamp timestamp = new TPCANTimestamp();
        while (true) {
            Thread.currentThread().sleep(10);
            while (can.Read(canBus, msg, timestamp) == TPCANStatus.PCAN_ERROR_OK) {
                int msgId = msg.getID();
                // Normal Message
                if (!signalConfManager.isMuxMessage(msgId)) {
                    String id = String.valueOf(msgId);
                    cache.set(id, new PTMessage(id, msg.getData()));
                }
                // Mux Message
                else {
                    int muxId = PTMessage.getMuxId(msg.getData(), signalConfManager.getMuxMessageConfig(msgId));
                    String id = String.valueOf(msgId) + "_m" + muxId;
                    cache.set(id, new PTMessage(id, msg.getData()));
                }
                PTSignalConf speedSignal = signalConfManager.getSignalConfig("VCU_vehicle|vcu_vehicleSpeed");
                //System.out.println(speedSignal + "---" + speedSignal.getMsgId());
                PTMessage message = cache.get(speedSignal.getMsgId());
                if (message != null) {
                    float speed = message.getSignal(speedSignal);
                    System.out.println("Speed: " + speed);
                }
                PTSignalConf batteryVolt = signalConfManager.getSignalConfig("BMS_debugModuleVoltage|bms_module1cellBlock1_m0");
                PTMessage bmsMessage = cache.get(batteryVolt.getMsgId());
                if (bmsMessage != null){
                    float volt = bmsMessage.getSignal(batteryVolt);
                    System.out.println("voltage: " + volt);
                }
            }
        }
    }

    static {
        System.loadLibrary("PCANBasic_JNI");
    }
}

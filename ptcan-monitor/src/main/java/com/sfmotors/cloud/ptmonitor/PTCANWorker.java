package com.sfmotors.cloud.ptmonitor;

import com.sfmotors.cloud.ptmonitor.comm.PTMessage;
import com.sfmotors.cloud.ptmonitor.comm.PTSignalConfManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import peak.can.basic.*;

@Component
public class PTCANWorker implements Runnable{

    @Autowired
    private PTSignalConfManager signalConfManager;

    @Autowired
    private PTDataCache ptDataCache;

    @Autowired
    private PTCanBus ptCanBus;


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
                    ptDataCache.set(id, new PTMessage(id, msg.getData()));
                }
                // Mux Message
                else {
                    int muxId = PTMessage.getMuxId(msg.getData(), signalConfManager.getMuxMessageConfig(msgId));
                    String id = String.valueOf(msgId) + "_m" + muxId;
                    ptDataCache.set(id, new PTMessage(id, msg.getData()));
                }
            }
            //System.out.println("Worker thread elapse: " + (System.currentTimeMillis()-startTime));
        }
    }

}

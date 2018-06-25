package com.sfmotors.cloud.ptmonitor.service;

import com.sfmotors.cloud.ptmonitor.PTCanBus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import peak.can.basic.*;

@Service
public class PTCommand {

    @Autowired
    private PTCanBus ptCanBus;

    public boolean enableDebugBattery(boolean isEnable) {
        System.out.println("EnableDebugBattery");
        TPCANHandle canBus = ptCanBus.getCANBus();
        PCANBasic pcanBasic = ptCanBus.getPcanBasic();
        byte[] enableCommand = {0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00};
        byte[] disableCommand = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
        byte len = 8;
        TPCANMsg tpcanMsg = new TPCANMsg();
        tpcanMsg.setType(TPCANMessageType.PCAN_MESSAGE_STANDARD);
        tpcanMsg.setData(isEnable ? enableCommand : disableCommand, len);
        tpcanMsg.setID(1807);
        TPCANStatus status = pcanBasic.Write(canBus, tpcanMsg);
        System.out.println("EnableDebugBattery status: " + status);
        return status == TPCANStatus.PCAN_ERROR_OK;
    }
}

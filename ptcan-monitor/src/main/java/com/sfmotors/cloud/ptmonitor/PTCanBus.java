package com.sfmotors.cloud.ptmonitor;

import org.springframework.stereotype.Component;
import peak.can.basic.*;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Component
public class PTCanBus {

    private TPCANHandle canBus = null; // e.g. TPCANHandle.PCAN_USBBUS1;
    private PCANBasic pcanBasic = new PCANBasic();
    private final String pcanUSBPrefix = "PCAN_USB";

    @PostConstruct
    protected void init(){
        PCANBasic can = new PCANBasic();
        TPCANStatus status = null;

        if (!can.initializeAPI()) {
            System.err.println("Unable to initialize PCAN API");
            System.exit(1);
        } else {
            System.out.println("PCAN initialization successful");
        }

        // Try all usb ports to connect PCAN
        for (TPCANHandle canBus : TPCANHandle.values()) {
            if (!canBus.name().startsWith(pcanUSBPrefix)) {
                continue;
            }
            System.out.println("Connecting to " + canBus.name());
            status = can.Initialize(canBus, TPCANBaudrate.PCAN_BAUD_500K, TPCANType.PCAN_TYPE_NONE, 0, (short) 0);
            if (status == TPCANStatus.PCAN_ERROR_INITIALIZE) {
                System.out.println("Cannot initialize CAN BUS..." + canBus.name());
            } else {
                this.canBus = canBus;
                break;
            }
        }
        // If fail to connect to any usb PCAN
        if (this.canBus == null) {
            System.err.println("Cannot connect to PCAN");
            System.exit(1);
        }
    }

    public TPCANHandle getCANBus() {
        return this.canBus;
    }

    public PCANBasic getPcanBasic() {
        return this.pcanBasic;
    }

    @PreDestroy
    public void destroy(){
        System.out.println("shutting down worker thread");
        pcanBasic.Uninitialize(canBus);
    }
}

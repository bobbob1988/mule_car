package com.sfmotors.cloud.ptmonitor.comm;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.tal.redstonechips.bitset.BitSet7;
import org.tal.redstonechips.bitset.BitSetUtils;

@Data
public class PTMessage {

    private static final int MSG_SIZE = 64;

    private String id;
    private BitSet7 data;
    private long timestamp;
    private boolean isMux;
    private long expiration = 3000; // Message default expired 3 second

    @Autowired
    private PTSignalConfManager ptSignalConfManager;

    public PTMessage(String id, byte[] data, long timestamp) {
        this.id = id;
        this.data = BitSet7.valueOf(data);
        this.timestamp= timestamp;
    }

    public PTMessage(String id, byte[] data, long timestamp, long expiration) {
        this(id, data, timestamp);
        this.expiration = expiration;
    }

    public PTMessage(String id, byte[] data) {
        this(id, data, System.currentTimeMillis());
    }

    public static int getMuxId(byte[] data, PTMuxIdConfig muxMessageConfig) {
        return BitSetUtils.bitSetToUnsignedInt(BitSet7.valueOf(data), muxMessageConfig.getStartBit(), muxMessageConfig.getLength());
    }

    public float getSignal(PTSignalConf config) {
        if (data == null) {
            throw new RuntimeException("CAN Message not initialized");
        }
        int val = config.isSigned() ? BitSetUtils.bitSetToSignedInt(this.data, config.getStartBit(), config.getLength())
                : BitSetUtils.bitSetToUnsignedInt(this.data, config.getStartBit(), config.getLength());
        return (float) val * config.getFactor() + config.getOffset();
    }

    public String getSignalValue(PTSignalConf config) {
        if (data == null) {
            throw new RuntimeException("CAN Message not initialized");
        }
        int val = config.isSigned() ? BitSetUtils.bitSetToSignedInt(this.data, config.getStartBit(), config.getLength())
                : BitSetUtils.bitSetToUnsignedInt(this.data, config.getStartBit(), config.getLength());
        return config.getValues().getOrDefault(String.valueOf(val), String.valueOf(val));
    }


    public boolean isExpired() {
        return (System.currentTimeMillis() - timestamp) > expiration;
    }
}

package com.sfmotors.cloud.ptmonitor.cloud;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LogEntry {
    private String VIN;
    private String msgId;
    private byte[] data;
    private long timestamp;
}

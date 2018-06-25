package com.sfmotors.cloud.ptmonitor.comm;

import lombok.Data;
import lombok.NonNull;

@Data
public class PTMuxIdConfig {
    @NonNull
    protected int startBit;
    @NonNull
    protected int length;
}

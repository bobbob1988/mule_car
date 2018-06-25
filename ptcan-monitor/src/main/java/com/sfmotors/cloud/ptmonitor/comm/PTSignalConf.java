package com.sfmotors.cloud.ptmonitor.comm;

import lombok.Data;

import java.util.HashMap;

@Data
public class PTSignalConf {
    protected String msgId;
    protected String name;
    protected float factor;
    protected float offset;
    protected int startBit;
    protected int length;
    protected boolean signed;
    protected HashMap<String, String> values;
}

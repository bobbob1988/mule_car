package com.sfmotors.cloud.ptmonitor;

import com.sfmotors.cloud.ptmonitor.comm.PTSignalConfManager;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class PTConfigTest {

    @Test
    public void readConfigFile() throws Exception {
        PTSignalConfManager config = new PTSignalConfManager();
        //config.init("C:\\Users\\oliver.su\\test.json");
        System.out.println(config);
    }
}

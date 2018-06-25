package com.sfmotors.cloud.ptmonitor;


import com.sfmotors.cloud.ptmonitor.redis.RedisManager;
import com.sfmotors.cloud.ptmonitor.redis.VehicleStatus;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {RedisManager.class})
public class RedisTest {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    public void RedisConnectionTest(){
        VehicleStatus vehicleStatus = VehicleStatus.builder().vehicleSpeed(109).build();
        redisTemplate.opsForValue().set("test", vehicleStatus);

    }
}

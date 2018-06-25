package com.sfmotors.cloud.ptmonitor;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import org.tal.redstonechips.bitset.BitSet7;
import org.tal.redstonechips.bitset.BitSetUtils;


@RunWith(SpringRunner.class)
public class BitConversionTest {

    @Test
    public void testBitSetConversion() {
        BitSet7 bits = new BitSet7(9);
        bits.set(2);
        bits.set(5);
        bits.set(6);
        Assert.assertEquals(BitSetUtils.bitSetToSignedInt(bits,0, 9), 100);
        Assert.assertEquals(BitSetUtils.bitSetToUnsignedInt(bits,0, 9), 100);
        bits.set(8);
        Assert.assertEquals(BitSetUtils.bitSetToSignedInt(bits,0, 9), -156);

    }
}

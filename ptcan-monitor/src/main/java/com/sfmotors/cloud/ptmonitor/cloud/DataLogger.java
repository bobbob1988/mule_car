package com.sfmotors.cloud.ptmonitor.cloud;

import com.google.common.collect.EvictingQueue;
import org.springframework.stereotype.Component;

import java.util.concurrent.locks.ReentrantLock;

@Component
public class DataLogger {

    private int QUEUE_SIZE = 1024 * 60;
    private ReentrantLock queueLock = new ReentrantLock();
    private EvictingQueue<LogEntry> dataQueue = EvictingQueue.create(QUEUE_SIZE);

    public void addMessage(LogEntry logEntry) {
        queueLock.lock();
        try {
            dataQueue.add(logEntry);
        } finally {
            queueLock.unlock();
        }
    }

    public EvictingQueue<LogEntry> getDataAndClear() {
        queueLock.lock();
        try {
            EvictingQueue<LogEntry> clonedQueue = EvictingQueue.create(dataQueue.size());
            clonedQueue.addAll(dataQueue);
            dataQueue.clear();
            return clonedQueue;
        } finally {
            queueLock.unlock();
        }
    }
}

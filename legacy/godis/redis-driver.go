package main

import (
	"github.com/go-redis/redis"
	"time"
	"fmt"
)

func myRedisClient(hostname string)(*redis.Client){
	client := redis.NewClient(&redis.Options{
		Addr:     hostname + ":6379",
		Password: "",
		DB:       0,
		DialTimeout: 2 * time.Second,
	})
	return client
}

func connectRedis(hostname string)(*redis.Client){
	client := myRedisClient(hostname)
	pong, err := client.Ping().Result()
	if err != nil {
		return nil
	} else {
		fmt.Println(pong + " redis server " + hostname + " connected")
		return client
	}
}

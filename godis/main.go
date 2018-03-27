package main

import (
	"os"
	"fmt"
	"github.com/go-redis/redis"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
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

func main() {
	hostname := "127.0.0.1"
	if len(os.Args) > 1  {
		hostname = os.Args[1]
	}
	client := myRedisClient(hostname)
	pong, err := client.Ping().Result()
	if err != nil {
		panic("Cannot connect to redis server: " + hostname)
	} else {
		fmt.Println(pong + " redis server " + hostname + " connected")
	}
	r := gin.Default()
	r.GET("/GET/:key", func(c *gin.Context){
		key := c.Param("key")
		val, err := client.Get(key).Result()
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"GET": val})
		} else if err == redis.Nil {
			c.JSON(http.StatusNoContent, gin.H{"error": "no value for key: " + key})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "read redis error"})
		}
	})
	r.GET("/HGETALL/:key", func(c *gin.Context){
		key := c.Param("key")
		val, err := client.HGetAll(key).Result()
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"HGETALL": val})
		} else if err == redis.Nil {
			c.JSON(http.StatusNoContent, gin.H{"error": "no value for key: " + key})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "read redis error"})
		}
	})
	r.GET("/SET/:key/:value", func(c *gin.Context){
		key := c.Param("key")
		value := c.Param("value")
		err := client.Set(key, value, 0).Err()
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"SET": "OK"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "write to redis error"})
		}

	})
	r.Run(":7379")


}
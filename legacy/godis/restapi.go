package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
)

func setCORSHeaders(c *gin.Context){
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Headers", "access-control-allow-origin, access-control-allow-headers")
}

func handleGet(r *gin.Engine, client *redis.Client) {
	r.GET("/GET/:key", func(c *gin.Context) {
		setCORSHeaders(c)
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
}

func handleHgetall(r *gin.Engine, client *redis.Client) {
	r.GET("/HGETALL/:key", func(c *gin.Context) {
		setCORSHeaders(c)
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
}

func handleSet(r *gin.Engine, client *redis.Client) {
	r.GET("/SET/:key/:value", func(c *gin.Context) {
		setCORSHeaders(c)
		key := c.Param("key")
		value := c.Param("value")
		err := client.Set(key, value, 0).Err()
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"SET": "OK"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "write to redis error"})
		}

	})
}

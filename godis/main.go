package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	"fmt"
)

func main() {

	// Parse command line arguments
	port := flag.Int("port", 7379, "listen port")
	hostname := flag.String("redis", "127.0.0.1", "redis hostname")
	isProd := flag.Bool("prod", false, "is production mode")
	flag.Parse()

	// Connect to redis server
	client := connectRedis(*hostname)
	if client == nil {
		panic("Cannot connect to redis server: " + *hostname)
	}

	// Initialize gin framework
	gin.DisableConsoleColor()
	if *isProd {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()

	// Add REST API handles
	handleGet(r, client)
	handleSet(r, client)
	handleHgetall(r, client)

	// Start http server
	r.Run(":" + fmt.Sprint(*port))
}
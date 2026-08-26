package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Setup CORS untuk mengizinkan request dari Next.js
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Contoh Grouping API
	api := r.Group("/api/v1")
	{
		api.GET("/vehicles", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "List of vehicles"})
		})
	}

	// Jalankan server di port 8080
	r.Run(":8080")
}

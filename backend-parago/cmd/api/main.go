package main

import (
	"log"

	"parago-backend/internal/config"
	"parago-backend/internal/routes"
	"parago-backend/internal/ws"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load konfigurasi & koneksi database
	config.LoadEnv()
	db := config.ConnectDB()

	// Inisialisasi WebSocket Hub & jalankan goroutine
	hub := ws.NewHub()
	go hub.Run()

	// Inisialisasi Gin router
	r := gin.Default()

	// Daftarkan semua route
	routes.SetupRoutes(r, db, hub)

	port := config.GetEnv("PORT", "8080")
	log.Printf("Server berjalan di port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}

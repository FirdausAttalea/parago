package main

import (
	"log"

	"parago-backend/internal/config"
	"parago-backend/internal/middleware"
	"parago-backend/internal/routes"
	"parago-backend/internal/ws"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load konfigurasi & koneksi database
	config.LoadEnv()
	db := config.ConnectDB()
	allowedOrigins := config.GetAllowedOrigins()

	// Migrasi skema database sesuai ERD
	if err := config.Migrate(db); err != nil {
		log.Fatalf("Gagal migrasi database: %v", err)
	}

	// Inisialisasi WebSocket Hub & jalankan goroutine
	hub := ws.NewHub()
	go hub.Run()

	// Inisialisasi Gin router
	r := gin.Default()
	r.Use(middleware.CORS(allowedOrigins))

	// Daftarkan semua route
	routes.SetupRoutes(r, db, hub, allowedOrigins)

	port := config.GetEnv("PORT", "8080")
	log.Printf("Server berjalan di port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}

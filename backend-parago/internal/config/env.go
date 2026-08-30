package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("File .env tidak ditemukan, menggunakan environment sistem")
	}
}

func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// GetAllowedOrigins membaca daftar origin yang diizinkan (untuk CORS &
// validasi origin WebSocket) dari env ALLOWED_ORIGINS, dipisah koma.
// Contoh: ALLOWED_ORIGINS=http://localhost:3000,https://parago.example.com
func GetAllowedOrigins() []string {
	raw := GetEnv("ALLOWED_ORIGINS", "http://localhost:3000")
	origins := strings.Split(raw, ",")
	for i, origin := range origins {
		origins[i] = strings.TrimSpace(origin)
	}
	return origins
}

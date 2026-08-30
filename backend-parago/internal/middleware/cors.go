// Package middleware berisi Gin middleware lintas-endpoint (CORS, dan
// nantinya auth/logging) yang dipasang secara global di main.go.
package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORS membangun middleware CORS dengan whitelist origin dari konfigurasi.
// Whitelist yang sama juga dipakai di internal/ws untuk validasi origin
// koneksi WebSocket, supaya kebijakan origin konsisten di satu sumber.
func CORS(allowedOrigins []string) gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

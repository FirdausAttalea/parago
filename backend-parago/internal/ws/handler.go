package ws

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// ServeWs mengembalikan handler upgrade WebSocket. allowedOrigins dipakai
// buat validasi header Origin, memakai whitelist yang sama dengan CORS HTTP
// (lihat internal/config.GetAllowedOrigins & internal/middleware.CORS).
func ServeWs(hub *Hub, allowedOrigins []string) gin.HandlerFunc {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			if origin == "" {
				// Non-browser client (mis. tool internal) tidak kirim header Origin.
				return true
			}
			for _, allowed := range allowedOrigins {
				if allowed == origin {
					return true
				}
			}
			return false
		},
	}

	return func(ctx *gin.Context) {
		conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upgrade koneksi WebSocket"})
			return
		}

		client := &Client{Hub: hub, Conn: conn, Send: make(chan []byte, 256)}
		hub.register <- client

		go client.WritePump()
		go client.ReadPump()
	}
}

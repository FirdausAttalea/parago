package ws

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Sesuaikan dengan origin frontend di production
	},
}

func ServeWs(hub *Hub) gin.HandlerFunc {
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

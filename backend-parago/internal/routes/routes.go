package routes

import (
	"log" // <-- Tambahkan log untuk menangani error inisialisasi middleware

	"parago-backend/internal/controller"
	"parago-backend/internal/middleware"
	"parago-backend/internal/repository"
	"parago-backend/internal/ws"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB, hub *ws.Hub, allowedOrigins []string) {
	vehicleRepo := repository.NewVehicleRepository(db)
	vehicleController := controller.NewVehicleController(vehicleRepo, hub)

	bookingRepo := repository.NewBookingRepository(db)
	bookingController := controller.NewBookingController(bookingRepo)

	// 1. Inisialisasi JWT Middleware dan tangkap error-nya
	authMiddleware, err := middleware.JWTMiddleware(db)
	if err != nil {
		log.Fatal("Gagal inisialisasi JWT Middleware: ", err)
	}

	api := r.Group("/api/v1")
	{
		authController := controller.NewAuthController(db)

		api.POST("/auth/login", authMiddleware.LoginHandler)
		api.POST("/auth/register", authController.Register)

		vehicles := api.Group("/vehicles")
		{
			vehicles.GET("", vehicleController.GetAll)
			vehicles.GET("/:id", vehicleController.GetByID)
			vehicles.POST("", vehicleController.Create)
			vehicles.PATCH("/:id/location", vehicleController.UpdateLocation)
		}

		bookings := api.Group("/bookings")
		{
			// 2. Gunakan MiddlewareFunc() agar sesuai dengan gin.HandlerFunc
			bookings.Use(authMiddleware.MiddlewareFunc())
			bookings.GET("", bookingController.GetAllBookings)
			bookings.POST("", bookingController.CreateBooking)
		}

		api.GET("/ws", ws.ServeWs(hub, allowedOrigins))
	}

	// 3. Teks string yang mengambang ("github.com/..." dll) sudah saya hapus dari sini.
}

// Komentar lama di bawahnya bisa Anda biarkan atau hapus

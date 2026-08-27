package routes

import (
	"parago-backend/internal/controller"
	"parago-backend/internal/repository"
	"parago-backend/internal/ws"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB, hub *ws.Hub) {
	vehicleRepo := repository.NewVehicleRepository(db)
	vehicleController := controller.NewVehicleController(vehicleRepo, hub)

	api := r.Group("/api/v1")
	{
		vehicles := api.Group("/vehicles")
		{
			vehicles.GET("", vehicleController.GetAll)
			vehicles.GET("/:id", vehicleController.GetByID)
			vehicles.POST("", vehicleController.Create)
			vehicles.PATCH("/:id/location", vehicleController.UpdateLocation)
		}

		api.GET("/ws", ws.ServeWs(hub))
	}
}
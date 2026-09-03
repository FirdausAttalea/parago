package controller

import (
	"encoding/json"

	"parago-backend/internal/models"
	"parago-backend/internal/repository"
	"parago-backend/internal/response"
	"parago-backend/internal/ws"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type VehicleController struct {
	Repo *repository.VehicleRepository
	Hub  *ws.Hub
}

func NewVehicleController(repo *repository.VehicleRepository, hub *ws.Hub) *VehicleController {
	return &VehicleController{Repo: repo, Hub: hub}
}

func (c *VehicleController) GetAll(ctx *gin.Context) {
	vehicles, err := c.Repo.FindAll()
	if err != nil {
		response.InternalError(ctx, "Gagal mengambil data kendaraan")
		return
	}
	response.OK(ctx, vehicles)
}

func (c *VehicleController) GetByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		response.BadRequest(ctx, "ID tidak valid")
		return
	}

	vehicle, err := c.Repo.FindByID(id)
	if err != nil {
		response.NotFound(ctx, "Kendaraan tidak ditemukan")
		return
	}
	response.OK(ctx, vehicle)
}

func (c *VehicleController) Create(ctx *gin.Context) {
	var vehicle models.Vehicle
	if err := ctx.ShouldBindJSON(&vehicle); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}

	if err := c.Repo.Create(&vehicle); err != nil {
		response.InternalError(ctx, "Gagal menambah kendaraan")
		return
	}
	response.Created(ctx, vehicle)
}

func (c *VehicleController) UpdateLocation(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		response.BadRequest(ctx, "ID tidak valid")
		return
	}

	var payload struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	}
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}

	if err := c.Repo.UpdateLocation(id, payload.Latitude, payload.Longitude); err != nil {
		response.InternalError(ctx, "Gagal update lokasi")
		return
	}

	// Broadcast update lokasi ke semua client yang terhubung
	message, _ := json.Marshal(gin.H{
		"type":       "location_update",
		"vehicle_id": id,
		"latitude":   payload.Latitude,
		"longitude":  payload.Longitude,
	})
	c.Hub.Broadcast(message)

	response.OK(ctx, gin.H{"message": "Lokasi berhasil diperbarui"})
}

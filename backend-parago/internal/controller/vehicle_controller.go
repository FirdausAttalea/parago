package controller

import (
	"encoding/json"
	"net/http"
	"strconv"

	"parago-backend/internal/models"
	"parago-backend/internal/repository"
	"parago-backend/internal/ws"

	"github.com/gin-gonic/gin"
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
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data kendaraan"})
		return
	}
	ctx.JSON(http.StatusOK, vehicles)
}

func (c *VehicleController) GetByID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	vehicle, err := c.Repo.FindByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Kendaraan tidak ditemukan"})
		return
	}
	ctx.JSON(http.StatusOK, vehicle)
}

func (c *VehicleController) Create(ctx *gin.Context) {
	var vehicle models.Vehicle
	if err := ctx.ShouldBindJSON(&vehicle); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.Repo.Create(&vehicle); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambah kendaraan"})
		return
	}
	ctx.JSON(http.StatusCreated, vehicle)
}

func (c *VehicleController) UpdateLocation(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))

	var payload struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	}
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.Repo.UpdateLocation(uint(id), payload.Latitude, payload.Longitude); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update lokasi"})
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

	ctx.JSON(http.StatusOK, gin.H{"message": "Lokasi berhasil diperbarui"})
}

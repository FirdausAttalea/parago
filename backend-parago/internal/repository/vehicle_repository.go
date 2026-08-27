package repository

import (
	"parago-backend/internal/models"

	"gorm.io/gorm"
)

type VehicleRepository struct {
	DB *gorm.DB
}

func NewVehicleRepository(db *gorm.DB) *VehicleRepository {
	return &VehicleRepository{DB: db}
}

func (r *VehicleRepository) FindAll() ([]models.Vehicle, error) {
	var vehicles []models.Vehicle
	err := r.DB.Preload("Driver").Find(&vehicles).Error
	return vehicles, err
}

func (r *VehicleRepository) FindByID(id uint) (*models.Vehicle, error) {
	var vehicle models.Vehicle
	err := r.DB.Preload("Driver").First(&vehicle, id).Error
	if err != nil {
		return nil, err
	}
	return &vehicle, nil
}

func (r *VehicleRepository) Create(vehicle *models.Vehicle) error {
	return r.DB.Create(vehicle).Error
}

func (r *VehicleRepository) UpdateLocation(id uint, lat, lng float64) error {
	return r.DB.Model(&models.Vehicle{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{"latitude": lat, "longitude": lng}).Error
}

func (r *VehicleRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Vehicle{}, id).Error
}

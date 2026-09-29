package repository

import (
    "parago-backend/internal/models"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type BookingRepository struct {
    DB *gorm.DB
}

func NewBookingRepository(db *gorm.DB) *BookingRepository {
    return &BookingRepository{DB: db}
}

func (r *BookingRepository) FindAll() ([]models.Booking, error) {
    var bookings []models.Booking
    // Preload related vehicle and driver for UI consumption
    err := r.DB.Preload("Vehicle").Preload("Driver").Find(&bookings).Error
    return bookings, err
}

func (r *BookingRepository) FindByID(id uuid.UUID) (*models.Booking, error) {
    var booking models.Booking
    err := r.DB.Preload("Vehicle").Preload("Driver").First(&booking, "id = ?", id).Error
    if err != nil {
        return nil, err
    }
    return &booking, nil
}

func (r *BookingRepository) Create(booking *models.Booking) error {
    return r.DB.Create(booking).Error
}

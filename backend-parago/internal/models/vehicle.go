package models

import "time"

type Vehicle struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PlateNumber string    `gorm:"unique;not null" json:"plate_number"`
	Brand       string    `json:"brand"`
	Model       string    `json:"model"`
	Status      string    `gorm:"default:'inactive'" json:"status"` // active, inactive, maintenance
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	DriverID    *uint     `json:"driver_id"`
	Driver      *Driver   `gorm:"foreignKey:DriverID" json:"driver,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

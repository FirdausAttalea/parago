package models

import "github.com/google/uuid"

// Vehicle adalah unit fisik kendaraan, mereferensikan satu VehicleModel
// dan menyimpan atribut per-unit — PRD 6.2 & 6.3.
//
// Catatan: tidak ada lagi field DriverID/Driver di sini (beda dari versi
// eksplorasi awal). Sesuai ERD, penugasan driver terjadi per-Booking
// (Booking.driver_id), bukan assignment statis ke Vehicle.
type Vehicle struct {
	BaseModel
	ModelID     uuid.UUID     `gorm:"type:uuid;not null" json:"model_id"`
	Model       *VehicleModel `gorm:"foreignKey:ModelID;constraint:OnDelete:RESTRICT" json:"model,omitempty"`
	PlateNumber string        `gorm:"unique;not null" json:"plate_number"`
	Year        int           `json:"year"`
	Color       string        `json:"color"`
	Status      string        `gorm:"not null;default:active" json:"status"` // active / maintenance / retired
	// Nullable, disiapkan untuk fitur live tracking fase 2 (PRD 6.2).
	Latitude  *float64 `json:"latitude,omitempty"`
	Longitude *float64 `json:"longitude,omitempty"`
}

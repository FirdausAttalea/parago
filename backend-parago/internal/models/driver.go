package models

import "time"

type Driver struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`
	LicenseNo   string    `gorm:"unique;not null" json:"license_no"`
	PhoneNumber string    `json:"phone_number"`
	IsAvailable bool      `gorm:"default:true" json:"is_available"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

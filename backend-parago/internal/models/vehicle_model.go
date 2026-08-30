package models

import "github.com/google/uuid"

// VehicleModel adalah katalog model di bawah brand tertentu (mis. Innova
// Zenix), menyimpan atribut yang tetap untuk semua unit dari model yang
// sama — PRD 6.2 & 6.3.
type VehicleModel struct {
	BaseModel
	BrandID      uuid.UUID     `gorm:"type:uuid;not null" json:"brand_id"`
	Brand        *VehicleBrand `gorm:"foreignKey:BrandID;constraint:OnDelete:RESTRICT" json:"brand,omitempty"`
	Name         string        `gorm:"not null" json:"name"`
	Type         string        `gorm:"not null" json:"type"` // SUV / MPV / Sedan / Van, dst
	Capacity     int           `gorm:"not null" json:"capacity"`
	Transmission string        `gorm:"not null" json:"transmission"` // Automatic / Manual
	Fuel         string        `gorm:"not null" json:"fuel"`         // Petrol / Diesel / Hybrid / Electric
}

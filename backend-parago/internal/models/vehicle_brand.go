package models

// VehicleBrand adalah katalog merek kendaraan (mis. Toyota) — PRD 6.3.
type VehicleBrand struct {
	BaseModel
	Name string `gorm:"unique;not null" json:"name"`
}

package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseModel dipakai oleh seluruh entitas master data (Division, User,
// VehicleBrand, VehicleModel, Vehicle, Driver) sesuai PRD bagian 6.2:
// UUID sebagai primary key, plus soft delete via deleted_at.
type BaseModel struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// BeforeCreate generate UUID kalau belum diisi manual, dijalankan GORM
// otomatis sebelum INSERT. Dipromosikan ke tiap struct yang embed BaseModel.
func (b *BaseModel) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}

// BaseModelNoSoftDelete dipakai oleh Booking. Sesuai PRD bagian 6.2,
// Booking sengaja TIDAK pakai soft delete — pembatalan direpresentasikan
// lewat status = cancelled, bukan penghapusan record.
type BaseModelNoSoftDelete struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (b *BaseModelNoSoftDelete) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}

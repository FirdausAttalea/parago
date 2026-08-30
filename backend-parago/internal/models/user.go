package models

import "github.com/google/uuid"

// User merepresentasikan akun pengguna sistem (PRD 6.3).
type User struct {
	BaseModel
	Name         string    `gorm:"not null" json:"name"`
	Email        string    `gorm:"unique;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"` // tidak pernah diserialize ke JSON
	Role         string    `gorm:"not null" json:"role"`
	DivisionID   uuid.UUID `gorm:"type:uuid;not null" json:"division_id"`
	Division     *Division `gorm:"foreignKey:DivisionID;constraint:OnDelete:RESTRICT" json:"division,omitempty"`
}

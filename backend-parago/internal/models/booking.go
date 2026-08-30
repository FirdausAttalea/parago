package models

import (
	"time"

	"github.com/google/uuid"
)

// Booking adalah entitas transaksi inti, menyimpan seluruh siklus hidup
// pengajuan hingga selesai — PRD 6.3. Sengaja tidak pakai soft delete
// (lihat BaseModelNoSoftDelete di common.go) — pembatalan direpresentasikan
// lewat Status = cancelled, bukan penghapusan record.
type Booking struct {
	BaseModelNoSoftDelete

	RequesterID uuid.UUID `gorm:"type:uuid;not null" json:"requester_id"`
	Requester   *User     `gorm:"foreignKey:RequesterID;constraint:OnDelete:RESTRICT" json:"requester,omitempty"`

	// Divisi penanggung jawab, dipilih requester saat submit — bisa beda
	// dari divisi asal requester (PRD 4.2).
	DivisionID uuid.UUID `gorm:"type:uuid;not null" json:"division_id"`
	Division   *Division `gorm:"foreignKey:DivisionID;constraint:OnDelete:RESTRICT" json:"division,omitempty"`

	VehicleID uuid.UUID `gorm:"type:uuid;not null" json:"vehicle_id"`
	Vehicle   *Vehicle  `gorm:"foreignKey:VehicleID;constraint:OnDelete:RESTRICT" json:"vehicle,omitempty"`

	// Nullable — hanya diisi kalau NeedsDriver = true (PRD 4.2).
	DriverID *uuid.UUID `gorm:"type:uuid" json:"driver_id,omitempty"`
	Driver   *Driver    `gorm:"foreignKey:DriverID;constraint:OnDelete:RESTRICT" json:"driver,omitempty"`

	NeedsDriver    bool      `gorm:"not null;default:false" json:"needs_driver"`
	StartDatetime  time.Time `gorm:"not null" json:"start_datetime"`
	EndDatetime    time.Time `gorm:"not null" json:"end_datetime"`
	Purpose        string    `json:"purpose"`
	Destination    string    `json:"destination"`
	PassengerCount int       `json:"passenger_count"`

	// pending_admin / pending_division / approved / ongoing / completed /
	// rejected / cancelled — lihat konstanta BookingStatus* di enums.go.
	Status string `gorm:"not null;default:pending_admin" json:"status"`

	// Approval level 1 — Fleet Admin (PRD 4.3).
	AdminReviewedBy *uuid.UUID `gorm:"type:uuid" json:"admin_reviewed_by,omitempty"`
	AdminReviewer   *User      `gorm:"foreignKey:AdminReviewedBy;constraint:OnDelete:RESTRICT" json:"admin_reviewer,omitempty"`
	AdminReviewedAt *time.Time `json:"admin_reviewed_at,omitempty"`

	// Approval level 2 — Division Head (PRD 4.3).
	DivisionReviewedBy *uuid.UUID `gorm:"type:uuid" json:"division_reviewed_by,omitempty"`
	DivisionReviewer   *User      `gorm:"foreignKey:DivisionReviewedBy;constraint:OnDelete:RESTRICT" json:"division_reviewer,omitempty"`
	DivisionReviewedAt *time.Time `json:"division_reviewed_at,omitempty"`

	// Wajib diisi kalau reject di level manapun; reject bersifat final
	// (PRD 4.3) — tidak ada revisi/resubmit pada booking yang sama.
	RejectionReason *string `json:"rejection_reason,omitempty"`
}

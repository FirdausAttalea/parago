package internal

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ==========================================
// MODUL: AUTH & ORGANISASI
// ==========================================

type Division struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string    `gorm:"type:varchar(100);not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name         string    `gorm:"type:varchar(100);not null"`
	Email        string    `gorm:"type:varchar(100);uniqueIndex;not null"`
	PasswordHash string    `gorm:"not null"`
	Role         string    `gorm:"type:varchar(50);not null;default:'employee'"`
	DivisionID   uuid.UUID `gorm:"type:uuid"`
	Division     Division  `gorm:"foreignKey:DivisionID"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}

// ==========================================
// MODUL: MASTER DATA (VEHICLES & DRIVERS)
// ==========================================

type Driver struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string    `gorm:"type:varchar(100);not null"`
	LicenseNo string    `gorm:"type:varchar(50);uniqueIndex;not null"`
	Phone     string    `gorm:"type:varchar(20);not null"`
	Status    string    `gorm:"type:varchar(50);default:'available'"` // available, on_duty, resigned
	PhotoURL  string    `gorm:"type:text"`
	Rating    float64   `gorm:"type:numeric(3,2)"`
	SafeMiles int64
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type VehicleBrand struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string    `gorm:"type:varchar(100);uniqueIndex;not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type VehicleModel struct {
	ID           uuid.UUID    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	BrandID      uuid.UUID    `gorm:"type:uuid;not null"`
	Brand        VehicleBrand `gorm:"foreignKey:BrandID"`
	Name         string       `gorm:"type:varchar(100);not null"`
	Type         string       `gorm:"type:varchar(50);not null"` // SUV, MPV, Sedan, dll
	Capacity     int          `gorm:"not null"`
	Transmission string       `gorm:"type:varchar(50);not null"`
	Fuel         string       `gorm:"type:varchar(50);not null"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
}

type Vehicle struct {
	ID          uuid.UUID    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ModelID     uuid.UUID    `gorm:"type:uuid;not null"`
	Model       VehicleModel `gorm:"foreignKey:ModelID"`
	PlateNumber string       `gorm:"type:varchar(50);uniqueIndex;not null"`
	Year        int          `gorm:"not null"`
	Color       string       `gorm:"type:varchar(50)"`
	Status      string       `gorm:"type:varchar(50);default:'active'"` // active, maintenance, retired
	ImageURL    string       `gorm:"type:text"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}

// ==========================================
// MODUL: BOOKING (TRANSAKSI UTAMA)
// ==========================================

type Booking struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	BookingCode string    `gorm:"type:varchar(50);uniqueIndex;not null"`
	Status      string    `gorm:"type:varchar(50);not null;default:'pending_admin'"`

	// Relasi Pemohon
	RequesterID uuid.UUID `gorm:"type:uuid;not null"`
	Requester   User      `gorm:"foreignKey:RequesterID"`
	DivisionID  uuid.UUID `gorm:"type:uuid;not null"`
	Division    Division  `gorm:"foreignKey:DivisionID"`

	// Relasi Kendaraan & Driver
	VehicleID   uuid.UUID  `gorm:"type:uuid;not null"`
	Vehicle     Vehicle    `gorm:"foreignKey:VehicleID"`
	NeedsDriver bool       `gorm:"not null"`
	DriverID    *uuid.UUID `gorm:"type:uuid"` // Pointer (*) karena bisa NULL jika NeedsDriver false
	Driver      *Driver    `gorm:"foreignKey:DriverID"`

	// Detail Perjalanan
	StartDatetime  time.Time `gorm:"not null"`
	EndDatetime    time.Time `gorm:"not null"`
	Purpose        string    `gorm:"type:varchar(255);not null"`
	Destination    string    `gorm:"type:varchar(255);not null"`
	PassengerCount int       `gorm:"not null"`
	TotalCost      int64     `gorm:"default:0"`

	// Relasi Approval (Level 1 & Level 2)
	AdminReviewedByID *uuid.UUID `gorm:"type:uuid"`
	AdminReviewedBy   *User      `gorm:"foreignKey:AdminReviewedByID"`
	AdminReviewedAt   *time.Time

	DivisionReviewedByID *uuid.UUID `gorm:"type:uuid"`
	DivisionReviewedBy   *User      `gorm:"foreignKey:DivisionReviewedByID"`
	DivisionReviewedAt   *time.Time

	RejectionReason *string `gorm:"type:text"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

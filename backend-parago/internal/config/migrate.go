package config

import (
	"log"

	"parago-backend/internal/models"

	"gorm.io/gorm"
)

// Migrate menjalankan AutoMigrate untuk seluruh entitas sesuai ERD (PRD
// bagian 6), dalam urutan dependency: tabel yang direferensikan dulu,
// baru tabel yang mereferensikannya.
//
// Relasi Division<->User cuma satu arah (User.division_id -> Division),
// jadi urutannya lurus tanpa workaround circular FK: Division dulu, baru
// User. Kepala divisi di-derive dari User.role == division_head, bukan
// FK terpisah di Division (lihat komentar di models/division.go).
func Migrate(db *gorm.DB) error {
	log.Println("Menjalankan migrasi database...")

	if err := db.AutoMigrate(
		&models.VehicleBrand{},
		&models.Division{},
		&models.Driver{},
		&models.User{},         // FK ke Division
		&models.VehicleModel{}, // FK ke VehicleBrand
		&models.Vehicle{},      // FK ke VehicleModel
		&models.Booking{},      // FK ke User, Division, Vehicle, Driver
	); err != nil {
		return err
	}

	log.Println("Migrasi database selesai")
	return nil
}

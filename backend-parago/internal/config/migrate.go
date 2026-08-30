package config

import (
	"log"

	"parago-backend/internal/models"

	"gorm.io/gorm"
)

// Migrate menjalankan AutoMigrate untuk seluruh entitas sesuai ERD (PRD
// bagian 6), dalam urutan dependency: tabel yang direferensikan dulu,
// baru tabel yang mereferensikannya (mis. VehicleBrand sebelum
// VehicleModel, VehicleModel sebelum Vehicle).
//
// Penanganan khusus circular FK Division <-> User:
// Division.head_user_id -> users.id, sementara User.division_id ->
// divisions.id. Tabel `users` belum ada saat Division pertama kali
// dimigrasikan, jadi GORM akan gagal kalau langsung memaksa constraint
// itu dibuat. Solusinya dua tahap:
//  1. Migrasikan Division dengan foreign key constraint DIMATIKAN
//     sementara (khusus untuk pass ini saja).
//  2. Setelah tabel `users` ada, tambahkan constraint
//     `divisions.head_user_id -> users.id` secara eksplisit lewat
//     Migrator().CreateConstraint.
func Migrate(db *gorm.DB) error {
	log.Println("Menjalankan migrasi database...")

	prevDisableFK := db.DisableForeignKeyConstraintWhenMigrating
	db.DisableForeignKeyConstraintWhenMigrating = true
	err := db.AutoMigrate(&models.Division{})
	db.DisableForeignKeyConstraintWhenMigrating = prevDisableFK
	if err != nil {
		return err
	}

	if err := db.AutoMigrate(
		&models.VehicleBrand{},
		&models.Driver{},
		&models.User{},         // FK ke Division, tabelnya sudah ada di atas
		&models.VehicleModel{}, // FK ke VehicleBrand
		&models.Vehicle{},      // FK ke VehicleModel
		&models.Booking{},      // FK ke User, Division, Vehicle, Driver
	); err != nil {
		return err
	}

	// Tabel `users` sudah pasti ada di titik ini — baru aman bikin
	// constraint divisions.head_user_id -> users.id.
	if !db.Migrator().HasConstraint(&models.Division{}, "HeadUser") {
		if err := db.Migrator().CreateConstraint(&models.Division{}, "HeadUser"); err != nil {
			return err
		}
	}

	log.Println("Migrasi database selesai")
	return nil
}

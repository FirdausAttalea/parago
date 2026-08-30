package models

import "github.com/google/uuid"

// Division merepresentasikan struktur organisasi/divisi (PRD 6.3).
//
// Catatan desain: HeadUserID dibuat nullable, berbeda dari tabel di PRD
// yang tidak menandainya nullable. Ini sengaja untuk memutus circular FK
// dengan User (Division.head_user_id -> User, User.division_id ->
// Division): tanpa nullable, tidak ada urutan insert yang valid untuk
// baris pertama. Division bisa dibuat dulu tanpa head, User-nya
// menyusul, baru head_user_id diisi belakangan.
//
// Constraint OnDelete:RESTRICT di bawah TIDAK dibuat otomatis saat
// AutoMigrate(&Division{}) — lihat internal/config/migrate.go, tabel
// `users` belum tentu ada di titik itu. Tag ini cuma dipakai belakangan
// oleh Migrator().CreateConstraint(&Division{}, "HeadUser") setelah
// tabel `users` dipastikan ada.
type Division struct {
	BaseModel
	Name       string     `gorm:"not null" json:"name"`
	HeadUserID *uuid.UUID `gorm:"type:uuid" json:"head_user_id,omitempty"`
	HeadUser   *User      `gorm:"foreignKey:HeadUserID;constraint:OnDelete:RESTRICT" json:"head_user,omitempty"`
}

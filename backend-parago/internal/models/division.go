package models

// Division merepresentasikan struktur organisasi/divisi (PRD 6.3).
//
// Tidak ada kolom head_user_id di sini. Kepala divisi adalah derived
// value, bukan FK tersimpan: user dengan Role == RoleDivisionHead dan
// DivisionID menunjuk ke divisi ini ADALAH kepala divisi tersebut.
// Ini menghindari circular FK dengan User (Division -> User -> Division)
// sama sekali, bukan cuma memutusnya. Lihat
// repository.DivisionRepository.GetDivisionHead untuk cara resolve-nya.
type Division struct {
	BaseModel
	Name string `gorm:"not null" json:"name"`
}

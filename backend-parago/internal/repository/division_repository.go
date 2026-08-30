package repository

import (
	"parago-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DivisionRepository struct {
	DB *gorm.DB
}

func NewDivisionRepository(db *gorm.DB) *DivisionRepository {
	return &DivisionRepository{DB: db}
}

// GetDivisionHead resolve kepala divisi lewat User.role == division_head,
// bukan lewat FK tersimpan — lihat catatan desain di models/division.go.
// Dipakai nanti di approval workflow level 2 (Division Head review).
func (r *DivisionRepository) GetDivisionHead(divisionID uuid.UUID) (*models.User, error) {
	var head models.User
	err := r.DB.
		Where("division_id = ? AND role = ?", divisionID, models.RoleDivisionHead).
		First(&head).Error
	if err != nil {
		return nil, err
	}
	return &head, nil
}

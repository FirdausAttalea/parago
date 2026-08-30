package models

// Driver adalah data pengemudi internal perusahaan — PRD 6.3.
type Driver struct {
	BaseModel
	Name      string `gorm:"not null" json:"name"`
	LicenseNo string `gorm:"unique;not null" json:"license_no"`
	Phone     string `json:"phone"`
	Status    string `gorm:"not null;default:available" json:"status"` // available / on_duty / resigned
}

package controller

import (
	"parago-backend/internal/response"
	"parago-backend/internal/repository"
	"parago-backend/internal/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type RegisterRequest struct {
	Email        string `json:"email" binding:"required|email"`
	PhoneNumber  string `json:"phone_number" binding:"required"`
	Password     string `json:"password" binding:"required,min=8"`
}

type AuthController struct {
	userRepo *repository.UserRepository
}

func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{
		userRepo: repository.NewUserRepository(db),
	}
}

func (ac *AuthController) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request data")
		return
	}

	// Check if email already exists
	exists, err := ac.userRepo.ExistsByEmail(req.Email)
	if err != nil {
		response.InternalError(c, "Failed to check email")
		return
	}
	if exists {
		response.BadRequest(c, "Email already registered")
		return
	}

	// Hash password
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.InternalError(c, "Failed to hash password")
		return
	}

	// Get first available division
	var division models.Division
	if err := ac.userRepo.DB.First(&division).Error; err != nil {
		response.InternalError(c, "No division found in system")
		return
	}

	user := models.User{
		Name:         splitEmailToName(req.Email),
		Email:        req.Email,
		PasswordHash: string(passwordHash),
		Role:         "employee",
		DivisionID:   division.ID,
	}

	if err := ac.userRepo.Create(&user); err != nil {
		response.InternalError(c, "Failed to create user")
		return
	}

	response.Created(c, gin.H{
		"message": "Registration successful",
		"user_id": user.ID,
	})
}

func splitEmailToName(email string) string {
	// Extract name from email (before @)
	atIdx := -1
	for i, c := range email {
		if c == '@' {
			atIdx = i
			break
		}
	}
	if atIdx > 0 {
		name := email[:atIdx]
		// Capitalize first letter
		if len(name) > 0 {
			return string(name[0]-'a'+'A') + name[1:]
		}
	}
	return "User"
}

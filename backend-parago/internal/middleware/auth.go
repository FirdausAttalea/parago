package middleware

import (
	"errors"
	"time"

	"parago-backend/internal/models"

	ginjwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	secretKey   = []byte("parago-secret-key")
	identityKey = "id"
)

// Struktur input untuk JSON dari frontend
type login struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// JWTMiddleware sekarang menerima koneksi DB
func JWTMiddleware(db *gorm.DB) (*ginjwt.GinJWTMiddleware, error) {
	return ginjwt.New(&ginjwt.GinJWTMiddleware{
		Realm:       "parago",
		Key:         secretKey,
		Timeout:     24 * time.Hour,
		MaxRefresh:  24 * time.Hour,
		IdentityKey: identityKey,

		// 1. Authenticator: Mengecek Email & Password ke Database
		Authenticator: func(c *gin.Context) (interface{}, error) {
			var loginVals login
			if err := c.ShouldBindJSON(&loginVals); err != nil {
				return "", ginjwt.ErrMissingLoginValues
			}

			var user models.User
			if err := db.Preload("Division").Where("email = ?", loginVals.Email).First(&user).Error; err != nil {
				return nil, errors.New("Email atau password salah")
			}

			if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginVals.Password)); err != nil {
				return nil, errors.New("Email atau password salah")
			}

			c.Set("logged_in_user", user)

			return &user, nil
		},

		// 2. PayloadFunc: Menggunakan ginjwt.MapClaims
		PayloadFunc: func(data interface{}) ginjwt.MapClaims {
			if v, ok := data.(*models.User); ok {
				return ginjwt.MapClaims{
					identityKey: v.ID.String(),
					"role":      v.Role,
				}
			}
			return ginjwt.MapClaims{}
		},

		// 3. LoginResponse
		LoginResponse: func(c *gin.Context, code int, token string, expire time.Time) {
			userData, _ := c.Get("logged_in_user")
			user := userData.(models.User)

			c.JSON(code, gin.H{
				"success": true,
				"data": gin.H{
					"token":      token,
					"expires_at": expire.Format(time.RFC3339),
					"user": gin.H{
						"id":    user.ID,
						"name":  user.Name,
						"email": user.Email,
						"role":  user.Role,
						"division": gin.H{
							"id":   user.Division.ID,
							"name": user.Division.Name,
						},
					},
				},
				"message": "Login berhasil",
			})
		},

		// 4. Custom Unauthorized Response
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"success": false,
				"data":    nil,
				"message": message,
			})
		},

		// 5. Kembali menggunakan Authorizator dengan urutan parameter v2
		Authorizator: func(data interface{}, c *gin.Context) bool {
			return true
		},

		TokenLookup:   "header: Authorization, query: token, cookie: jwt",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	})
}

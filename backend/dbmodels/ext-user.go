package dbmodels

import (
	"github.com/Subilan/Monologue/models"
	"gorm.io/gorm"
)

type ExtUser struct {
	models.ExtUser
	gorm.Model
	PasswordHash string `gorm:"not null"`
}

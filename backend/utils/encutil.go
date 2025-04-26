package utils

import (
	"golang.org/x/crypto/bcrypt"
)

func BcryptPassword(password string) []byte {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return nil
	}

	return hash
}

func ComparePassword(hash, password []byte) bool {
	return bcrypt.CompareHashAndPassword(hash, password) == nil
}

package utils

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Resp(code int, data map[string]any, c *gin.Context) {
	c.JSON(code, data)
}

func OKK(c *gin.Context) {
	OK(nil, c)
}

func OK(data map[string]any, c *gin.Context) {
	Resp(http.StatusOK, gin.H{"status": "ok", "data": data}, c)
}

func BAD(message string, c *gin.Context) {
	Resp(http.StatusBadRequest, gin.H{"status": "ng", "message": message}, c)
}

func ERR(message string, c *gin.Context) {
	Resp(http.StatusInternalServerError, gin.H{"status": "error", "message": message}, c)
}

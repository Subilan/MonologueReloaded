package main

import (
	"github.com/Subilan/Monologue/handlers/lor"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Run(port string) error {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello World")
	})

	user := r.Group("/user")
	user.POST("create", lor.HandleCreateUser)
	user.POST("check", lor.HandleCheckUser)

	return r.Run(port)
}

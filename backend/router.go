package main

import (
	"github.com/Subilan/Monologue/handlers/lor"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Run(port string) error {
	r := gin.Default()

	r.Use(Cors)

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello World")
	})

	user := r.Group("/user")
	user.POST("create", lor.HandleCreateUser)
	user.POST("check", lor.HandleCheckUser)

	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "ng",
			"message": "route not found",
		})
	})

	return r.Run(port)
}

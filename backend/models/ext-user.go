package models

type ExtUser struct {
	LoginExtUser
	Age    int    `json:"age"`
	Gender string `gorm:"not null" json:"gender" binding:"required,oneof=M F O U"`
	Region string `json:"region"`
}

type LoginExtUser struct {
	Username string `gorm:"unique" json:"username" binding:"required,max=20,min=3"`
	Password string `gorm:"-" json:"password" binding:"required,min=8"`
}

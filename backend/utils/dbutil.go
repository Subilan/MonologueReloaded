package utils

import (
	"fmt"
	"github.com/Subilan/Monologue/dbmodels"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitializeDb(configFile string) {
	var err error
	config := GetConfig(configFile)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", config.Db.Username, config.Db.Password, config.Db.Host, config.Db.Port, config.Db.Database)
	Db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if config.Db.AutoMigrate {
		_ = Db.AutoMigrate(&dbmodels.ExtUser{})
	}

	Catch(err)
}

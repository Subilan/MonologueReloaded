package lor

import (
	"github.com/Subilan/Monologue/consts"
	"github.com/Subilan/Monologue/dbmodels"
	"github.com/Subilan/Monologue/models"
	"github.com/Subilan/Monologue/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleCreateUser(c *gin.Context) {
	var obj models.ExtUser

	if err := c.ShouldBindJSON(&obj); err != nil {
		utils.BAD(consts.InvalidBody, c)
		return
	}

	result := utils.Db.FirstOrCreate(&dbmodels.ExtUser{
		ExtUser:      obj,
		Model:        gorm.Model{},
		PasswordHash: string(utils.BcryptPassword(obj.Password)),
	})

	if result.Error != nil {
		utils.ERR(result.Error.Error(), c)
		return
	}

	if result.RowsAffected != 1 {
		utils.BAD(consts.DuplicateKey, c)
		return
	}

	utils.OKK(c)
}

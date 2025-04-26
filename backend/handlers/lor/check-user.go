package lor

import (
	"errors"
	"github.com/Subilan/Monologue/consts"
	"github.com/Subilan/Monologue/dbmodels"
	"github.com/Subilan/Monologue/models"
	"github.com/Subilan/Monologue/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleCheckUser(c *gin.Context) {
	var obj models.LoginExtUser

	if err := c.ShouldBind(&obj); err != nil {
		utils.BAD(consts.InvalidBody, c)
		return
	}

	var dbUser dbmodels.ExtUser
	res := utils.Db.Where(&dbmodels.ExtUser{
		ExtUser: models.ExtUser{
			LoginExtUser: models.LoginExtUser{
				Username: obj.Username,
			},
		},
	}).Take(&dbUser)

	if res.Error != nil {
		if errors.Is(res.Error, gorm.ErrRecordNotFound) {
			utils.BAD(consts.NotFound, c)
			return
		}

		utils.ERR(res.Error.Error(), c)
		return
	}

	if !utils.ComparePassword([]byte(dbUser.PasswordHash), []byte(obj.Password)) {
		utils.BAD(consts.IncorrectInfo, c)
		return
	}

	utils.OKK(c)
}

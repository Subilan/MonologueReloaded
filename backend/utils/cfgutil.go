package utils

import (
	"github.com/goccy/go-yaml"
	"os"
)

type Config struct {
	Db struct {
		Username    string `yaml:"username"`
		Password    string `yaml:"password"`
		Host        string `yaml:"host"`
		Port        string `yaml:"port"`
		Database    string `yaml:"database"`
		AutoMigrate bool   `yaml:"autoMigrate"`
	} `yaml:"db"`
}

func GetConfig(configFile string) Config {
	configContent, err := os.ReadFile(configFile)
	Catch(err)

	var res Config
	Catch(yaml.Unmarshal(configContent, &res))

	return res
}

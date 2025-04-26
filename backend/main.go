package main

import (
	"flag"
	"github.com/Subilan/Monologue/utils"
)

var configFile = flag.String("config", "config.yml", "Path to config file")

func main() {
	flag.Parse()

	utils.InitializeDb(*configFile)

	_ = Run(":9876")
}

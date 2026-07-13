package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	scenario := flag.String("scenario", "", "Scenario to run")
	flag.Parse()

	if *scenario == "" {
		fmt.Println("simulator scaffolded, scenarios implemented in Phase 3")
		os.Exit(0)
	}

	fmt.Printf("simulator scaffolded, scenario %s implemented in Phase 3\n", *scenario)
	os.Exit(0)
}

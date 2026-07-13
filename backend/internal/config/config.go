package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv         string
	LogLevel       string
	ServerPort     string
	FrontendOrigin string
	PostgresDSN    string
	RedisAddr      string
	RedisPassword  string
	JWTSecret      string
	JWTExpiryMins  string
	GeminiAPIKey   string
}

func LoadConfig() (*Config, error) {
	// Attempt to load .env file if it exists, but do not fail if missing
	_ = godotenv.Load()

	cfg := &Config{
		AppEnv:         getEnvOrError("APP_ENV"),
		LogLevel:       getEnvOrError("LOG_LEVEL"),
		ServerPort:     getEnvOrError("SERVER_PORT"),
		FrontendOrigin: getEnvOrError("FRONTEND_ORIGIN"),
		PostgresDSN:    getEnvOrError("POSTGRES_DSN"),
		RedisAddr:      getEnvOrError("REDIS_ADDR"),
		RedisPassword:  os.Getenv("REDIS_PASSWORD"), // Optional
		JWTSecret:      getEnvOrError("JWT_SECRET"),
		JWTExpiryMins:  getEnvOrError("JWT_EXPIRY_MINUTES"),
		GeminiAPIKey:   os.Getenv("GEMINI_API_KEY"), // For Phase 3
	}

	return cfg, nil
}

func getEnvOrError(key string) string {
	val := os.Getenv(key)
	if val == "" {
		// Fail fast if required config is missing
		panic(fmt.Sprintf("FATAL: Missing required environment variable: %s", key))
	}
	return val
}

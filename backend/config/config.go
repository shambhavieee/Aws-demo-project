package config

import "os"

// Config holds all application-level configuration.
type Config struct {
	JWTSecret   string
	DBPath      string
	Port        string
	FrontendURL string
}

// Load returns the application config, reading from environment
// variables with sensible defaults for local development.
func Load() *Config {
	return &Config{
		JWTSecret:   getEnv("JWT_SECRET", "examduty-super-secret-key-change-in-production"),
		DBPath:      getEnv("DB_PATH", "./examduty.db"),
		Port:        getEnv("PORT", "8080"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

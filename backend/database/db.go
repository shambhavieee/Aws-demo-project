package database

import (
	"log"

	"examduty-backend/models"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Init opens (or creates) the SQLite database, runs auto-migrations,
// and seeds initial data if the database is empty.
func Init(dbPath string) {
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate all models
	if err := DB.AutoMigrate(
		&models.User{},
		&models.Exam{},
		&models.Payment{},
		&models.Incident{},
		&models.Application{},
	); err != nil {
		log.Fatalf("Auto-migration failed: %v", err)
	}

	log.Println("✅ Database connected and migrated")

	// Seed if empty
	Seed(DB)
}

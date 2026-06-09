package main

import (
	"log"
	"net/http"

	"examduty-backend/config"
	"examduty-backend/database"
	"examduty-backend/handlers"
	"examduty-backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// ── Load config ──────────────────────────────────────────────────────────── 
	cfg := config.Load()

	// ── Init database ────────────────────────────────────────────────────────── 
	database.Init(cfg.DBPath)

	// ── Pass JWT secret to handlers ────────────────────────────────────────────
	handlers.SetJWTSecret(cfg.JWTSecret)

	// ── Set up Gin ─────────────────────────────────────────────────────────────
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// ── CORS — allow React dev server ──────────────────────────────────────────
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL, "http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// ── Health check ───────────────────────────────────────────────────────────
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "examduty-backend"})
	})

	// ── API routes ─────────────────────────────────────────────────────────────
	api := r.Group("/api")

	// Public — no auth required
	auth := api.Group("/auth")
	{
		auth.POST("/login", handlers.Login)
		auth.POST("/logout", handlers.Logout)
	}

	// Protected — JWT required
	protected := api.Group("")
	protected.Use(middleware.Auth(cfg.JWTSecret))
	{
		protected.GET("/me", handlers.Me)

		// Exams
		protected.GET("/exams", handlers.ListExams)
		protected.GET("/exams/:id", handlers.GetExam)

		// Payments
		protected.GET("/payments", handlers.ListPayments)
		protected.GET("/payments/:id", handlers.GetPayment)

		// Incidents
		protected.GET("/incidents", handlers.ListIncidents)
		protected.GET("/incidents/:id", handlers.GetIncident)
		protected.POST("/incidents", handlers.CreateIncident)

		// Applications
		protected.GET("/applications", handlers.ListApplications)
		protected.GET("/applications/:id", handlers.GetApplication)
		protected.POST("/applications", handlers.CreateApplication)

		// Dashboard
		protected.GET("/dashboard/stats", handlers.GetDashboardStats)
	}

	// ── Start server ───────────────────────────────────────────────────────────
	addr := ":" + cfg.Port
	log.Printf("🚀 ExamDuty Backend running on http://localhost%s", addr)
	log.Printf("📡 Allowing CORS from: %s", cfg.FrontendURL)
	log.Printf("💾 Database: %s", cfg.DBPath)

	if err := r.Run(addr); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

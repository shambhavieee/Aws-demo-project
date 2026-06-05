package handlers

import (
	"fmt"
	"net/http"
	"time"

	"examduty-backend/database"
	"examduty-backend/middleware"
	"examduty-backend/models"

	"github.com/gin-gonic/gin"
)

// ListApplications returns all applications for the authenticated user.
// Supports optional query param: ?status=pending|approved|rejected|waitlisted
// GET /api/applications
func ListApplications(c *gin.Context) {
	userID := middleware.GetUserID(c)
	status := c.Query("status")

	query := database.DB.Where("user_id = ?", userID)
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var apps []models.Application
	if err := query.Order("created_at desc").Find(&apps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch applications"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": apps, "total": len(apps)})
}

// GetApplication returns a single application by app code.
// GET /api/applications/:id
func GetApplication(c *gin.Context) {
	userID := middleware.GetUserID(c)
	code := c.Param("id")

	var app models.Application
	if err := database.DB.
		Where("app_code = ? AND user_id = ?", code, userID).
		First(&app).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Application not found"})
		return
	}
	c.JSON(http.StatusOK, app)
}

// CreateApplication submits a new exam duty application.
// POST /api/applications
func CreateApplication(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var input models.CreateApplicationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var count int64
	database.DB.Model(&models.Application{}).Count(&count)
	code := fmt.Sprintf("APP-%03d", count+1)

	app := models.Application{
		AppCode:        code,
		ExamName:       input.ExamName,
		Board:          input.Board,
		ExamDate:       input.ExamDate,
		AppliedOn:      time.Now().Format("2006-01-02"),
		Role:           input.Role,
		PreferredVenue: input.PreferredVenue,
		Status:         models.AppStatusPending,
		Remarks:        "Application submitted. Awaiting review.",
		UserID:         userID,
	}

	if err := database.DB.Create(&app).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit application"})
		return
	}
	c.JSON(http.StatusCreated, app)
}

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

// ListIncidents returns all incidents reported by the authenticated user.
// GET /api/incidents
func ListIncidents(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var incidents []models.Incident
	if err := database.DB.
		Where("user_id = ?", userID).
		Order("reported_at desc").
		Find(&incidents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch incidents"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": incidents, "total": len(incidents)})
}

// GetIncident returns a single incident by its code.
// GET /api/incidents/:id
func GetIncident(c *gin.Context) {
	userID := middleware.GetUserID(c)
	code := c.Param("id")

	var incident models.Incident
	if err := database.DB.
		Where("incident_code = ? AND user_id = ?", code, userID).
		First(&incident).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
		return
	}
	c.JSON(http.StatusOK, incident)
}

// CreateIncident allows a user to report a new incident.
// POST /api/incidents
func CreateIncident(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var input models.CreateIncidentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate a sequential incident code
	var count int64
	database.DB.Model(&models.Incident{}).Count(&count)
	code := fmt.Sprintf("INC-%03d", count+1)

	incident := models.Incident{
		IncidentCode: code,
		ExamID:       input.ExamID,
		ExamName:     input.ExamName,
		ExamDate:     input.ExamDate,
		Venue:        input.Venue,
		IncidentType: input.IncidentType,
		Severity:     models.IncidentSeverity(input.Severity),
		Description:  input.Description,
		ReportedAt:   time.Now().Format(time.RFC3339),
		Status:       models.IncidentStatusOpen,
		UserID:       userID,
	}

	if err := database.DB.Create(&incident).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create incident"})
		return
	}
	c.JSON(http.StatusCreated, incident)
}

package handlers

import (
	"net/http"

	"examduty-backend/database"
	"examduty-backend/middleware"
	"examduty-backend/models"

	"github.com/gin-gonic/gin"
)

// ListExams returns all exams for the authenticated user.
// Supports optional query param: ?status=assigned|conducted|upcoming|cancelled
// GET /api/exams
func ListExams(c *gin.Context) {
	userID := middleware.GetUserID(c)
	status := c.Query("status")

	query := database.DB.Where("user_id = ?", userID)
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var exams []models.Exam
	if err := query.Order("date desc").Find(&exams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exams"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": exams, "total": len(exams)})
}

// GetExam returns a single exam by its exam code (e.g. EX-001).
// GET /api/exams/:id
func GetExam(c *gin.Context) {
	userID := middleware.GetUserID(c)
	examCode := c.Param("id")

	var exam models.Exam
	if err := database.DB.
		Where("exam_code = ? AND user_id = ?", examCode, userID).
		First(&exam).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Exam not found"})
		return
	}
	c.JSON(http.StatusOK, exam)
}

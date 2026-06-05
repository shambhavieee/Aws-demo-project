package handlers

import (
	"net/http"

	"examduty-backend/database"
	"examduty-backend/middleware"
	"examduty-backend/models"

	"github.com/gin-gonic/gin"
)

type DashboardStats struct {
	TotalAssigned      int64   `json:"totalAssigned"`
	TotalConducted     int64   `json:"totalConducted"`
	UpcomingExams      int64   `json:"upcomingExams"`
	TotalEarnings      float64 `json:"totalEarnings"`
	PendingPayments    int64   `json:"pendingPayments"`
	OpenIncidents      int64   `json:"openIncidents"`
	PendingApplications int64  `json:"pendingApplications"`
}

// GetDashboardStats returns summary statistics for the dashboard page.
// GET /api/dashboard/stats
func GetDashboardStats(c *gin.Context) {
	userID := middleware.GetUserID(c)
	db := database.DB

	var stats DashboardStats

	db.Model(&models.Exam{}).Where("user_id = ?", userID).Count(&stats.TotalAssigned)
	db.Model(&models.Exam{}).Where("user_id = ? AND status = ?", userID, models.ExamStatusConducted).Count(&stats.TotalConducted)
	db.Model(&models.Exam{}).Where("user_id = ? AND status IN ?", userID, []models.ExamStatus{models.ExamStatusUpcoming, models.ExamStatusAssigned}).Count(&stats.UpcomingExams)

	// Sum of paid payments
	db.Model(&models.Payment{}).
		Where("user_id = ? AND status = ?", userID, models.PaymentStatusPaid).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&stats.TotalEarnings)

	db.Model(&models.Payment{}).
		Where("user_id = ? AND status IN ?", userID, []models.PaymentStatus{models.PaymentStatusPending, models.PaymentStatusProcessing}).
		Count(&stats.PendingPayments)

	db.Model(&models.Incident{}).
		Where("user_id = ? AND status IN ?", userID, []models.IncidentStatus{models.IncidentStatusOpen, models.IncidentStatusUnderReview}).
		Count(&stats.OpenIncidents)

	db.Model(&models.Application{}).
		Where("user_id = ? AND status IN ?", userID, []models.ApplicationStatus{models.AppStatusPending, models.AppStatusWaitlisted}).
		Count(&stats.PendingApplications)

	c.JSON(http.StatusOK, stats)
}

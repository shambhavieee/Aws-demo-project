package handlers

import (
	"net/http"

	"examduty-backend/database"
	"examduty-backend/middleware"
	"examduty-backend/models"

	"github.com/gin-gonic/gin"
)

// ListPayments returns all payments for the authenticated user.
// Supports optional query param: ?status=paid|pending|processing|rejected
// GET /api/payments
func ListPayments(c *gin.Context) {
	userID := middleware.GetUserID(c)
	status := c.Query("status")

	query := database.DB.Where("user_id = ?", userID)
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var payments []models.Payment
	if err := query.Order("created_at desc").Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch payments"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": payments, "total": len(payments)})
}

// GetPayment returns a single payment by payment code.
// GET /api/payments/:id
func GetPayment(c *gin.Context) {
	userID := middleware.GetUserID(c)
	payCode := c.Param("id")

	var payment models.Payment
	if err := database.DB.
		Where("payment_code = ? AND user_id = ?", payCode, userID).
		First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found"})
		return
	}
	c.JSON(http.StatusOK, payment)
}

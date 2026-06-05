package models

import "gorm.io/gorm"

type ApplicationStatus string

const (
	AppStatusPending    ApplicationStatus = "pending"
	AppStatusApproved   ApplicationStatus = "approved"
	AppStatusRejected   ApplicationStatus = "rejected"
	AppStatusWaitlisted ApplicationStatus = "waitlisted"
)

// Application represents a user's application to invigilate an exam.
type Application struct {
	gorm.Model
	AppCode        string            `gorm:"uniqueIndex;not null" json:"id"`
	ExamName       string            `json:"examName"`
	Board          string            `json:"board"`
	ExamDate       string            `json:"examDate"`
	AppliedOn      string            `json:"appliedOn"`
	Role           string            `json:"role"`
	PreferredVenue string            `json:"preferredVenue"`
	Status         ApplicationStatus `gorm:"default:pending" json:"status"`
	Remarks        string            `json:"remarks,omitempty"`
	ReviewedOn     string            `json:"reviewedOn,omitempty"`
	UserID         uint              `json:"userId"`
	User           User              `gorm:"foreignKey:UserID" json:"-"`
}

// CreateApplicationInput is the request body for POST /api/applications.
type CreateApplicationInput struct {
	ExamName       string `json:"examName" binding:"required"`
	Board          string `json:"board" binding:"required"`
	ExamDate       string `json:"examDate" binding:"required"`
	Role           string `json:"role" binding:"required"`
	PreferredVenue string `json:"preferredVenue" binding:"required"`
}

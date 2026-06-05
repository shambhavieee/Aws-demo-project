package models

import "gorm.io/gorm"

type IncidentSeverity string
type IncidentStatus string

const (
	SeverityLow      IncidentSeverity = "low"
	SeverityMedium   IncidentSeverity = "medium"
	SeverityHigh     IncidentSeverity = "high"
	SeverityCritical IncidentSeverity = "critical"

	IncidentStatusOpen        IncidentStatus = "open"
	IncidentStatusUnderReview IncidentStatus = "under_review"
	IncidentStatusResolved    IncidentStatus = "resolved"
	IncidentStatusClosed      IncidentStatus = "closed"
)

// Incident represents an incident reported during an examination duty.
type Incident struct {
	gorm.Model
	IncidentCode  string           `gorm:"uniqueIndex;not null" json:"id"`
	ExamID        uint             `json:"examId"`
	ExamName      string           `json:"examName"`
	ExamDate      string           `json:"examDate"`
	Venue         string           `json:"venue"`
	IncidentType  string           `json:"incidentType"`
	Severity      IncidentSeverity `gorm:"default:medium" json:"severity"`
	Description   string           `gorm:"type:text" json:"description"`
	ReportedAt    string           `json:"reportedAt"` // RFC3339
	Status        IncidentStatus   `gorm:"default:open" json:"status"`
	ActionTaken   string           `gorm:"type:text" json:"actionTaken,omitempty"`
	UserID        uint             `json:"userId"`
	User          User             `gorm:"foreignKey:UserID" json:"-"`
}

// CreateIncidentInput is the request body for POST /api/incidents.
type CreateIncidentInput struct {
	ExamID       uint   `json:"examId" binding:"required"`
	ExamName     string `json:"examName" binding:"required"`
	ExamDate     string `json:"examDate" binding:"required"`
	Venue        string `json:"venue" binding:"required"`
	IncidentType string `json:"incidentType" binding:"required"`
	Severity     string `json:"severity" binding:"required"`
	Description  string `json:"description" binding:"required"`
}

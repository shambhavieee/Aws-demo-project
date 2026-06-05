package models

import "gorm.io/gorm"

type ExamStatus string

const (
	ExamStatusAssigned  ExamStatus = "assigned"
	ExamStatusConducted ExamStatus = "conducted"
	ExamStatusUpcoming  ExamStatus = "upcoming"
	ExamStatusCancelled ExamStatus = "cancelled"
)

// Exam represents an examination duty assigned to a user.
type Exam struct {
	gorm.Model
	ExamCode      string     `gorm:"uniqueIndex;not null" json:"id"`
	ExamName      string     `gorm:"not null" json:"examName"`
	Board         string     `json:"board"`
	Subject       string     `json:"subject"`
	Date          string     `json:"date"`           // "YYYY-MM-DD"
	Time          string     `json:"time"`           // "09:30 AM"
	Venue         string     `json:"venue"`
	VenueAddress  string     `json:"venueAddress"`
	Role          string     `json:"role"`
	Status        ExamStatus `gorm:"default:assigned" json:"status"`
	DutyType      string     `json:"dutyType"`
	ReportingTime string     `json:"reportingTime"`
	UserID        uint       `json:"userId"`          // FK → User.ID
	User          User       `gorm:"foreignKey:UserID" json:"-"`
}

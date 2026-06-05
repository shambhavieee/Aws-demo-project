package models

import "gorm.io/gorm"

type PaymentStatus string

const (
	PaymentStatusPaid       PaymentStatus = "paid"
	PaymentStatusPending    PaymentStatus = "pending"
	PaymentStatusProcessing PaymentStatus = "processing"
	PaymentStatusRejected   PaymentStatus = "rejected"
)

// Payment represents an honorarium payment for a conducted exam duty.
type Payment struct {
	gorm.Model
	PaymentCode   string        `gorm:"uniqueIndex;not null" json:"id"`
	ExamID        uint          `json:"examId"`
	ExamCode      string        `json:"examCode"` // human-readable ref
	ExamName      string        `json:"examName"`
	ExamDate      string        `json:"examDate"`
	DutyType      string        `json:"dutyType"`
	Amount        float64       `json:"amount"`
	Status        PaymentStatus `gorm:"default:pending" json:"status"`
	PaymentDate   string        `json:"paymentDate,omitempty"`
	TransactionID string        `json:"transactionId,omitempty"`
	BankAccount   string        `json:"bankAccount"`
	Remarks       string        `json:"remarks,omitempty"`
	UserID        uint          `json:"userId"`
	User          User          `gorm:"foreignKey:UserID" json:"-"`
}

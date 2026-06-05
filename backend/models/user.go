package models

import "gorm.io/gorm"

// User represents an invigilator/supervisor account.
type User struct {
	gorm.Model
	Name        string `gorm:"not null" json:"name"`
	Email       string `gorm:"uniqueIndex;not null" json:"email"`
	Password    string `gorm:"not null" json:"-"` // bcrypt hash, never exposed
	EmployeeID  string `gorm:"uniqueIndex;not null" json:"employeeId"`
	Designation string `json:"designation"`
	Department  string `json:"department"`
}

// UserResponse is the safe public representation of a user (no password).
type UserResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	EmployeeID  string `json:"employeeId"`
	Designation string `json:"designation"`
	Department  string `json:"department"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:          u.ID,
		Name:        u.Name,
		Email:       u.Email,
		EmployeeID:  u.EmployeeID,
		Designation: u.Designation,
		Department:  u.Department,
	}
}

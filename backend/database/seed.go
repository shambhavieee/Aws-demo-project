package database

import (
	"log"
	"time"

	"examduty-backend/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Seed populates the database with demo data on first run.
// It is idempotent — skipped if a user already exists.
func Seed(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		log.Println("ℹ️  Database already seeded, skipping")
		return
	}

	log.Println("🌱 Seeding database...")

	// ── User ──────────────────────────────────────────────
	hash, _ := bcrypt.GenerateFromPassword([]byte("Admin@123"), bcrypt.DefaultCost)
	user := models.User{
		Name:        "Priya Sharma",
		Email:       "demo@exam.gov.in",
		Password:    string(hash),
		EmployeeID:  "INV-2024-0042",
		Designation: "Senior Invigilator",
		Department:  "Examination Wing – Zone B",
	}
	db.Create(&user)

	// ── Exams ─────────────────────────────────────────────
	exams := []models.Exam{
		{ExamCode: "EX-001", ExamName: "UPSC Civil Services Prelims 2024", Board: "UPSC", Subject: "General Studies Paper I", Date: "2024-06-16", Time: "09:30 AM", Venue: "Delhi Public School, R K Puram", VenueAddress: "Sector 12, R K Puram, New Delhi – 110022", Role: "Chief Superintendent", Status: models.ExamStatusConducted, DutyType: "Invigilation", ReportingTime: "07:30 AM", UserID: user.ID},
		{ExamCode: "EX-002", ExamName: "SSC CGL Tier I 2024", Board: "SSC", Subject: "Combined Graduate Level", Date: "2024-07-09", Time: "10:00 AM", Venue: "Kendriya Vidyalaya No. 2", VenueAddress: "Andrews Ganj, New Delhi – 110049", Role: "Invigilator", Status: models.ExamStatusConducted, DutyType: "Invigilation", ReportingTime: "08:30 AM", UserID: user.ID},
		{ExamCode: "EX-003", ExamName: "IBPS PO Mains 2024", Board: "IBPS", Subject: "Probationary Officer – Main Exam", Date: "2024-11-24", Time: "09:00 AM", Venue: "Army Public School, Dhaula Kuan", VenueAddress: "Shankarpuri, New Delhi – 110010", Role: "Flying Squad Member", Status: models.ExamStatusConducted, DutyType: "Flying Squad", ReportingTime: "07:00 AM", UserID: user.ID},
		{ExamCode: "EX-004", ExamName: "CBSE Board Exam 2025 – Class XII", Board: "CBSE", Subject: "Mathematics", Date: "2025-03-08", Time: "10:30 AM", Venue: "Springdales School, Pusa Road", VenueAddress: "Pusa Road, New Delhi – 110060", Role: "Invigilator", Status: models.ExamStatusConducted, DutyType: "Invigilation", ReportingTime: "09:00 AM", UserID: user.ID},
		{ExamCode: "EX-005", ExamName: "CBSE Board Exam 2025 – Class X", Board: "CBSE", Subject: "Science", Date: "2025-03-15", Time: "10:30 AM", Venue: "Sarvodaya Vidyalaya, Sector 8", VenueAddress: "Sector 8, Rohini, New Delhi – 110085", Role: "Invigilator", Status: models.ExamStatusConducted, DutyType: "Invigilation", ReportingTime: "09:00 AM", UserID: user.ID},
		{ExamCode: "EX-006", ExamName: "NEET UG 2025", Board: "NTA", Subject: "Biology, Physics & Chemistry", Date: "2025-05-04", Time: "02:00 PM", Venue: "Guru Harkishan Public School", VenueAddress: "Pitampura, New Delhi – 110034", Role: "Chief Superintendent", Status: models.ExamStatusUpcoming, DutyType: "Invigilation", ReportingTime: "11:00 AM", UserID: user.ID},
		{ExamCode: "EX-007", ExamName: "JEE Main Session 2 2025", Board: "NTA", Subject: "Physics, Chemistry & Mathematics", Date: "2025-04-02", Time: "09:00 AM", Venue: "Modern School, Barakhamba Road", VenueAddress: "Barakhamba Road, New Delhi – 110001", Role: "Invigilator", Status: models.ExamStatusUpcoming, DutyType: "Invigilation", ReportingTime: "07:30 AM", UserID: user.ID},
		{ExamCode: "EX-008", ExamName: "Delhi Police Constable Exam 2025", Board: "SSC", Subject: "Written Test", Date: "2025-06-14", Time: "10:00 AM", Venue: "Bal Bharati Public School, Pitampura", VenueAddress: "Pitampura, New Delhi – 110034", Role: "Invigilator", Status: models.ExamStatusAssigned, DutyType: "Invigilation", ReportingTime: "08:00 AM", UserID: user.ID},
	}
	db.Create(&exams)

	// ── Payments ──────────────────────────────────────────
	payments := []models.Payment{
		{PaymentCode: "PAY-001", ExamID: exams[0].ID, ExamCode: "EX-001", ExamName: "UPSC Civil Services Prelims 2024", ExamDate: "2024-06-16", DutyType: "Chief Superintendent", Amount: 3500, Status: models.PaymentStatusPaid, PaymentDate: "2024-07-10", TransactionID: "TXN20240710001", BankAccount: "SBI ****4521", Remarks: "Payment processed successfully", UserID: user.ID},
		{PaymentCode: "PAY-002", ExamID: exams[1].ID, ExamCode: "EX-002", ExamName: "SSC CGL Tier I 2024", ExamDate: "2024-07-09", DutyType: "Invigilator", Amount: 1800, Status: models.PaymentStatusPaid, PaymentDate: "2024-08-05", TransactionID: "TXN20240805002", BankAccount: "SBI ****4521", Remarks: "Credited via NEFT", UserID: user.ID},
		{PaymentCode: "PAY-003", ExamID: exams[2].ID, ExamCode: "EX-003", ExamName: "IBPS PO Mains 2024", ExamDate: "2024-11-24", DutyType: "Flying Squad", Amount: 2500, Status: models.PaymentStatusProcessing, BankAccount: "SBI ****4521", Remarks: "Under finance review", UserID: user.ID},
		{PaymentCode: "PAY-004", ExamID: exams[3].ID, ExamCode: "EX-004", ExamName: "CBSE Board Exam 2025 – Class XII", ExamDate: "2025-03-08", DutyType: "Invigilator", Amount: 1500, Status: models.PaymentStatusPending, BankAccount: "SBI ****4521", Remarks: "Awaiting HOD approval", UserID: user.ID},
		{PaymentCode: "PAY-005", ExamID: exams[4].ID, ExamCode: "EX-005", ExamName: "CBSE Board Exam 2025 – Class X", ExamDate: "2025-03-15", DutyType: "Invigilator", Amount: 1500, Status: models.PaymentStatusPending, BankAccount: "SBI ****4521", Remarks: "Awaiting HOD approval", UserID: user.ID},
	}
	db.Create(&payments)

	// ── Incidents ─────────────────────────────────────────
	incidents := []models.Incident{
		{
			IncidentCode: "INC-001", ExamID: exams[0].ID, ExamName: "UPSC Civil Services Prelims 2024", ExamDate: "2024-06-16",
			Venue:        "Delhi Public School, R K Puram",
			IncidentType: "Unfair Means", Severity: models.SeverityHigh,
			Description:  "Candidate found in possession of a mobile phone inside the examination hall. The device was confiscated and candidate was escorted out. Detailed report filed with the Centre Superintendent.",
			ReportedAt:   "2024-06-16T11:45:00+05:30",
			Status:       models.IncidentStatusResolved,
			ActionTaken:  "Candidate barred from exam. Report forwarded to UPSC. FIR filed with local police.",
			UserID:       user.ID,
		},
		{
			IncidentCode: "INC-002", ExamID: exams[3].ID, ExamName: "CBSE Board Exam 2025 – Class XII", ExamDate: "2025-03-08",
			Venue:        "Springdales School, Pusa Road",
			IncidentType: "Candidate Misbehaviour", Severity: models.SeverityMedium,
			Description:  "A candidate verbally abused the invigilator when asked to stop writing after the bell. The candidate refused to comply for approximately 2 minutes.",
			ReportedAt:   "2025-03-08T13:10:00+05:30",
			Status:       models.IncidentStatusUnderReview,
			ActionTaken:  "Warning issued. Report submitted to school principal and CBSE regional office.",
			UserID:       user.ID,
		},
	}
	db.Create(&incidents)

	// ── Applications ──────────────────────────────────────
	applications := []models.Application{
		{AppCode: "APP-001", ExamName: "UPSC CAPF AC Exam 2025", Board: "UPSC", ExamDate: "2025-08-24", AppliedOn: "2025-05-10", Role: "Chief Superintendent", PreferredVenue: "Central Delhi Zone", Status: models.AppStatusApproved, Remarks: "Application approved. Duty letter will be issued 7 days prior.", ReviewedOn: "2025-05-20", UserID: user.ID},
		{AppCode: "APP-002", ExamName: "SSC CHSL Tier I 2025", Board: "SSC", ExamDate: "2025-07-15", AppliedOn: "2025-05-25", Role: "Invigilator", PreferredVenue: "North Delhi Zone", Status: models.AppStatusPending, Remarks: "Under review by zonal coordinator", UserID: user.ID},
		{AppCode: "APP-003", ExamName: "RBI Grade B 2025", Board: "RBI", ExamDate: "2025-06-29", AppliedOn: "2025-04-18", Role: "Observer", PreferredVenue: "South Delhi Zone", Status: models.AppStatusRejected, Remarks: "Insufficient experience for Observer role. Reapply as Invigilator.", ReviewedOn: "2025-05-02", UserID: user.ID},
		{AppCode: "APP-004", ExamName: "NEET PG 2025", Board: "NBE", ExamDate: "2025-09-07", AppliedOn: "2025-06-01", Role: "Invigilator", PreferredVenue: "West Delhi Zone", Status: models.AppStatusWaitlisted, Remarks: "On waitlist position #3. Will be confirmed if vacancies arise.", UserID: user.ID},
	}
	db.Create(&applications)

	_ = time.Now() // ensure time import is used
	log.Println("✅ Seed data inserted successfully")
}

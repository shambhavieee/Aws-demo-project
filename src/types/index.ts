export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  designation: string;
  department: string;
  avatar?: string;
}

export interface Exam {
  id: string;
  examName: string;
  board: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  role: string;
  status: 'assigned' | 'conducted' | 'upcoming' | 'cancelled';
  dutyType: string;
  reportingTime: string;
}

export interface Payment {
  id: string;
  examId: string;
  examName: string;
  examDate: string;
  dutyType: string;
  amount: number;
  status: 'paid' | 'pending' | 'processing' | 'rejected';
  paymentDate?: string;
  transactionId?: string;
  bankAccount: string;
  remarks?: string;
}

export interface Incident {
  id: string;
  examId: string;
  examName: string;
  examDate: string;
  venue: string;
  incidentType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedAt: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  actionTaken?: string;
}

export interface Application {
  id: string;
  examName: string;
  board: string;
  examDate: string;
  appliedOn: string;
  role: string;
  preferredVenue: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  remarks?: string;
  reviewedOn?: string;
}

export interface DashboardStats {
  totalAssigned: number;
  totalConducted: number;
  upcomingExams: number;
  totalEarnings: number;
  pendingPayments: number;
  openIncidents: number;
  pendingApplications: number;
}

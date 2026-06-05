/**
 * Typed API client for the ExamDuty Go backend.
 * All requests are sent to http://localhost:8080/api.
 * The JWT token is automatically read from localStorage.
 */

import type {
  User, Exam, Payment, Incident, Application, DashboardStats,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ── Token helpers ──────────────────────────────────────────────────────────────

export const tokenStorage = {
  get: (): string | null => localStorage.getItem('examduty_token'),
  set: (t: string) => localStorage.setItem('examduty_token', t),
  clear: () => localStorage.removeItem('examduty_token'),
};

// ── Core fetch wrapper ─────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Response wrappers ──────────────────────────────────────────────────────────

interface ListResponse<T> {
  data: T[];
  total: number;
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),

  me: () => apiFetch<User>('/me'),
};

// ── Dashboard ──────────────────────────────────────────────────────────────────

export const dashboardApi = {
  stats: () => apiFetch<DashboardStats>('/dashboard/stats'),
};

// ── Exams ──────────────────────────────────────────────────────────────────────

export const examsApi = {
  list: (status?: string) =>
    apiFetch<ListResponse<Exam>>(`/exams${status ? `?status=${status}` : ''}`),

  get: (id: string) => apiFetch<Exam>(`/exams/${id}`),
};

// ── Payments ───────────────────────────────────────────────────────────────────

export const paymentsApi = {
  list: (status?: string) =>
    apiFetch<ListResponse<Payment>>(`/payments${status ? `?status=${status}` : ''}`),

  get: (id: string) => apiFetch<Payment>(`/payments/${id}`),
};

// ── Incidents ──────────────────────────────────────────────────────────────────

export const incidentsApi = {
  list: () => apiFetch<ListResponse<Incident>>('/incidents'),
  get: (id: string) => apiFetch<Incident>(`/incidents/${id}`),
  create: (data: Omit<Incident, 'id' | 'status' | 'reportedAt' | 'actionTaken'>) =>
    apiFetch<Incident>('/incidents', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Applications ───────────────────────────────────────────────────────────────

export const applicationsApi = {
  list: (status?: string) =>
    apiFetch<ListResponse<Application>>(`/applications${status ? `?status=${status}` : ''}`),
  get: (id: string) => apiFetch<Application>(`/applications/${id}`),
  create: (data: Pick<Application, 'examName' | 'board' | 'examDate' | 'role' | 'preferredVenue'>) =>
    apiFetch<Application>('/applications', { method: 'POST', body: JSON.stringify(data) }),
};

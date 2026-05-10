import { apiFetch } from "@/lib/api";

export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type FraudAlertStatus = "NEW" | "INVESTIGATING" | "DISMISSED" | "RESOLVED";

export type RecentAlert = {
  alertId: string;
  transactionId: string;
  transactionRef: string;
  severity: AlertSeverity;
  alertStatus?: FraudAlertStatus;
  title: string;
  message: string;
  riskScore?: number;
  riskLevel?: string;
  status?: string;
  ipAddress?: string | null;
  deviceId?: string | null;
  amount?: string;
  currency?: string;
  explanation?: string;
  createdAt: string;
  isResolved?: boolean;
  dismissReason?: string | null;
};

export type FraudAlert = {
  id: string;
  transactionId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  metadata?: any;
  status: FraudAlertStatus;
  statusUpdatedAt: string;
  statusUpdatedByUserId?: string | null;
  dismissReason?: string | null;
  isResolved: boolean;
  resolvedAt?: string | null;
  createdAt: string;
};

export type Transaction = {
  id: string;
  transactionRef: string;
  amount: string;
  currency: string;
  senderAccount?: string | null;
  receiverAccount?: string | null;
  ipAddress?: string | null;
  deviceId?: string | null;
  location?: string | null;
  riskScore: number;
  riskLevel: string;
  status: string;
  createdAt: string;
  fraudAlerts?: FraudAlert[];
  user?: { id: string; name: string; email: string; role: string } | null;
};

export type Trace = {
  originCity: string;
  destinationCity: string;
  nodes: { id: string; label: string; city: string; lng: number; lat: number }[];
  points: { seq: number; lng: number; lat: number; tMs: number }[];
};

export type ReportsList = {
  reports: any[];
  pagination: { total: number; page: number; limit: number; pages: number };
};

export function getRecentAlerts(token: string) {
  return apiFetch<RecentAlert[]>("/alerts/recent", { token });
}

export function listAlerts(token: string, params?: Record<string, string | number | undefined>) {
  const qs = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  return apiFetch<{ alerts: FraudAlert[]; pagination: any }>(`/alerts${qs}`, { token });
}

export function investigateAlert(token: string, alertId: string) {
  return apiFetch<{ alert: FraudAlert }>(`/alerts/${alertId}/investigate`, {
    method: "PATCH",
    token,
  });
}

export function dismissAlert(token: string, alertId: string, reason?: string) {
  return apiFetch<{ alert: FraudAlert }>(`/alerts/${alertId}/dismiss`, {
    method: "PATCH",
    token,
    body: JSON.stringify(reason ? { reason } : {}),
  });
}

export function getTransaction(token: string, id: string) {
  return apiFetch<{ transaction: Transaction }>(`/transactions/${id}`, { token });
}

export function getTransactionTrace(token: string, id: string) {
  return apiFetch<{ trace: Trace }>(`/transactions/${id}/trace`, { token });
}

export function listTransactions(
  token: string,
  params?: Record<string, string | number | undefined>,
) {
  const qs = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  return apiFetch<{ transactions: Transaction[]; pagination: any }>(`/transactions${qs}`, {
    token,
  });
}

export function listReports(token: string, params?: Record<string, string | number | undefined>) {
  const qs = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  return apiFetch<ReportsList>(`/reports${qs}`, { token });
}

export function getReport(token: string, id: string) {
  return apiFetch<any>(`/reports/${id}`, { token });
}

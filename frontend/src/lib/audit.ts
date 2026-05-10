import { apiFetch } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

export type AuditLog = {
  id: string;
  userId: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  ipAddress: string | null;
  metadata: any;
  createdAt: string;
  user?: Pick<AuthUser, "id" | "name" | "email" | "role"> | null;
};

export async function listAuditLogs(
  token: string,
  params: { page?: number; limit?: number; action?: string } = {},
) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.action) q.set("action", params.action);

  const qs = q.toString();
  return apiFetch<{ logs: AuditLog[]; pagination: any }>(`/audit-logs${qs ? `?${qs}` : ""}`, {
    token,
  });
}

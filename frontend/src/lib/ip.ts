import { apiFetch } from "@/lib/api";

export type IpCheckResult = {
  ipAddress: string;
  abuseConfidence: number;
  isBlacklisted: boolean;
  riskScore: number;
  countryCode: string | null;
  city: string | null;
  isp: string | null;
  sources: any;
  checkedAt: string;
  cached: boolean;
};

export async function checkIp(token: string, ipAddress: string) {
  return apiFetch<IpCheckResult>("/ip/check", {
    method: "POST",
    token,
    body: JSON.stringify({ ipAddress }),
  });
}

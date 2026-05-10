import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bandFor, bandBg } from "@/lib/risk";
import { dismissAlert, getRecentAlerts, investigateAlert, type RecentAlert } from "@/lib/backend";
import { useAuth } from "@/lib/auth";

const ICONS: Record<string, string> = {
  HIGH: "warning",
  CRITICAL: "report",
  MEDIUM: "info",
  LOW: "info",
};

export function LiveAlertsList({ limit = 8 }: { limit?: number }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { token, user } = useAuth();
  const [localDismissed, setLocalDismissed] = useState<Set<string>>(new Set());
  const [localInvestigating, setLocalInvestigating] = useState<Record<string, true>>({});

  const recent = useQuery({
    queryKey: ["alerts", "recent"],
    enabled: Boolean(token && user && (user.role === "ADMIN" || user.role === "ANALYST")),
    queryFn: () => getRecentAlerts(token!),
    refetchInterval: 5000,
  });

  const investigate = useMutation({
    mutationFn: async (alertId: string) => investigateAlert(token!, alertId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const dismiss = useMutation({
    mutationFn: async (alertId: string) => dismissAlert(token!, alertId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const live = (recent.data || []) as RecentAlert[];
  const visible = useMemo(
    () =>
      live
        .filter((a) => !localDismissed.has(a.alertId))
        .filter((a) => (a.alertStatus || "NEW") !== "DISMISSED")
        .slice(0, limit),
    [live, localDismissed, limit],
  );

  if (!token || !user || (user.role !== "ADMIN" && user.role !== "ANALYST")) {
    return (
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 py-10 text-center">
        <p className="text-on-surface-variant text-sm">
          Alerts are available to analysts and admins.
        </p>
      </div>
    );
  }

  if (recent.isLoading) {
    return (
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 py-10 text-center text-sm text-on-surface-variant">
        Loading live alerts...
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/30 py-16 text-center">
        <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">verified</span>
        <p className="font-headline font-bold text-lg">All clear</p>
        <p className="text-on-surface-variant text-sm">
          No active alerts. Live stream will surface anomalies as they appear.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visible.map((a) => {
        const sev = a.severity?.toLowerCase?.() || String(a.severity || "").toLowerCase();
        const band = bandFor(sev === "critical" ? 90 : sev === "high" ? 70 : 40);
        const status = a.alertStatus || (localInvestigating[a.alertId] ? "INVESTIGATING" : "NEW");
        return (
          <article
            key={a.alertId}
            className={`bg-surface-container-lowest p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all group relative animate-fade-in ${
              a.severity === "CRITICAL"
                ? "border-error"
                : a.severity === "HIGH"
                  ? "border-orange-500"
                  : "border-amber-400"
            }`}
          >
            <div className="flex gap-6">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${bandBg(band)}`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {ICONS[a.severity] || "warning"}
                  </span>
                </div>
                {a.severity === "CRITICAL" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-white animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-headline font-bold text-lg">{a.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                          a.severity === "CRITICAL"
                            ? "bg-error-container text-on-error-container"
                            : a.severity === "HIGH"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {String(a.severity).toLowerCase()}
                      </span>
                      {status === "INVESTIGATING" && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-blue-100 text-blue-700">
                          Investigating
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl">
                      {a.message}
                    </p>
                  </div>
                  <span className="text-xs text-outline font-medium whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100/50">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-outline uppercase font-bold tracking-tighter">
                        Transaction
                      </span>
                      <span className="text-sm font-bold">{a.transactionRef}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setLocalDismissed((s) => new Set(s).add(a.alertId));
                        dismiss.mutate(a.alertId);
                      }}
                      className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        setLocalInvestigating((r) => ({ ...r, [a.alertId]: true }));
                        investigate.mutate(a.alertId);
                        nav({ to: "/dashboard/transactions/$id", params: { id: a.transactionId } });
                      }}
                      className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-transform"
                    >
                      Investigate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// Compact ticker variant for the Overview page.
export function LiveAlertsTicker({ limit = 5 }: { limit?: number }) {
  const { token, user } = useAuth();
  const recent = useQuery({
    queryKey: ["alerts", "recent", "ticker"],
    enabled: Boolean(token && user && (user.role === "ADMIN" || user.role === "ANALYST")),
    queryFn: () => getRecentAlerts(token!),
    refetchInterval: 5000,
  });
  const alerts = (recent.data || []).slice(0, limit);
  if (
    !token ||
    !user ||
    (user.role !== "ADMIN" && user.role !== "ANALYST") ||
    alerts.length === 0
  ) {
    return (
      <div className="py-8 text-center text-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-2xl text-emerald-500 mb-1">
          check_circle
        </span>
        <p>No live alerts. Stream is healthy.</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {alerts.map((a) => {
        const dot =
          a.severity === "CRITICAL"
            ? "bg-error"
            : a.severity === "HIGH"
              ? "bg-orange-500"
              : "bg-amber-400";
        return (
          <div
            key={a.alertId}
            className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors animate-fade-in"
          >
            <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{a.title}</p>
              <p className="text-[11px] text-on-surface-variant truncate">{a.message}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              {new Date(a.createdAt).toLocaleTimeString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { listAuditLogs } from "@/lib/audit";

export const Route = createFileRoute("/dashboard/logs")({
  component: LogsPage,
});

function LogsPage() {
  const { token } = useAuth();

  const q = useQuery({
    queryKey: ["audit-logs"],
    enabled: Boolean(token),
    queryFn: () => listAuditLogs(token!, { limit: 50, page: 1 }),
  });

  const logs = q.data?.logs || [];

  return (
    <DashboardLayout
      active="logs"
      title="System Logs"
      subtitle="Audit trail of analyses, logins, and admin actions."
      actions={
        <Link
          to="/dashboard"
          className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </Link>
      }
    >
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
          <h3 className="font-headline font-bold text-sm">Recent Events</h3>
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            {logs.length} shown
          </span>
        </div>

        {q.isLoading ? (
          <div className="p-10 text-center text-sm text-on-surface-variant">Loading...</div>
        ) : q.isError ? (
          <div className="p-10 text-center text-sm text-error">Unable to load logs.</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-sm text-on-surface-variant">No logs yet.</div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {logs.map((l: any) => (
              <div key={l.id} className="p-5 hover:bg-surface-container-low transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{l.action}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {l.entity ? `${l.entity}${l.entityId ? ` (${l.entityId})` : ""}` : "System"}{" "}
                      {l.user?.email ? `- ${l.user.email}` : ""}
                    </p>
                  </div>
                  <span className="text-[11px] text-outline whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString()}
                  </span>
                </div>
                {l.metadata ? (
                  <details className="mt-3">
                    <summary className="text-xs font-semibold text-primary cursor-pointer select-none">
                      View metadata
                    </summary>
                    <pre className="mt-2 text-xs bg-surface-container-low rounded-xl border border-outline-variant/15 p-4 overflow-auto max-h-[240px]">
                      {JSON.stringify(l.metadata, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { listReports } from "@/lib/backend";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { token } = useAuth();

  const q = useQuery({
    queryKey: ["reports"],
    enabled: Boolean(token),
    queryFn: () => listReports(token!),
  });

  const reports = q.data?.reports || [];

  return (
    <DashboardLayout
      active="reports"
      title="Reports"
      subtitle="Computed fraud reports with trace summaries and map overlays."
      actions={
        <div className="text-xs font-bold text-on-surface-variant bg-surface-container px-3 py-2 rounded-lg">
          {q.isLoading ? "Loading…" : `${reports.length} shown`}
        </div>
      }
    >
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-sm">Latest Reports</h3>
          <span className="text-[11px] text-on-surface-variant">Open a report to view KPI + map trace.</span>
        </div>

        {q.isLoading ? (
          <div className="p-10 text-center text-sm text-on-surface-variant">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="p-10 text-center text-sm text-on-surface-variant">No reports yet.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr className="text-left text-[11px] uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-3">Transaction</th>
                  <th className="px-6 py-3">Risk</th>
                  <th className="px-6 py-3">Alerts</th>
                  <th className="px-6 py-3">Severity</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r: any) => (
                  <tr key={r.id} className="border-t border-outline-variant/10 hover:bg-surface-container-lowest">
                    <td className="px-6 py-4 font-semibold">{r.transactionRef}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold">{r.riskScore}</span>{" "}
                      <span className="text-on-surface-variant text-xs">{r.riskLevel}</span>
                    </td>
                    <td className="px-6 py-4">{r.alertCount}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high">
                        {String(r.topSeverity).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/dashboard/reports/$id"
                        params={{ id: r.id }}
                        className="px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


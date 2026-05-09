import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TraceMap } from "@/components/TraceMap";
import { useAuth } from "@/lib/auth";
import { getReport } from "@/lib/backend";

export const Route = createFileRoute("/dashboard/reports/$id")({
  component: ReportDetailPage,
});

function ReportDetailPage() {
  const { id } = Route.useParams();
  const { token } = useAuth();

  const q = useQuery({
    queryKey: ["reports", id],
    enabled: Boolean(token),
    queryFn: () => getReport(token!, id),
  });

  const data = q.data;
  const report = data?.report;
  const kpis = data?.kpis;
  const map = data?.map;
  const tx = data?.transaction;

  return (
    <DashboardLayout
      active="reports"
      title={report ? `Report • ${report.transactionRef}` : "Report"}
      subtitle={report ? new Date(report.createdAt).toLocaleString() : "Loading report…"}
      actions={
        <Link
          to="/dashboard/reports"
          className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </Link>
      }
    >
      {q.isLoading ? (
        <div className="text-sm text-on-surface-variant">Loading…</div>
      ) : !data ? (
        <div className="text-sm text-error">Unable to load report.</div>
      ) : (
        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Kpi label="Risk Score" value={String(kpis?.riskScore ?? "-")} />
              <Kpi label="Alerts" value={String(kpis?.alertCount ?? "-")} />
              <Kpi label="Amount" value={tx ? `${tx.amount} ${tx.currency}` : "-"} />
              <Kpi label="Location" value={report?.location || "Unknown"} />
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-sm">Map Overlay</h3>
                <span className="text-[11px] text-on-surface-variant">
                  {data?.traceSummary?.originCity} → {data?.traceSummary?.destinationCity}
                </span>
              </div>
              {map?.nodes && map?.path ? (
                <TraceMap height="440px" nodes={map.nodes} points={map.path} />
              ) : (
                <div className="h-[440px] rounded-xl bg-surface-container-low flex items-center justify-center text-sm text-on-surface-variant">
                  Map unavailable.
                </div>
              )}
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-primary-container text-white rounded-xl p-6">
              <h4 className="font-headline font-bold uppercase tracking-widest text-xs mb-3">Trace Summary</h4>
              <div className="space-y-2 text-sm text-white/85">
                <div className="flex justify-between gap-4">
                  <span className="text-white/60">Origin</span>
                  <span className="font-semibold">{data?.traceSummary?.originCity}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-white/60">Destination</span>
                  <span className="font-semibold">{data?.traceSummary?.destinationCity}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-white/60">Hops</span>
                  <span className="font-semibold">{data?.traceSummary?.hopCount}</span>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-white/60">{data?.traceSummary?.note}</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
              <h3 className="font-headline font-bold text-sm mb-4">Alert Status</h3>
              {kpis?.statusCounts ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(kpis.statusCounts).map(([k, v]: any) => (
                    <div key={k} className="bg-surface-container-low p-4 rounded-lg">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">{k}</p>
                      <p className="text-xl font-headline font-extrabold">{v}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No alerts in this report.</p>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
              <h3 className="font-headline font-bold text-sm mb-4">Linked Alerts</h3>
              {tx?.fraudAlerts?.length ? (
                <div className="space-y-3">
                  {tx.fraudAlerts.slice(0, 8).map((a: any) => (
                    <div key={a.id} className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{a.title}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">{a.message}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high">
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No linked alerts.</p>
              )}
            </div>
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{label}</p>
      <p className="text-2xl font-headline font-extrabold mt-2">{value}</p>
    </div>
  );
}


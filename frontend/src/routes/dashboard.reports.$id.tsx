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

  const subtitle = report ? new Date(report.createdAt).toLocaleString() : "Loading report...";

  const exportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report?.transactionRef || id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      active="reports"
      title={report ? `Report - ${report.transactionRef}` : "Report"}
      subtitle={subtitle}
      actions={
        <div className="flex items-center gap-2">
          {tx?.id ? (
            <Link
              to="/dashboard/transactions/$id"
              params={{ id: tx.id }}
              className="px-3 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-sm"
            >
              Open Transaction
            </Link>
          ) : null}
          <button
            onClick={exportJson}
            disabled={!data}
            className="px-3 py-2 text-xs font-bold bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-xl shadow-sm disabled:opacity-50"
          >
            Export JSON
          </button>
          <Link
            to="/dashboard/reports"
            className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back
          </Link>
        </div>
      }
    >
      {q.isLoading ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-10 text-center text-sm text-on-surface-variant">
          Loading...
        </div>
      ) : !data ? (
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-10 text-center text-sm text-error">
          Unable to load report.
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-headline font-bold text-sm">KPI Summary</h3>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Operational summary for this report window.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-surface-container-low border border-outline-variant/15">
                  {tx?.riskLevel || "LOW"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Kpi label="Risk Score" value={String(kpis?.riskScore ?? "-")} tone="risk" />
                <Kpi label="Alerts" value={String(kpis?.alertCount ?? "-")} />
                <Kpi label="Amount" value={tx ? `${tx.amount} ${tx.currency}` : "-"} />
                <Kpi label="Location" value={report?.location || "Unknown"} />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-headline font-bold text-sm">Map Overlay</h3>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {data?.traceSummary?.originCity} {"->"} {data?.traceSummary?.destinationCity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-surface-container-low border border-outline-variant/15">
                    {map?.path?.length || 0} pts
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-surface-container-low border border-outline-variant/15">
                    {data?.traceSummary?.hopCount || 0} hops
                  </span>
                </div>
              </div>
              {map?.nodes && map?.path ? (
                <TraceMap height="460px" nodes={map.nodes} points={map.path} />
              ) : (
                <div className="h-[460px] rounded-2xl bg-surface-container-low flex items-center justify-center text-sm text-on-surface-variant">
                  Map unavailable.
                </div>
              )}
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-primary-container text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-7xl">summarize</span>
              </div>
              <div className="relative z-10">
                <h4 className="font-headline font-bold uppercase tracking-widest text-xs mb-4">
                  Trace Summary
                </h4>
                <div className="space-y-2 text-sm text-white/85">
                  <RowDark k="Origin" v={data?.traceSummary?.originCity || "N/A"} />
                  <RowDark k="Destination" v={data?.traceSummary?.destinationCity || "N/A"} />
                  <RowDark k="Hops" v={String(data?.traceSummary?.hopCount ?? "N/A")} />
                </div>
                <p className="mt-4 text-[11px] text-white/65">{data?.traceSummary?.note}</p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-sm">Alert Status</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {Object.values(kpis?.statusCounts || {}).reduce(
                    (a: number, b: any) => a + Number(b || 0),
                    0,
                  )}{" "}
                  total
                </span>
              </div>
              {kpis?.statusCounts ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(kpis.statusCounts).map(([k, v]: any) => (
                    <div
                      key={k}
                      className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-4"
                    >
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                        {k}
                      </p>
                      <p className="text-2xl font-headline font-extrabold mt-2">{v}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No alerts in this report.</p>
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-sm">Linked Alerts</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {(tx?.fraudAlerts?.length || 0).toString()}
                </span>
              </div>
              {tx?.fraudAlerts?.length ? (
                <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                  {tx.fraudAlerts.slice(0, 12).map((a: any) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{a.title}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">{a.message}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-surface-container-high border border-outline-variant/10 whitespace-nowrap">
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

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "risk" }) {
  const toneCls =
    tone === "risk"
      ? "bg-primary-container text-white border-white/10"
      : "bg-surface-container-lowest border-outline-variant/15";
  const labelCls = tone === "risk" ? "text-white/60" : "text-on-surface-variant";
  const valueCls = tone === "risk" ? "text-white" : "text-on-surface";
  return (
    <div className={`rounded-2xl p-4 border ${toneCls}`}>
      <p className={`text-[10px] uppercase tracking-widest font-bold ${labelCls}`}>{label}</p>
      <p className={`text-xl font-headline font-extrabold mt-2 ${valueCls}`}>{value}</p>
    </div>
  );
}

function RowDark({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/60">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

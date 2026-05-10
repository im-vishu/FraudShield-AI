import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveAlertsTicker } from "@/components/LiveAlertsList";
import { MapboxMap } from "@/components/MapboxMap";
import { useAuth } from "@/lib/auth";
import { listTransactions } from "@/lib/backend";
import { CITIES } from "@/lib/mock-data";
import { useLiveTransactions } from "@/hooks/useLiveTransactions";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { token, user } = useAuth();
  const liveTx = useLiveTransactions(true);

  const txQ = useQuery({
    queryKey: ["transactions", "overview"],
    enabled: Boolean(token),
    queryFn: () => listTransactions(token!, { limit: 6, page: 1 }),
    refetchInterval: 15000,
  });

  const canSeeAlerts = user?.role === "ADMIN" || user?.role === "ANALYST";

  return (
    <DashboardLayout
      active="overview"
      title="Overview"
      subtitle="Real-time monitoring and live tracing across India."
      actions={
        <Link
          to="/dashboard/transactions"
          className="px-3 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-sm"
        >
          View Transactions
        </Link>
      }
    >
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              label="Recent Transactions"
              value={String(txQ.data?.transactions?.length || 0)}
              icon="payments"
            />
            <Card label="Role" value={user?.role || "USER"} icon="badge" />
            <Card label="System" value="Live" icon="verified" tone="primary" />
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline font-bold text-sm">India Live Map</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Streaming dashboard traces from backend SSE.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-on-surface-variant bg-white/60 border border-outline-variant/20 px-3 py-2 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <MapboxMap cities={CITIES} height="440px" showLiveTransactions liveTraces={liveTx} />
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/15">
              <h3 className="font-headline font-bold text-sm">Latest Transactions</h3>
              <Link
                to="/dashboard/transactions"
                className="text-xs font-bold text-primary hover:underline"
              >
                Open list
              </Link>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {(txQ.data?.transactions || []).map((t) => (
                <Link
                  key={t.id}
                  to="/dashboard/transactions/$id"
                  params={{ id: t.id }}
                  className="block px-6 py-4 hover:bg-surface-container-low"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{t.transactionRef}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {t.location || "Unknown"} {"-"} {t.ipAddress || "IP unknown"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {t.amount} {t.currency}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">Risk {t.riskScore}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {txQ.isLoading ? (
                <div className="px-6 py-10 text-center text-sm text-on-surface-variant">
                  Loading...
                </div>
              ) : (txQ.data?.transactions || []).length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-on-surface-variant">
                  No transactions yet.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-primary-container text-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline font-bold text-sm">Live Alerts</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-white/10">
                {canSeeAlerts ? "ANALYST" : "RESTRICTED"}
              </span>
            </div>
            <p className="text-[11px] text-white/70 mb-4">
              {canSeeAlerts
                ? "Powered by backend recent alerts feed."
                : "Alerts are restricted to analysts and admins."}
            </p>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <LiveAlertsTicker limit={6} />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/20 shadow-sm">
            <h3 className="font-headline font-bold text-sm mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickLink
                to="/dashboard/reports"
                icon="summarize"
                title="Reports"
                desc="KPI + map overlays"
              />
              <QuickLink
                to="/dashboard/transactions"
                icon="payments"
                title="Transactions"
                desc="Trace and drill-in"
              />
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function Card({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: string;
  tone?: "primary";
}) {
  return (
    <div
      className={[
        "rounded-2xl p-5 border shadow-sm overflow-hidden relative",
        tone === "primary"
          ? "bg-primary-container text-white border-white/10"
          : "bg-white/70 backdrop-blur-xl border-outline-variant/20",
      ].join(" ")}
    >
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <span className="material-symbols-outlined text-7xl">{icon}</span>
      </div>
      <p
        className={`text-[10px] uppercase tracking-widest font-bold ${tone === "primary" ? "text-white/60" : "text-on-surface-variant"}`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-headline font-extrabold mt-2 ${tone === "primary" ? "text-white" : "text-on-surface"}`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickLink({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-surface-container-low rounded-2xl border border-outline-variant/15 p-4 hover:bg-surface-container-high transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white border border-outline-variant/15 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[20px] text-slate-700">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold tracking-tight">{title}</p>
          <p className="text-[11px] text-on-surface-variant mt-1">{desc}</p>
        </div>
        <span className="material-symbols-outlined ml-auto text-slate-400 group-hover:text-slate-700 transition-colors">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}

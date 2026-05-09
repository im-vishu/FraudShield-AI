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
          className="px-3 py-2 text-xs font-bold bg-primary text-white rounded-lg"
        >
          View Transactions
        </Link>
      }
    >
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card label="Transactions (latest)" value={String(txQ.data?.transactions?.length || 0)} />
            <Card label="Role" value={user?.role || "USER"} />
            <Card label="Status" value="Live" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <h3 className="font-headline font-bold text-sm mb-4">India Live Map</h3>
            <MapboxMap cities={CITIES} height="420px" showLiveTransactions liveTraces={liveTx} />
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
              <h3 className="font-headline font-bold text-sm">Latest Transactions</h3>
              <Link to="/dashboard/transactions" className="text-xs font-bold text-primary hover:underline">
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
                        {t.location || "Unknown"} • {t.ipAddress || "IP unknown"}
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
                <div className="px-6 py-10 text-center text-sm text-on-surface-variant">Loading…</div>
              ) : (txQ.data?.transactions || []).length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-on-surface-variant">No transactions yet.</div>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-primary-container text-white rounded-xl p-6">
            <h3 className="font-headline font-bold text-sm mb-2">Live Alerts</h3>
            <p className="text-[11px] text-white/70 mb-4">
              {canSeeAlerts ? "Ticker is powered by backend recent alerts." : "Alerts are restricted to analysts and admins."}
            </p>
            <div className="bg-white/5 rounded-xl p-4">
              <LiveAlertsTicker limit={6} />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <h3 className="font-headline font-bold text-sm mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dashboard/reports" className="bg-surface-container-low p-4 rounded-lg font-bold text-sm hover:bg-surface-container-high">
                Reports
              </Link>
              <Link to="/dashboard/transactions" className="bg-surface-container-low p-4 rounded-lg font-bold text-sm hover:bg-surface-container-high">
                Transactions
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{label}</p>
      <p className="text-2xl font-headline font-extrabold mt-2">{value}</p>
    </div>
  );
}

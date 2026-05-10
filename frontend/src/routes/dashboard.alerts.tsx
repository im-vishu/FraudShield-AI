import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveAlertsList } from "@/components/LiveAlertsList";
import { AlertsTable } from "@/components/AlertsTable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  const { user } = useAuth();
  const allowed = user?.role === "ADMIN" || user?.role === "ANALYST";

  return (
    <DashboardLayout
      active="alerts"
      title="Alerts"
      subtitle="Real-time anomalies. Investigate or dismiss with persistent status."
    >
      {!allowed ? (
        <div className="bg-surface-container-lowest rounded-xl p-10 border border-outline-variant/10 text-center text-sm text-on-surface-variant">
          Access denied.
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 xl:col-span-5 space-y-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-sm">Live Feed</h3>
                <span className="inline-flex items-center gap-2 text-[11px] font-bold text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <LiveAlertsList limit={6} />
            </div>
          </section>

          <section className="col-span-12 xl:col-span-7 space-y-4">
            <AlertsTable />
          </section>
        </div>
      )}
    </DashboardLayout>
  );
}

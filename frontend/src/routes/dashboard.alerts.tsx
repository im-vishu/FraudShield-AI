import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LiveAlertsList } from "@/components/LiveAlertsList";
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
        <LiveAlertsList limit={10} />
      )}
    </DashboardLayout>
  );
}


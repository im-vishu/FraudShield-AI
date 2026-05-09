import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

type NavKey = "overview" | "transactions" | "alerts" | "reports" | "risk" | "admin";

export function DashboardLayout({
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  active: NavKey;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const canSeeAlerts = user?.role === "ADMIN" || user?.role === "ANALYST";
  const canSeeAdmin = user?.role === "ADMIN";

  const Item = ({
    k,
    to,
    label,
    icon,
    hidden,
  }: {
    k: NavKey;
    to: string;
    label: string;
    icon: string;
    hidden?: boolean;
  }) => {
    if (hidden) return null;
    const isActive = active === k || path === to;
    return (
      <Link
        to={to}
        className={[
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 scale-100 active:scale-95 transition-transform",
          isActive
            ? "bg-slate-200/50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/80",
        ].join(" ")}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="font-body text-on-surface bg-surface min-h-screen">
      <aside className="flex flex-col fixed left-0 top-0 z-40 bg-slate-50 dark:bg-slate-900 h-screen w-64 border-r-0 font-manrope text-sm font-medium tracking-tight">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-signature-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_lock
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white leading-tight">
                Sovereign Sentinel
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-on-primary-container">
                Fraud Prevention AI
              </p>
            </div>
          </div>
          <nav className="space-y-1">
            <Item k="overview" to="/dashboard" label="Overview" icon="dashboard" />
            <Item k="transactions" to="/dashboard/transactions" label="Transactions" icon="payments" />
            <Item k="alerts" to="/dashboard/alerts" label="Alerts" icon="notifications_active" hidden={!canSeeAlerts} />
            <Item k="reports" to="/dashboard/reports" label="Reports" icon="summarize" />
            <Item k="risk" to="/dashboard/risk-analysis" label="Risk" icon="security" hidden={!canSeeAlerts} />
            <Item k="admin" to="/dashboard/admin" label="Admin" icon="settings_applications" hidden={!canSeeAdmin} />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-3">
          <div className="p-4 bg-surface-container-high rounded-xl">
            <p className="text-xs text-on-surface-variant mb-1">Signed in</p>
            <p className="text-sm font-bold truncate">{user?.name || user?.email}</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
              {user?.role || "USER"}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      <header className="flex items-center justify-between px-8 ml-64 h-16 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none font-manrope text-sm border-b border-slate-200/15 dark:border-slate-800/15">
        <div className="min-w-0">
          {title ? <h2 className="font-bold text-slate-900 dark:text-white truncate">{title}</h2> : null}
          {subtitle ? <p className="text-[11px] text-on-surface-variant truncate">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </header>

      <main className="ml-64 px-8 py-8">{children}</main>
    </div>
  );
}


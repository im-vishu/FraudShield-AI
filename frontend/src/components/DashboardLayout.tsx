import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";

type NavKey =
  | "overview"
  | "analyze"
  | "transactions"
  | "alerts"
  | "reports"
  | "ip"
  | "logs"
  | "risk"
  | "admin";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const canSeeAlerts = user?.role === "ADMIN" || user?.role === "ANALYST";
  const canSeeAdmin = user?.role === "ADMIN";

  useEffect(() => {
    // Close sidebar after navigation on mobile.
    setSidebarOpen(false);
  }, [path]);

  const navItems = useMemo(
    () => [
      {
        k: "overview" as const,
        to: "/dashboard",
        label: "Overview",
        icon: "dashboard",
        hidden: false,
      },
      {
        k: "analyze" as const,
        to: "/dashboard/analyze",
        label: "Analyze",
        icon: "science",
        hidden: false,
      },
      {
        k: "transactions" as const,
        to: "/dashboard/transactions",
        label: "Transactions",
        icon: "payments",
        hidden: false,
      },
      {
        k: "alerts" as const,
        to: "/dashboard/alerts",
        label: "Alerts",
        icon: "notifications_active",
        hidden: !canSeeAlerts,
      },
      {
        k: "reports" as const,
        to: "/dashboard/reports",
        label: "Reports",
        icon: "summarize",
        hidden: false,
      },
      {
        k: "ip" as const,
        to: "/dashboard/ip-reputation",
        label: "IP Reputation",
        icon: "public",
        hidden: false,
      },
      {
        k: "logs" as const,
        to: "/dashboard/logs",
        label: "Logs",
        icon: "receipt_long",
        hidden: false,
      },
      {
        k: "risk" as const,
        to: "/dashboard/risk-analysis",
        label: "Risk",
        icon: "security",
        hidden: !canSeeAlerts,
      },
      {
        k: "admin" as const,
        to: "/dashboard/admin",
        label: "Admin",
        icon: "settings_applications",
        hidden: !canSeeAdmin,
      },
    ],
    [canSeeAlerts, canSeeAdmin],
  );

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
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-200 active:scale-[0.99] transition-transform",
          isActive
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/70",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="font-body text-on-surface min-h-screen bg-gradient-to-b from-surface to-surface-container-low">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/20">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="min-w-0 text-center">
            <p className="text-sm font-bold truncate">{title || "Dashboard"}</p>
            {subtitle ? (
              <p className="text-[10px] text-on-surface-variant truncate">{subtitle}</p>
            ) : null}
          </div>
          <div className="h-9 w-9 rounded-lg bg-surface-container-low flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] text-slate-600">shield</span>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {sidebarOpen ? (
        <button
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-slate-200/30 bg-white/90 backdrop-blur-xl",
          "transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:z-40 lg:w-72 lg:bg-white/70",
        ].join(" ")}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 signature-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/10">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_lock
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight truncate">
                FraudShield AI
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant truncate">
                India Fraud Watch
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((it) => (
              <Item key={it.k} {...it} />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-3">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/15">
            <p className="text-[11px] text-on-surface-variant mb-1">Signed in</p>
            <p className="text-sm font-bold truncate">{user?.name || user?.email}</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
              {user?.role || "USER"}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors flex items-center justify-center gap-2 border border-outline-variant/15"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Desktop top bar */}
      <header className="hidden lg:flex items-center justify-between px-8 ml-72 h-16 sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-slate-200/20">
        <div className="min-w-0">
          {title ? (
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 truncate">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="text-[11px] text-on-surface-variant truncate">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </header>

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

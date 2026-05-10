import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { dismissAlert, investigateAlert, listAlerts, type FraudAlert } from "@/lib/backend";
import { useAuth } from "@/lib/auth";

const STATUSES = ["NEW", "INVESTIGATING", "DISMISSED", "RESOLVED"] as const;
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export function AlertsTable() {
  const { token } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();

  const [status, setStatus] = useState<string>("NEW");
  const [severity, setSeverity] = useState<string>("all");
  const [q, setQ] = useState("");
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ["alerts", "list", status, severity],
    enabled: Boolean(token),
    queryFn: () =>
      listAlerts(token!, {
        limit: 50,
        page: 1,
        status: status || undefined,
        severity: severity === "all" ? undefined : severity,
      }),
    refetchInterval: 12000,
  });

  const all = (query.data?.alerts || []) as FraudAlert[];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((a) => {
      const txRef = (a as any).transaction?.transactionRef || "";
      return (
        a.id.toLowerCase().includes(needle) ||
        a.title.toLowerCase().includes(needle) ||
        a.message.toLowerCase().includes(needle) ||
        String(txRef).toLowerCase().includes(needle)
      );
    });
  }, [all, q]);

  const rowPad = dense ? "py-3" : "py-4";

  const investigate = useMutation({
    mutationFn: async (alertId: string) => investigateAlert(token!, alertId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const dismiss = useMutation({
    mutationFn: async (alertId: string) => dismissAlert(token!, alertId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });

  const dismissSelected = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    await Promise.all(ids.map((id) => dismiss.mutateAsync(id).catch(() => null)));
    setSelected(new Set());
  };

  const toggleAll = () => {
    const ids = filtered.map((a) => a.id);
    const next = new Set(selected);
    const allSelected = ids.every((id) => next.has(id));
    if (allSelected) ids.forEach((id) => next.delete(id));
    else ids.forEach((id) => next.add(id));
    setSelected(next);
  };

  const statusChip = (s: string) => {
    const cls =
      s === "NEW"
        ? "bg-blue-50 text-blue-700"
        : s === "INVESTIGATING"
          ? "bg-amber-50 text-amber-800"
          : s === "DISMISSED"
            ? "bg-slate-100 text-slate-700"
            : "bg-emerald-50 text-emerald-700";
    return (
      <span
        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${cls}`}
      >
        {s.toLowerCase()}
      </span>
    );
  };

  const sevDot = (sev: string) => {
    const cls =
      sev === "CRITICAL"
        ? "bg-error"
        : sev === "HIGH"
          ? "bg-orange-500"
          : sev === "MEDIUM"
            ? "bg-amber-400"
            : "bg-emerald-500";
    return <span className={`w-2 h-2 rounded-full ${cls}`} />;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search alert id, title, txn ref..."
            className="w-full bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm border border-outline-variant/20 shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setSelected(new Set());
            setStatus(e.target.value);
          }}
          className="bg-white rounded-xl px-3 py-2.5 text-sm border border-outline-variant/20 shadow-sm font-semibold"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>

        <select
          value={severity}
          onChange={(e) => {
            setSelected(new Set());
            setSeverity(e.target.value);
          }}
          className="bg-white rounded-xl px-3 py-2.5 text-sm border border-outline-variant/20 shadow-sm font-semibold"
        >
          <option value="all">Severity: All</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              Severity: {s}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-outline-variant/15 shadow-sm">
          <span className="text-[11px] font-bold text-on-surface-variant">Dense</span>
          <input type="checkbox" checked={dense} onChange={(e) => setDense(e.target.checked)} />
        </label>

        <button
          onClick={dismissSelected}
          disabled={selected.size === 0 || dismiss.isPending}
          className="px-3 py-2.5 rounded-xl text-xs font-bold bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container-high disabled:opacity-50"
        >
          Dismiss Selected ({selected.size})
        </button>

        <div className="text-xs font-medium text-on-surface-variant ml-auto">
          {query.isLoading ? "Loading..." : `${filtered.length} shown`}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant sticky top-0 z-10">
                <th className="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && filtered.every((a) => selected.has(a.id))}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest">Alert</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest">
                  Severity
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest">
                  Created
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="text-sm">
              {query.isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr
                      key={`sk-${i}`}
                      className={i % 2 ? "bg-surface-container-low/30" : "bg-surface"}
                    >
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className={`px-6 ${rowPad}`}>
                          <div className="h-3 w-full max-w-[260px] bg-slate-200/70 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : null}

              {!query.isLoading &&
                filtered.map((a, i) => (
                  <tr
                    key={a.id}
                    className={`${i % 2 ? "bg-surface-container-low/30" : "bg-surface"} hover:bg-surface-container-high transition-colors group`}
                  >
                    <td className={`px-6 ${rowPad}`}>
                      <input
                        type="checkbox"
                        checked={selected.has(a.id)}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(a.id);
                          else next.delete(a.id);
                          setSelected(next);
                        }}
                      />
                    </td>
                    <td className={`px-6 ${rowPad}`}>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{a.title}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">{a.message}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1 font-mono truncate">
                          {a.id}
                        </p>
                      </div>
                    </td>
                    <td className={`px-6 ${rowPad}`}>
                      <div className="inline-flex items-center gap-2">
                        {sevDot(a.severity)}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {a.severity.toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 ${rowPad}`}>{statusChip(a.status)}</td>
                    <td
                      className={`px-6 ${rowPad} text-on-surface-variant text-xs whitespace-nowrap`}
                    >
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td className={`px-6 ${rowPad} text-right`}>
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await investigate.mutateAsync(a.id).catch(() => null);
                            nav({
                              to: "/dashboard/transactions/$id",
                              params: { id: a.transactionId },
                            });
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-primary text-white"
                        >
                          Investigate
                        </button>
                        <button
                          onClick={() => dismiss.mutate(a.id)}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container-high"
                        >
                          Dismiss
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!query.isLoading && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-on-surface-variant text-sm"
                  >
                    No alerts match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

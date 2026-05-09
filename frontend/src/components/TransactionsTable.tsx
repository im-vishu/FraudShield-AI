import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { bandFor } from "@/lib/risk";
import { useAuth } from "@/lib/auth";
import { listTransactions, type Transaction } from "@/lib/backend";

const RISK_BUCKETS = [
  { id: "all", label: "All Risk", match: () => true },
  { id: "low", label: "Low", match: (r: number) => r < 25 },
  { id: "medium", label: "Medium", match: (r: number) => r >= 25 && r < 50 },
  { id: "high", label: "High", match: (r: number) => r >= 50 && r < 75 },
  { id: "critical", label: "Critical", match: (r: number) => r >= 75 },
] as const;

export function TransactionsTable() {
  const { token } = useAuth();
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState<(typeof RISK_BUCKETS)[number]["id"]>("all");

  const txQ = useQuery({
    queryKey: ["transactions"],
    enabled: Boolean(token),
    queryFn: () => listTransactions(token!),
    refetchInterval: 10000,
  });

  const all = (txQ.data?.transactions || []) as Transaction[];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const bucket = RISK_BUCKETS.find((b) => b.id === risk)!;
    return all.filter((t) => {
      if (!bucket.match(t.riskScore)) return false;
      if (!needle) return true;
      return (
        t.transactionRef.toLowerCase().includes(needle) ||
        t.id.toLowerCase().includes(needle) ||
        (t.user?.name || "").toLowerCase().includes(needle) ||
        (t.user?.email || "").toLowerCase().includes(needle) ||
        (t.ipAddress || "").toLowerCase().includes(needle) ||
        (t.location || "").toLowerCase().includes(needle)
      );
    });
  }, [q, risk, all]);

  return (
    <div className="space-y-4">
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ref, user, IP, location…"
            className="w-full bg-white rounded-lg pl-10 pr-4 py-2 text-sm border-none shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          {RISK_BUCKETS.map((b) => (
            <button
              key={b.id}
              onClick={() => setRisk(b.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                risk === b.id ? "signature-gradient text-white" : "text-on-surface-variant hover:bg-slate-50"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-on-surface-variant ml-auto">
          {txQ.isLoading ? (
            "Loading…"
          ) : (
            <>
              Showing <span className="text-on-surface font-bold">{filtered.length}</span> of {all.length}
            </>
          )}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Transaction</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Location / IP</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Risk</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((t, i) => {
              const band = bandFor(t.riskScore);
              const badgeBg =
                band === "critical"
                  ? "bg-error-container text-on-error-container"
                  : band === "high"
                    ? "bg-orange-100 text-orange-700"
                    : band === "medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-50 text-emerald-700";
              const dot =
                band === "critical"
                  ? "bg-error"
                  : band === "high"
                    ? "bg-orange-500"
                    : band === "medium"
                      ? "bg-amber-400"
                      : "bg-emerald-500";
              return (
                <tr
                  key={t.id}
                  className={`${i % 2 ? "bg-surface-container-low/30" : "bg-surface"} hover:bg-surface-container-high transition-colors group cursor-pointer`}
                >
                  <td className="px-6 py-4">
                    <Link
                      to="/dashboard/transactions/$id"
                      params={{ id: t.id }}
                      className="font-manrope font-bold text-xs text-on-primary-fixed-variant hover:underline"
                    >
                      {t.transactionRef}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-xs">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-on-surface">{t.user?.name || "Operator"}</p>
                    <p className="text-[10px] text-on-surface-variant">{t.user?.email || ""}</p>
                  </td>
                  <td className="px-6 py-4 font-headline font-bold text-on-surface">
                    {t.amount} {t.currency}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-on-surface font-medium">{t.location || "Unknown"}</p>
                    <p className="text-[10px] text-on-surface-variant">{t.ipAddress || ""}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`px-3 py-1 rounded-lg inline-flex items-center gap-1.5 font-bold text-xs ${badgeBg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {t.riskScore}% {band[0].toUpperCase() + band.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/dashboard/transactions/$id"
                      params={{ id: t.id }}
                      className="text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-on-surface-variant text-sm">
                  {txQ.isLoading ? "Loading…" : "No transactions match the current filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


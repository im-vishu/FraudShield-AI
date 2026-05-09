import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TraceMap, type TracePoint } from "@/components/TraceMap";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";
import { getTransaction, getTransactionTrace } from "@/lib/backend";

export const Route = createFileRoute("/dashboard/transactions/$id")({
  component: TransactionDetailsPage,
});

function TransactionDetailsPage() {
  const { id } = Route.useParams();
  const { token } = useAuth();
  const [live, setLive] = useState(false);
  const [livePoint, setLivePoint] = useState<TracePoint | null>(null);
  const [streamPoints, setStreamPoints] = useState<TracePoint[]>([]);

  const txQ = useQuery({
    queryKey: ["transactions", id],
    enabled: Boolean(token),
    queryFn: () => getTransaction(token!, id),
  });

  const traceQ = useQuery({
    queryKey: ["transactions", id, "trace"],
    enabled: Boolean(token),
    queryFn: () => getTransactionTrace(token!, id),
  });

  const nodes = traceQ.data?.trace?.nodes || [];
  const points = traceQ.data?.trace?.points || [];

  const mergedPoints = useMemo(() => {
    if (!live) return points;
    return [...points, ...streamPoints];
  }, [live, points, streamPoints]);

  useEffect(() => {
    if (!live || !token) return;
    let cancelled = false;
    const ac = new AbortController();

    setStreamPoints([]);
    setLivePoint(null);

    const run = async () => {
      const res = await fetch(`${API_URL}/transactions/${id}/trace/stream`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: ac.signal,
      });

      if (!res.ok || !res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buf = "";
      let currentEvent = "message";

      const flush = (chunk: string) => {
        buf += chunk;
        while (true) {
          const idx = buf.indexOf("\n\n");
          if (idx === -1) break;
          const raw = buf.slice(0, idx);
          buf = buf.slice(idx + 2);

          const lines = raw.split("\n").map((l) => l.trimEnd());
          let data = "";
          currentEvent = "message";
          for (const line of lines) {
            if (line.startsWith("event:")) currentEvent = line.slice(6).trim();
            if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (!data) continue;
          try {
            const parsed = JSON.parse(data);
            if (cancelled) return;
            if (currentEvent === "trace_point") {
              setLivePoint(parsed);
              setStreamPoints((p) => [...p, parsed]);
            }
          } catch {}
        }
      };

      while (!cancelled) {
        const { value, done } = await reader.read();
        if (done) break;
        flush(decoder.decode(value, { stream: true }));
      }
    };

    run().catch(() => {});
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [live, token, id]);

  const tx = txQ.data?.transaction;

  return (
    <DashboardLayout
      active="transactions"
      title={tx ? tx.transactionRef : "Transaction"}
      subtitle={tx ? `Risk ${tx.riskScore} • ${tx.riskLevel} • ${tx.status}` : "Loading transaction…"}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/transactions"
            className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back
          </Link>
          <label className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg">
            <span className="text-xs font-bold text-on-surface-variant">Live Trace</span>
            <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
          </label>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <h3 className="font-headline font-bold text-sm mb-4">Transaction Overview</h3>
            {txQ.isLoading ? (
              <p className="text-sm text-on-surface-variant">Loading…</p>
            ) : tx ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Row k="Amount" v={`${tx.amount} ${tx.currency}`} />
                <Row k="Location" v={tx.location || "Unknown"} />
                <Row k="IP" v={tx.ipAddress || "Unknown"} />
                <Row k="Device" v={tx.deviceId || "Unknown"} />
              </div>
            ) : (
              <p className="text-sm text-error">Unable to load transaction.</p>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-sm">Trace Map</h3>
              {traceQ.data?.trace ? (
                <p className="text-[11px] text-on-surface-variant">
                  {traceQ.data.trace.originCity} → {traceQ.data.trace.destinationCity}
                </p>
              ) : null}
            </div>
            {traceQ.isLoading ? (
              <div className="h-[420px] rounded-xl bg-surface-container-low flex items-center justify-center text-sm text-on-surface-variant">
                Generating trace…
              </div>
            ) : traceQ.data?.trace ? (
              <TraceMap height="420px" nodes={nodes} points={mergedPoints} livePoint={livePoint} />
            ) : (
              <div className="h-[420px] rounded-xl bg-surface-container-low flex items-center justify-center text-sm text-error">
                Trace unavailable.
              </div>
            )}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-primary-container text-white rounded-xl p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-7xl">psychology</span>
            </div>
            <div className="relative z-10">
              <h4 className="font-headline font-bold uppercase tracking-widest text-xs mb-4">Trace Summary</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                {traceQ.data?.trace
                  ? `Deterministic demo trace for ${tx?.transactionRef || "this transaction"} (stable across refresh).`
                  : "Trace will appear once the backend returns a path."}
              </p>
              {live ? (
                <p className="mt-3 text-[11px] text-white/70">
                  Live mode: streaming points from backend SSE.
                </p>
              ) : null}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <h3 className="font-headline font-bold text-sm mb-4">Alerts Linked</h3>
            {tx?.fraudAlerts?.length ? (
              <div className="space-y-3">
                {tx.fraudAlerts.slice(0, 6).map((a) => (
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
              <p className="text-sm text-on-surface-variant">No alerts linked.</p>
            )}
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-outline-variant/10 pb-2">
      <span className="text-on-surface-variant">{k}</span>
      <span className="font-semibold truncate max-w-[60%] text-right">{v}</span>
    </div>
  );
}


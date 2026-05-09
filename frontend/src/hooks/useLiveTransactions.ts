import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export type LiveTxnTrace = {
  transactionId: string;
  transactionRef: string;
  amount: string;
  currency: string;
  riskScore: number;
  riskLevel: string;
  originCity: string;
  destinationCity: string;
  points: { seq: number; lng: number; lat: number; tMs?: number }[];
};

export function useLiveTransactions(enabled = true) {
  const { token } = useAuth();
  const [items, setItems] = useState<LiveTxnTrace[]>([]);

  const can = Boolean(enabled && token);

  useEffect(() => {
    if (!can) return;
    let cancelled = false;
    const ac = new AbortController();

    const run = async () => {
      const res = await fetch(`${API_URL}/transactions/stream`, {
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
            if (currentEvent === "txn_trace") {
              setItems((prev) => [parsed, ...prev].slice(0, 12));
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
  }, [can, token]);

  return useMemo(() => items, [items]);
}


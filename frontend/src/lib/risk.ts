// Shared risk scoring used by heatmap, alerts and overview.
import { useEffect, useState } from "react";
import { CITIES, ALERTS, type Alert, type City } from "./mock-data";

export type RiskBand = "low" | "medium" | "high" | "critical";

export function bandFor(score: number): RiskBand {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function bandColor(b: RiskBand): string {
  switch (b) {
    case "critical": return "text-error";
    case "high":     return "text-orange-600";
    case "medium":   return "text-amber-600";
    default:         return "text-emerald-600";
  }
}

export function bandBg(b: RiskBand): string {
  switch (b) {
    case "critical": return "bg-error";
    case "high":     return "bg-orange-500";
    case "medium":   return "bg-amber-400";
    default:         return "bg-emerald-500";
  }
}

// Same scoring rule used to drive the heatmap markers + alert generator.
// Input range 0-100, modulated by a velocity factor.
export function scoreCity(c: City, velocity = 1): number {
  const base = c.riskPct * 4; // 0..~120
  const tierMult = c.tier === 4 ? 1.25 : c.tier === 3 ? 1.1 : 1;
  return Math.min(100, Math.round(base * tierMult * velocity));
}

const KINDS: Alert["kind"][] = ["VELOCITY SPIKE", "GEO-ANOMALY", "BOT PATTERN", "TIER SPIKE", "UPI ABUSE"];

function genAlert(seed: number): Alert {
  const c = CITIES[seed % CITIES.length];
  const score = scoreCity(c, 0.9 + ((seed % 5) * 0.08));
  const band = bandFor(score);
  const sev: Alert["severity"] = band === "critical" ? "critical" : band === "high" ? "high" : "medium";
  const kind = KINDS[seed % KINDS.length];
  return {
    id: `LA-${Date.now()}-${seed}`,
    kind,
    ts: "Just now",
    title: `${kind} in ${c.name}`,
    body: `Tier ${c.tier} cluster — risk ${score}% across ${c.txnCount.toLocaleString("en-IN")} txns.`,
    severity: sev,
    city: c.name,
  };
}

// Live-updating alerts feed: starts with seeded ALERTS, prepends a fresh one
// every `interval` ms based on the same risk-scoring rule as the heatmap.
export function useLiveAlerts(interval = 6000, max = 20): Alert[] {
  const [list, setList] = useState<Alert[]>(ALERTS);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setList((prev) => [genAlert(Date.now() + i++), ...prev].slice(0, max));
    }, interval);
    return () => clearInterval(id);
  }, [interval, max]);
  return list;
}

// Active count derived live from the feed (stable seed for SSR-safe initial).
export function useActiveAlertsCount(): number {
  const list = useLiveAlerts(6000, 50);
  return list.filter((a) => a.severity !== "medium").length + 12;
}

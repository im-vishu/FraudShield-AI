import { useState } from "react";
import { CITIES } from "@/lib/mock-data";
import { downloadCsv } from "@/lib/csv";
import { bandFor, scoreCity, type RiskBand } from "@/lib/risk";

const RANGES = [
  { id: "7d",  label: "Last 7 Days",  days: 7 },
  { id: "30d", label: "Last 30 Days", days: 30 },
  { id: "90d", label: "Last 90 Days", days: 90 },
  { id: "ytd", label: "Year to Date", days: 300 },
] as const;

const BANDS: { id: "all" | RiskBand; label: string }[] = [
  { id: "all", label: "All Risk" },
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export function CityRiskExport() {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("7d");
  const [city, setCity] = useState<string>("all");
  const [bandFilter, setBandFilter] = useState<(typeof BANDS)[number]["id"]>("all");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setBusy(true);
    setDone(false);
    const r = RANGES.find((x) => x.id === range)!;
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - r.days);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    const rows: (string | number)[][] = [
      ["FraudShieldAI City-Wise Risk Report"],
      [`Range: ${fmt(start)} → ${fmt(today)}`, `Generated: ${today.toISOString()}`],
      [`Filters — City: ${city === "all" ? "All" : city} · Risk: ${bandFilter === "all" ? "All" : bandFilter}`],
      [],
      ["City", "Tier", "Lat", "Lng", "Txn Count (range)", "Base Risk %", "Risk Score", "Band"],
    ];

    const filtered = CITIES.filter((c) => {
      if (city !== "all" && c.name !== city) return false;
      if (bandFilter !== "all" && bandFor(scoreCity(c)) !== bandFilter) return false;
      return true;
    });

    for (const c of filtered) {
      const score = scoreCity(c);
      const txns = Math.round(c.txnCount * (r.days / 30));
      rows.push([c.name, c.tier, c.lat, c.lng, txns, c.riskPct, score, bandFor(score)]);
    }

    if (filtered.length === 0) {
      rows.push(["— No cities match the selected filters —"]);
    }

    downloadCsv(`fraudshield-city-risk-${range}-${bandFilter}-${fmt(today)}.csv`, rows);
    setTimeout(() => { setBusy(false); setDone(true); setTimeout(() => setDone(false), 1800); }, 400);
  };

  const selectCls = "bg-white rounded-lg px-3 py-1.5 text-xs font-semibold border-none shadow-sm cursor-pointer";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select value={range} onChange={(e) => setRange(e.target.value as typeof range)} className={selectCls}>
        {RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
      </select>
      <select value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
        <option value="all">All Cities</option>
        {CITIES.map((c) => <option key={c.name} value={c.name}>{c.name} (T{c.tier})</option>)}
      </select>
      <select value={bandFilter} onChange={(e) => setBandFilter(e.target.value as typeof bandFilter)} className={selectCls}>
        {BANDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
      </select>
      <button
        onClick={handleExport}
        disabled={busy}
        className="signature-gradient text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-sm">{done ? "check" : "download"}</span>
        {busy ? "Exporting…" : done ? "Downloaded" : "Export City CSV"}
      </button>
    </div>
  );
}

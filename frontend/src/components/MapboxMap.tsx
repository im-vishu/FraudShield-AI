import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { City } from "@/lib/mock-data";
import type { LiveTxnTrace } from "@/hooks/useLiveTransactions";

const TOKEN_KEY = "fs.mapbox.token";

interface Props {
  cities: City[];
  height?: string;
  showLiveTransactions?: boolean;
  liveTraces?: LiveTxnTrace[];
}

export function MapboxMap({
  cities,
  height = "500px",
  showLiveTransactions = true,
  liveTraces
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    // Prefer .env (VITE_MAPBOX_TOKEN). Keep localStorage as fallback for quick overrides.
    return (import.meta.env.VITE_MAPBOX_TOKEN as string) || localStorage.getItem(TOKEN_KEY) || "";
  });
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!ref.current || !token) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [80.5, 22.5],
      zoom: 3.8,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      cities.forEach((c) => {
        const color =
          c.tier === 1 ? "#EF4444" :
          c.tier === 2 ? "#FF6B35" :
          c.tier === 3 ? "#F59E0B" : "#00D4AA";
        const size = 10 + c.tier * 2 + Math.min(c.riskPct, 30) / 2;

        const el = document.createElement("div");
        el.style.cssText = `
          width:${size}px;height:${size}px;border-radius:9999px;
          background:${color};box-shadow:0 0 ${size * 1.5}px ${color};
          border:2px solid rgba(255,255,255,0.4);cursor:pointer;
        `;

        new mapboxgl.Marker(el)
          .setLngLat([c.lng, c.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
              `<div style="font-family:Inter;color:#0B0F1E;padding:4px 6px">
                 <div style="font-weight:700;font-size:13px">${c.name} · Tier ${c.tier}</div>
                 <div style="font-size:11px;opacity:0.7">${c.txnCount.toLocaleString()} txns</div>
                 <div style="font-size:11px;color:${color};font-weight:600">${c.riskPct}% risk</div>
               </div>`
            )
          )
          .addTo(map);
      });
    });

    let interval: number | undefined;

    const animatePath = (path: { lng: number; lat: number }[]) => {
      if (!path.length) return;
      const dot = document.createElement("div");
      dot.style.cssText =
        "width:8px;height:8px;border-radius:9999px;background:#FF6B35;box-shadow:0 0 12px #FF6B35;";
      const m = new mapboxgl.Marker(dot).setLngLat([path[0].lng, path[0].lat]).addTo(map);
      const start = performance.now();
      const dur = 2000;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const idx = Math.min(path.length - 1, Math.floor(p * (path.length - 1)));
        const pt = path[idx];
        m.setLngLat([pt.lng, pt.lat]);
        if (p < 1) requestAnimationFrame(step);
        else m.remove();
      };
      requestAnimationFrame(step);
    };

    if (showLiveTransactions && (!liveTraces || liveTraces.length === 0)) {
      interval = window.setInterval(() => {
        const a = cities[Math.floor(Math.random() * cities.length)];
        const b = cities[Math.floor(Math.random() * cities.length)];
        if (a === b) return;
        animatePath([a, b]);
      }, 900);
    }

    return () => {
      if (interval) clearInterval(interval);
      map.remove();
      mapRef.current = null;
    };
  }, [token, cities, showLiveTransactions, liveTraces]);

  // When live traces arrive from the backend, animate them (one per render tick).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !liveTraces || liveTraces.length === 0) return;
    const last = liveTraces[0];
    if (!last?.points?.length) return;

    const dot = document.createElement("div");
    dot.style.cssText =
      "width:8px;height:8px;border-radius:9999px;background:#FF6B35;box-shadow:0 0 12px #FF6B35;";
    const m = new mapboxgl.Marker(dot)
      .setLngLat([last.points[0].lng, last.points[0].lat])
      .addTo(map);

    const start = performance.now();
    const dur = 2200;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const idx = Math.min(last.points.length - 1, Math.floor(p * (last.points.length - 1)));
      const pt = last.points[idx];
      m.setLngLat([pt.lng, pt.lat]);
      if (p < 1) requestAnimationFrame(step);
      else m.remove();
    };
    requestAnimationFrame(step);
  }, [liveTraces]);

  if (!token) {
    return (
      <div
        style={{ height }}
        className="rounded-xl bg-surface-2 grid-bg flex items-center justify-center p-8"
      >
        <div className="max-w-sm text-center space-y-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Mapbox token required
          </div>
          <p className="text-sm text-muted-foreground">
            Paste your Mapbox public token to activate the live India fraud heatmap.
            Get a free token at <span className="text-primary">mapbox.com</span>.
          </p>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="pk.eyJ1Ijoi..."
            className="w-full bg-surface-3 rounded-lg px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => {
              if (!draft.startsWith("pk.")) return;
              localStorage.setItem(TOKEN_KEY, draft);
              setToken(draft);
            }}
            className="orange-gradient text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg w-full"
          >
            Activate Live Map
          </button>
        </div>
      </div>
    );
  }

  return <div ref={ref} style={{ height }} className="rounded-xl overflow-hidden" />;
}

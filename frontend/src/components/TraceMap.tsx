import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const TOKEN_KEY = "fs.mapbox.token";

export type TracePoint = { seq: number; lng: number; lat: number; tMs?: number };
export type TraceNode = { id: string; label?: string; city?: string; lng: number; lat: number };

type Props = {
  height?: string;
  nodes: TraceNode[];
  points: TracePoint[];
  livePoint?: TracePoint | null;
};

export function TraceMap({ height = "420px", nodes, points, livePoint }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    // Prefer .env (VITE_MAPBOX_TOKEN). Keep localStorage as fallback for quick overrides.
    return (import.meta.env.VITE_MAPBOX_TOKEN as string) || localStorage.getItem(TOKEN_KEY) || "";
  });
  const [draft, setDraft] = useState("");

  const lineGeojson = useMemo(() => {
    const coords = points.map((p) => [p.lng, p.lat]);
    if (livePoint) coords.push([livePoint.lng, livePoint.lat]);
    return {
      type: "Feature" as const,
      properties: {},
      geometry: { type: "LineString" as const, coordinates: coords },
    };
  }, [points, livePoint]);

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

    const markers: mapboxgl.Marker[] = [];

    map.on("load", () => {
      // nodes
      for (const n of nodes) {
        const el = document.createElement("div");
        el.style.cssText =
          "width:12px;height:12px;border-radius:9999px;background:#00D4AA;box-shadow:0 0 16px #00D4AA;border:2px solid rgba(255,255,255,0.4);";
        const m = new mapboxgl.Marker(el)
          .setLngLat([n.lng, n.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 14, closeButton: false }).setHTML(
              `<div style="font-family:Inter;color:#0B0F1E;padding:4px 6px">
                 <div style="font-weight:700;font-size:12px">${n.city || n.label || "Node"}</div>
               </div>`
            )
          )
          .addTo(map);
        markers.push(m);
      }

      map.addSource("traceLine", { type: "geojson", data: lineGeojson as any });
      map.addLayer({
        id: "traceLineLayer",
        type: "line",
        source: "traceLine",
        paint: {
          "line-color": "#FF6B35",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      // Fit bounds if we can
      const all = [...nodes.map((n) => [n.lng, n.lat] as [number, number]), ...points.map((p) => [p.lng, p.lat] as [number, number])];
      if (all.length > 1) {
        const bounds = all.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(all[0], all[0]));
        map.fitBounds(bounds, { padding: 60, duration: 600 });
      }
    });

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [token, nodes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("traceLine") as mapboxgl.GeoJSONSource | undefined;
    if (src) src.setData(lineGeojson as any);
  }, [lineGeojson]);

  if (!token) {
    return (
      <div style={{ height }} className="rounded-xl bg-surface-2 grid-bg flex items-center justify-center p-8">
        <div className="max-w-sm text-center space-y-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Mapbox token required</div>
          <p className="text-sm text-muted-foreground">
            Paste your Mapbox public token to activate tracing.
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
            Activate Trace Map
          </button>
        </div>
      </div>
    );
  }

  return <div ref={ref} style={{ height }} className="rounded-xl overflow-hidden" />;
}

const crypto = require("crypto");

// Minimal city coordinate set for deterministic demo tracing (lng, lat).
// Keep this small and stable so traces don't change across refreshes.
const CITIES = [
  { name: "Mumbai", lng: 72.8777, lat: 19.076 },
  { name: "Delhi", lng: 77.1025, lat: 28.7041 },
  { name: "Bengaluru", lng: 77.5946, lat: 12.9716 },
  { name: "Hyderabad", lng: 78.4867, lat: 17.385 },
  { name: "Chennai", lng: 80.2707, lat: 13.0827 },
  { name: "Kolkata", lng: 88.3639, lat: 22.5726 },
  { name: "Pune", lng: 73.8567, lat: 18.5204 },
  { name: "Ahmedabad", lng: 72.5714, lat: 23.0225 },
  { name: "Jaipur", lng: 75.7873, lat: 26.9124 },
  { name: "Lucknow", lng: 80.9462, lat: 26.8467 }
];

function hashToSeed(input) {
  const h = crypto.createHash("sha256").update(String(input)).digest();
  return h.readUInt32BE(0);
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickCityByName(location) {
  if (!location) return null;
  const s = String(location).toLowerCase();
  return CITIES.find((c) => s.includes(c.name.toLowerCase())) || null;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function jitter(rand, scale) {
  return (rand() - 0.5) * scale;
}

function buildTrace({ transactionId, location, ipAddress }) {
  const seed = hashToSeed(`${transactionId}:${location || ""}:${ipAddress || ""}`);
  const rand = mulberry32(seed);

  const origin =
    pickCityByName(location) ||
    CITIES[Math.floor(rand() * CITIES.length)];

  // Destination: choose a different city.
  let dest = CITIES[Math.floor(rand() * CITIES.length)];
  if (dest.name === origin.name) {
    dest = CITIES[(CITIES.findIndex((c) => c.name === origin.name) + 3) % CITIES.length];
  }

  const points = [];
  const steps = 24; // smooth enough for map animation

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Small jitter so it isn't a perfectly straight line; deterministic from seed.
    const j = 0.18 * Math.sin(t * Math.PI);
    const lng = lerp(origin.lng, dest.lng, t) + jitter(rand, 0.35) * j;
    const lat = lerp(origin.lat, dest.lat, t) + jitter(rand, 0.25) * j;
    points.push({
      seq: i,
      lng,
      lat,
      // Not using real timestamps; client can render relative.
      tMs: i * 1200
    });
  }

  const nodes = [
    { id: "origin", label: "Origin", city: origin.name, lng: origin.lng, lat: origin.lat },
    { id: "dest", label: "Destination", city: dest.name, lng: dest.lng, lat: dest.lat }
  ];

  return {
    seed,
    originCity: origin.name,
    destinationCity: dest.name,
    nodes,
    points
  };
}

module.exports = {
  buildTrace
};


// Mock India fintech fraud data

export interface City {
  name: string;
  tier: 1 | 2 | 3 | 4;
  lng: number;
  lat: number;
  riskPct: number;
  txnCount: number;
}

export const CITIES: City[] = [
  { name: "Mumbai", tier: 1, lng: 72.8777, lat: 19.076, riskPct: 12.4, txnCount: 48210 },
  { name: "Delhi", tier: 1, lng: 77.1025, lat: 28.7041, riskPct: 8.1, txnCount: 41020 },
  { name: "Bangalore", tier: 1, lng: 77.5946, lat: 12.9716, riskPct: 6.4, txnCount: 38810 },
  { name: "Chennai", tier: 1, lng: 80.2707, lat: 13.0827, riskPct: 5.2, txnCount: 22100 },
  { name: "Kolkata", tier: 1, lng: 88.3639, lat: 22.5726, riskPct: 7.8, txnCount: 19840 },
  { name: "Hyderabad", tier: 1, lng: 78.4867, lat: 17.385, riskPct: 6.0, txnCount: 24500 },
  { name: "Pune", tier: 2, lng: 73.8567, lat: 18.5204, riskPct: 9.1, txnCount: 16800 },
  { name: "Ahmedabad", tier: 2, lng: 72.5714, lat: 23.0225, riskPct: 11.2, txnCount: 14200 },
  { name: "Jaipur", tier: 2, lng: 75.7873, lat: 26.9124, riskPct: 13.6, txnCount: 10230 },
  { name: "Lucknow", tier: 2, lng: 80.9462, lat: 26.8467, riskPct: 14.2, txnCount: 8420 },
  { name: "Surat", tier: 2, lng: 72.8311, lat: 21.1702, riskPct: 10.4, txnCount: 9100 },
  { name: "Indore", tier: 2, lng: 75.8577, lat: 22.7196, riskPct: 12.0, txnCount: 7430 },
  { name: "Kanpur", tier: 3, lng: 80.3319, lat: 26.4499, riskPct: 18.5, txnCount: 4210 },
  { name: "Patna", tier: 3, lng: 85.1376, lat: 25.5941, riskPct: 22.1, txnCount: 3820 },
  { name: "Bhopal", tier: 3, lng: 77.4126, lat: 23.2599, riskPct: 16.8, txnCount: 4880 },
  { name: "Nagpur", tier: 3, lng: 79.0882, lat: 21.1458, riskPct: 14.4, txnCount: 5210 },
  { name: "Varanasi", tier: 3, lng: 82.9739, lat: 25.3176, riskPct: 19.6, txnCount: 2940 },
  { name: "Ranchi", tier: 4, lng: 85.3096, lat: 23.3441, riskPct: 24.3, txnCount: 1820 },
  { name: "Gaya", tier: 4, lng: 84.9994, lat: 24.7914, riskPct: 28.7, txnCount: 1240 },
  { name: "Muzaffarpur", tier: 4, lng: 85.3647, lat: 26.1209, riskPct: 26.4, txnCount: 980 },
  { name: "Gorakhpur", tier: 4, lng: 83.3732, lat: 26.7606, riskPct: 25.1, txnCount: 1410 },
];

export interface Txn {
  id: string;
  ts: string;
  user: { name: string; tag: string };
  amount: number;
  city: string;
  ip: string;
  risk: number;
  rail: "UPI" | "Netbanking" | "Card" | "Wallet";
  status: "settled" | "flagged" | "pending" | "blocked";
}

const NAMES = [
  ["Arjun Sharma", "Verified Tier 2"],
  ["Priya Kapur", "Trusted Merchant"],
  ["Sunita Rao", "Standard User"],
  ["Rohan Das", "New Account"],
  ["Aisha Khan", "Verified"],
  ["Vikram Mehta", "Standard"],
  ["Neha Iyer", "Trusted"],
  ["Karan Singh", "New Account"],
  ["Divya Patel", "Verified"],
  ["Rahul Joshi", "Tier 3"],
];

export const TXNS: Txn[] = Array.from({ length: 24 }).map((_, i) => {
  const c = CITIES[i % CITIES.length];
  const n = NAMES[i % NAMES.length];
  const risk = Math.floor(c.riskPct + ((i * 7) % 70));
  const rails = ["UPI", "Netbanking", "Card", "Wallet"] as const;
  const statuses = ["settled", "flagged", "pending", "blocked"] as const;
  return {
    id: `TXN-${(948210 - i * 7).toString()}`,
    ts: `Oct 24, ${14 - Math.floor(i / 4)}:${(60 - i * 3) % 60 || 12}:${(50 - i) % 60 || 10}`,
    user: { name: n[0], tag: n[1] },
    amount: 1000 + ((i * 10331) % 450000),
    city: c.name,
    ip: `${10 + i}.${(i * 17) % 255}.${(i * 31) % 255}.${(i * 47) % 255}`,
    risk,
    rail: rails[i % rails.length],
    status: statuses[i % statuses.length],
  };
});

export interface Alert {
  id: string;
  kind: "VELOCITY SPIKE" | "GEO-ANOMALY" | "BOT PATTERN" | "TIER SPIKE" | "UPI ABUSE";
  ts: string;
  title: string;
  body: string;
  severity: "critical" | "high" | "medium";
  city?: string;
}

export const ALERTS: Alert[] = [
  {
    id: "A-1",
    kind: "VELOCITY SPIKE",
    ts: "Just now",
    title: "Card ending in **4291",
    body: "12 transactions in 4 seconds.",
    severity: "critical",
  },
  {
    id: "A-2",
    kind: "GEO-ANOMALY",
    ts: "4m ago",
    title: "User Login from Mumbai",
    body: "Previously New York, 5 mins prior.",
    severity: "high",
    city: "Mumbai",
  },
  {
    id: "A-3",
    kind: "BOT PATTERN",
    ts: "12m ago",
    title: "Sequential bin probing",
    body: "Detected on Gateway ID: 941.",
    severity: "medium",
  },
  {
    id: "A-4",
    kind: "TIER SPIKE",
    ts: "21m ago",
    title: "Tier 3 fraud +312%",
    body: "Patna cluster - 87 attempts in 10 min.",
    severity: "critical",
    city: "Patna",
  },
  {
    id: "A-5",
    kind: "UPI ABUSE",
    ts: "38m ago",
    title: "Blacklisted UPI ID reuse",
    body: "ravi.fraud@oksbi attempted ₹48,000.",
    severity: "high",
  },
  {
    id: "A-6",
    kind: "GEO-ANOMALY",
    ts: "1h ago",
    title: "Impossible travel",
    body: "Delhi -> Chennai in 8 minutes.",
    severity: "high",
  },
];

export interface Device {
  id: string;
  fingerprint: string;
  city: string;
  ip: string;
  os: string;
  lastSeen: string;
  risk: number;
  txnCount: number;
}

export const DEVICES: Device[] = [
  {
    id: "D-001",
    fingerprint: "fp_a91...c84",
    city: "Mumbai",
    ip: "192.168.1.45",
    os: "Android 14",
    lastSeen: "2m ago",
    risk: 89,
    txnCount: 142,
  },
  {
    id: "D-002",
    fingerprint: "fp_b22...e10",
    city: "Delhi",
    ip: "104.18.23.1",
    os: "iOS 17",
    lastSeen: "12m ago",
    risk: 12,
    txnCount: 88,
  },
  {
    id: "D-003",
    fingerprint: "fp_c77...a31",
    city: "Patna",
    ip: "157.2.44.90",
    os: "Android 13",
    lastSeen: "1h ago",
    risk: 76,
    txnCount: 24,
  },
  {
    id: "D-004",
    fingerprint: "fp_d44...b20",
    city: "Bangalore",
    ip: "12.55.234.12",
    os: "Web Chrome",
    lastSeen: "4m ago",
    risk: 18,
    txnCount: 311,
  },
  {
    id: "D-005",
    fingerprint: "fp_e88...f99",
    city: "Lucknow",
    ip: "65.21.12.4",
    os: "Android 12",
    lastSeen: "9m ago",
    risk: 64,
    txnCount: 41,
  },
];

export interface Report {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  flagged: number;
  recovered: number;
  scope: string;
}

export const REPORTS: Report[] = [
  {
    id: "REP-8821",
    title: "Weekly Fraud Summary",
    period: "Oct 17 – Oct 24, 2024",
    generatedAt: "Today, 09:14",
    flagged: 142,
    recovered: 4220000,
    scope: "All Tiers",
  },
  {
    id: "REP-8810",
    title: "Tier 3-4 Velocity Patterns",
    period: "Oct 1 – Oct 24, 2024",
    generatedAt: "Yesterday",
    flagged: 318,
    recovered: 1820000,
    scope: "Tier 3, 4",
  },
  {
    id: "REP-8801",
    title: "UPI Abuse Quarterly",
    period: "Q3 2024",
    generatedAt: "Oct 20",
    flagged: 1240,
    recovered: 18420000,
    scope: "UPI",
  },
  {
    id: "REP-8794",
    title: "Mumbai Cluster Report",
    period: "Oct 1 – Oct 15",
    generatedAt: "Oct 16",
    flagged: 92,
    recovered: 3110000,
    scope: "Mumbai",
  },
];

export const KPIS = {
  totalVolume: "₹8.42 Cr",
  fraudRate: "0.82%",
  activeAlerts: 142,
  riskyUsers: 2104,
  flaggedToday: 42,
  blockedToday: 1240,
};

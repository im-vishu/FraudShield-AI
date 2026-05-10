import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!name || !email || !password) return setErr("Name, email and password are required.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (!agree) return setErr("Please accept the corporate policy.");
    setBusy(true);
    try {
      await register(name, email, password);
      nav({ to: "/dashboard" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="font-body text-on-surface bg-surface min-h-screen flex">
      <main className="flex-1 flex items-center justify-center p-8 order-2 lg:order-1 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 text-xs font-bold text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span> Back to home
        </Link>
        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-[0px_20px_40px_rgba(25,28,30,0.04)] border border-outline-variant/15">
            <div className="mb-8">
              <h2 className="font-headline font-bold text-2xl">Create account with email</h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Spin up a fraud command center in under a minute.
              </p>
            </div>
            <form className="space-y-5" onSubmit={onSubmit}>
              <Field label="Full Name" icon="person">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  placeholder="Priya Kapur"
                />
              </Field>
              <Field label="Organization" icon="domain">
                <input
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className={inputCls}
                  placeholder="Acme Payments Pvt Ltd"
                />
              </Field>
              <Field label="Corporate Email" icon="alternate_email">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className={inputCls}
                  placeholder="name@organization.com"
                />
              </Field>
              <Field label="Access Key" icon="lock">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className={inputCls}
                  placeholder="At least 6 characters"
                />
              </Field>
              <label className="flex items-start gap-3 p-3 bg-surface-container rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-sm"
                />
                <span className="text-xs text-on-surface-variant">
                  I agree to the Corporate Policy and Service Terms.
                </span>
              </label>
              {err && <p className="text-error text-sm font-semibold">{err}</p>}
              <button
                disabled={busy}
                type="submit"
                className="signature-gradient w-full text-white font-headline font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
                {busy ? "Creating..." : "Create account with email"}
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
              <p className="text-xs text-on-surface-variant">
                Already onboard?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <aside className="hidden lg:flex w-1/2 relative overflow-hidden signature-gradient text-white p-12 flex-col justify-between order-1 lg:order-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
          </div>
          <div>
            <p className="font-headline font-extrabold text-lg tracking-tight">
              Sovereign Sentinel
            </p>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Fraud Prevention AI</p>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-headline font-extrabold text-4xl leading-tight tracking-tight mb-4">
            Stop UPI fraud before it lands.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Tier-aware risk scoring, live geo-anomaly detection, and one-click block actions across
            India's payment rails.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Live Tier 1–4 city heatmaps",
              "OTP-secured operator access",
              "CSV exports for compliance",
              "Instant block + investigate workflows",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[10px] uppercase tracking-widest opacity-60">
          © 2024 Sovereign Sentinel
        </p>
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      </aside>
    </div>
  );
}

const inputCls =
  "w-full bg-surface-container-low border border-transparent focus:border-on-primary-fixed-variant/40 focus:ring-4 focus:ring-on-primary-fixed/5 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline/60 transition-all outline-none";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

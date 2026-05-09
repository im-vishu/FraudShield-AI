import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) return setErr("Email and password required.");
    setBusy(true);
    try {
      await login(email, password);
      nav({ to: "/dashboard" });
    } catch (e: any) {
      setErr(e?.message || "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="font-body text-on-surface bg-surface min-h-screen flex">
      {/* Side image */}
      <aside className="hidden lg:flex w-1/2 relative overflow-hidden signature-gradient text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
          </div>
          <div>
            <p className="font-headline font-extrabold text-lg tracking-tight">Sovereign Sentinel</p>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Fraud Prevention AI</p>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-headline font-extrabold text-4xl leading-tight tracking-tight mb-4">
            India's UPI fraud sentinel, built for Tier 1-4 reach.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Live heatmaps, transaction tracing, and persistent alert workflows across your payment rails.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-widest opacity-60">© 2024 Sovereign Sentinel</p>
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      </aside>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center p-8 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 text-xs font-bold text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span> Back to home
        </Link>

        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest p-10 rounded-2xl shadow-[0px_20px_40px_rgba(25,28,30,0.04)] border border-outline-variant/15">
            <div className="mb-8">
              <h2 className="font-headline font-bold text-2xl tracking-tight">Sign in</h2>
              <p className="text-on-surface-variant text-sm mt-1">Use your corporate email and access key.</p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <Field label="Corporate Email" icon="alternate_email">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="name@organization.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Access Key" icon="lock">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  className={inputCls}
                />
              </Field>

              {err ? <p className="text-error text-sm font-semibold">{err}</p> : null}

              <button
                disabled={busy}
                type="submit"
                className="signature-gradient w-full text-white font-headline font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{busy ? "Signing in..." : "Sign in"}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
              <p className="text-xs text-on-surface-variant">
                New to Sentinel?{" "}
                <Link to="/signup" className="text-primary font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
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


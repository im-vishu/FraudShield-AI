import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { checkIp, type IpCheckResult } from "@/lib/ip";

export const Route = createFileRoute("/dashboard/ip-reputation")({
  component: IpReputationPage,
});

function IpReputationPage() {
  const { token } = useAuth();
  const [ip, setIp] = useState("");

  const m = useMutation({
    mutationFn: async () => checkIp(token!, ip.trim()),
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ip.trim()) return;
    await m.mutateAsync();
  };

  const r = m.data as IpCheckResult | undefined;

  return (
    <DashboardLayout
      active="ip"
      title="IP Reputation"
      subtitle="Check IP risk using free sources (AbuseIPDB, IPinfo, ip-api fallback)."
      actions={
        <Link
          to="/dashboard"
          className="px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </Link>
      }
    >
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-5">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
            <h3 className="font-headline font-bold text-sm mb-4">Lookup</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  IP Address
                </label>
                <input
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="8.8.8.8"
                  className={inputCls}
                />
              </div>
              {m.error ? (
                <p className="text-sm text-error">
                  {(m.error as any)?.message || "Lookup failed."}
                </p>
              ) : null}
              <button
                disabled={m.isPending}
                type="submit"
                className="signature-gradient w-full text-white font-headline font-bold py-3 rounded-xl shadow-lg active:scale-[0.99] transition-all disabled:opacity-60"
              >
                {m.isPending ? "Checking..." : "Check IP"}
              </button>
            </form>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-7 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="font-headline font-bold text-sm">Result</h3>
              {r ? (
                <span
                  className={[
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border",
                    r.isBlacklisted
                      ? "bg-error-container text-on-error-container border-error/20"
                      : "bg-surface-container-low border-outline-variant/15",
                  ].join(" ")}
                >
                  {r.isBlacklisted ? "High Risk" : "Normal"}
                </span>
              ) : null}
            </div>

            {!r ? (
              <p className="text-sm text-on-surface-variant">
                Run a lookup to see reputation, geo, and provider data.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Card k="Risk Score" v={String(r.riskScore)} />
                <Card k="Abuse Confidence" v={`${r.abuseConfidence}%`} />
                <Card k="Country" v={r.countryCode || "N/A"} />
                <Card k="City" v={r.city || "N/A"} />
                <Card k="ISP/Org" v={r.isp || "N/A"} wide />
                <Card k="Cached" v={r.cached ? "Yes" : "No"} />
              </div>
            )}
          </div>

          {r?.sources ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
              <h3 className="font-headline font-bold text-sm mb-4">Sources</h3>
              <pre className="text-xs bg-surface-container-low rounded-xl border border-outline-variant/15 p-4 overflow-auto max-h-[420px]">
                {JSON.stringify(r.sources, null, 2)}
              </pre>
            </div>
          ) : null}
        </aside>
      </div>
    </DashboardLayout>
  );
}

const inputCls =
  "w-full bg-surface-container-low border border-transparent focus:border-on-primary-fixed-variant/40 focus:ring-4 focus:ring-on-primary-fixed/5 rounded-xl py-2.5 px-3 text-on-surface placeholder:text-outline/60 transition-all outline-none text-sm";

function Card({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 border bg-surface-container-lowest border-outline-variant/15 ${wide ? "col-span-2" : ""}`}
    >
      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{k}</p>
      <p className="text-sm font-semibold mt-2 break-words">{v}</p>
    </div>
  );
}

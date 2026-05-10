import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

type AnalyzeInput = {
  transactionRef: string;
  amount: number;
  currency?: string;
  senderAccount?: string;
  receiverAccount?: string;
  ipAddress?: string;
  deviceId?: string;
  location?: string;
};

type AnalyzeResponse = {
  transaction: any;
  fraudAlert?: any;
  publishedAlert?: any;
  riskExplanation?: string;
};

export const Route = createFileRoute("/dashboard/analyze")({
  component: AnalyzePage,
});

function AnalyzePage() {
  const { token } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState<AnalyzeInput>({
    transactionRef: `TXN-${Date.now()}`,
    amount: 1000,
    currency: "INR",
    senderAccount: "",
    receiverAccount: "",
    ipAddress: "",
    deviceId: "",
    location: "",
  });

  const m = useMutation({
    mutationFn: async () =>
      apiFetch<AnalyzeResponse>("/transactions/analyze", {
        method: "POST",
        token,
        body: JSON.stringify({
          transactionRef: form.transactionRef,
          amount: Number(form.amount),
          currency: form.currency || "INR",
          senderAccount: form.senderAccount || undefined,
          receiverAccount: form.receiverAccount || undefined,
          ipAddress: form.ipAddress || undefined,
          deviceId: form.deviceId || undefined,
          location: form.location || undefined,
        }),
      }),
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await m.mutateAsync();
  };

  const tx = m.data?.transaction;

  return (
    <DashboardLayout
      active="analyze"
      title="Transaction Analysis"
      subtitle="Score a transaction and persist the decision trace."
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
        <section className="col-span-12 lg:col-span-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
            <h3 className="font-headline font-bold text-sm mb-4">Input</h3>
            <form className="space-y-4" onSubmit={onSubmit}>
              <Field label="Transaction Ref">
                <input
                  value={form.transactionRef}
                  onChange={(e) => setForm((s) => ({ ...s, transactionRef: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Amount">
                  <input
                    value={form.amount}
                    onChange={(e) => setForm((s) => ({ ...s, amount: Number(e.target.value) }))}
                    type="number"
                    min={0}
                    className={inputCls}
                  />
                </Field>
                <Field label="Currency">
                  <input
                    value={form.currency}
                    onChange={(e) => setForm((s) => ({ ...s, currency: e.target.value }))}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Sender Account">
                <input
                  value={form.senderAccount}
                  onChange={(e) => setForm((s) => ({ ...s, senderAccount: e.target.value }))}
                  className={inputCls}
                  placeholder="Optional"
                />
              </Field>
              <Field label="Receiver Account">
                <input
                  value={form.receiverAccount}
                  onChange={(e) => setForm((s) => ({ ...s, receiverAccount: e.target.value }))}
                  className={inputCls}
                  placeholder="Optional"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="IP Address">
                  <input
                    value={form.ipAddress}
                    onChange={(e) => setForm((s) => ({ ...s, ipAddress: e.target.value }))}
                    className={inputCls}
                    placeholder="Optional"
                  />
                </Field>
                <Field label="Device ID">
                  <input
                    value={form.deviceId}
                    onChange={(e) => setForm((s) => ({ ...s, deviceId: e.target.value }))}
                    className={inputCls}
                    placeholder="Optional"
                  />
                </Field>
              </div>
              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                  className={inputCls}
                  placeholder="Optional"
                />
              </Field>

              {m.error ? (
                <p className="text-sm text-error">
                  {(m.error as any)?.message || "Failed to analyze transaction."}
                </p>
              ) : null}

              <button
                disabled={m.isPending}
                type="submit"
                className="signature-gradient w-full text-white font-headline font-bold py-3 rounded-xl shadow-lg active:scale-[0.99] transition-all disabled:opacity-60"
              >
                {m.isPending ? "Analyzing..." : "Analyze Transaction"}
              </button>
            </form>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-6 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline font-bold text-sm">Result</h3>
              {tx?.id ? (
                <button
                  onClick={() => nav({ to: "/dashboard/transactions/$id", params: { id: tx.id } })}
                  className="px-3 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-sm"
                >
                  Open Transaction
                </button>
              ) : null}
            </div>

            {!m.data ? (
              <p className="text-sm text-on-surface-variant">
                Submit an analysis to see the risk score, explanation, and any resulting alert.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                <Row k="Risk Score" v={String(tx?.riskScore ?? "N/A")} />
                <Row k="Risk Level" v={String(tx?.riskLevel ?? "N/A")} />
                <Row k="Status" v={String(tx?.status ?? "N/A")} />
                <div className="pt-3 border-t border-outline-variant/15">
                  <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                    Explanation
                  </p>
                  <p className="text-sm text-on-surface-variant whitespace-pre-wrap">
                    {m.data.riskExplanation || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

const inputCls =
  "w-full bg-surface-container-low border border-transparent focus:border-on-primary-fixed-variant/40 focus:ring-4 focus:ring-on-primary-fixed/5 rounded-xl py-2.5 px-3 text-on-surface placeholder:text-outline/60 transition-all outline-none text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-label text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-on-surface-variant">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

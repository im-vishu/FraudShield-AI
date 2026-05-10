import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/risk-analysis")({
  component: RiskAnalysisPage,
});

function RiskAnalysisPage() {
  return (
    <div className="font-body text-on-surface bg-surface min-h-screen">
      <aside className="flex flex-col h-full fixed left-0 top-0 z-40 bg-slate-50 dark:bg-slate-900 h-screen w-64 border-r-0">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white font-manrope">
            Sovereign Sentinel
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-semibold">
            Fraud Prevention AI
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/80 group"
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="dashboard">
              dashboard
            </span>
            <span className="font-manrope text-sm font-medium tracking-tight">Overview</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/80 group"
            href="/dashboard/transactions"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="payments">
              payments
            </span>
            <span className="font-manrope text-sm font-medium tracking-tight">Transactions</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/80 group"
            href="/dashboard/alerts"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="notifications_active"
            >
              notifications_active
            </span>
            <span className="font-manrope text-sm font-medium tracking-tight">Alerts</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 bg-slate-200/50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold group scale-100 active:scale-95 transition-transform"
            href="/dashboard/risk-analysis"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="security"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
            <span className="font-manrope text-sm font-medium tracking-tight">Risk</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/80 group"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="devices">
              devices
            </span>
            <span className="font-manrope text-sm font-medium tracking-tight">Devices</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/80 group"
            href="/dashboard/admin"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              data-icon="settings_applications"
            >
              settings_applications
            </span>
            <span className="font-manrope text-sm font-medium tracking-tight">Admin</span>
          </a>
        </nav>
        <div className="p-6 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
              CSO
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Chief Security Officer</p>
              <p className="text-[10px] text-on-surface-variant truncate">Security Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="flex items-center justify-between px-8 w-full h-16 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none">
          <div className="flex items-center bg-surface-container-high px-4 py-2 rounded-xl w-96 focus-within:ring-2 focus-within:ring-slate-400/20 transition-all">
            <span
              className="material-symbols-outlined text-slate-500 text-[20px]"
              data-icon="search"
            >
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm font-manrope w-full ml-2"
              placeholder="Search Risk Patterns..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-200/15 pr-6">
              <button className="relative text-slate-500 hover:text-slate-900 transition-all">
                <span className="material-symbols-outlined" data-icon="notifications">
                  notifications
                </span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="text-slate-500 hover:text-slate-900 transition-all">
                <span className="material-symbols-outlined" data-icon="help_outline">
                  help_outline
                </span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-all">
                Support
              </span>
              <button className="signature-gradient text-white px-5 py-2 rounded-xl text-sm font-semibold tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Investigate Case
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-light font-manrope tracking-tight text-on-surface">
                Risk <span className="font-extrabold">Intelligence</span>
              </h2>
              <p className="text-on-surface-variant mt-2 font-medium">
                Advanced pattern recognition and behavioral risk mapping
              </p>
            </div>
            <div className="flex gap-2">
              <div className="bg-surface-container-highest px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                <span className="text-xs font-bold font-manrope">LIVE ANALYTICS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl overflow-hidden relative group">
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                  Spatial Visualization
                </span>
                <h3 className="text-2xl font-manrope font-bold">Fraud Intensity Heatmap</h3>
              </div>
              <div className="absolute top-6 right-6 z-10 bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-error"></span>
                    <span className="text-xs font-semibold">High Intensity (NCR, Mumbai)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[#FF9D00]"></span>
                    <span className="text-xs font-semibold">Elevated (Bengaluru, Pune)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-secondary-container"></span>
                    <span className="text-xs font-semibold">Baseline</span>
                  </div>
                </div>
              </div>
              <div className="h-[480px] w-full bg-slate-200 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                  data-alt="abstract satellite topographic map of india with glowing red and orange heatmap overlays on major metropolitan hubs dark cinematic lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC7nEzy34g10tbaA_wDz6dnI1bZfcja2YhZaBZ1T3MLEfoG2ul9y2cvYQvudFnhQ37Yj1ixQqBhWzVt9xgDQXKag7kHsR5JCAqfeRcwH2RzC-ckQ_Oclip6qzJtZt00xoIzosLBH5cN24p4n4MKu5TSmg6yhyOp-la1UsUovOCCKvl3bWzPaYbVmXksdkD_w4zc8nwf93gCflunGLf-NiDMpIyZNdrBrKe5xXxoDl_EU_FR4WDhvSRp7CNqX-yzZLLSNc36HwkyvmO"
                />

                <div className="absolute top-[25%] left-[45%] w-32 h-32 bg-red-500/30 blur-3xl rounded-full"></div>
                <div className="absolute top-[65%] left-[35%] w-24 h-24 bg-red-600/40 blur-3xl rounded-full"></div>
                <div className="absolute top-[75%] left-[55%] w-20 h-20 bg-orange-500/30 blur-3xl rounded-full"></div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 bg-primary-container text-white rounded-xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim/10 blur-[100px] -mr-32 -mt-32"></div>
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className="material-symbols-outlined text-secondary-fixed"
                    data-icon="model_training"
                  >
                    model_training
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-primary-container">
                    Threshold Simulator
                  </span>
                </div>
                <h3 className="text-2xl font-manrope font-bold mb-2">Policy Calibration</h3>
                <p className="text-on-primary-container text-sm leading-relaxed">
                  Adjust AI sensitivity to balance friction vs. security. Current projected false
                  positive rate: <span className="text-white font-bold">0.82%</span>
                </p>
                <div className="mt-10 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Risk Threshold</span>
                      <span className="text-secondary-fixed">84 / 100</span>
                    </div>
                    <div className="relative w-full h-2 bg-white/10 rounded-full">
                      <div className="absolute top-0 left-0 h-full w-[84%] bg-secondary-fixed rounded-full"></div>
                      <div className="absolute top-1/2 left-[84%] -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span>Latency Tolerance</span>
                      <span className="text-secondary-fixed">150ms</span>
                    </div>
                    <div className="relative w-full h-2 bg-white/10 rounded-full">
                      <div className="absolute top-0 left-0 h-full w-[45%] bg-secondary-fixed rounded-full"></div>
                      <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer"></div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full py-4 mt-8 bg-white text-primary-container rounded-xl font-bold font-manrope hover:bg-secondary-fixed transition-colors">
                Apply Global Policy
              </button>
            </div>

            <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-lg font-manrope font-extrabold tracking-tight">
                    Temporal Patterns
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Hourly fraud distribution (24hr cycle)
                  </p>
                </div>
                <select className="bg-surface-container text-xs font-bold border-none rounded-lg focus:ring-0">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="flex items-end justify-between h-48 gap-2">
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-surface-container-high rounded-t-sm h-[30%]"></div>
                  <span className="text-[9px] font-bold text-on-surface-variant">00:00</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-surface-container-high rounded-t-sm h-[20%]"></div>
                  <span className="text-[9px] font-bold text-on-surface-variant">04:00</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-primary/20 rounded-t-sm h-[45%]"></div>
                  <span className="text-[9px] font-bold text-on-surface-variant">08:00</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-primary/40 rounded-t-sm h-[70%]"></div>
                  <span className="text-[9px] font-bold text-on-surface-variant">12:00</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-primary/60 rounded-t-sm h-[90%]"></div>
                  <span className="text-[9px] font-bold text-on-surface-variant">16:00</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-primary rounded-t-sm h-[100%]"></div>
                  <span className="text-[9px] font-bold text-on-surface-variant">20:00</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-primary/80 rounded-t-sm h-[60%]"></div>
                  <span className="text-[9px] font-bold text-on-surface-variant">23:00</span>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <h3 className="text-lg font-manrope font-extrabold tracking-tight mb-6">
                High-Risk Entities
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        data-icon="account_balance"
                      >
                        account_balance
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Node_AX_9921</p>
                      <p className="text-[11px] text-on-surface-variant">
                        Merchant Terminal {"-"} Mumbai
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-error">98.2</p>
                    <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50">
                      Score
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        data-icon="smartphone"
                      >
                        smartphone
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Device_ID_744k</p>
                      <p className="text-[11px] text-on-surface-variant">Mobile {"-"} New Delhi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-orange-600">84.5</p>
                    <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50">
                      Score
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-[20px]" data-icon="person">
                        person
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">User_Hash_772</p>
                      <p className="text-[11px] text-on-surface-variant">
                        Consumer {"-"} Bengaluru
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-on-surface">76.1</p>
                    <p className="text-[10px] uppercase font-bold tracking-tighter opacity-50">
                      Score
                    </p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 text-xs font-bold text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-2">
                View Complete Risk Registry
                <span className="material-symbols-outlined text-[16px]" data-icon="arrow_forward">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-surface-container-low border border-outline-variant/10 rounded-xl">
              <span className="material-symbols-outlined text-primary mb-4" data-icon="psychology">
                psychology
              </span>
              <h4 className="font-manrope font-bold text-sm mb-2">AI Observation</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Detected 12% increase in 'Account Takeover' signatures across South-East corridors
                in the last 4 hours.
              </p>
            </div>
            <div className="p-6 bg-surface-container-low border border-outline-variant/10 rounded-xl">
              <span className="material-symbols-outlined text-primary mb-4" data-icon="hub">
                hub
              </span>
              <h4 className="font-manrope font-bold text-sm mb-2">Network Affinity</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                3 High-risk nodes identified as belonging to the same hardware cluster. Isolation
                recommended.
              </p>
            </div>
            <div className="p-6 bg-surface-container-low border border-outline-variant/10 rounded-xl">
              <span
                className="material-symbols-outlined text-primary mb-4"
                data-icon="auto_awesome"
              >
                auto_awesome
              </span>
              <h4 className="font-manrope font-bold text-sm mb-2">Optimization Suggestion</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Increasing threshold by 4% would reduce false positives by 18% with negligible
                impact on catch rate.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

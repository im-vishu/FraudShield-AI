import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingHeroCanvas } from "@/components/LandingHeroCanvas";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const apply = () => setReducedMotion(Boolean(mq.matches));
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return (
    <div className="font-body text-on-surface bg-surface min-h-screen">
      <nav className="w-full h-16 sticky top-0 z-50 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none font-manrope text-sm border-b border-slate-200/15 dark:border-slate-800/15">
        <div className="flex items-center gap-8">
          <a href="/" className="text-xl font-bold tracking-tighter text-slate-900 font-headline">
            Sovereign Sentinel
          </a>
          <div className="hidden md:flex gap-6 items-center">
            <a className="text-slate-900 border-b-2 border-slate-900 font-medium py-1" href="#">
              Overview
            </a>
            <a className="text-slate-500 hover:text-slate-900 transition-all py-1" href="#features">
              Features
            </a>
            <a className="text-slate-500 hover:text-slate-900 transition-all py-1" href="#scoring">
              Risk AI
            </a>
            <a
              className="text-slate-500 hover:text-slate-900 transition-all py-1"
              href="#compliance"
            >
              Compliance
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-slate-600 hover:text-slate-900 transition-all font-medium px-3 py-2"
          >
            Login
          </a>
          <a
            href="/signup"
            className="signature-gradient text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </a>
        </div>
      </nav>
      <main>
        <section className="relative overflow-hidden pt-20 pb-32 px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container/10 text-on-primary-container text-xs font-semibold mb-6 tracking-wide">
                <span className="material-symbols-outlined text-sm mr-2" data-icon="security">
                  security
                </span>{" "}
                NEXT-GEN FRAUD PREVENTION
              </div>
              <h1 className="font-headline text-6xl font-light leading-tight tracking-tight text-primary mb-6">
                The <span className="font-bold">Sovereign Sentinel</span> of Digital Assets.
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                FraudShield AI deploys autonomous cognitive nodes to monitor, analyze, and
                neutralize transaction risks before they impact your bottom line. Precision
                intelligence for the modern enterprise.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/signup"
                  className="signature-gradient text-on-primary px-8 py-4 rounded-lg font-semibold text-base shadow-xl hover:shadow-2xl active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  Get Started Free <span className="material-symbols-outlined">arrow_forward</span>
                </a>
                <a
                  href="/login"
                  className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-lg font-semibold text-base hover:bg-surface-container-high transition-colors inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>Login
                </a>
              </div>
            </div>
            <div className="relative" style={{ perspective: "1200px" }}>
              <div
                className="relative aspect-square w-full rounded-xl overflow-hidden shadow-2xl"
                style={{
                  transform: "rotateY(-12deg) rotateX(6deg)",
                  transformStyle: "preserve-3d",
                  animation: "sentinel-float 6s ease-in-out infinite",
                }}
              >
                <LandingHeroCanvas reducedMotion={reducedMotion} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/40 to-transparent"></div>

                <div
                  className="absolute bottom-6 right-6 glass-panel p-6 rounded-xl border border-white/20 shadow-2xl"
                  style={{ transform: "translateZ(60px)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined" data-icon="bolt">
                        bolt
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
                        Processing Speed
                      </div>
                      <div className="text-2xl font-headline font-bold text-primary">0.04ms</div>
                    </div>
                  </div>
                </div>
              </div>
              <style>{`@keyframes sentinel-float { 0%,100% { transform: rotateY(-12deg) rotateX(6deg) translateY(0); } 50% { transform: rotateY(-8deg) rotateX(4deg) translateY(-12px); } }`}</style>
            </div>
          </div>

          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[120px] -z-10"></div>
        </section>

        <section className="py-24 bg-surface-container-low px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-3xl font-bold text-primary mb-4">
                Real-time Fraud Prevention
              </h2>
              <p className="text-on-surface-variant max-w-2xl">
                A multi-layered defense system that evolves with every attempt. We don't just block;
                we predict.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <span
                    className="material-symbols-outlined text-4xl text-primary mb-6"
                    data-icon="psychology"
                  >
                    psychology
                  </span>
                  <h3 className="text-xl font-headline font-bold mb-3">Cognitive Analysis</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Advanced behavioral mapping identifies subtle anomalies in user patterns that
                    traditional systems miss.
                  </p>
                </div>
              </div>

              <div className="bg-primary-container p-8 rounded-xl text-on-primary flex flex-col justify-between md:row-span-2">
                <div>
                  <span
                    className="material-symbols-outlined text-4xl mb-6"
                    data-icon="shield_with_heart"
                  >
                    shield_with_heart
                  </span>
                  <h3 className="text-2xl font-headline font-bold mb-4">Autonomous Sentinel</h3>
                  <p className="text-on-primary-container text-base leading-relaxed mb-8">
                    Deploying 24/7 active surveillance across your entire transaction gateway. Our
                    AI Sentinel learns from global threat databases in real-time, providing
                    immediate immunity to new attack vectors.
                  </p>
                </div>
                <img
                  alt="Server room with blue lighting"
                  className="rounded-lg h-48 object-cover w-full opacity-60"
                  data-alt="Sleek modern data center server racks with glowing blue status indicators in a dark, high-tech environment"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4-STSpKhbygwy0XBUQYwcL2NosbiYubFIH5hUGOr_cbXu3OhbcZW0F1r0n_v616WK8yvI6SGJ1DL2Ey7nmpxIsIGeSBzTn9ghwXpvoma9FMtKdxkUzPSxbM_pP8ACVY15tE9zXoMUiAe2yalQFap4ntBiHCjZo4tK2kK9KVc46m0FNevdvNuGcr56jeEpcLfUEgZlP5hqekOnbJ7SXThNepaSuwkM1j1a80IPbbvnK8t0QS04D1JSowg0iGpxOtkNqt7xZVikyPm_"
                />
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <span
                    className="material-symbols-outlined text-4xl text-primary mb-6"
                    data-icon="sync_alt"
                  >
                    sync_alt
                  </span>
                  <h3 className="text-xl font-headline font-bold mb-3">Zero-Latency Sync</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Integration that doesn't slow you down. Execute checks in the background while
                    users checkout seamlessly.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-xl md:col-span-1">
                <span
                  className="material-symbols-outlined text-4xl text-primary mb-6"
                  data-icon="location_on"
                >
                  location_on
                </span>
                <h3 className="text-xl font-headline font-bold mb-3">Geospatial Guard</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Instant verification of transaction location against established user travel
                  profiles.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-xl md:col-span-1">
                <span
                  className="material-symbols-outlined text-4xl text-primary mb-6"
                  data-icon="fingerprint"
                >
                  fingerprint
                </span>
                <h3 className="text-xl font-headline font-bold mb-3">Biometric Link</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Seamlessly bridge digital transactions with physical identity verification
                  protocols.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-xl shadow-2xl p-8 border border-outline-variant/15">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="font-headline font-bold">Transaction Analysis</h4>
                  <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold">
                    HIGH RISK
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="w-2/3">
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-error w-[89%]"></div>
                      </div>
                      <div className="text-xs text-on-surface-variant uppercase tracking-tighter">
                        Risk Score: 89/100
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-headline font-extrabold text-primary">
                        ₹1,42,000
                      </div>
                      <div className="text-[10px] text-on-surface-variant uppercase">
                        Potential Loss Prevented
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-lg">
                      <div className="text-[10px] text-on-surface-variant uppercase mb-1">
                        Velocity Alarm
                      </div>
                      <div className="text-sm font-bold text-on-surface">3 Attempts / 5sec</div>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-lg">
                      <div className="text-[10px] text-on-surface-variant uppercase mb-1">
                        Device ID
                      </div>
                      <div className="text-sm font-bold text-on-surface">Unknown Emulator</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary-container/30 rounded-full blur-3xl -z-10"></div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-headline text-4xl font-light mb-6">
                Quantifiable Trust with <span className="font-bold">AI Risk Scoring</span>.
              </h2>
              <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                Our proprietary scoring engine analyzes 12,000+ data points per transaction. From
                device fingerprinting to network integrity, we convert complex data into a simple,
                actionable risk index.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">
                    check_circle
                  </span>
                  <span className="font-medium">Dynamic Thresholding for VIP Users</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">
                    check_circle
                  </span>
                  <span className="font-medium">
                    Automated Decision Logic (Approve/Flag/Decline)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary" data-icon="check_circle">
                    check_circle
                  </span>
                  <span className="font-medium">
                    Explainable AI: See exactly why a score was given
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary-container text-on-primary px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-16 h-1 border-t-4 border-secondary-fixed mb-8"></div>
                <h2 className="font-headline text-4xl font-bold mb-6">
                  India-Specific Compliance Architecture.
                </h2>
                <p className="text-on-primary-container text-lg mb-8">
                  Built specifically for the Indian regulatory landscape. We ensure full compliance
                  with RBI guidelines, DPDP Act, and local data localization mandates.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-3xl font-headline font-bold text-white mb-2">100%</div>
                    <div className="text-sm text-on-primary-container uppercase tracking-widest font-semibold">
                      RBI Compliant
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-headline font-bold text-white mb-2">On-Soil</div>
                    <div className="text-sm text-on-primary-container uppercase tracking-widest font-semibold">
                      Data Hosting
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <h4 className="font-bold mb-2">e-KYC Integration</h4>
                  <p className="text-sm text-on-primary-container">
                    Seamless integration with Aadhaar and PAN verification systems.
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <h4 className="font-bold mb-2">UPI Guard</h4>
                  <p className="text-sm text-on-primary-container">
                    Specialized monitoring for UPI intent and collect request frauds.
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <h4 className="font-bold mb-2">DPDP Ready</h4>
                  <p className="text-sm text-on-primary-container">
                    Privacy-first design ensuring compliance with Digital Personal Data Protection.
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <h4 className="font-bold mb-2">SAR Filing</h4>
                  <p className="text-sm text-on-primary-container">
                    Automated generation of Suspicious Activity Reports for regulators.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
            <img
              alt="Map texture of India"
              className="object-cover h-full w-full"
              data-alt="A stylized minimalist map of India with glowing digital connection lines across major tech hubs"
              data-location="India"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm0J59A8LkngsCLpNxN4fpi7Ycas51RNKEhosmuLwrO2O6toe6WHtL5D7VTTF6uNvCEH4hB_bHXEfmG8fD8W_olpyc1VLTpbc4mBwvo7yENVyrm0hyeMenPPlxP3iCNGLdww0MIrPNDr959U-Hox9RmVZevG5lqu3edOgdI4YVc4bRUNQp8y_RcFVCdw7XQQ0Apmt4rEHyO3GlR5XbxKpXprCpLymGj6GhYXW4OAVmvHyiSYjHDRu1e_AWr2ja1aFGeZWnAYwCH-qB"
            />
          </div>
        </section>

        <section className="py-32 bg-surface px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline text-4xl font-bold text-primary mb-4">
                Command the Defense
              </h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">
                Full visibility into your fraud landscape through a refined, intuitive dashboard
                interface.
              </p>
            </div>
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden">
                <div className="h-12 bg-surface-container-low flex items-center px-6 border-b border-outline-variant/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/20"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></div>
                    <div className="w-3 h-3 rounded-full bg-surface-container-high"></div>
                  </div>
                </div>

                <div className="p-8 grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-1 space-y-6">
                    <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                      <div className="text-xs text-on-surface-variant mb-1">
                        Live Sentinel Status
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-bold">Active</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-8 w-full bg-surface-container-low rounded-lg"></div>
                      <div className="h-8 w-full bg-primary-container rounded-lg"></div>
                      <div className="h-8 w-full bg-surface-container-low rounded-lg"></div>
                      <div className="h-8 w-full bg-surface-container-low rounded-lg"></div>
                    </div>
                  </div>
                  <div className="md:col-span-3 space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-6 bg-surface-container-low rounded-xl">
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
                          Protected Volume
                        </div>
                        <div className="text-2xl font-headline font-bold">₹8.4 Cr</div>
                      </div>
                      <div className="p-6 bg-surface-container-low rounded-xl">
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
                          Blocked Threats
                        </div>
                        <div className="text-2xl font-headline font-bold text-error">1,240</div>
                      </div>
                      <div className="p-6 bg-surface-container-low rounded-xl">
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">
                          False Positive
                        </div>
                        <div className="text-2xl font-headline font-bold">0.02%</div>
                      </div>
                    </div>
                    <div className="h-64 bg-surface-container-lowest rounded-xl border border-outline-variant/10 relative p-6">
                      <div className="flex justify-between items-center mb-8">
                        <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          Threat Intensity Overlay
                        </div>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-sm bg-primary-container"></div>
                          <div className="w-3 h-3 rounded-sm bg-secondary-container"></div>
                        </div>
                      </div>
                      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between h-32">
                        <div className="w-8 bg-surface-container-high rounded-t h-[40%]"></div>
                        <div className="w-8 bg-surface-container-high rounded-t h-[60%]"></div>
                        <div className="w-8 bg-primary-container rounded-t h-[85%]"></div>
                        <div className="w-8 bg-surface-container-high rounded-t h-[45%]"></div>
                        <div className="w-8 bg-surface-container-high rounded-t h-[30%]"></div>
                        <div className="w-8 bg-primary-container rounded-t h-[95%]"></div>
                        <div className="w-8 bg-surface-container-high rounded-t h-[50%]"></div>
                        <div className="w-8 bg-surface-container-high rounded-t h-[70%]"></div>
                        <div className="w-8 bg-surface-container-high rounded-t h-[40%]"></div>
                        <div className="w-8 bg-primary-container rounded-t h-[80%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-container/5 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </section>

        <section className="py-32 px-8">
          <div className="max-w-4xl mx-auto text-center glass-panel p-16 rounded-2xl border border-white/40 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-headline text-5xl font-bold text-primary mb-6">
                Ready to fortify your ecosystem?
              </h2>
              <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto">
                Join India's leading fintechs and banks that trust FraudShield AI to protect their
                digital sovereignty.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <a
                  href="/signup"
                  className="signature-gradient text-white px-10 py-5 rounded-lg font-bold text-lg shadow-2xl inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  Get Started Free <span className="material-symbols-outlined">arrow_forward</span>
                </a>
                <a
                  href="/login"
                  className="bg-white text-primary border border-primary/10 px-10 py-5 rounded-lg font-bold text-lg hover:bg-surface-container-low transition-colors inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>Login
                </a>
              </div>
            </div>

            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <img
                alt="High tech digital texture"
                className="object-cover w-full h-full"
                data-alt="Deep blue abstract digital pattern of binary code and geometric circuit lines, soft focus and low contrast"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfCXiSLQpkOOkKPdN7bn0mn8gri2s3p9q4sdfq6iHqoA4Np8Gu6vGJdhWweZcLdPZwg5StWdXKBc75klS590Zkb9gAgwd9ukBje2TS_z1rW967eMSn3sHvGduNSAAAYLkoD4ZgQNorfRm8x6Z91y4SP9pXOlqwYAdS20KRTJHFylWLSxdhAYCA74UmCpmGGv5aL0yOTx27B3ORX6RGYI7YC8RiXRMS_PxquFQ5Qo-Bbk-sdqdqQIdSQbLX5VvG60kNqGnEmTbnKVQQ"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-20 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="text-xl font-bold tracking-tighter text-slate-900 font-headline mb-6">
              Sovereign Sentinel
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              The next generation of autonomous fraud prevention for the Indian financial sector.
            </p>
            <div className="flex gap-4">
              <a className="text-on-surface-variant hover:text-primary" href="#">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a className="text-on-surface-variant hover:text-primary" href="#">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest">Technology</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary" href="#">
                  Cognitive Engine
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Real-time Risk Scoring
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  API Integration
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Sentinel Nodes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest">Compliance</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary" href="#">
                  RBI Regulations
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  DPDP Compliance
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Data Residency
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Security Audits
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest">Company</h5>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Contact Sales
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline-variant/10 text-center text-xs text-on-surface-variant uppercase tracking-widest">
          © 2024 Sovereign Sentinel AI. All Rights Reserved. Protected by AES-256 Encryption.
        </div>
      </footer>
    </div>
  );
}

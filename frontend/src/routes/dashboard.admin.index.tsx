import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/admin/")({
  component: AdminPanel,
});

function AdminPanel() {
  return (
    <div className="font-body text-on-surface bg-surface min-h-screen">


<aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-900 flex flex-col p-4 gap-y-2 z-50">
<div className="mb-8 px-2 flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white">
<span className="material-symbols-outlined" data-icon="shield">shield</span>
</div>
<div>
<h1 className="font-manrope font-extrabold text-slate-900 dark:text-slate-50 text-lg leading-tight">FraudShield AI</h1>
<p className="text-[10px] uppercase tracking-[0.2em] text-on-secondary-container font-semibold">The Sovereign Sentinel</p>
</div>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-3 py-2.5 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-lg shadow-lg font-inter text-sm font-medium tracking-wide" href="/dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg font-inter text-sm font-medium tracking-wide transition-all duration-150 ease-out" href="/dashboard/admin">
<span className="material-symbols-outlined" data-icon="admin_panel_settings">admin_panel_settings</span>
<span>Admin</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg font-inter text-sm font-medium tracking-wide transition-all duration-150 ease-out" href="/dashboard/risk-analysis">
<span className="material-symbols-outlined" data-icon="security">security</span>
<span>Threat Logs</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg font-inter text-sm font-medium tracking-wide transition-all duration-150 ease-out" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span>User Registry</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg font-inter text-sm font-medium tracking-wide transition-all duration-150 ease-out" href="#">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span>System Health</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg font-inter text-sm font-medium tracking-wide transition-all duration-150 ease-out" href="#">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span>Audit Trail</span>
</a>
</nav>
<div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
<a className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg font-inter text-sm font-medium tracking-wide" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span>Support</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 text-error hover:bg-error-container/20 rounded-lg font-inter text-sm font-medium tracking-wide" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
<span>Logout</span>
</a>
</div>
</aside>

<main className="ml-64 flex-1 flex flex-col min-h-screen relative">

<header className="w-full sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 shadow-sm dark:shadow-none">
<div className="flex items-center gap-4">
<h2 className="font-manrope text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Global System Administration</h2>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center bg-surface-container rounded-lg px-3 py-1.5 gap-2">
<span className="material-symbols-outlined text-outline text-sm" data-icon="search">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm font-inter w-64 p-0" placeholder="Search system logs..." type="text" />
</div>
<div className="flex items-center gap-2">
<button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined text-slate-600" data-icon="notifications">notifications</span>
</button>
<button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span className="material-symbols-outlined text-slate-600" data-icon="settings">settings</span>
</button>
<div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
<div className="flex items-center gap-3">
<div className="text-right hidden sm:block">
<p className="text-xs font-bold text-slate-900">Admin_Shield_01</p>
<p className="text-[10px] text-slate-500 uppercase tracking-wider">Super Administrator</p>
</div>
<img className="w-10 h-10 rounded-lg object-cover border border-outline-variant/30" data-alt="Close up portrait of a serious professional male administrator in a clean office setting with soft natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEEkzI80XGQclIvP7Hj6uARooaxQZ2M30Vy8jqjRAcc-XElKk-fDL0je6ErzdvEvdItC7d1lczxErOZqlqi0-W7tpaK4wQ8j7IVyOoonA8YQhUbT5nY89VHPM_WDynbR7NYIh8HKWyCnRZiZTUDNY5IFQNtF00PROzDYIAA92vOsl7oDeHQsQ2LbPMjgDEN5681SNlQR5IgRTXr3kWGkLVihySgB9UD9hmiUzwpbd4vRwHf18GK5TpnbMsy0eqNro8EQ6LyGEyRm58" />
</div>
</div>
</div>
<div className="bg-gradient-to-r from-slate-200/50 to-transparent dark:from-slate-800/50 h-[1px] bottom-0 absolute left-0 right-0"></div>
</header>

<div className="p-8 space-y-8">

<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

<div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
<div className="relative z-10">
<p className="text-xs font-semibold text-on-secondary-container uppercase tracking-widest mb-2">Total Active Users</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-manrope font-bold text-primary">12,402</h3>
<span className="text-xs font-bold text-emerald-600 flex items-center">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                                +5%
                            </span>
</div>
<p className="text-[10px] text-outline mt-1">vs. previous month period</p>
</div>
<div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-8xl" data-icon="group">group</span>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
<div className="relative z-10">
<p className="text-xs font-semibold text-on-secondary-container uppercase tracking-widest mb-2">System Health</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-manrope font-bold text-primary">99.9%</h3>
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-tighter">Operational</span>
</div>
<p className="text-[10px] text-outline mt-1">All 14 global nodes active</p>
</div>
<div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-8xl" data-icon="dns">dns</span>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
<div className="relative z-10">
<p className="text-xs font-semibold text-on-secondary-container uppercase tracking-widest mb-2">Pending Investigations</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-manrope font-bold text-primary">142</h3>
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container uppercase tracking-tighter">High Priority</span>
</div>
<p className="text-[10px] text-outline mt-1">Requires analyst review</p>
</div>
<div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-8xl" data-icon="emergency_home">emergency_home</span>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
<div className="relative z-10">
<p className="text-xs font-semibold text-on-secondary-container uppercase tracking-widest mb-2">Fraud Prevention Rate</p>
<div className="flex items-baseline gap-2">
<h3 className="text-3xl font-manrope font-bold text-primary">88.4%</h3>
<span className="text-xs font-bold text-primary-container">AI Score</span>
</div>
<p className="text-[10px] text-outline mt-1">Refined by Sentinel Engine</p>
</div>
<div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
<span className="material-symbols-outlined text-8xl" data-icon="verified_user">verified_user</span>
</div>
</div>
</section>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-0 overflow-hidden shadow-sm border border-outline-variant/10">
<div className="p-6 flex justify-between items-center bg-surface-container-low/50">
<div>
<h4 className="font-manrope font-bold text-lg text-slate-900">User Management Registry</h4>
<p className="text-sm text-outline">Manage administrative and analyst access levels</p>
</div>
<button className="px-4 py-2 signature-gradient text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined text-sm" data-icon="person_add">person_add</span>
                            Provision User
                        </button>
</div>
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 border-b border-outline-variant/20">
<th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Name</th>
<th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</th>
<th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
<th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Login</th>
<th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-6 py-4 flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed">JD</div>
<span className="text-sm font-medium text-slate-900">Julian Draxler</span>
</td>
<td className="px-6 py-4">
<span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">Admin</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="text-xs text-slate-600">Active</span>
</div>
</td>
<td className="px-6 py-4 text-xs text-slate-500">2 mins ago</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:underline text-xs font-bold">Manage</button>
</td>
</tr>
<tr className="bg-slate-50/30 hover:bg-slate-50/50 transition-colors">
<td className="px-6 py-4 flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">SK</div>
<span className="text-sm font-medium text-slate-900">Sarah Kovic</span>
</td>
<td className="px-6 py-4">
<span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">Analyst</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
<span className="text-xs text-slate-600">Active</span>
</div>
</td>
<td className="px-6 py-4 text-xs text-slate-500">14 hours ago</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:underline text-xs font-bold">Manage</button>
</td>
</tr>
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-6 py-4 flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold text-on-tertiary-fixed">MR</div>
<span className="text-sm font-medium text-slate-900">Marcus Rossi</span>
</td>
<td className="px-6 py-4">
<span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">Viewer</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-1.5">
<span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
<span className="text-xs text-slate-600">Suspended</span>
</div>
</td>
<td className="px-6 py-4 text-xs text-slate-500">3 days ago</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:underline text-xs font-bold">Manage</button>
</td>
</tr>
</tbody>
</table>
<div className="p-4 border-t border-outline-variant/10 flex justify-center">
<button className="text-xs font-bold text-on-secondary-container hover:text-primary transition-colors flex items-center gap-2">
                            View all users <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>

<div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
<div className="bg-surface-container-low rounded-xl p-6 flex-1 shadow-sm border border-outline-variant/10">
<div className="flex items-center justify-between mb-6">
<h4 className="font-manrope font-bold text-lg text-slate-900">System Activity</h4>
<span className="material-symbols-outlined text-slate-400" data-icon="refresh">refresh</span>
</div>
<div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">

<div className="relative pl-8">
<div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center border-4 border-surface-container-low z-10">
<span className="material-symbols-outlined text-[10px] text-white" data-icon="settings">settings</span>
</div>
<p className="text-sm font-medium text-slate-900">Risk thresholds updated</p>
<p className="text-xs text-slate-500">User <span className="font-bold text-slate-700">Admin_JD</span> changed core sensitivity from 0.75 to 0.82</p>
<p className="text-[10px] text-outline mt-1 font-bold uppercase tracking-tighter">12 minutes ago</p>
</div>

<div className="relative pl-8">
<div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-surface-container-low z-10">
<span className="material-symbols-outlined text-[10px] text-white" data-icon="restart_alt">restart_alt</span>
</div>
<p className="text-sm font-medium text-slate-900">System Node Restarted</p>
<p className="text-xs text-slate-500">Auto-recovery completed for <span className="font-bold text-slate-700">Node_EU_West</span> after latency spike</p>
<p className="text-[10px] text-outline mt-1 font-bold uppercase tracking-tighter">45 minutes ago</p>
</div>

<div className="relative pl-8">
<div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-error flex items-center justify-center border-4 border-surface-container-low z-10">
<span className="material-symbols-outlined text-[10px] text-white" data-icon="lock">lock</span>
</div>
<p className="text-sm font-medium text-slate-900">Access Revoked</p>
<p className="text-xs text-slate-500">Admin account <span className="font-bold text-slate-700">Marcus Rossi</span> suspended due to inactivity</p>
<p className="text-[10px] text-outline mt-1 font-bold uppercase tracking-tighter">2 hours ago</p>
</div>
</div>
<button className="w-full mt-6 py-2 border border-outline-variant/20 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-colors">
                            Full Audit History
                        </button>
</div>
</div>

<div className="col-span-12 lg:col-span-7 bg-primary-container rounded-xl overflow-hidden relative min-h-[400px]">
<div className="absolute inset-0 opacity-40 mix-blend-overlay">
<img className="w-full h-full object-cover" data-alt="High-contrast stylized digital world map with glowing connection lines on a dark background showing data flow" data-location="Global" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdSqaTi_A3R52eorcxQa_rghdc-LWPfLSYyK84vQcWClC4tNQgGfCB1LYUDpsTmDl9i3_q3v4C9cNkgnWnF15rRflKZkMiM5Xd0GOCgbqe7-Mp4w_O4fSbOE9JnGn7AmeK4yBvPZB3vZc_1Zl-w8-RlMfoV3_rBq4_YP846RqINoeCXDLw1MGgtb6gN0MAIXMSpHFiUWnbZBLuyh6-K8iaFBOqkpiyt-OnSjSiYpV-ojkWbVP-NoTkYTWNVlbV62J1FcHBXp0eLBQ4" />
</div>
<div className="relative z-10 p-8 flex flex-col h-full justify-between">
<div>
<div className="flex items-center gap-2 mb-2">
<span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<h4 className="font-manrope font-bold text-xl text-white">Live Global Attack Vectors</h4>
</div>
<p className="text-slate-400 text-sm max-w-md">Real-time monitoring of adversarial AI and brute-force attempts targeting internal infrastructure.</p>
</div>
<div className="grid grid-cols-3 gap-4">
<div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10">
<p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">North America</p>
<p className="text-lg font-bold text-white mt-1">1,204 <span className="text-[10px] text-emerald-400">Stable</span></p>
</div>
<div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10">
<p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Asia-Pacific</p>
<p className="text-lg font-bold text-white mt-1">4,891 <span className="text-[10px] text-error">Elevated</span></p>
</div>
<div className="bg-black/30 backdrop-blur-md p-4 rounded-lg border border-white/10">
<p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Europe</p>
<p className="text-lg font-bold text-white mt-1">842 <span className="text-[10px] text-emerald-400">Stable</span></p>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 flex flex-col justify-between">
<div>
<h4 className="font-manrope font-bold text-lg text-slate-900 mb-2">Infrastructure Performance</h4>
<p className="text-sm text-outline mb-6">Network latency &amp; system load across primary clusters</p>
<div className="space-y-6">

<div>
<div className="flex justify-between items-end mb-2">
<span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">API Latency</span>
<span className="text-lg font-manrope font-bold text-primary">24ms</span>
</div>
<div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary-container rounded-full" style={{"width":"24%"}}></div>
</div>
</div>

<div>
<div className="flex justify-between items-end mb-2">
<span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Server Load</span>
<span className="text-lg font-manrope font-bold text-primary">42%</span>
</div>
<div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary-container rounded-full" style={{"width":"42%"}}></div>
</div>
</div>

<div>
<div className="flex justify-between items-end mb-2">
<span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">DB I/O Capacity</span>
<span className="text-lg font-manrope font-bold text-primary">12%</span>
</div>
<div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary-container rounded-full" style={{"width":"12%"}}></div>
</div>
</div>
</div>
</div>
<div className="mt-8 pt-6 border-t border-outline-variant/10">
<div className="flex items-center gap-4">
<div className="flex-1">
<p className="text-[10px] text-outline font-bold uppercase">Uptime Score</p>
<p className="text-sm font-bold text-emerald-600">Optimal (99.98%)</p>
</div>
<button className="px-4 py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container-highest transition-colors">
                                Detailed Metrics
                            </button>
</div>
</div>
</div>
</div>
</div>

<footer className="mt-auto p-8 bg-slate-100/50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
<div className="flex items-center gap-6">
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">FraudShield Sentinel Core v4.2.0</span>
<div className="flex gap-4">
<a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Documentation</a>
<a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">API Reference</a>
<a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Compliance Hub</a>
</div>
</div>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-500"></span>
<span className="text-xs font-bold text-slate-600">Secure Environment Encrypted</span>
</div>
</footer>
</main>

<button className="fixed bottom-8 right-8 w-14 h-14 rounded-xl signature-gradient text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50">
<span className="material-symbols-outlined text-2xl" data-icon="support_agent">support_agent</span>
</button>

    </div>
  );
}

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNetwork } from '../context/NetworkContext';
import { exportDashboardPDF, exportRowsToCSV } from '../lib/exportUtils';

export function TrafficProfilePage() {
  const { snapshot, assets, alerts, isDemoMode, selectedProtocol, setSelectedProtocol } = useNetwork();
  const [searchParams] = useSearchParams();
  const activeProto = searchParams.get('protocol') ?? selectedProtocol;

  const topTalkers = useMemo(
    () => [...assets].sort((a, b) => b.throughputMbps - a.throughputMbps).slice(0, 6),
    [assets],
  );

  const totalBandwidthMbps = useMemo(
    () => assets.reduce((sum, a) => sum + a.throughputMbps, 0),
    [assets],
  );

  const handleDownloadCSV = () => {
    exportRowsToCSV(
      'netvision-traffic-profile.csv',
      ['Hour', 'Ingress (Mbps)', 'Egress (Mbps)', 'OT Traffic (Mbps)', 'IT Traffic (Mbps)'],
      snapshot.hourlyProfile.map((h) => [h.hour, h.ingressMbps, h.egressMbps, h.otMbps, h.itMbps]),
    );
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-[#24538F] via-[#275A9B] to-[#2B62A7] pb-6 text-white dark:from-[#12284A] dark:via-[#142D52] dark:to-[#17335D]">
        <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Traffic Profile & Bandwidth</h1>
              <p className="mt-1 text-xs text-blue-100/80">
                {isDemoMode ? 'Demo Data · ' : ''}Hourly ingress/egress throughput, OT vs. IT utilization, and top network talkers
                {activeProto ? ` · Filtered: ${activeProto}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeProto && (
                <button
                  type="button"
                  onClick={() => setSelectedProtocol(null)}
                  className="rounded-lg border border-white/25 bg-white/12 px-3 py-2 text-xs font-medium text-white backdrop-blur-md hover:bg-white/20"
                >
                  Clear {activeProto} Filter
                </button>
              )}
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/12 px-3 py-2 text-xs font-medium text-white backdrop-blur-md hover:bg-white/20"
              >
                <Download className="h-3.5 w-3.5" /> CSV Report
              </button>
              <button
                type="button"
                onClick={() => exportDashboardPDF(snapshot, alerts, isDemoMode)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#13B6C2] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0fa2ad]"
              >
                <FileText className="h-3.5 w-3.5" /> PDF Summary
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Aggregate Throughput</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{(totalBandwidthMbps / 1000).toFixed(2)} Gbps</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Total Flows ({snapshot.timeRange})</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{snapshot.flows.total.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">IT Protocol Share</p>
              <p className="mt-1 text-xl font-bold text-cyan-200 tabular-nums">{snapshot.protocols.itPct.toFixed(1)}%</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">OT Protocol Share</p>
              <p className="mt-1 text-xl font-bold text-blue-100 tabular-nums">{snapshot.protocols.otPct.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Hourly Ingress vs Egress */}
          <section className="glass-card rounded-2xl p-5 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-[#253246] dark:text-white">
              Incoming vs. Outgoing Traffic (Mbps)
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snapshot.hourlyProfile} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ingressFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#24538F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#24538F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="egressFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#13B6C2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#13B6C2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="ingressMbps" name="Incoming (Ingress)" stroke="#24538F" strokeWidth={2} fill="url(#ingressFill)" />
                  <Area type="monotone" dataKey="egressMbps" name="Outgoing (Egress)" stroke="#13B6C2" strokeWidth={2} fill="url(#egressFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* OT vs IT Traffic */}
          <section className="glass-card rounded-2xl p-5 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-[#253246] dark:text-white">
              IT vs. OT Bandwidth Split by Hour
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={snapshot.hourlyProfile} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="itMbps" name="IT Traffic (Mbps)" fill="#3A70AC" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="otMbps" name="OT Traffic (Mbps)" fill="#13B6C2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Top Network Talkers */}
        <section className="glass-card rounded-2xl p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-[#253246] dark:text-white">
            Top Bandwidth Consumers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 font-semibold">Hostname</th>
                  <th className="py-2.5 font-semibold">IP Address</th>
                  <th className="py-2.5 font-semibold">Zone</th>
                  <th className="py-2.5 font-semibold">Type</th>
                  <th className="py-2.5 text-right font-semibold">Bandwidth</th>
                  <th className="py-2.5 text-right font-semibold">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topTalkers.map((device) => {
                  const share = (device.throughputMbps / Math.max(totalBandwidthMbps, 1)) * 100;
                  return (
                    <tr key={device.id}>
                      <td className="py-3 font-semibold text-[#253246] dark:text-slate-100">{device.hostname}</td>
                      <td className="py-3 font-mono-data text-slate-600 dark:text-slate-300">{device.ipAddress}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{device.zone}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{device.deviceType}</td>
                      <td className="py-3 text-right font-semibold tabular-nums">{device.throughputMbps.toFixed(1)} Mbps</td>
                      <td className="py-3 text-right tabular-nums">{share.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

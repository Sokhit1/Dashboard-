import { useMemo, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNetwork } from '../context/NetworkContext';

export function BaselinePage() {
  const { snapshot, isDemoMode } = useNetwork();
  const [tolerancePct, setTolerancePct] = useState<number>(15);

  const chartData = useMemo(
    () =>
      snapshot.baseline.map((pt) => ({
        ...pt,
        upperBand: Math.round(pt.baselineMbps * (1 + tolerancePct / 100)),
        lowerBand: Math.round(pt.baselineMbps * (1 - tolerancePct / 100)),
      })),
    [snapshot.baseline, tolerancePct],
  );

  const deviations = useMemo(
    () => chartData.filter((pt) => Math.abs(pt.deviationPct) >= tolerancePct),
    [chartData, tolerancePct],
  );

  const avgBaseline = Math.round(
    chartData.reduce((acc, item) => acc + item.baselineMbps, 0) / Math.max(chartData.length, 1),
  );
  const peakObserved = Math.max(...chartData.map((d) => d.observedMbps));

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-[#24538F] via-[#275A9B] to-[#2B62A7] pb-6 text-white dark:from-[#12284A] dark:via-[#142D52] dark:to-[#17335D]">
        <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Network Baseline & Deviations</h1>
              <p className="mt-1 text-xs text-blue-100/80">
                {isDemoMode ? 'Demo Data · ' : ''}Historical throughput envelope comparison for {snapshot.timeRange.toUpperCase()} window
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-100">Deviation Threshold:</span>
              <div className="inline-flex rounded-lg border border-white/25 bg-white/12 p-0.5 text-xs backdrop-blur-md">
                {[10, 15, 25].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTolerancePct(pct)}
                    className={`rounded-md px-2.5 py-1 font-medium tabular-nums transition-colors ${
                      tolerancePct === pct ? 'bg-white text-[#24538F]' : 'text-blue-100 hover:text-white'
                    }`}
                  >
                    ±{pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Expected Mean Baseline</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{avgBaseline.toLocaleString()} Mbps</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Peak Observed Throughput</p>
              <p className="mt-1 text-xl font-bold text-cyan-200 tabular-nums">{peakObserved.toLocaleString()} Mbps</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Intervals Exceeding ±{tolerancePct}%</p>
              <p className="mt-1 text-xl font-bold text-amber-200 tabular-nums">{deviations.length}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Baseline Comparison Chart */}
        <section className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#253246] dark:text-white">
              Observed Traffic vs. Normal Baseline Envelope
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Shaded band indicates ±{tolerancePct}% normal operating threshold around historical mean
            </p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="slot" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} unit=" Mbps" />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="upperBand"
                  name={`Upper Threshold (+${tolerancePct}%)`}
                  stroke="none"
                  fill="#3A70AC"
                  fillOpacity={0.12}
                />
                <Line
                  type="monotone"
                  dataKey="baselineMbps"
                  name="Baseline Mean"
                  stroke="#64748B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="observedMbps"
                  name="Observed Traffic"
                  stroke="#13B6C2"
                  strokeWidth={2.5}
                  dot={{ r: 3.5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Deviation Table */}
        <section className="glass-card rounded-2xl p-5 sm:p-6">
          <h2 className="mb-3 text-base font-semibold text-[#253246] dark:text-white">
            Interval Deviation Log
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 font-semibold">Time Interval</th>
                  <th className="py-2.5 text-right font-semibold">Baseline (Mbps)</th>
                  <th className="py-2.5 text-right font-semibold">Observed (Mbps)</th>
                  <th className="py-2.5 text-right font-semibold">Deviation</th>
                  <th className="py-2.5 font-semibold">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {chartData.map((row) => {
                  const isAlert = Math.abs(row.deviationPct) >= tolerancePct;
                  return (
                    <tr key={row.slot}>
                      <td className="py-2.5 font-mono-data font-medium text-[#253246] dark:text-slate-200">{row.slot}</td>
                      <td className="py-2.5 text-right tabular-nums">{row.baselineMbps.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-semibold tabular-nums">{row.observedMbps.toLocaleString()}</td>
                      <td
                        className={`py-2.5 text-right font-semibold tabular-nums ${
                          isAlert ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {row.deviationPct >= 0 ? '+' : ''}
                        {row.deviationPct}%
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                            isAlert
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {isAlert ? 'Threshold Exceeded' : 'Within Baseline'}
                        </span>
                      </td>
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Download, Filter, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNetwork } from '../context/NetworkContext';
import { exportRowsToCSV } from '../lib/exportUtils';

export function ProtocolDistributionChart() {
  const { snapshot, selectedProtocol, setSelectedProtocol } = useNetwork();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { protocols } = snapshot;

  const otItems = protocols.details.filter((d) => d.category === 'OT');
  const itItems = protocols.details.filter((d) => d.category === 'IT');
  const otherItems = protocols.details.filter((d) => d.category === 'Other');

  const handleBarClick = (protocolName: string) => {
    setSelectedProtocol(selectedProtocol === protocolName ? null : protocolName);
  };

  const handleExport = () => {
    exportRowsToCSV(
      `netvision-protocols-${snapshot.timeRange}.csv`,
      ['Category', 'Protocol', 'Transport', 'Sessions', 'Share (%)', 'Trend (%)'],
      protocols.details.map((p) => [
        p.category,
        p.name,
        p.transport,
        p.sessions,
        p.percentage.toFixed(2),
        p.trendPct.toFixed(2),
      ]),
    );
  };

  return (
    <>
      <section className="glass-card flex flex-col rounded-2xl p-5 sm:p-6">
        {/* Header Row */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-[#253246] dark:text-slate-100">
              Protocol Distribution
            </h2>
            {selectedProtocol && (
              <button
                type="button"
                onClick={() => setSelectedProtocol(null)}
                className="inline-flex items-center gap-1 rounded-md bg-[#24538F]/10 px-2 py-0.5 text-xs font-medium text-[#24538F] hover:bg-[#24538F]/20 dark:bg-sky-900/40 dark:text-sky-300"
              >
                <Filter className="h-3 w-3" />
                {selectedProtocol}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleExport}
            title="Export protocol distribution CSV"
            aria-label="Export protocol distribution CSV"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-[#24538F] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Main Content Split */}
        <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-12">
          {/* Left OT / IT / Other Summary Panel */}
          <div className="glass-panel-tint flex flex-col justify-between rounded-xl p-4 sm:p-5 md:col-span-5">
            <div className="space-y-4">
              {/* OT Protocols */}
              <div className="grid grid-cols-12 items-start gap-2 border-b border-slate-200/70 pb-3 dark:border-slate-700/70">
                <div className="col-span-5">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">OT Protocols</p>
                  <p className="mt-1 text-xl font-bold text-[#253246] tabular-nums dark:text-white">
                    {protocols.otPct.toFixed(1)}%
                  </p>
                </div>
                <div className="col-span-7 space-y-1 text-[11px]">
                  {otItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="truncate">{item.name}</span>
                      <span className="font-semibold text-[#253246] tabular-nums dark:text-slate-100">
                        {item.sessions.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IT Protocols */}
              <div className="grid grid-cols-12 items-start gap-2 border-b border-slate-200/70 pb-3 dark:border-slate-700/70">
                <div className="col-span-5">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">IT Protocols</p>
                  <p className="mt-1 text-xl font-bold text-[#253246] tabular-nums dark:text-white">
                    {protocols.itPct.toFixed(1)}%
                  </p>
                </div>
                <div className="col-span-7 space-y-1 text-[11px]">
                  {itItems.slice(0, 4).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="truncate">{item.name}</span>
                      <span className="font-semibold text-[#253246] tabular-nums dark:text-slate-100">
                        {item.sessions.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Protocols */}
              <div className="grid grid-cols-12 items-start gap-2">
                <div className="col-span-5">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Other Protocols</p>
                  <p className="mt-1 text-xl font-bold text-[#253246] tabular-nums dark:text-white">
                    {protocols.otherPct.toFixed(1)}%
                  </p>
                </div>
                <div className="col-span-7 space-y-1 text-[11px]">
                  {otherItems.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="truncate">{item.name}</span>
                      <span className="font-semibold text-[#253246] tabular-nums dark:text-slate-100">
                        {item.sessions.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#24538F] transition-colors hover:text-[#1a3e6d] dark:text-[#38BDF8] dark:hover:text-sky-300"
              >
                <span>View More</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              {selectedProtocol && (
                <button
                  type="button"
                  onClick={() => navigate(`/traffic?protocol=${encodeURIComponent(selectedProtocol)}`)}
                  className="text-[11px] font-medium text-[#13B6C2] hover:underline"
                >
                  Open Profile →
                </button>
              )}
            </div>
          </div>

          {/* Right Vertical Bar Chart */}
          <div className="flex flex-col justify-between md:col-span-7">
            <div className="h-60 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={protocols.bars} margin={{ top: 14, right: 8, left: -16, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="protocol"
                    tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${Math.round((v / Math.max(snapshot.flows.total, 1)) * 100)}%`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(36, 83, 143, 0.06)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0].payload as (typeof protocols.bars)[number];
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-800">
                          <p className="font-semibold text-[#253246] dark:text-white">{item.protocol}</p>
                          <p className="mt-0.5 text-slate-600 tabular-nums dark:text-slate-300">
                            {item.sessions.toLocaleString()} sessions ({item.percentage.toFixed(1)}%)
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">Click bar to filter</p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="sessions"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                    className="cursor-pointer"
                  >
                    {protocols.bars.map((entry) => {
                      const dimmed = selectedProtocol && selectedProtocol !== entry.protocol;
                      return (
                        <Cell
                          key={entry.protocol}
                          fill={entry.color}
                          fillOpacity={dimmed ? 0.3 : 1}
                          onClick={() => handleBarClick(entry.protocol)}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
              Session Distribution Details · Click a protocol bar to filter
            </p>
          </div>
        </div>
      </section>

      {/* Protocol Detail Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Full Protocol Telemetry Breakdown"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
            >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-[#253246] dark:text-white">
                  Full Protocol Breakdown ({snapshot.timeRange.toUpperCase()})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total {snapshot.flows.total.toLocaleString()} analyzed sessions across OT, IT, and Other layers
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="py-2 font-medium">Protocol</th>
                    <th className="py-2 font-medium">Domain</th>
                    <th className="py-2 font-medium">Transport</th>
                    <th className="py-2 text-right font-medium">Sessions</th>
                    <th className="py-2 text-right font-medium">Share</th>
                    <th className="py-2 text-right font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {protocols.details.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-semibold text-[#253246] dark:text-slate-100">{row.name}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{row.category}</td>
                      <td className="py-2.5 font-mono-data text-slate-500 dark:text-slate-400">{row.transport}</td>
                      <td className="py-2.5 text-right font-medium tabular-nums">
                        {row.sessions.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">{row.percentage.toFixed(1)}%</td>
                      <td
                        className={`py-2.5 text-right font-semibold tabular-nums ${
                          row.trendPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {row.trendPct >= 0 ? '+' : ''}
                        {row.trendPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

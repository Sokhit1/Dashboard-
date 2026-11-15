import { useMemo, useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNetwork } from '../context/NetworkContext';
import { exportRowsToCSV } from '../lib/exportUtils';

type FlowKey = 'unicast' | 'broadcast' | 'multicast';

export function TrafficDistributionChart() {
  const { snapshot } = useNetwork();
  const [viewMode, setViewMode] = useState<'rings' | 'trend'>('rings');
  const [activeCategories, setActiveCategories] = useState<Record<FlowKey, boolean>>({
    unicast: true,
    broadcast: true,
    multicast: true,
  });
  const [hoveredRing, setHoveredRing] = useState<FlowKey | null>(null);

  const { flows } = snapshot;

  const categories = useMemo(
    () => [
      {
        key: 'unicast' as FlowKey,
        label: 'Unicast Flows',
        count: flows.unicast,
        pct: Math.round((flows.unicast / Math.max(flows.total, 1)) * 100),
        color: '#24538F',
        radius: 82,
      },
      {
        key: 'broadcast' as FlowKey,
        label: 'Broadcast Flows',
        count: flows.broadcast,
        pct: Math.round((flows.broadcast / Math.max(flows.total, 1)) * 100),
        color: '#13B6C2',
        radius: 64,
      },
      {
        key: 'multicast' as FlowKey,
        label: 'Multicast Flows',
        count: flows.multicast,
        pct: Math.round((flows.multicast / Math.max(flows.total, 1)) * 100),
        color: '#253246',
        radius: 46,
      },
    ],
    [flows],
  );

  const toggleCategory = (key: FlowKey) => {
    setActiveCategories((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.unicast && !next.broadcast && !next.multicast) {
        return prev; // Keep at least one selected
      }
      return next;
    });
  };

  const handleExport = () => {
    exportRowsToCSV(
      `netvision-traffic-flows-${snapshot.timeRange}.csv`,
      ['Time', 'Unicast Flows', 'Broadcast Flows', 'Multicast Flows', 'Total Flows'],
      flows.series.map((pt) => [pt.time, pt.unicast, pt.broadcast, pt.multicast, pt.total]),
    );
  };

  const hoveredItem = hoveredRing ? categories.find((c) => c.key === hoveredRing) : null;

  return (
    <section className="glass-card flex flex-col rounded-2xl p-5 sm:p-6">
      {/* Header Row */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-[#253246] dark:text-slate-100">
          Network Traffic Distribution
        </h2>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('rings')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                viewMode === 'rings'
                  ? 'bg-white text-[#24538F] shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Rings
            </button>
            <button
              type="button"
              onClick={() => setViewMode('trend')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                viewMode === 'trend'
                  ? 'bg-white text-[#24538F] shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Trend
            </button>
          </div>
          <button
            type="button"
            onClick={handleExport}
            title="Export traffic distribution CSV"
            aria-label="Export traffic distribution CSV"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-[#24538F] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid flex-1 grid-cols-1 gap-5 md:grid-cols-12">
        {/* Left Tinted Summary Box (matching screenshot with frosted tint) */}
        <div className="glass-panel-tint flex flex-col justify-between rounded-xl p-4 sm:p-5 md:col-span-5">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Network Flows</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[#253246] tabular-nums dark:text-white">
              {flows.total.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {snapshot.periodStart} to {snapshot.periodEnd}
            </p>
          </div>

          {/* Sparkline + Change Badge */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-14 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flows.series} margin={{ top: 4, right: 4, left: 4, bottom: 2 }}>
                  <defs>
                    <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#13B6C2" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#13B6C2" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#13B6C2"
                    strokeWidth={2}
                    fill="url(#sparkFill)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded bg-[#13B6C2]/15 px-2 py-1 text-[11px] font-semibold text-[#0e8d97] tabular-nums dark:bg-[#13B6C2]/25 dark:text-cyan-300">
              <TrendingUp className="h-3 w-3" />+{flows.changePct}%
            </span>
          </div>

          {/* Selectable Flow Category Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {categories.map((cat) => {
              const isActive = activeCategories[cat.key];
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => toggleCategory(cat.key)}
                  onMouseEnter={() => setHoveredRing(cat.key)}
                  onMouseLeave={() => setHoveredRing(null)}
                  className={`rounded-lg p-1.5 text-left transition-all ${
                    isActive
                      ? 'hover:bg-white/80 dark:hover:bg-slate-700/60'
                      : 'opacity-45 hover:opacity-75'
                  }`}
                >
                  <p className="text-base font-bold text-[#253246] tabular-nums dark:text-slate-100">
                    {cat.count.toLocaleString()}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span
                      className="inline-block h-2 w-2 rounded-xs"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Visualization Area */}
        <div className="flex flex-col justify-center md:col-span-7">
          {viewMode === 'rings' ? (
            <div className="relative flex flex-col items-center justify-center">
              {/* Interactive Multi-Ring Concentric Chart */}
              <div className="relative flex items-center justify-center">
                <svg
                  viewBox="0 0 220 220"
                  className="h-60 w-60 select-none sm:h-64 sm:w-64"
                  role="img"
                  aria-label="Multi-ring traffic flow distribution chart"
                >
                  {categories.map((cat) => {
                    const isEnabled = activeCategories[cat.key];
                    const circumference = 2 * Math.PI * cat.radius;
                    // Reference screenshot shows dramatic multi-ring arcs starting from 12 o'clock
                    const visualShare = isEnabled ? Math.max(cat.pct, 10) / 100 : 0;
                    const dashLength = circumference * visualShare * 0.88;
                    const isHovered = hoveredRing === cat.key;

                    return (
                      <g key={cat.key}>
                        {/* Background track */}
                        <circle
                          cx="110"
                          cy="110"
                          r={cat.radius}
                          fill="none"
                          stroke="currentColor"
                          className="text-slate-100 dark:text-slate-800"
                          strokeWidth="13"
                        />
                        {/* Animated Active Arc */}
                        <motion.circle
                          cx="110"
                          cy="110"
                          r={cat.radius}
                          fill="none"
                          stroke={cat.color}
                          strokeWidth={isHovered ? 15 : 13}
                          strokeLinecap="round"
                          strokeDasharray={`${dashLength} ${circumference}`}
                          transform="rotate(-90 110 110)"
                          initial={{ strokeDasharray: `0 ${circumference}` }}
                          animate={{
                            strokeDasharray: `${dashLength} ${circumference}`,
                            opacity: isEnabled ? (hoveredRing && !isHovered ? 0.55 : 1) : 0.15,
                          }}
                          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                          className="cursor-pointer transition-opacity"
                          onMouseEnter={() => setHoveredRing(cat.key)}
                          onMouseLeave={() => setHoveredRing(null)}
                          onClick={() => toggleCategory(cat.key)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Center Label & Hover Readout */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  {hoveredItem ? (
                    <>
                      <span className="text-lg font-bold text-[#253246] tabular-nums dark:text-white">
                        {hoveredItem.count.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {hoveredItem.label} ({hoveredItem.pct}%)
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-slate-400 dark:text-slate-500">
                      Flows
                    </span>
                  )}
                </div>
              </div>

              {/* Selectable Legend Strip */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                {categories.map((cat) => {
                  const isActive = activeCategories[cat.key];
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => toggleCategory(cat.key)}
                      onMouseEnter={() => setHoveredRing(cat.key)}
                      onMouseLeave={() => setHoveredRing(null)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                        isActive
                          ? 'border-slate-200 bg-slate-50 text-[#253246] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                          : 'border-transparent bg-transparent text-slate-400 line-through'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-xs"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.label.replace(' Flows', '')}</span>
                      <span className="font-semibold tabular-nums">{cat.pct}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flows.series} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="unicastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#24538F" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#24538F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="broadcastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#13B6C2" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#13B6C2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  {activeCategories.unicast && (
                    <Area
                      type="monotone"
                      dataKey="unicast"
                      name="Unicast Flows"
                      stroke="#24538F"
                      strokeWidth={2}
                      fill="url(#unicastGrad)"
                    />
                  )}
                  {activeCategories.broadcast && (
                    <Area
                      type="monotone"
                      dataKey="broadcast"
                      name="Broadcast Flows"
                      stroke="#13B6C2"
                      strokeWidth={2}
                      fill="url(#broadcastGrad)"
                    />
                  )}
                  {activeCategories.multicast && (
                    <Area
                      type="monotone"
                      dataKey="multicast"
                      name="Multicast Flows"
                      stroke="#253246"
                      strokeWidth={2}
                      fillOpacity={0}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

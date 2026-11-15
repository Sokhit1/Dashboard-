import { useState, useRef, useEffect } from 'react';
import { Clock, Download, FileSpreadsheet, FileText, Pause, Play, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNetwork } from '../context/NetworkContext';
import { exportDashboardCSV, exportDashboardPDF } from '../lib/exportUtils';
import type { RefreshInterval, TimeRange } from '../types/network';

const TIME_OPTIONS: Array<{ value: TimeRange; label: string }> = [
  { value: '1h', label: 'Last 1 Hour' },
  { value: '4h', label: 'Last 4 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];

const REFRESH_OPTIONS: Array<{ value: RefreshInterval; label: string }> = [
  { value: 'off', label: 'Off' },
  { value: '10s', label: '10s' },
  { value: '30s', label: '30s' },
  { value: '60s', label: '60s' },
];

export function DateRangeFilter() {
  const {
    timeRange,
    setTimeRange,
    refreshInterval,
    setRefreshInterval,
    isSimulationPaused,
    toggleSimulationPaused,
    manualRefresh,
    isRefreshing,
    snapshot,
    alerts,
    isDemoMode,
  } = useNetwork();

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Date & Time Range Selector */}
      <label className="relative inline-flex items-center">
        <Clock className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-blue-100" />
        <select
          aria-label="Select date and time range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="h-9 cursor-pointer appearance-none rounded-lg border border-white/25 bg-white/12 pr-7 pl-8 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#24538F] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 text-[10px] text-blue-100">▾</span>
      </label>

      {/* Auto-Refresh Interval Selector + Pause/Resume + Manual Refresh */}
      <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-white/25 bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md">
        <button
          type="button"
          onClick={manualRefresh}
          title="Manual refresh"
          aria-label="Refresh telemetry now"
          className="flex h-full items-center justify-center border-r border-white/20 px-2.5 text-blue-100 transition-colors hover:bg-white/20 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <select
          aria-label="Auto-refresh interval"
          value={refreshInterval}
          onChange={(e) => setRefreshInterval(e.target.value as RefreshInterval)}
          className="h-full cursor-pointer appearance-none bg-transparent px-2.5 text-xs font-medium text-white focus:outline-none"
        >
          {REFRESH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#24538F] text-white">
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={toggleSimulationPaused}
          title={isSimulationPaused ? 'Resume live simulation' : 'Pause live simulation'}
          aria-label={isSimulationPaused ? 'Resume live simulation' : 'Pause live simulation'}
          className="flex h-full items-center gap-1 border-l border-white/20 px-2.5 text-xs font-medium text-blue-100 transition-colors hover:bg-white/20 hover:text-white"
        >
          {isSimulationPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          <span className="hidden sm:inline">{isSimulationPaused ? 'Paused' : 'Live'}</span>
        </button>
      </div>

      {/* Export Report Menu */}
      <div className="relative" ref={exportRef}>
        <button
          type="button"
          onClick={() => setExportMenuOpen((prev) => !prev)}
          aria-label="Export dashboard report"
          title="Export dashboard report"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/25 bg-white/12 px-3 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Export</span>
        </button>

        <AnimatePresence>
          {exportMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-2xl border border-white/60 bg-white/90 p-1.5 text-[#253246] shadow-2xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-100"
            >
              <button
                type="button"
                onClick={() => {
                  exportDashboardCSV(snapshot);
                  setExportMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#24538F] dark:text-[#38BDF8]" />
                Export CSV Report
              </button>
              <button
                type="button"
                onClick={() => {
                  exportDashboardPDF(snapshot, alerts, isDemoMode);
                  setExportMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              >
                <FileText className="h-3.5 w-3.5 text-[#13B6C2]" />
                Export PDF Summary
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Check, CheckCircle2, Download, Search, ShieldAlert } from 'lucide-react';
import { exportAlertsCSV } from '../lib/exportUtils';
import type { AlertSeverity, AlertStatus, NetworkAlert } from '../types/network';

interface AlertsPanelProps {
  alerts: NetworkAlert[];
  onUpdateStatus: (id: string, status: AlertStatus) => Promise<void>;
  initialCategory?: string;
}

export function AlertsPanel({ alerts, onUpdateStatus, initialCategory = 'all' }: AlertsPanelProps) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AlertStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [selectedId, setSelectedId] = useState<string>(alerts[0]?.id ?? '');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(alerts.map((a) => a.category)))],
    [alerts],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alerts.filter((a) => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.hostname.toLowerCase().includes(q) ||
        a.sourceIp.toLowerCase().includes(q) ||
        a.protocol.toLowerCase().includes(q)
      );
    });
  }, [alerts, search, severityFilter, statusFilter, categoryFilter]);

  const selectedAlert = filtered.find((a) => a.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Alerts Table / List */}
      <div className="glass-card overflow-hidden rounded-2xl lg:col-span-8">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-slate-800">
          <div className="relative flex-1 sm:min-w-[200px] sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts, IP, protocol..."
              aria-label="Search network alerts"
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-xs text-[#253246] focus:border-[#24538F] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as 'all' | AlertSeverity)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#253246] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              aria-label="Filter by alert status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | AlertStatus)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#253246] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#253246] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => exportAlertsCSV(filtered)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#24538F] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500 dark:text-slate-400">
              No network alerts match the selected filters.
            </div>
          ) : (
            filtered.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedId(alert.id)}
                  className={`flex cursor-pointer flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isSelected
                      ? 'bg-[#F2F6FB] dark:bg-slate-800/80'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        alert.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : alert.severity === 'high'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : alert.severity === 'medium'
                              ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#253246] dark:text-white">{alert.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {alert.hostname} ({alert.sourceIp}) · {alert.protocol} · {alert.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-11 sm:pl-0">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold capitalize ${
                        alert.severity === 'critical'
                          ? 'bg-rose-600 text-white'
                          : alert.severity === 'high'
                            ? 'bg-amber-500 text-white'
                            : alert.severity === 'medium'
                              ? 'bg-[#3A70AC] text-white'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${
                        alert.status === 'open'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                          : alert.status === 'acknowledged'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Incident Details & Workflow Actions */}
      <aside className="glass-card rounded-2xl p-5 lg:col-span-4">
        {selectedAlert ? (
          <div className="flex h-full flex-col justify-between gap-5">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-[#13B6C2] uppercase">Incident Details</p>
                <h3 className="mt-1 text-base font-semibold text-[#253246] dark:text-white">
                  {selectedAlert.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="space-y-2.5 rounded-xl bg-[#F2F6FB] p-4 text-xs dark:bg-slate-800/60">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Source Host</span>
                  <span className="font-semibold text-[#253246] dark:text-white">{selectedAlert.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Source IP</span>
                  <span className="font-mono-data font-medium text-[#253246] dark:text-white">{selectedAlert.sourceIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Protocol</span>
                  <span className="font-medium text-[#253246] dark:text-white">{selectedAlert.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Detected At</span>
                  <span className="font-mono-data text-[#253246] dark:text-white">{selectedAlert.detectedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Current State</span>
                  <span className="font-semibold capitalize text-[#24538F] dark:text-sky-300">
                    {selectedAlert.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                disabled={selectedAlert.status !== 'open'}
                onClick={() => void onUpdateStatus(selectedAlert.id, 'acknowledged')}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#24538F] bg-white px-3 py-2 text-xs font-semibold text-[#24538F] transition-colors hover:bg-[#24538F]/5 disabled:opacity-40 dark:border-sky-500 dark:bg-slate-800 dark:text-sky-300"
              >
                <Check className="h-3.5 w-3.5" />
                Acknowledge
              </button>
              <button
                type="button"
                disabled={selectedAlert.status === 'resolved'}
                onClick={() => void onUpdateStatus(selectedAlert.id, 'resolved')}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#24538F] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1b4070] disabled:opacity-40"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Resolve
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Select an alert to inspect incident details and actions.</p>
        )}
      </aside>
    </div>
  );
}

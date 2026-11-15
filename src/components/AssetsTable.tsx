import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Server,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { getHardwareImageForType } from '../lib/assetImages';
import { exportAssetsCSV } from '../lib/exportUtils';
import type { AssetStatus, NetworkAsset } from '../types/network';

interface AssetsTableProps {
  assets: NetworkAsset[];
}

type SortField = 'hostname' | 'ipAddress' | 'deviceType' | 'status' | 'throughputMbps' | 'lastSeen';

export function AssetsTable({ assets }: AssetsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AssetStatus>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('hostname');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<NetworkAsset | null>(null);

  const pageSize = 7;

  const deviceTypes = useMemo(() => ['all', ...Array.from(new Set(assets.map((a) => a.deviceType)))], [assets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets
      .filter((a) => {
        if (statusFilter !== 'all' && a.status !== statusFilter) return false;
        if (typeFilter !== 'all' && a.deviceType !== typeFilter) return false;
        if (!q) return true;
        return (
          a.hostname.toLowerCase().includes(q) ||
          a.ipAddress.toLowerCase().includes(q) ||
          a.macAddress.toLowerCase().includes(q) ||
          a.vendor.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [assets, search, statusFilter, typeFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <>
      <div className="glass-card overflow-hidden rounded-2xl">
        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-slate-800">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search IP, hostname, MAC, vendor..."
              aria-label="Search network assets"
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-xs text-[#253246] placeholder:text-slate-400 focus:border-[#24538F] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | AssetStatus);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#253246] focus:border-[#24538F] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="degraded">Degraded</option>
              <option value="offline">Offline</option>
            </select>

            <select
              aria-label="Filter by device type"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#253246] focus:border-[#24538F] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {deviceTypes.map((dt) => (
                <option key={dt} value={dt}>
                  {dt === 'all' ? 'All Device Types' : dt}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => exportAssetsCSV(filtered)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#24538F] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <button type="button" onClick={() => toggleSort('hostname')} className="inline-flex items-center gap-1 hover:text-[#24538F]">
                    Hostname <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <button type="button" onClick={() => toggleSort('ipAddress')} className="inline-flex items-center gap-1 hover:text-[#24538F]">
                    IP Address <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <button type="button" onClick={() => toggleSort('deviceType')} className="inline-flex items-center gap-1 hover:text-[#24538F]">
                    Device Type <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">MAC Address</th>
                <th className="px-4 py-3 font-semibold">
                  <button type="button" onClick={() => toggleSort('status')} className="inline-flex items-center gap-1 hover:text-[#24538F]">
                    Status <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  <button type="button" onClick={() => toggleSort('throughputMbps')} className="inline-flex items-center gap-1 hover:text-[#24538F]">
                    Throughput <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <button type="button" onClick={() => toggleSort('lastSeen')} className="inline-flex items-center gap-1 hover:text-[#24538F]">
                    Last Seen <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                    No network assets match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="cursor-pointer transition-colors hover:bg-[#F2F6FB]/70 dark:hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-3 font-semibold text-[#253246] dark:text-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={getHardwareImageForType(asset.deviceType)}
                          alt={asset.deviceType}
                          referrerPolicy="no-referrer"
                          className="h-9 w-12 shrink-0 rounded-md border border-slate-200/80 object-cover dark:border-slate-700"
                        />
                        <div>
                          <div>{asset.hostname}</div>
                          <div className="text-[11px] font-normal text-slate-400">{asset.vendor} · {asset.zone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono-data text-slate-700 dark:text-slate-300">{asset.ipAddress}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{asset.deviceType}</td>
                    <td className="px-4 py-3 font-mono-data text-slate-500 dark:text-slate-400">{asset.macAddress}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold capitalize ${
                          asset.status === 'online'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : asset.status === 'degraded'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-slate-700 dark:text-slate-200">
                      {asset.throughputMbps.toFixed(1)} Mbps
                    </td>
                    <td className="px-4 py-3 font-mono-data text-slate-500 dark:text-slate-400">{asset.lastSeen}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span className="tabular-nums">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} assets
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <span className="px-2 font-medium tabular-nums">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Asset Detail Slide-Over Drawer */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedAsset(null)}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#24538F]/10 text-[#24538F] dark:bg-sky-900/40 dark:text-sky-300">
                    <Server className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#253246] dark:text-white">{selectedAsset.hostname}</h3>
                    <p className="font-mono-data text-xs text-slate-500 dark:text-slate-400">{selectedAsset.ipAddress}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAsset(null)}
                  aria-label="Close asset drawer"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs">
                <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                  <img
                    src={getHardwareImageForType(selectedAsset.deviceType)}
                    alt={`${selectedAsset.vendor} ${selectedAsset.deviceType}`}
                    referrerPolicy="no-referrer"
                    className="h-44 w-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F2F6FB] p-4 dark:bg-slate-800/60">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Status</p>
                  <p className="mt-1 font-semibold capitalize text-[#253246] dark:text-white">{selectedAsset.status}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Network Zone</p>
                  <p className="mt-1 font-semibold text-[#253246] dark:text-white">{selectedAsset.zone}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Throughput</p>
                  <p className="mt-1 font-semibold tabular-nums text-[#253246] dark:text-white">
                    {selectedAsset.throughputMbps.toFixed(1)} Mbps
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Packet Loss</p>
                  <p className="mt-1 font-semibold tabular-nums text-[#253246] dark:text-white">
                    {selectedAsset.packetLossPct.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Device Type</span>
                  <span className="font-medium text-[#253246] dark:text-slate-200">{selectedAsset.deviceType}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Hardware Vendor</span>
                  <span className="font-medium text-[#253246] dark:text-slate-200">{selectedAsset.vendor}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">MAC Address</span>
                  <span className="font-mono-data font-medium text-[#253246] dark:text-slate-200">{selectedAsset.macAddress}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Subnet CIDR</span>
                  <span className="font-mono-data font-medium text-[#253246] dark:text-slate-200">{selectedAsset.subnet}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Observed Latency</span>
                  <span className="font-medium tabular-nums text-[#253246] dark:text-slate-200">{selectedAsset.latencyMs} ms</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Last Telemetry Seen</span>
                  <span className="font-mono-data font-medium text-[#253246] dark:text-slate-200">{selectedAsset.lastSeen}</span>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

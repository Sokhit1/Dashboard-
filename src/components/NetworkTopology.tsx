import React, { useMemo, useState } from 'react';
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'motion/react';
import { getHardwareImageForType } from '../lib/assetImages';
import type { AssetStatus, NetworkAsset, NetworkConnection } from '../types/network';

interface NetworkTopologyProps {
  assets: NetworkAsset[];
  connections: NetworkConnection[];
}

export function NetworkTopology({ assets, connections }: NetworkTopologyProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });
  const [statusFilter, setStatusFilter] = useState<'all' | AssetStatus>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(assets[0]?.id ?? '');

  const assetMap = useMemo(() => new Map(assets.map((a) => [a.id, a])), [assets]);

  const visibleAssets = useMemo(
    () => (statusFilter === 'all' ? assets : assets.filter((a) => a.status === statusFilter)),
    [assets, statusFilter],
  );
  const visibleIds = useMemo(() => new Set(visibleAssets.map((a) => a.id)), [visibleAssets]);

  const visibleConnections = useMemo(
    () => connections.filter((c) => visibleIds.has(c.sourceId) && visibleIds.has(c.targetId)),
    [connections, visibleIds],
  );

  const selectedNode = assetMap.get(selectedNodeId) ?? visibleAssets[0] ?? null;
  const nodeConnections = useMemo(() => {
    if (!selectedNode) return [];
    return connections.filter((c) => c.sourceId === selectedNode.id || c.targetId === selectedNode.id);
  }, [connections, selectedNode]);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as HTMLElement).closest('[data-node="true"]')) return;
    setIsDragging(true);
    setDragOrigin({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragOrigin.x, y: e.clientY - dragOrigin.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Interactive Topology Canvas */}
      <div className="glass-card relative overflow-hidden rounded-2xl lg:col-span-8">
        {/* Canvas Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs dark:bg-slate-800">
            {(['all', 'online', 'degraded', 'offline'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-2.5 py-1 font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-white text-[#24538F] shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
              aria-label="Zoom in topology"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
              aria-label="Zoom out topology"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={resetViewport}
              aria-label="Reset topology zoom"
              className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>

        {/* SVG Graph Viewport */}
        <div className="relative h-[460px] w-full bg-[#F8FAFC] dark:bg-[#0E1729]">
          <svg
            viewBox="0 0 840 480"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`h-full w-full select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {/* Subtle dot grid */}
            <defs>
              <pattern id="topoGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#CBD5E1" opacity="0.45" />
              </pattern>
            </defs>
            <rect width="840" height="480" fill="url(#topoGrid)" />

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Connection Links */}
              {visibleConnections.map((conn) => {
                const src = assetMap.get(conn.sourceId);
                const tgt = assetMap.get(conn.targetId);
                if (!src || !tgt) return null;

                const isHighlighted =
                  selectedNode && (conn.sourceId === selectedNode.id || conn.targetId === selectedNode.id);

                const strokeColor =
                  conn.status === 'dropped'
                    ? '#DC2626'
                    : conn.status === 'congested'
                      ? '#D97706'
                      : isHighlighted
                        ? '#13B6C2'
                        : '#94A3B8';

                return (
                  <g key={conn.id}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={strokeColor}
                      strokeWidth={isHighlighted ? 2.8 : 1.6}
                      strokeDasharray={conn.status === 'dropped' ? '5 4' : undefined}
                      strokeOpacity={isHighlighted ? 0.95 : 0.55}
                    />
                    {isHighlighted && (
                      <text
                        x={(src.x + tgt.x) / 2}
                        y={(src.y + tgt.y) / 2 - 6}
                        textAnchor="middle"
                        className="fill-slate-600 text-[10px] font-semibold dark:fill-slate-300"
                      >
                        {conn.protocol} · {conn.bandwidthMbps} Mbps
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Asset Nodes */}
              {visibleAssets.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const fill =
                  node.status === 'online'
                    ? '#24538F'
                    : node.status === 'degraded'
                      ? '#D97706'
                      : '#DC2626';

                return (
                  <g
                    key={node.id}
                    data-node="true"
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle r="27" fill="none" stroke="#13B6C2" strokeWidth="2.5" strokeOpacity="0.85" />
                    )}
                    <circle
                      r="20"
                      fill={fill}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <text
                      y="4"
                      textAnchor="middle"
                      className="fill-white text-[10px] font-bold"
                    >
                      {node.deviceType.slice(0, 3).toUpperCase()}
                    </text>
                    <text
                      y="34"
                      textAnchor="middle"
                      className="fill-[#253246] text-[10px] font-semibold dark:fill-slate-200"
                    >
                      {node.hostname.split('.')[0]}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] text-slate-600 backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#24538F]" /> Online
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Degraded
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-600" /> Offline
            </span>
            <span className="hidden items-center gap-1 text-slate-400 sm:inline-flex">
              <Maximize2 className="h-3 w-3" /> Drag background to pan · Zoom {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Node Inspector Panel */}
      <aside className="glass-card flex flex-col rounded-2xl p-5 lg:col-span-4">
        {selectedNode ? (
          <>
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#253246] dark:text-white">{selectedNode.hostname}</h3>
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-semibold capitalize ${
                    selectedNode.status === 'online'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : selectedNode.status === 'degraded'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>
              <p className="mt-1 font-mono-data text-xs text-slate-500 dark:text-slate-400">
                {selectedNode.ipAddress} · {selectedNode.deviceType} · {selectedNode.zone}
              </p>
            </div>

            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800"
            >
              <img
                src={getHardwareImageForType(selectedNode.deviceType)}
                alt={`${selectedNode.vendor} ${selectedNode.deviceType}`}
                referrerPolicy="no-referrer"
                className="h-32 w-full object-cover"
              />
            </motion.div>

            <div className="my-4 grid grid-cols-3 gap-2 rounded-xl bg-[#F2F6FB] p-3 text-center dark:bg-slate-800/60">
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Throughput</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-[#253246] dark:text-white">
                  {selectedNode.throughputMbps.toFixed(0)} Mbps
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Latency</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-[#253246] dark:text-white">
                  {selectedNode.latencyMs} ms
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Loss</p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-[#253246] dark:text-white">
                  {selectedNode.packetLossPct}%
                </p>
              </div>
            </div>

            <h4 className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              Peer Links ({nodeConnections.length})
            </h4>
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {nodeConnections.map((conn) => {
                const peerId = conn.sourceId === selectedNode.id ? conn.targetId : conn.sourceId;
                const peer = assetMap.get(peerId);
                return (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => peer && setSelectedNodeId(peer.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-100 p-2.5 text-left text-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                  >
                    <div>
                      <p className="font-semibold text-[#253246] dark:text-slate-100">
                        {peer?.hostname ?? peerId}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {conn.protocol} (Port {conn.port})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium tabular-nums text-[#24538F] dark:text-sky-300">
                        {conn.bandwidthMbps} Mbps
                      </p>
                      <p
                        className={`text-[11px] capitalize ${
                          conn.status === 'active'
                            ? 'text-emerald-600'
                            : conn.status === 'congested'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                        }`}
                      >
                        {conn.status}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-500">Select a node on the topology map to inspect connections.</p>
        )}
      </aside>
    </div>
  );
}

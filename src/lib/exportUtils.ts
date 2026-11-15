import { jsPDF } from 'jspdf';
import type { NetworkAlert, NetworkAsset, NetworkSnapshot } from '../types/network';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRowsToCSV(filename: string, headers: string[], rows: Array<Array<string | number>>) {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

export function exportDashboardCSV(snapshot: NetworkSnapshot) {
  const headers = ['Section', 'Metric', 'Value', 'Change / Share', 'Time Range'];
  const rows: Array<Array<string | number>> = [
    ['KPI', 'Assets Discovered', snapshot.kpis.assetsDiscovered, `${snapshot.kpis.assetsChangePct}%`, snapshot.timeRange],
    ['KPI', 'Network Connections', snapshot.kpis.networkConnections, `${snapshot.kpis.connectionsChangePct}%`, snapshot.timeRange],
    ['KPI', 'Anomalies Detected', snapshot.kpis.anomaliesDetected, `${snapshot.kpis.anomaliesChangePct}%`, snapshot.timeRange],
    ['KPI', 'Network Errors', snapshot.kpis.networkErrors, `${snapshot.kpis.errorsChangePct}%`, snapshot.timeRange],
    ['Traffic Flow', 'Total Network Flows', snapshot.flows.total, `${snapshot.flows.changePct}%`, snapshot.timeRange],
    ['Traffic Flow', 'Unicast Flows', snapshot.flows.unicast, `${Math.round((snapshot.flows.unicast / snapshot.flows.total) * 100)}%`, snapshot.timeRange],
    ['Traffic Flow', 'Broadcast Flows', snapshot.flows.broadcast, `${Math.round((snapshot.flows.broadcast / snapshot.flows.total) * 100)}%`, snapshot.timeRange],
    ['Traffic Flow', 'Multicast Flows', snapshot.flows.multicast, `${Math.round((snapshot.flows.multicast / snapshot.flows.total) * 100)}%`, snapshot.timeRange],
    ...snapshot.protocols.details.map((p) => [
      `Protocol (${p.category})`,
      p.name,
      p.sessions,
      `${p.percentage.toFixed(2)}%`,
      snapshot.timeRange,
    ]),
    ...snapshot.health.map((h) => ['Health', h.title, `${h.percentage}%`, h.status, snapshot.timeRange]),
  ];

  exportRowsToCSV(`netvision-dashboard-${snapshot.timeRange}.csv`, headers, rows);
}

export function exportAssetsCSV(assets: NetworkAsset[]) {
  const headers = [
    'Hostname',
    'IP Address',
    'MAC Address',
    'Device Type',
    'Vendor',
    'Zone',
    'Status',
    'Throughput (Mbps)',
    'Packet Loss (%)',
    'Latency (ms)',
    'Last Seen',
  ];

  const rows = assets.map((a) => [
    a.hostname,
    a.ipAddress,
    a.macAddress,
    a.deviceType,
    a.vendor,
    a.zone,
    a.status,
    a.throughputMbps.toFixed(2),
    a.packetLossPct.toFixed(2),
    a.latencyMs.toFixed(1),
    a.lastSeen,
  ]);

  exportRowsToCSV('netvision-network-assets.csv', headers, rows);
}

export function exportAlertsCSV(alerts: NetworkAlert[]) {
  const headers = ['ID', 'Title', 'Severity', 'Status', 'Category', 'Source IP', 'Hostname', 'Protocol', 'Detected At'];
  const rows = alerts.map((a) => [
    a.id,
    a.title,
    a.severity,
    a.status,
    a.category,
    a.sourceIp,
    a.hostname,
    a.protocol,
    a.detectedAt,
  ]);
  exportRowsToCSV('netvision-network-alerts.csv', headers, rows);
}

export function exportDashboardPDF(snapshot: NetworkSnapshot, alerts: NetworkAlert[], isDemoMode: boolean) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(36, 83, 143); // #24538F
  doc.rect(0, 0, pageWidth, 88, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Repsort Analytics — NetVision Report', 40, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Window: ${snapshot.timeRange.toUpperCase()} (${snapshot.periodStart} to ${snapshot.periodEnd})  |  Source: ${
      isDemoMode ? 'Demo Data (Synthetic Telemetry)' : 'Supabase Live'
    }`,
    40,
    58,
  );
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 74);

  let y = 118;

  // KPI Summary
  doc.setTextColor(37, 50, 70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('1. Key Performance Summary', 40, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const kpiLines = [
    `Assets Discovered: ${snapshot.kpis.assetsDiscovered.toLocaleString()} (${snapshot.kpis.assetsChangePct >= 0 ? '+' : ''}${snapshot.kpis.assetsChangePct}%)`,
    `Network Connections: ${snapshot.kpis.networkConnections.toLocaleString()} (${snapshot.kpis.connectionsChangePct >= 0 ? '+' : ''}${snapshot.kpis.connectionsChangePct}%)`,
    `Anomalies Detected: ${snapshot.kpis.anomaliesDetected.toLocaleString()} (${snapshot.kpis.anomaliesChangePct >= 0 ? '+' : ''}${snapshot.kpis.anomaliesChangePct}%)`,
    `Network Errors: ${snapshot.kpis.networkErrors.toLocaleString()} (${snapshot.kpis.errorsChangePct >= 0 ? '+' : ''}${snapshot.kpis.errorsChangePct}%)`,
  ];
  kpiLines.forEach((line) => {
    doc.text(line, 52, y);
    y += 16;
  });

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('2. Network Traffic Distribution', 40, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Total Network Flows: ${snapshot.flows.total.toLocaleString()} (${snapshot.flows.changePct >= 0 ? '+' : ''}${snapshot.flows.changePct}%)`, 52, y);
  y += 16;
  doc.text(
    `Unicast: ${snapshot.flows.unicast.toLocaleString()} (${Math.round((snapshot.flows.unicast / snapshot.flows.total) * 100)}%)   |   Broadcast: ${snapshot.flows.broadcast.toLocaleString()} (${Math.round((snapshot.flows.broadcast / snapshot.flows.total) * 100)}%)   |   Multicast: ${snapshot.flows.multicast.toLocaleString()} (${Math.round((snapshot.flows.multicast / snapshot.flows.total) * 100)}%)`,
    52,
    y,
  );

  y += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('3. Protocol Distribution (OT / IT / Other)', 40, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `OT Protocols: ${snapshot.protocols.otTotal.toLocaleString()} (${snapshot.protocols.otPct.toFixed(1)}%)   |   IT Protocols: ${snapshot.protocols.itTotal.toLocaleString()} (${snapshot.protocols.itPct.toFixed(1)}%)   |   Other Protocols: ${snapshot.protocols.otherTotal.toLocaleString()} (${snapshot.protocols.otherPct.toFixed(1)}%)`,
    52,
    y,
  );
  y += 18;
  snapshot.protocols.bars.forEach((bar) => {
    doc.text(`${bar.protocol}: ${bar.sessions.toLocaleString()} sessions (${bar.percentage.toFixed(1)}%)`, 52, y);
    y += 14;
  });

  y += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('4. Network Health Indicators', 40, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  snapshot.health.forEach((h) => {
    doc.text(`${h.title}: ${h.percentage}% (${h.status}) — Trend: ${h.trendPct >= 0 ? '+' : ''}${h.trendPct}%`, 52, y);
    y += 16;
  });

  y += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('5. Active Network Alerts (Top 5)', 40, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  alerts.slice(0, 5).forEach((alert) => {
    doc.text(
      `[${alert.severity.toUpperCase()} / ${alert.status}] ${alert.title} — ${alert.sourceIp} (${alert.protocol})`,
      52,
      y,
    );
    y += 15;
  });

  doc.save(`netvision-report-${snapshot.timeRange}.pdf`);
}

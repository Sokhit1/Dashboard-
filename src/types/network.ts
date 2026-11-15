export type TimeRange = '1h' | '4h' | '24h' | '7d' | '30d';
export type RefreshInterval = 'off' | '10s' | '30s' | '60s';
export type ThemeMode = 'light' | 'dark';

export type AssetStatus = 'online' | 'degraded' | 'offline';
export type AssetDeviceType =
  | 'Router'
  | 'Switch'
  | 'Firewall'
  | 'Server'
  | 'PLC / OT Controller'
  | 'Sensor'
  | 'Workstation'
  | 'Gateway';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'open' | 'acknowledged' | 'resolved';

export interface NetworkAsset {
  id: string;
  hostname: string;
  ipAddress: string;
  macAddress: string;
  deviceType: AssetDeviceType;
  vendor: string;
  subnet: string;
  zone: 'Core' | 'DMZ' | 'OT-Plant' | 'Corporate' | 'Edge';
  status: AssetStatus;
  throughputMbps: number;
  packetLossPct: number;
  latencyMs: number;
  lastSeen: string;
  x: number;
  y: number;
}

export interface NetworkConnection {
  id: string;
  sourceId: string;
  targetId: string;
  protocol: string;
  port: number;
  bandwidthMbps: number;
  latencyMs: number;
  status: 'active' | 'congested' | 'dropped';
}

export interface TrafficFlowPoint {
  time: string;
  unicast: number;
  broadcast: number;
  multicast: number;
  total: number;
  baseline: number;
}

export interface ProtocolDetailItem {
  name: string;
  category: 'OT' | 'IT' | 'Other';
  transport: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'Other';
  sessions: number;
  percentage: number;
  trendPct: number;
}

export interface TransportBarItem {
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'Other';
  sessions: number;
  percentage: number;
  color: string;
}

export interface HealthMetric {
  id: 'availability' | 'reliability' | 'security';
  title: string;
  percentage: number;
  status: 'Good' | 'Fair' | 'Poor';
  color: string;
  startLabel: string;
  endLabel: string;
  trendPct: number;
  summary: string;
  factors: { label: string; value: string; state: 'nominal' | 'warning' | 'critical' }[];
}

export interface NetworkAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  category: 'Anomaly' | 'Security' | 'Latency' | 'Packet Loss' | 'OT Protocol';
  sourceIp: string;
  hostname: string;
  protocol: string;
  detectedAt: string;
}

export interface BaselineMetricPoint {
  slot: string;
  observedMbps: number;
  baselineMbps: number;
  upperBoundMbps: number;
  lowerBoundMbps: number;
  deviationPct: number;
}

export interface HourlyTrafficPoint {
  hour: string;
  ingressMbps: number;
  egressMbps: number;
  otMbps: number;
  itMbps: number;
}

export interface KPISummary {
  assetsDiscovered: number;
  assetsChangePct: number;
  networkConnections: number;
  connectionsChangePct: number;
  anomaliesDetected: number;
  anomaliesChangePct: number;
  networkErrors: number;
  errorsChangePct: number;
}

export interface NetworkSnapshot {
  timeRange: TimeRange;
  periodStart: string;
  periodEnd: string;
  kpis: KPISummary;
  flows: {
    total: number;
    changePct: number;
    unicast: number;
    broadcast: number;
    multicast: number;
    series: TrafficFlowPoint[];
  };
  protocols: {
    otTotal: number;
    otPct: number;
    itTotal: number;
    itPct: number;
    otherTotal: number;
    otherPct: number;
    details: ProtocolDetailItem[];
    bars: TransportBarItem[];
  };
  health: HealthMetric[];
  baseline: BaselineMetricPoint[];
  hourlyProfile: HourlyTrafficPoint[];
}

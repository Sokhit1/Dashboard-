import type {
  BaselineMetricPoint,
  HourlyTrafficPoint,
  NetworkAlert,
  NetworkAsset,
  NetworkConnection,
  NetworkSnapshot,
  ProtocolDetailItem,
  TimeRange,
  TransportBarItem,
} from '../types/network';

export const DEMO_ASSETS: NetworkAsset[] = [
  {
    id: 'ast-01',
    hostname: 'core-rtr-01.nv.local',
    ipAddress: '10.10.0.1',
    macAddress: '00:1A:2B:3C:4D:01',
    deviceType: 'Router',
    vendor: 'Cisco Systems',
    subnet: '10.10.0.0/24',
    zone: 'Core',
    status: 'online',
    throughputMbps: 4820.5,
    packetLossPct: 0.02,
    latencyMs: 1.8,
    lastSeen: '2026-11-14 21:22:10',
    x: 420,
    y: 190,
  },
  {
    id: 'ast-02',
    hostname: 'dist-sw-04.nv.local',
    ipAddress: '10.10.1.14',
    macAddress: '00:1A:2B:3C:4D:02',
    deviceType: 'Switch',
    vendor: 'Arista Networks',
    subnet: '10.10.1.0/24',
    zone: 'Core',
    status: 'online',
    throughputMbps: 3190.2,
    packetLossPct: 0.04,
    latencyMs: 2.3,
    lastSeen: '2026-11-14 21:22:08',
    x: 240,
    y: 120,
  },
  {
    id: 'ast-03',
    hostname: 'fw-edge-02.nv.local',
    ipAddress: '172.16.0.2',
    macAddress: '00:1A:2B:3C:4D:03',
    deviceType: 'Firewall',
    vendor: 'Palo Alto',
    subnet: '172.16.0.0/24',
    zone: 'DMZ',
    status: 'degraded',
    throughputMbps: 1940.0,
    packetLossPct: 1.45,
    latencyMs: 14.6,
    lastSeen: '2026-11-14 21:21:55',
    x: 610,
    y: 110,
  },
  {
    id: 'ast-04',
    hostname: 'plc-line-a1.ot.local',
    ipAddress: '192.168.50.11',
    macAddress: '00:1A:2B:3C:4D:04',
    deviceType: 'PLC / OT Controller',
    vendor: 'Siemens',
    subnet: '192.168.50.0/24',
    zone: 'OT-Plant',
    status: 'online',
    throughputMbps: 124.8,
    packetLossPct: 0.0,
    latencyMs: 3.1,
    lastSeen: '2026-11-14 21:22:11',
    x: 170,
    y: 320,
  },
  {
    id: 'ast-05',
    hostname: 'app-srv-09.nv.local',
    ipAddress: '10.10.20.42',
    macAddress: '00:1A:2B:3C:4D:05',
    deviceType: 'Server',
    vendor: 'Dell EMC',
    subnet: '10.10.20.0/24',
    zone: 'Corporate',
    status: 'online',
    throughputMbps: 2410.1,
    packetLossPct: 0.08,
    latencyMs: 4.5,
    lastSeen: '2026-11-14 21:22:09',
    x: 590,
    y: 310,
  },
  {
    id: 'ast-06',
    hostname: 'gw-modbus-03.ot.local',
    ipAddress: '192.168.50.25',
    macAddress: '00:1A:2B:3C:4D:06',
    deviceType: 'Gateway',
    vendor: 'Schneider Electric',
    subnet: '192.168.50.0/24',
    zone: 'OT-Plant',
    status: 'offline',
    throughputMbps: 0.0,
    packetLossPct: 100.0,
    latencyMs: 0.0,
    lastSeen: '2026-11-14 20:49:12',
    x: 350,
    y: 380,
  },
  {
    id: 'ast-07',
    hostname: 'dns-auth-01.nv.local',
    ipAddress: '10.10.10.5',
    macAddress: '00:1A:2B:3C:4D:07',
    deviceType: 'Server',
    vendor: 'HPE ProLiant',
    subnet: '10.10.10.0/24',
    zone: 'Core',
    status: 'online',
    throughputMbps: 1185.4,
    packetLossPct: 0.01,
    latencyMs: 1.9,
    lastSeen: '2026-11-14 21:22:12',
    x: 430,
    y: 65,
  },
  {
    id: 'ast-08',
    hostname: 'scada-hmi-02.ot.local',
    ipAddress: '192.168.50.18',
    macAddress: '00:1A:2B:3C:4D:08',
    deviceType: 'Workstation',
    vendor: 'Rockwell Automation',
    subnet: '192.168.50.0/24',
    zone: 'OT-Plant',
    status: 'online',
    throughputMbps: 342.6,
    packetLossPct: 0.05,
    latencyMs: 3.8,
    lastSeen: '2026-11-14 21:22:07',
    x: 110,
    y: 205,
  },
  {
    id: 'ast-09',
    hostname: 'sensor-temp-14.ot.local',
    ipAddress: '192.168.52.104',
    macAddress: '00:1A:2B:3C:4D:09',
    deviceType: 'Sensor',
    vendor: 'Honeywell',
    subnet: '192.168.52.0/24',
    zone: 'Edge',
    status: 'degraded',
    throughputMbps: 18.4,
    packetLossPct: 2.3,
    latencyMs: 28.4,
    lastSeen: '2026-11-14 21:21:44',
    x: 245,
    y: 420,
  },
  {
    id: 'ast-10',
    hostname: 'edge-sw-08.nv.local',
    ipAddress: '10.10.4.22',
    macAddress: '00:1A:2B:3C:4D:0A',
    deviceType: 'Switch',
    vendor: 'Juniper Networks',
    subnet: '10.10.4.0/24',
    zone: 'Corporate',
    status: 'online',
    throughputMbps: 1680.9,
    packetLossPct: 0.03,
    latencyMs: 2.7,
    lastSeen: '2026-11-14 21:22:10',
    x: 720,
    y: 215,
  },
  {
    id: 'ast-11',
    hostname: 'ntp-stratum-01.nv.local',
    ipAddress: '10.10.10.12',
    macAddress: '00:1A:2B:3C:4D:0B',
    deviceType: 'Server',
    vendor: 'Meinberg',
    subnet: '10.10.10.0/24',
    zone: 'Core',
    status: 'online',
    throughputMbps: 245.2,
    packetLossPct: 0.0,
    latencyMs: 1.2,
    lastSeen: '2026-11-14 21:22:11',
    x: 525,
    y: 195,
  },
  {
    id: 'ast-12',
    hostname: 'vpn-gw-01.nv.local',
    ipAddress: '172.16.4.1',
    macAddress: '00:1A:2B:3C:4D:0C',
    deviceType: 'Gateway',
    vendor: 'Fortinet',
    subnet: '172.16.4.0/24',
    zone: 'Edge',
    status: 'online',
    throughputMbps: 980.7,
    packetLossPct: 0.14,
    latencyMs: 9.4,
    lastSeen: '2026-11-14 21:22:06',
    x: 715,
    y: 380,
  },
];

export const DEMO_CONNECTIONS: NetworkConnection[] = [
  { id: 'conn-01', sourceId: 'ast-01', targetId: 'ast-02', protocol: 'TCP', port: 443, bandwidthMbps: 2450, latencyMs: 1.4, status: 'active' },
  { id: 'conn-02', sourceId: 'ast-01', targetId: 'ast-03', protocol: 'HTTPS', port: 443, bandwidthMbps: 1840, latencyMs: 11.2, status: 'congested' },
  { id: 'conn-03', sourceId: 'ast-01', targetId: 'ast-07', protocol: 'DNS', port: 53, bandwidthMbps: 620, latencyMs: 1.1, status: 'active' },
  { id: 'conn-04', sourceId: 'ast-01', targetId: 'ast-11', protocol: 'UDP', port: 123, bandwidthMbps: 140, latencyMs: 0.9, status: 'active' },
  { id: 'conn-05', sourceId: 'ast-02', targetId: 'ast-04', protocol: 'PROFINET', port: 34964, bandwidthMbps: 112, latencyMs: 2.8, status: 'active' },
  { id: 'conn-06', sourceId: 'ast-02', targetId: 'ast-08', protocol: 'TCP', port: 102, bandwidthMbps: 295, latencyMs: 3.2, status: 'active' },
  { id: 'conn-07', sourceId: 'ast-02', targetId: 'ast-06', protocol: 'Modbus TCP', port: 502, bandwidthMbps: 0, latencyMs: 0, status: 'dropped' },
  { id: 'conn-08', sourceId: 'ast-04', targetId: 'ast-09', protocol: 'PROFIBUS', port: 5001, bandwidthMbps: 18, latencyMs: 24.5, status: 'congested' },
  { id: 'conn-09', sourceId: 'ast-01', targetId: 'ast-05', protocol: 'HTTPS', port: 8443, bandwidthMbps: 1920, latencyMs: 3.7, status: 'active' },
  { id: 'conn-10', sourceId: 'ast-03', targetId: 'ast-10', protocol: 'SSH', port: 22, bandwidthMbps: 410, latencyMs: 4.9, status: 'active' },
  { id: 'conn-11', sourceId: 'ast-05', targetId: 'ast-10', protocol: 'HTTP', port: 80, bandwidthMbps: 1180, latencyMs: 2.1, status: 'active' },
  { id: 'conn-12', sourceId: 'ast-10', targetId: 'ast-12', protocol: 'UDP', port: 500, bandwidthMbps: 890, latencyMs: 8.6, status: 'active' },
  { id: 'conn-13', sourceId: 'ast-01', targetId: 'ast-06', protocol: 'ICMP', port: 0, bandwidthMbps: 4, latencyMs: 95.0, status: 'dropped' },
];

export const INITIAL_DEMO_ALERTS: NetworkAlert[] = [
  {
    id: 'alt-101',
    title: 'Broadcast Storm Exceeds Baseline Threshold',
    description: 'Broadcast frames on DMZ firewall interface eth1/2 rose 26.3% above the 4h rolling baseline.',
    severity: 'critical',
    status: 'open',
    category: 'Anomaly',
    sourceIp: '172.16.0.2',
    hostname: 'fw-edge-02.nv.local',
    protocol: 'UDP',
    detectedAt: '2026-11-14 21:18:40',
  },
  {
    id: 'alt-102',
    title: 'OT Modbus Gateway Unreachable',
    description: 'gw-modbus-03 failed 6 consecutive Modbus TCP keepalive checks on port 502.',
    severity: 'high',
    status: 'open',
    category: 'OT Protocol',
    sourceIp: '192.168.50.25',
    hostname: 'gw-modbus-03.ot.local',
    protocol: 'Modbus TCP',
    detectedAt: '2026-11-14 20:49:12',
  },
  {
    id: 'alt-103',
    title: 'Unusual SSH Lateral Scan Activity',
    description: 'Repeated SSH authentication attempts detected across Corporate VLAN 20.',
    severity: 'high',
    status: 'open',
    category: 'Security',
    sourceIp: '10.10.20.42',
    hostname: 'app-srv-09.nv.local',
    protocol: 'SSH',
    detectedAt: '2026-11-14 20:32:05',
  },
  {
    id: 'alt-104',
    title: 'Edge Sensor Packet Loss Spike',
    description: 'Packet loss on sensor-temp-14 reached 2.30%, exceeding 1.0% SLA ceiling.',
    severity: 'medium',
    status: 'acknowledged',
    category: 'Packet Loss',
    sourceIp: '192.168.52.104',
    hostname: 'sensor-temp-14.ot.local',
    protocol: 'PROFIBUS',
    detectedAt: '2026-11-14 19:54:21',
  },
  {
    id: 'alt-105',
    title: 'Elevated DNS NXDOMAIN Response Rate',
    description: 'DNS resolver recorded a 14% uptick in NXDOMAIN lookups from edge subnet.',
    severity: 'medium',
    status: 'open',
    category: 'Security',
    sourceIp: '10.10.10.5',
    hostname: 'dns-auth-01.nv.local',
    protocol: 'DNS',
    detectedAt: '2026-11-14 19:15:09',
  },
  {
    id: 'alt-106',
    title: 'ICMP Diagnostic Echo Burst',
    description: 'Scheduled diagnostics generated brief ICMP latency increase on Core-01 uplink.',
    severity: 'low',
    status: 'resolved',
    category: 'Latency',
    sourceIp: '10.10.0.1',
    hostname: 'core-rtr-01.nv.local',
    protocol: 'ICMP',
    detectedAt: '2026-11-14 18:40:00',
  },
];

const RANGE_MULTIPLIERS: Record<TimeRange, { scale: number; start: string; end: string; labels: string[] }> = {
  '1h': {
    scale: 0.28,
    start: '20:20 PM',
    end: '21:20 PM',
    labels: ['20:20', '20:30', '20:40', '20:50', '21:00', '21:10', '21:20'],
  },
  '4h': {
    scale: 1,
    start: '01:00 AM',
    end: '05:00 AM',
    labels: ['17:30', '18:10', '18:50', '19:30', '20:10', '20:50', '21:20'],
  },
  '24h': {
    scale: 4.8,
    start: '13 Nov 21:20',
    end: '14 Nov 21:20',
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '19:00', '21:20'],
  },
  '7d': {
    scale: 28,
    start: '07 Nov 2026',
    end: '14 Nov 2026',
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  '30d': {
    scale: 112,
    start: '15 Oct 2026',
    end: '14 Nov 2026',
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Current'],
  },
};

export function buildSnapshot(timeRange: TimeRange, tickOffset = 0): NetworkSnapshot {
  const cfg = RANGE_MULTIPLIERS[timeRange];
  const jitter = Math.sin(tickOffset * 0.7) * 0.015;
  const effectiveScale = cfg.scale * (1 + jitter);

  // Keep 4h at tick 0 pinned cleanly to the exact KPI & Flow reference values
  const isDefaultBaseline = timeRange === '4h' && tickOffset === 0;

  const totalFlows = isDefaultBaseline ? 10000 : Math.round(10000 * effectiveScale);
  const unicast = isDefaultBaseline ? 8000 : Math.round(totalFlows * 0.8);
  const broadcast = isDefaultBaseline ? 1200 : Math.round(totalFlows * 0.12);
  const multicast = totalFlows - unicast - broadcast;

  const assetsDiscovered = isDefaultBaseline
    ? 3424
    : Math.round(3424 + (cfg.scale > 1 ? Math.log2(cfg.scale) * 140 : -120) + Math.round(Math.sin(tickOffset) * 6));
  const networkConnections = isDefaultBaseline
    ? 2733
    : Math.round(2733 * (cfg.scale === 1 ? 1 : 0.75 + Math.min(cfg.scale, 10) * 0.09) + Math.round(Math.cos(tickOffset) * 14));
  const anomaliesDetected = isDefaultBaseline
    ? 1041
    : Math.round(1041 * (cfg.scale < 1 ? 0.35 : Math.min(cfg.scale, 16) * 0.65) + (tickOffset % 5));
  const networkErrors = isDefaultBaseline
    ? 1966
    : Math.round(1966 * (cfg.scale < 1 ? 0.3 : Math.min(cfg.scale, 16) * 0.58) + ((tickOffset * 2) % 9));

  // Coherent Protocol Breakdown derived strictly from totalFlows
  const otProfinet = Math.round(totalFlows * 0.056);
  const otProfibus = Math.round(totalFlows * 0.024);
  const otModbus = Math.round(totalFlows * 0.04);
  const otTotal = otProfinet + otProfibus + otModbus;

  const itHttps = Math.round(totalFlows * 0.285);
  const itDns = Math.round(totalFlows * 0.162);
  const itHttp = Math.round(totalFlows * 0.145);
  const itNtp = Math.round(totalFlows * 0.115);
  const itSsh = Math.round(totalFlows * 0.1);
  const itTotal = itHttps + itDns + itHttp + itNtp + itSsh;

  const otherIcmp = Math.round(totalFlows * 0.043);
  const otherArp = Math.round(totalFlows * 0.017);
  const otherMisc = totalFlows - otTotal - itTotal - otherIcmp - otherArp;
  const otherTotal = otherIcmp + otherArp + otherMisc;

  const details: ProtocolDetailItem[] = [
    { name: 'PROFINET', category: 'OT', transport: 'Other', sessions: otProfinet, percentage: (otProfinet / totalFlows) * 100, trendPct: 4.2 },
    { name: 'PROFIBUS', category: 'OT', transport: 'Other', sessions: otProfibus, percentage: (otProfibus / totalFlows) * 100, trendPct: -1.1 },
    { name: 'Modbus TCP', category: 'OT', transport: 'TCP', sessions: otModbus, percentage: (otModbus / totalFlows) * 100, trendPct: 2.5 },
    { name: 'HTTPS', category: 'IT', transport: 'HTTPS', sessions: itHttps, percentage: (itHttps / totalFlows) * 100, trendPct: 8.4 },
    { name: 'DNS', category: 'IT', transport: 'DNS', sessions: itDns, percentage: (itDns / totalFlows) * 100, trendPct: 1.9 },
    { name: 'HTTP', category: 'IT', transport: 'HTTP', sessions: itHttp, percentage: (itHttp / totalFlows) * 100, trendPct: -3.2 },
    { name: 'NTP', category: 'IT', transport: 'UDP', sessions: itNtp, percentage: (itNtp / totalFlows) * 100, trendPct: 0.4 },
    { name: 'SSH', category: 'IT', transport: 'TCP', sessions: itSsh, percentage: (itSsh / totalFlows) * 100, trendPct: 2.1 },
    { name: 'ICMP', category: 'Other', transport: 'ICMP', sessions: otherIcmp, percentage: (otherIcmp / totalFlows) * 100, trendPct: 11.3 },
    { name: 'ARP', category: 'Other', transport: 'Other', sessions: otherArp, percentage: (otherArp / totalFlows) * 100, trendPct: 0.8 },
    { name: 'Other', category: 'Other', transport: 'Other', sessions: otherMisc, percentage: (otherMisc / totalFlows) * 100, trendPct: -0.5 },
  ];

  // Transport Bar Chart aggregated from the exact same dataset
  const tcpSessions = Math.round(totalFlows * 0.34);
  const udpSessions = Math.round(totalFlows * 0.24);
  const httpsSessions = itHttps;
  const httpSessions = itHttp;
  const dnsSessions = Math.round(totalFlows * 0.065);
  const icmpSessions = otherIcmp;
  const otherBarSessions = totalFlows - tcpSessions - udpSessions - httpsSessions - httpSessions - dnsSessions - icmpSessions;

  const bars: TransportBarItem[] = [
    { protocol: 'TCP', sessions: tcpSessions, percentage: (tcpSessions / totalFlows) * 100, color: '#24538F' },
    { protocol: 'UDP', sessions: udpSessions, percentage: (udpSessions / totalFlows) * 100, color: '#13B6C2' },
    { protocol: 'HTTPS', sessions: httpsSessions, percentage: (httpsSessions / totalFlows) * 100, color: '#3A70AC' },
    { protocol: 'HTTP', sessions: httpSessions, percentage: (httpSessions / totalFlows) * 100, color: '#0EA5E9' },
    { protocol: 'DNS', sessions: dnsSessions, percentage: (dnsSessions / totalFlows) * 100, color: '#38BDF8' },
    { protocol: 'ICMP', sessions: icmpSessions, percentage: (icmpSessions / totalFlows) * 100, color: '#253246' },
    { protocol: 'Other', sessions: otherBarSessions, percentage: (otherBarSessions / totalFlows) * 100, color: '#64748B' },
  ];

  // Traffic series points summing coherently
  const weights = [0.11, 0.14, 0.12, 0.16, 0.15, 0.17, 0.15];
  const series = cfg.labels.map((label, idx) => {
    const wave = Math.sin(idx * 1.1 + tickOffset * 0.6) * 0.08;
    const ptTotal = Math.round(totalFlows * weights[idx] * (1 + wave));
    const ptUnicast = Math.round(ptTotal * 0.8);
    const ptBroadcast = Math.round(ptTotal * 0.12);
    const ptMulticast = ptTotal - ptUnicast - ptBroadcast;
    return {
      time: label,
      unicast: ptUnicast,
      broadcast: ptBroadcast,
      multicast: ptMulticast,
      total: ptTotal,
      baseline: Math.round(totalFlows * weights[idx] * 0.94),
    };
  });

  // Health gauges (71%, 41%, 27% at default baseline)
  const availPct = isDefaultBaseline ? 71 : Math.min(99, Math.max(55, Math.round(71 + Math.sin(tickOffset * 0.4) * 3)));
  const relPct = isDefaultBaseline ? 41 : Math.min(95, Math.max(32, Math.round(41 + Math.cos(tickOffset * 0.5) * 3)));
  const secPct = isDefaultBaseline ? 27 : Math.min(85, Math.max(18, Math.round(27 + Math.sin(tickOffset * 0.3) * 2)));

  const health: NetworkSnapshot['health'] = [
    {
      id: 'availability',
      title: 'Network Availability',
      percentage: availPct,
      status: availPct >= 65 ? 'Good' : availPct >= 40 ? 'Fair' : 'Poor',
      color: '#24538F',
      startLabel: `From ${cfg.start}`,
      endLabel: `To ${cfg.end}`,
      trendPct: 2.4,
      summary: '10 of 12 monitored assets online; 1 OT gateway offline.',
      factors: [
        { label: 'Core Router Uptime', value: '99.98%', state: 'nominal' },
        { label: 'OT Gateway Reachability', value: '1 Offline', state: 'warning' },
        { label: 'DMZ Path Redundancy', value: 'Active / Standby', state: 'nominal' },
      ],
    },
    {
      id: 'reliability',
      title: 'Network Reliability',
      percentage: relPct,
      status: relPct >= 70 ? 'Good' : relPct >= 38 ? 'Fair' : 'Poor',
      color: '#13B6C2',
      startLabel: `From ${cfg.start}`,
      endLabel: `To ${cfg.end}`,
      trendPct: -1.8,
      summary: 'Elevated packet retransmissions on Edge Sensor & DMZ firewall.',
      factors: [
        { label: 'Mean Packet Loss', value: '0.42%', state: 'warning' },
        { label: 'TCP Retransmission Rate', value: '3.18%', state: 'warning' },
        { label: 'Jitter Variance', value: '6.4 ms', state: 'nominal' },
      ],
    },
    {
      id: 'security',
      title: 'Network Security',
      percentage: secPct,
      status: secPct >= 70 ? 'Good' : secPct >= 40 ? 'Fair' : 'Poor',
      color: '#253246',
      startLabel: `From ${cfg.start}`,
      endLabel: `To ${cfg.end}`,
      trendPct: -4.2,
      summary: 'Unresolved high-severity anomalies and lateral SSH scan alerts.',
      factors: [
        { label: 'Open Critical/High Alerts', value: '3 Active', state: 'critical' },
        { label: 'Unencrypted OT/HTTP Flows', value: '18.5%', state: 'warning' },
        { label: 'Zero-Trust Policy Coverage', value: '42%', state: 'critical' },
      ],
    },
  ];

  const baseline: BaselineMetricPoint[] = cfg.labels.map((slot, i) => {
    const base = 1850 + Math.sin(i * 0.8) * 320;
    const observed = Math.round(base * (i === 4 ? 1.29 : 0.96 + Math.cos(i + tickOffset) * 0.08));
    return {
      slot,
      baselineMbps: Math.round(base),
      upperBoundMbps: Math.round(base * 1.15),
      lowerBoundMbps: Math.round(base * 0.85),
      observedMbps: observed,
      deviationPct: Number((((observed - base) / base) * 100).toFixed(1)),
    };
  });

  const hourlyProfile: HourlyTrafficPoint[] = [
    { hour: '00:00', ingressMbps: 1120, egressMbps: 980, otMbps: 310, itMbps: 1790 },
    { hour: '03:00', ingressMbps: 940, egressMbps: 810, otMbps: 305, itMbps: 1445 },
    { hour: '06:00', ingressMbps: 1380, egressMbps: 1190, otMbps: 380, itMbps: 2190 },
    { hour: '09:00', ingressMbps: 2640, egressMbps: 2120, otMbps: 490, itMbps: 4270 },
    { hour: '12:00', ingressMbps: 3120, egressMbps: 2790, otMbps: 520, itMbps: 5390 },
    { hour: '15:00', ingressMbps: 2980, egressMbps: 2610, otMbps: 505, itMbps: 5085 },
    { hour: '18:00', ingressMbps: 2340, egressMbps: 1990, otMbps: 430, itMbps: 3900 },
    { hour: '21:00', ingressMbps: 1860 + Math.round(Math.sin(tickOffset) * 90), egressMbps: 1620, otMbps: 390, itMbps: 3090 },
  ];

  return {
    timeRange,
    periodStart: cfg.start,
    periodEnd: cfg.end,
    kpis: {
      assetsDiscovered,
      assetsChangePct: 16,
      networkConnections,
      connectionsChangePct: 3,
      anomaliesDetected,
      anomaliesChangePct: 11,
      networkErrors,
      errorsChangePct: 1,
    },
    flows: {
      total: totalFlows,
      changePct: 16,
      unicast,
      broadcast,
      multicast,
      series,
    },
    protocols: {
      otTotal,
      otPct: Number(((otTotal / totalFlows) * 100).toFixed(2)),
      itTotal,
      itPct: Number(((itTotal / totalFlows) * 100).toFixed(2)),
      otherTotal,
      otherPct: Number(((otherTotal / totalFlows) * 100).toFixed(2)),
      details,
      bars,
    },
    health,
    baseline,
    hourlyProfile,
  };
}

-- =============================================================================
-- Repsort Analytics — NetVision Network Monitoring Schema
-- Compatible with PostgreSQL 15+ / Supabase
-- =============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. user_profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'engineer', 'analyst', 'viewer')),
  department TEXT DEFAULT 'Network Operations',
  avatar_url TEXT,
  preferred_theme TEXT NOT NULL DEFAULT 'light' CHECK (preferred_theme IN ('light', 'dark')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles (email);

-- -----------------------------------------------------------------------------
-- 2. network_assets
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostname TEXT NOT NULL,
  ip_address INET NOT NULL UNIQUE,
  mac_address MACADDR NOT NULL,
  device_type TEXT NOT NULL CHECK (
    device_type IN ('Router', 'Switch', 'Firewall', 'Server', 'PLC / OT Controller', 'Sensor', 'Workstation', 'Gateway')
  ),
  vendor TEXT NOT NULL,
  subnet TEXT NOT NULL,
  zone TEXT NOT NULL CHECK (zone IN ('Core', 'DMZ', 'OT-Plant', 'Corporate', 'Edge')),
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'degraded', 'offline')),
  throughput_mbps NUMERIC(10, 2) NOT NULL DEFAULT 0,
  packet_loss_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_network_assets_status ON public.network_assets (status);
CREATE INDEX IF NOT EXISTS idx_network_assets_zone ON public.network_assets (zone);
CREATE INDEX IF NOT EXISTS idx_network_assets_last_seen ON public.network_assets (last_seen DESC);

-- -----------------------------------------------------------------------------
-- 3. network_connections
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_asset_id UUID NOT NULL REFERENCES public.network_assets (id) ON DELETE CASCADE,
  target_asset_id UUID NOT NULL REFERENCES public.network_assets (id) ON DELETE CASCADE,
  protocol TEXT NOT NULL,
  port INTEGER NOT NULL CHECK (port BETWEEN 0 AND 65535),
  bandwidth_mbps NUMERIC(10, 2) NOT NULL DEFAULT 0,
  latency_ms NUMERIC(8, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'congested', 'dropped')),
  last_observed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_distinct_endpoints CHECK (source_asset_id <> target_asset_id)
);

CREATE INDEX IF NOT EXISTS idx_network_connections_source ON public.network_connections (source_asset_id);
CREATE INDEX IF NOT EXISTS idx_network_connections_target ON public.network_connections (target_asset_id);
CREATE INDEX IF NOT EXISTS idx_network_connections_status ON public.network_connections (status);

-- -----------------------------------------------------------------------------
-- 4. traffic_flows
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.traffic_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  window_label TEXT NOT NULL DEFAULT '4h',
  flow_type TEXT NOT NULL CHECK (flow_type IN ('Unicast', 'Broadcast', 'Multicast')),
  flow_count INTEGER NOT NULL CHECK (flow_count >= 0),
  bytes_transferred BIGINT NOT NULL DEFAULT 0,
  ingress_mbps NUMERIC(10, 2) NOT NULL DEFAULT 0,
  egress_mbps NUMERIC(10, 2) NOT NULL DEFAULT 0,
  baseline_expected_flows INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_traffic_flows_recorded_at ON public.traffic_flows (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_flows_type ON public.traffic_flows (flow_type);

-- -----------------------------------------------------------------------------
-- 5. protocol_statistics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.protocol_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  category TEXT NOT NULL CHECK (category IN ('OT', 'IT', 'Other')),
  protocol_name TEXT NOT NULL,
  transport TEXT NOT NULL CHECK (transport IN ('TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'Other')),
  session_count INTEGER NOT NULL CHECK (session_count >= 0),
  percentage NUMERIC(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  trend_pct NUMERIC(5, 2) NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_protocol_stats_recorded_at ON public.protocol_statistics (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_protocol_stats_category ON public.protocol_statistics (category);

-- -----------------------------------------------------------------------------
-- 6. network_metrics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  time_window TEXT NOT NULL DEFAULT '4h',
  assets_discovered INTEGER NOT NULL,
  assets_change_pct NUMERIC(5, 2) NOT NULL,
  connections_total INTEGER NOT NULL,
  connections_change_pct NUMERIC(5, 2) NOT NULL,
  anomalies_detected INTEGER NOT NULL,
  anomalies_change_pct NUMERIC(5, 2) NOT NULL,
  network_errors INTEGER NOT NULL,
  errors_change_pct NUMERIC(5, 2) NOT NULL,
  availability_pct NUMERIC(5, 2) NOT NULL CHECK (availability_pct BETWEEN 0 AND 100),
  reliability_pct NUMERIC(5, 2) NOT NULL CHECK (reliability_pct BETWEEN 0 AND 100),
  security_pct NUMERIC(5, 2) NOT NULL CHECK (security_pct BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS idx_network_metrics_recorded_at ON public.network_metrics (recorded_at DESC);

-- -----------------------------------------------------------------------------
-- 7. network_alerts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.network_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.network_assets (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
  category TEXT NOT NULL CHECK (category IN ('Anomaly', 'Security', 'Latency', 'Packet Loss', 'OT Protocol')),
  source_ip INET,
  protocol TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_by UUID REFERENCES public.user_profiles (id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_network_alerts_status ON public.network_alerts (status);
CREATE INDEX IF NOT EXISTS idx_network_alerts_severity ON public.network_alerts (severity);
CREATE INDEX IF NOT EXISTS idx_network_alerts_detected_at ON public.network_alerts (detected_at DESC);

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_alerts ENABLE ROW LEVEL SECURITY;

-- Authenticated read policies for telemetry tables
CREATE POLICY "Authenticated users can read network assets"
  ON public.network_assets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read network connections"
  ON public.network_connections FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read traffic flows"
  ON public.traffic_flows FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read protocol statistics"
  ON public.protocol_statistics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read network metrics"
  ON public.network_metrics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read alerts"
  ON public.network_alerts FOR SELECT TO authenticated USING (true);

-- Engineers and admins can update alert workflow status
CREATE POLICY "Authenticated operators can update alerts"
  ON public.network_alerts FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (status IN ('open', 'acknowledged', 'resolved'));

-- Users can read and update their own profile
CREATE POLICY "Users manage own profile"
  ON public.user_profiles FOR ALL TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- =============================================================================
-- Enable Realtime Replication (Run in Supabase SQL Editor if needed)
-- =============================================================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.network_metrics, public.network_alerts, public.traffic_flows;

-- =============================================================================
-- Sample Seed Data (Demonstration Telemetry)
-- =============================================================================
INSERT INTO public.user_profiles (full_name, email, role, department)
VALUES
  ('Sarah Jenkins', 'sarah.jenkins@netvision.example', 'admin', 'Core Infrastructure'),
  ('Cyril Baffour', 'cyril.baffour@netvision.example', 'engineer', 'NOC Analytics')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.network_assets (hostname, ip_address, mac_address, device_type, vendor, subnet, zone, status, throughput_mbps, packet_loss_pct)
VALUES
  ('core-rtr-01.nv.local', '10.10.0.1', '00:1A:2B:3C:4D:01', 'Router', 'Cisco Systems', '10.10.0.0/24', 'Core', 'online', 4820.50, 0.02),
  ('dist-sw-04.nv.local', '10.10.1.14', '00:1A:2B:3C:4D:02', 'Switch', 'Arista Networks', '10.10.1.0/24', 'Core', 'online', 3190.20, 0.04),
  ('fw-edge-02.nv.local', '172.16.0.2', '00:1A:2B:3C:4D:03', 'Firewall', 'Palo Alto', '172.16.0.0/24', 'DMZ', 'degraded', 1940.00, 1.45),
  ('plc-line-a1.ot.local', '192.168.50.11', '00:1A:2B:3C:4D:04', 'PLC / OT Controller', 'Siemens', '192.168.50.0/24', 'OT-Plant', 'online', 124.80, 0.00),
  ('app-srv-09.nv.local', '10.10.20.42', '00:1A:2B:3C:4D:05', 'Server', 'Dell EMC', '10.10.20.0/24', 'Corporate', 'online', 2410.10, 0.08),
  ('gw-modbus-03.ot.local', '192.168.50.25', '00:1A:2B:3C:4D:06', 'Gateway', 'Schneider Electric', '192.168.50.0/24', 'OT-Plant', 'offline', 0.00, 100.00)
ON CONFLICT (ip_address) DO NOTHING;

INSERT INTO public.network_metrics (
  time_window, assets_discovered, assets_change_pct,
  connections_total, connections_change_pct,
  anomalies_detected, anomalies_change_pct,
  network_errors, errors_change_pct,
  availability_pct, reliability_pct, security_pct
)
VALUES
  ('4h', 3424, 16.00, 2733, 3.00, 1041, 11.00, 1966, 1.00, 71.00, 41.00, 27.00);

INSERT INTO public.traffic_flows (window_label, flow_type, flow_count, bytes_transferred, ingress_mbps, egress_mbps, baseline_expected_flows)
VALUES
  ('4h', 'Unicast', 8000, 8450000000, 3210.4, 2890.1, 7600),
  ('4h', 'Broadcast', 1200, 420000000, 185.2, 160.0, 950),
  ('4h', 'Multicast', 800, 710000000, 410.8, 390.5, 780);

INSERT INTO public.protocol_statistics (category, protocol_name, transport, session_count, percentage, trend_pct)
VALUES
  ('OT', 'PROFINET', 'Other', 560, 5.60, 4.20),
  ('OT', 'PROFIBUS', 'Other', 240, 2.40, -1.10),
  ('OT', 'Modbus TCP', 'TCP', 400, 4.00, 2.50),
  ('IT', 'HTTPS', 'HTTPS', 3400, 34.00, 8.40),
  ('IT', 'HTTP', 'HTTP', 1450, 14.50, -3.20),
  ('IT', 'DNS', 'DNS', 1620, 16.20, 1.90),
  ('IT', 'NTP', 'UDP', 850, 8.50, 0.40),
  ('IT', 'SSH', 'TCP', 750, 7.50, 2.10),
  ('Other', 'ICMP', 'ICMP', 430, 4.30, 11.30),
  ('Other', 'ARP', 'Other', 170, 1.70, 0.80),
  ('Other', 'Other IP', 'UDP', 130, 1.30, -0.50);

INSERT INTO public.network_alerts (title, description, severity, status, category, source_ip, protocol)
VALUES
  ('Unusual Broadcast Storm on DMZ Segment', 'Broadcast packet rate exceeded 4h baseline threshold by 26.3% on fw-edge-02.', 'critical', 'open', 'Anomaly', '172.16.0.2', 'UDP'),
  ('OT Gateway Unreachable (gw-modbus-03)', 'Modbus TCP keepalive missed 6 consecutive polling intervals.', 'high', 'open', 'OT Protocol', '192.168.50.25', 'Modbus TCP'),
  ('Elevated TLS Handshake Retries', 'Repeated failed TLS 1.3 negotiations from external subnet.', 'medium', 'acknowledged', 'Security', '10.10.20.42', 'HTTPS'),
  ('ICMP Echo Spike Detected', 'Elevated ICMP diagnostics traffic across Core-01 uplink.', 'low', 'resolved', 'Latency', '10.10.0.1', 'ICMP');

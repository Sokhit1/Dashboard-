import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Laptop, Network } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';
import { DateRangeFilter } from './DateRangeFilter';
import { KPICard } from './KPICard';

export function DashboardHeader() {
  const { snapshot, assets, connections, alerts, lastUpdated, isDemoMode, isSimulationPaused } = useNetwork();
  const navigate = useNavigate();
  const [hoveredKpi, setHoveredKpi] = useState<string | null>(null);

  const onlineAssets = assets.filter((a) => a.status === 'online').length;
  const degradedAssets = assets.filter((a) => a.status === 'degraded').length;
  const offlineAssets = assets.filter((a) => a.status === 'offline').length;

  const activeLinks = connections.filter((c) => c.status === 'active').length;
  const impairedLinks = connections.length - activeLinks;

  const openAlerts = alerts.filter((a) => a.status === 'open').length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length;

  return (
    <section className="relative z-20 bg-gradient-to-b from-[#24538F] via-[#275A9B] to-[#2B62A7] pb-7 text-white dark:from-[#12284A] dark:via-[#142D52] dark:to-[#17335D]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-[#13B6C2]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 pt-5 sm:px-6 lg:px-8">
        {/* Welcome Row + Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Welcome to NetVision Analytics
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-blue-100/80">
              <span>{isDemoMode ? 'Demo Data (Synthetic Telemetry)' : 'Supabase Live Stream'}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span aria-hidden="true">·</span>
              <span>{isSimulationPaused ? 'Simulation Paused' : 'Simulation Active'}</span>
            </p>
          </div>

          <DateRangeFilter />
        </div>

        {/* Four Horizontal KPI Cards Strip (overflow-visible for floating spring popovers) */}
        <div
          onMouseLeave={() => setHoveredKpi(null)}
          className="mt-5 grid grid-cols-1 divide-y divide-white/15 overflow-visible rounded-2xl border border-white/25 bg-white/10 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl backdrop-saturate-150 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 dark:border-white/15 dark:bg-white/5"
        >
          <KPICard
            id="assets"
            title="Assets Discovered"
            value={snapshot.kpis.assetsDiscovered}
            changePct={snapshot.kpis.assetsChangePct}
            icon={Laptop}
            positiveIsGood={true}
            isHovered={hoveredKpi === 'assets'}
            onHoverStart={() => setHoveredKpi('assets')}
            onHoverEnd={() => setHoveredKpi((curr) => (curr === 'assets' ? null : curr))}
            detailLabel="Sampled Host Status"
            detailValue={`${onlineAssets} Online · ${degradedAssets} Degraded · ${offlineAssets} Offline`}
            actionText="Open Asset Inventory"
            sparkPoints={[42, 46, 48, 51, 55, 58, 64]}
            onClick={() => navigate('/assets')}
          />
          <KPICard
            id="connections"
            title="Network Connections"
            value={snapshot.kpis.networkConnections}
            changePct={snapshot.kpis.connectionsChangePct}
            icon={Network}
            positiveIsGood={true}
            isHovered={hoveredKpi === 'connections'}
            onHoverStart={() => setHoveredKpi('connections')}
            onHoverEnd={() => setHoveredKpi((curr) => (curr === 'connections' ? null : curr))}
            detailLabel="Topology Mesh Links"
            detailValue={`${activeLinks} Active · ${impairedLinks} Congested / Dropped`}
            actionText="Explore Topology Graph"
            sparkPoints={[54, 52, 57, 56, 60, 61, 63]}
            onClick={() => navigate('/graph')}
          />
          <KPICard
            id="anomalies"
            title="Anomalies Detected"
            value={snapshot.kpis.anomaliesDetected}
            changePct={snapshot.kpis.anomaliesChangePct}
            icon={AlertTriangle}
            positiveIsGood={false}
            isHovered={hoveredKpi === 'anomalies'}
            onHoverStart={() => setHoveredKpi('anomalies')}
            onHoverEnd={() => setHoveredKpi((curr) => (curr === 'anomalies' ? null : curr))}
            detailLabel="Active Incident Queue"
            detailValue={`${openAlerts} Open · ${criticalAlerts} Critical Unresolved`}
            actionText="Triage Anomaly Alerts"
            sparkPoints={[28, 34, 31, 45, 42, 49, 54]}
            onClick={() => navigate('/alerts?category=Anomaly')}
          />
          <KPICard
            id="errors"
            title="Network Errors"
            value={snapshot.kpis.networkErrors}
            changePct={snapshot.kpis.errorsChangePct}
            icon={Activity}
            positiveIsGood={false}
            isHovered={hoveredKpi === 'errors'}
            onHoverStart={() => setHoveredKpi('errors')}
            onHoverEnd={() => setHoveredKpi((curr) => (curr === 'errors' ? null : curr))}
            detailLabel="Reliability Watch"
            detailValue={`${snapshot.health[1]?.percentage ?? 41}% Reliability · TCP Retries`}
            actionText="Inspect Error Diagnostics"
            sparkPoints={[46, 44, 47, 45, 48, 46, 49]}
            onClick={() => navigate('/alerts')}
          />
        </div>
      </div>
    </section>
  );
}

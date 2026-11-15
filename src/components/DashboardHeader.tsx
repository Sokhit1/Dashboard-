import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, Laptop, Network } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';
import { DateRangeFilter } from './DateRangeFilter';
import { KPICard } from './KPICard';

export function DashboardHeader() {
  const { snapshot, lastUpdated, isDemoMode, isSimulationPaused } = useNetwork();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#24538F] via-[#275A9B] to-[#2B62A7] pb-7 text-white dark:from-[#12284A] dark:via-[#142D52] dark:to-[#17335D]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-[#13B6C2]/20 blur-3xl"
      />
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

        {/* Four Horizontal KPI Cards Strip (matching reference screenshot with Apple glass sheen) */}
        <div className="mt-5 grid grid-cols-1 divide-y divide-white/15 overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl backdrop-saturate-150 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 dark:border-white/15 dark:bg-white/5">
          <KPICard
            title="Assets Discovered"
            value={snapshot.kpis.assetsDiscovered}
            changePct={snapshot.kpis.assetsChangePct}
            icon={Laptop}
            positiveIsGood={true}
            onClick={() => navigate('/assets')}
          />
          <KPICard
            title="Network Connections"
            value={snapshot.kpis.networkConnections}
            changePct={snapshot.kpis.connectionsChangePct}
            icon={Network}
            positiveIsGood={true}
            onClick={() => navigate('/graph')}
          />
          <KPICard
            title="Anomalies Detected"
            value={snapshot.kpis.anomaliesDetected}
            changePct={snapshot.kpis.anomaliesChangePct}
            icon={AlertTriangle}
            positiveIsGood={false}
            onClick={() => navigate('/alerts?category=Anomaly')}
          />
          <KPICard
            title="Network Errors"
            value={snapshot.kpis.networkErrors}
            changePct={snapshot.kpis.errorsChangePct}
            icon={Activity}
            positiveIsGood={false}
            onClick={() => navigate('/alerts')}
          />
        </div>
      </div>
    </section>
  );
}

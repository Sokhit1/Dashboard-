import { useSearchParams } from 'react-router-dom';
import { AlertsPanel } from '../components/AlertsPanel';
import { useNetwork } from '../context/NetworkContext';

export function AlertsPage() {
  const { alerts, updateAlertStatus, isDemoMode } = useNetwork();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';

  const openCount = alerts.filter((a) => a.status === 'open').length;
  const ackCount = alerts.filter((a) => a.status === 'acknowledged').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-[#24538F] via-[#275A9B] to-[#2B62A7] pb-6 text-white dark:from-[#12284A] dark:via-[#142D52] dark:to-[#17335D]">
        <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Anomalies & Network Alerts</h1>
          <p className="mt-1 text-xs text-blue-100/80">
            {isDemoMode ? 'Demo Data · ' : ''}Triage, acknowledge, and resolve security and baseline deviations
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Open Incidents</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{openCount}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Critical Unresolved</p>
              <p className="mt-1 text-xl font-bold text-rose-200 tabular-nums">{criticalCount}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Acknowledged</p>
              <p className="mt-1 text-xl font-bold text-amber-200 tabular-nums">{ackCount}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Resolved</p>
              <p className="mt-1 text-xl font-bold text-cyan-200 tabular-nums">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <AlertsPanel
          alerts={alerts}
          onUpdateStatus={updateAlertStatus}
          initialCategory={initialCategory}
        />
      </main>
    </div>
  );
}

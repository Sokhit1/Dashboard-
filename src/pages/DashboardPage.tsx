import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DashboardHeader } from '../components/DashboardHeader';
import { HealthGauge } from '../components/HealthGauge';
import { InfrastructureShowcase } from '../components/InfrastructureShowcase';
import { ProtocolDistributionChart } from '../components/ProtocolDistributionChart';
import { TrafficDistributionChart } from '../components/TrafficDistributionChart';
import { useNetwork } from '../context/NetworkContext';
import type { HealthMetric } from '../types/network';

export function DashboardPage() {
  const { snapshot } = useNetwork();
  const navigate = useNavigate();
  const [selectedHealth, setSelectedHealth] = useState<HealthMetric | null>(null);

  return (
    <div>
      <DashboardHeader />

      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Two Large Analytics Panels Side-by-Side */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-2"
        >
          <TrafficDistributionChart />
          <ProtocolDistributionChart />
        </motion.div>

        {/* Three Health Indicators in One Row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {snapshot.health.map((metric) => (
            <HealthGauge key={metric.id} metric={metric} onSelect={setSelectedHealth} />
          ))}
        </motion.div>

        {/* Apple-style Infrastructure & Hardware Visual Showcase */}
        <InfrastructureShowcase />
      </main>

      {/* Health Detail Drawer */}
      <AnimatePresence>
        {selectedHealth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedHealth(null)}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedHealth.title} Details`}
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
                <div>
                  <h3 className="text-base font-semibold text-[#253246] dark:text-white">
                    {selectedHealth.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedHealth.startLabel} · {selectedHealth.endLabel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedHealth(null)}
                  aria-label="Close health drawer"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-6">
                <div className="flex items-center justify-between rounded-xl bg-[#F2F6FB] p-4 dark:bg-slate-800/60">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Composite Score</p>
                    <p className="mt-1 text-3xl font-bold tabular-nums text-[#253246] dark:text-white">
                      {selectedHealth.percentage}%
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      selectedHealth.status === 'Good'
                        ? 'bg-emerald-600 text-white'
                        : selectedHealth.status === 'Fair'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-600 text-white'
                    }`}
                  >
                    {selectedHealth.status}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedHealth.summary}
                </p>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-[#253246] dark:text-slate-200">
                    Contributing Telemetry Factors
                  </h4>
                  {selectedHealth.factors.map((factor) => (
                    <div
                      key={factor.label}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-3.5 py-2.5 text-xs dark:border-slate-800"
                    >
                      <span className="text-slate-600 dark:text-slate-300">{factor.label}</span>
                      <span
                        className={`font-semibold tabular-nums ${
                          factor.state === 'nominal'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : factor.state === 'warning'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {factor.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHealth(null);
                    navigate('/alerts');
                  }}
                  className="w-full rounded-lg bg-[#24538F] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1c4170]"
                >
                  Inspect Related Alerts
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

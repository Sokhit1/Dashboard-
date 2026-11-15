import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Cpu, Server, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useNetwork } from '../context/NetworkContext';
import { INFRASTRUCTURE_IMAGES } from '../lib/assetImages';

export function InfrastructureShowcase() {
  const { assets, connections, snapshot } = useNetwork();
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const coreAssetsCount = assets.filter((a) => a.zone === 'Core' || a.zone === 'DMZ').length;
  const otAssetsCount = assets.filter((a) => a.zone === 'OT-Plant' || a.zone === 'Edge').length;

  const cards = [
    {
      id: 'core',
      title: 'Core Data Center Fabric',
      subtitle: `${coreAssetsCount} Core & DMZ Nodes · ${connections.length} Active Links`,
      metric: `${snapshot.health[0]?.percentage ?? 71}% Availability`,
      image: INFRASTRUCTURE_IMAGES.datacenter,
      alt: 'Enterprise data center aisle with core routing racks and cobalt lighting',
      route: '/graph',
      actionLabel: 'Inspect Topology',
      icon: Server,
    },
    {
      id: 'noc',
      title: 'Operations & Baseline Watch',
      subtitle: `${snapshot.kpis.anomaliesDetected.toLocaleString()} Anomalies · ${snapshot.timeRange.toUpperCase()} Window`,
      metric: `${snapshot.flows.total.toLocaleString()} Flows`,
      image: INFRASTRUCTURE_IMAGES.noc,
      alt: 'Modern glass network operations center workspace',
      route: '/baseline',
      actionLabel: 'View Baselines',
      icon: ShieldCheck,
    },
    {
      id: 'ot',
      title: 'Industrial OT & Edge Gateways',
      subtitle: `${otAssetsCount} Plant Controllers & Sensors · ${snapshot.protocols.otPct.toFixed(1)}% OT Share`,
      metric: 'PROFINET / Modbus',
      image: INFRASTRUCTURE_IMAGES.otGateway,
      alt: 'Brushed aluminum industrial OT gateway controller hardware',
      route: '/assets',
      actionLabel: 'Browse Assets',
      icon: Cpu,
    },
  ];

  return (
    <section className="space-y-4 pt-2" aria-label="Infrastructure Zones Spotlight">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-base font-semibold text-[#253246] dark:text-slate-100">
            Infrastructure & Hardware Environments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore live monitored physical zones, core routing fabrics, and industrial OT gateways
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/assets')}
          className="inline-flex items-center gap-1 self-start text-xs font-semibold text-[#24538F] transition-colors hover:text-[#13B6C2] sm:self-auto dark:text-sky-300"
        >
          <span>Full Hardware Inventory</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isImgBroken = failedImages[card.id];

          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => navigate(card.route)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              className="group relative flex h-64 w-full flex-col justify-end overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 text-left shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-[#24538F] dark:border-slate-800"
            >
              {!isImgBroken ? (
                <img
                  src={card.image}
                  alt={card.alt}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedImages((prev) => ({ ...prev, [card.id]: true }))}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#24538F] to-[#0F172A]">
                  <Icon className="h-14 w-14 text-white/30" />
                </div>
              )}

              {/* Contrast Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/15 transition-opacity duration-300 group-hover:from-slate-950/95" />

              {/* Top Frosted Metric Pill (iOS Glass Style) */}
              <div className="relative z-10 flex w-full flex-1 flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md tabular-nums">
                    <Icon className="h-3 w-3 text-[#38BDF8]" />
                    {card.metric}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-[#24538F]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold tracking-tight text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-200/90">{card.subtitle}</p>
                  <p className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#38BDF8]">
                    {card.actionLabel}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

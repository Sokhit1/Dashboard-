import { AlertCircle, CheckCircle2, Clock, ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import type { HealthMetric } from '../types/network';

interface HealthGaugeProps {
  metric: HealthMetric;
  onSelect: (metric: HealthMetric) => void;
}

export function HealthGauge({ metric, onSelect }: HealthGaugeProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (metric.percentage / 100) * circumference;

  const badgeStyle =
    metric.status === 'Good'
      ? 'bg-emerald-600 text-white'
      : metric.status === 'Fair'
        ? 'bg-amber-500 text-white'
        : 'bg-rose-600 text-white';

  const StatusIcon =
    metric.status === 'Good' ? CheckCircle2 : metric.status === 'Fair' ? AlertCircle : ShieldAlert;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(metric)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="glass-card group flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left transition-all duration-200 hover:border-[#3A70AC]/45 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[#24538F] dark:hover:border-sky-400/35"
    >
      {/* Left Info Column */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-[#253246] dark:text-slate-100">{metric.title}</h3>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${badgeStyle}`}
          >
            <StatusIcon className="h-3 w-3" />
            {metric.status}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums ${
              metric.trendPct >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {metric.trendPct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {metric.trendPct >= 0 ? '+' : ''}
            {metric.trendPct}%
          </span>
        </div>

        <div className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1.5 tabular-nums">
            <Clock className="h-3 w-3 shrink-0 text-slate-400" />
            <span>{metric.startLabel}</span>
          </p>
          <p className="flex items-center gap-1.5 tabular-nums">
            <Clock className="h-3 w-3 shrink-0 text-slate-400" />
            <span>{metric.endLabel}</span>
          </p>
        </div>
      </div>

      {/* Right Animated Circular Progress Ring */}
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
        <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="9"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={metric.color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="absolute text-lg font-bold text-[#253246] tabular-nums dark:text-white">
          {metric.percentage}%
        </span>
      </div>
    </motion.button>
  );
}

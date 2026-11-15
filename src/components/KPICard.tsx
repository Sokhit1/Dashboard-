import { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface KPICardProps {
  title: string;
  value: number;
  changePct: number;
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  positiveIsGood?: boolean;
}

export function KPICard({
  title,
  value,
  changePct,
  icon: Icon,
  onClick,
  active = false,
  positiveIsGood = true,
}: KPICardProps) {
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    const startVal = displayVal;
    const diff = value - startVal;
    if (diff === 0) return;

    let frame = 0;
    const totalFrames = 18;
    let rafId = 0;

    const step = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setDisplayVal(Math.round(startVal + diff * progress));
      if (frame < totalFrames) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  const isUp = changePct >= 0;
  const isFavorable = positiveIsGood ? isUp : !isUp;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-white ${
        active
          ? 'bg-white/20 ring-1 ring-inset ring-white/40'
          : 'hover:bg-white/10'
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
        <Icon className="h-6 w-6 stroke-[1.75]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-blue-100/90">{title}</p>
        <div className="mt-1 flex items-center gap-2.5">
          <span className="text-xl font-bold tracking-tight text-white tabular-nums sm:text-[22px]">
            {displayVal.toLocaleString()}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
              isFavorable
                ? 'bg-[#13B6C2]/25 text-cyan-100'
                : 'bg-rose-500/25 text-rose-100'
            }`}
          >
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isUp ? '+' : ''}
            {changePct}%
          </span>
        </div>
      </div>
    </motion.button>
  );
}

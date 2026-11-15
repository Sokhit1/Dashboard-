import React, { useEffect, useState } from 'react';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from 'motion/react';

export interface KPICardProps {
  id: string;
  title: string;
  value: number;
  changePct: number;
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  positiveIsGood?: boolean;
  isHovered?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  detailLabel: string;
  detailValue: string;
  actionText: string;
  sparkPoints?: number[];
}

export function KPICard({
  title,
  value,
  changePct,
  icon: Icon,
  onClick,
  active = false,
  positiveIsGood = true,
  isHovered = false,
  onHoverStart,
  onHoverEnd,
  detailLabel,
  detailValue,
  actionText,
  sparkPoints = [38, 44, 41, 52, 49, 61, 68],
}: KPICardProps) {
  const [displayVal, setDisplayVal] = useState(value);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.18), transparent 75%)`;

  const isUp = changePct >= 0;
  const isFavorable = positiveIsGood ? isUp : !isUp;

  // Build crisp SVG sparkline path for the floating preview card
  const minPt = Math.min(...sparkPoints);
  const maxPt = Math.max(...sparkPoints);
  const span = Math.max(maxPt - minPt, 1);
  const svgPoints = sparkPoints
    .map((pt, i) => {
      const x = (i / Math.max(sparkPoints.length - 1, 1)) * 72;
      const y = 20 - ((pt - minPt) / span) * 16;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      className="relative"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <motion.button
        type="button"
        onClick={onClick}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        onMouseMove={handleMouseMove}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className={`group relative flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-white ${
          active ? 'bg-white/15 ring-1 ring-inset ring-white/35' : ''
        }`}
      >
        {/* Sliding Apple-style glass highlight across cards */}
        {isHovered && (
          <motion.span
            layoutId="kpiHoverHighlight"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="pointer-events-none absolute inset-1 rounded-xl bg-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md"
          />
        )}

        {/* Cursor-tracking specular light sheen */}
        <motion.span
          aria-hidden="true"
          style={{ background: spotlightBg }}
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Spring-animated Icon Container */}
        <motion.div
          animate={isHovered ? { y: -2, scale: 1.08, rotate: -3 } : { y: 0, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 440, damping: 24 }}
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
        >
          <Icon className="h-6 w-6 stroke-[1.75]" />
        </motion.div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-medium text-blue-100/90">{title}</p>
            <motion.span
              animate={isHovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 4 }}
              transition={{ type: 'spring', stiffness: 440, damping: 26 }}
              className="text-cyan-200"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.span>
          </div>

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

      {/* Floating Apple-Style Frosted Interaction Popover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 440, damping: 28 }}
            className="pointer-events-none absolute top-full right-3 left-3 z-30 mt-2.5 hidden sm:block"
          >
            <div className="rounded-2xl border border-white/75 bg-white/90 p-3.5 text-[#253246] shadow-[0_18px_40px_-12px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{detailLabel}</p>
                  <p className="mt-0.5 truncate text-xs font-semibold text-[#253246] tabular-nums dark:text-white">
                    {detailValue}
                  </p>
                </div>
                <svg viewBox="0 0 72 24" className="h-6 w-16 shrink-0 overflow-visible">
                  <motion.polyline
                    fill="none"
                    stroke={isFavorable ? '#13B6C2' : '#E11D48'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={svgPoints}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-2 text-[11px] font-semibold text-[#24538F] dark:border-slate-800 dark:text-sky-300">
                <span>{actionText}</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

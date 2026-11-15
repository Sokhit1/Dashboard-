import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { AlertsPage } from './pages/AlertsPage';
import { AssetsPage } from './pages/AssetsPage';
import { BaselinePage } from './pages/BaselinePage';
import { DashboardPage } from './pages/DashboardPage';
import { GraphPage } from './pages/GraphPage';
import { TrafficProfilePage } from './pages/TrafficProfilePage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/baseline" element={<BaselinePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/traffic" element={<TrafficProfilePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const { isDemoMode } = useNetwork();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#EEF3F9] text-[#253246] transition-colors dark:bg-[#09101E] dark:text-slate-100">
      {/* Subtle Ambient Light Layer for Frosted Glass Refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#3A70AC]/15 blur-3xl dark:bg-[#24538F]/25" />
        <div className="absolute top-1/3 right-[-6rem] h-[460px] w-[460px] rounded-full bg-[#13B6C2]/14 blur-3xl dark:bg-[#13B6C2]/15" />
        <div className="absolute bottom-[-8rem] left-1/3 h-[380px] w-[380px] rounded-full bg-[#3A70AC]/12 blur-3xl dark:bg-[#3A70AC]/15" />
      </div>

      <Navbar />
      <div className="relative z-10 flex-1">
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
      </div>
      <footer className="relative z-10 border-t border-white/60 bg-white/70 px-4 py-4 text-xs text-slate-500 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 sm:flex-row">
          <span>Repsort Analytics · NetVision Network Monitoring</span>
          <span>
            {isDemoMode
              ? 'Demo Data Mode: Synthetic telemetry simulation active (configure Supabase env vars for live ingestion).'
              : 'Connected to Supabase PostgreSQL & Realtime.'}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <NetworkProvider>
          <AppShell />
        </NetworkProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}

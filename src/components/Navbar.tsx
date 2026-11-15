import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  ChevronDown,
  Menu,
  Moon,
  Pause,
  Play,
  ShieldAlert,
  Sun,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNetwork } from '../context/NetworkContext';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/assets', label: 'Network Assets' },
  { to: '/baseline', label: 'Network Baseline' },
  { to: '/graph', label: 'Network Graph' },
  { to: '/traffic', label: 'Traffic Profile' },
  { to: '/alerts', label: 'Alerts' },
];

export function Navbar() {
  const {
    alerts,
    unreadAlertsCount,
    updateAlertStatus,
    theme,
    toggleTheme,
    isDemoMode,
    isSimulationPaused,
    toggleSimulationPaused,
  } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const openAlerts = alerts.filter((a) => a.status === 'open').slice(0, 4);

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-[#24538F]/80 text-white shadow-[0_4px_24px_-6px_rgba(15,23,42,0.2)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-[#102442]/80">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Wordmark */}
        <NavLink to="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap focus:outline-none">
          <motion.span
            whileHover={{ rotate: 45 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/25"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83" />
            </svg>
          </motion.span>
          <span className="text-lg font-bold tracking-tight text-white">NetVision</span>
        </NavLink>

        {/* Center: Desktop Navigation Links with iOS sliding indicator */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary Navigation">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-blue-100/80 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-white"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Actions (Theme, Notifications, Profile) */}
        <div className="flex shrink-0 items-center gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-100 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-label="Open notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-blue-100 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <Bell className="h-4 w-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#13B6C2] px-1 text-[10px] font-bold text-white tabular-nums">
                  {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -6 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="absolute right-0 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 text-[#253246] shadow-2xl backdrop-blur-xl sm:w-96 dark:border-slate-700/80 dark:bg-slate-900/95 dark:text-slate-100"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-semibold">Network Notifications</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {unreadAlertsCount} open incident{unreadAlertsCount === 1 ? '' : 's'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        navigate('/alerts');
                      }}
                      className="text-xs font-medium text-[#24538F] hover:underline dark:text-[#38BDF8]"
                    >
                      View all
                    </button>
                  </div>
                  <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                    {openAlerts.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                        All active alerts have been acknowledged.
                      </div>
                    ) : (
                      openAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60">
                          <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              alert.severity === 'critical'
                                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                                : alert.severity === 'high'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                  : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                            }`}
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold">{alert.title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                              {alert.sourceIp} · {alert.protocol}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void updateAlertStatus(alert.id, 'acknowledged')}
                            title="Acknowledge alert"
                            className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Open user profile menu"
            >
              {!avatarError ? (
                <img
                  src="/src/assets/images/avatar_network_admin_1794720269683.jpg"
                  alt="Sarah Jenkins"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="h-8 w-8 rounded-full border border-white/40 object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-[#3A70AC] text-xs font-semibold text-white">
                  SJ
                </span>
              )}
              <ChevronDown className="hidden h-3.5 w-3.5 text-blue-100 sm:block" />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -6 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200/80 bg-white/95 p-2 text-[#253246] shadow-2xl backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95 dark:text-slate-100"
                >
                  <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                    <p className="text-sm font-semibold">Sarah Jenkins</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Lead Network Architect · Repsort Analytics</p>
                  </div>
                  <div className="py-1.5 text-xs">
                    <div className="flex items-center justify-between px-3 py-2 text-slate-600 dark:text-slate-300">
                      <span>Telemetry Source</span>
                      <span className="font-semibold text-[#24538F] dark:text-[#38BDF8]">
                        {isDemoMode ? 'Demo Data' : 'Supabase Live'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleSimulationPaused}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <span>Live Simulation</span>
                      <span className="inline-flex items-center gap-1 font-medium text-[#13B6C2]">
                        {isSimulationPaused ? (
                          <>
                            <Play className="h-3 w-3" /> Resume
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3" /> Pause
                          </>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme();
                        setProfileOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <span>Appearance</span>
                      <span className="font-medium capitalize">{theme}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle mobile navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-[#1E477B] px-4 py-3 lg:hidden dark:bg-[#102544]"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/15 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}


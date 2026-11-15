import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  buildSnapshot,
  DEMO_ASSETS,
  DEMO_CONNECTIONS,
  INITIAL_DEMO_ALERTS,
} from '../data/demoData';
import { isSupabaseConfigured, subscribeToNetworkRealtime, supabase } from '../lib/supabase';
import type {
  AlertStatus,
  NetworkAlert,
  NetworkAsset,
  NetworkConnection,
  NetworkSnapshot,
  RefreshInterval,
  ThemeMode,
  TimeRange,
} from '../types/network';

interface NetworkContextValue {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  refreshInterval: RefreshInterval;
  setRefreshInterval: (interval: RefreshInterval) => void;
  isSimulationPaused: boolean;
  toggleSimulationPaused: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  lastUpdated: Date;
  isRefreshing: boolean;
  isDemoMode: boolean;
  snapshot: NetworkSnapshot;
  assets: NetworkAsset[];
  connections: NetworkConnection[];
  alerts: NetworkAlert[];
  selectedProtocol: string | null;
  setSelectedProtocol: (protocol: string | null) => void;
  manualRefresh: () => void;
  updateAlertStatus: (id: string, status: AlertStatus) => Promise<void>;
  unreadAlertsCount: number;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

const REFRESH_MS: Record<RefreshInterval, number | null> = {
  off: null,
  '10s': 10000,
  '30s': 30000,
  '60s': 60000,
};

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('4h');
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>('10s');
  const [isSimulationPaused, setIsSimulationPaused] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('netvision-theme') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });
  const [tick, setTick] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [assets, setAssets] = useState<NetworkAsset[]>(DEMO_ASSETS);
  const [connections] = useState<NetworkConnection[]>(DEMO_CONNECTIONS);
  const [alerts, setAlerts] = useState<NetworkAlert[]>(INITIAL_DEMO_ALERTS);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('netvision-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleSimulationPaused = useCallback(() => {
    setIsSimulationPaused((prev) => !prev);
  }, []);

  const stepSimulation = useCallback(() => {
    setIsRefreshing(true);
    setTick((prev) => {
      const next = prev + 1;
      // Gently vary synthetic asset throughput & latency for live monitoring realism
      setAssets((curr) =>
        curr.map((asset, idx) => {
          if (asset.status === 'offline') return asset;
          const factor = 1 + Math.sin(next * 0.8 + idx) * 0.04;
          return {
            ...asset,
            throughputMbps: Number((asset.throughputMbps * factor).toFixed(1)),
            latencyMs: Number(Math.max(0.8, asset.latencyMs + Math.cos(next + idx) * 0.2).toFixed(1)),
            lastSeen: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }),
      );

      // Every 4th tick in simulation, append a realistic demo alert (cap list cleanly at 16)
      if (next % 4 === 0) {
        const syntheticTemplates: Array<Omit<NetworkAlert, 'id' | 'detectedAt'>> = [
          {
            title: 'Microburst Detected on Core Uplink',
            description: 'Transient TCP window saturation observed during simulated telemetry interval.',
            severity: 'medium',
            status: 'open',
            category: 'Latency',
            sourceIp: '10.10.0.1',
            hostname: 'core-rtr-01.nv.local',
            protocol: 'TCP',
          },
          {
            title: 'PROFINET Cycle Jitter Warning',
            description: 'Industrial controller polling interval deviated by +4.2ms from baseline.',
            severity: 'high',
            status: 'open',
            category: 'OT Protocol',
            sourceIp: '192.168.50.11',
            hostname: 'plc-line-a1.ot.local',
            protocol: 'PROFINET',
          },
        ];
        const chosen = syntheticTemplates[(next / 4) % syntheticTemplates.length];
        setAlerts((curr) => [
          {
            ...chosen,
            id: `alt-sim-${Date.now()}`,
            detectedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          },
          ...curr.slice(0, 14),
        ]);
      }

      return next;
    });
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 250);
  }, []);

  const manualRefresh = useCallback(() => {
    stepSimulation();
  }, [stepSimulation]);

  // Auto-refresh interval
  useEffect(() => {
    const ms = REFRESH_MS[refreshInterval];
    if (!ms || isSimulationPaused) return;
    const timer = window.setInterval(stepSimulation, ms);
    return () => window.clearInterval(timer);
  }, [refreshInterval, isSimulationPaused, stepSimulation]);

  // Supabase Realtime listener if credentials are configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const unsubscribe = subscribeToNetworkRealtime(() => {
      setLastUpdated(new Date());
    });
    return unsubscribe;
  }, []);

  const updateAlertStatus = useCallback(async (id: string, status: AlertStatus) => {
    setAlerts((curr) => curr.map((a) => (a.id === id ? { ...a, status } : a)));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('network_alerts').update({ status }).eq('id', id);
    }
  }, []);

  const snapshot = useMemo(() => buildSnapshot(timeRange, tick), [timeRange, tick]);
  const unreadAlertsCount = useMemo(() => alerts.filter((a) => a.status === 'open').length, [alerts]);

  const value: NetworkContextValue = {
    timeRange,
    setTimeRange,
    refreshInterval,
    setRefreshInterval,
    isSimulationPaused,
    toggleSimulationPaused,
    theme,
    toggleTheme,
    lastUpdated,
    isRefreshing,
    isDemoMode: !isSupabaseConfigured,
    snapshot,
    assets,
    connections,
    alerts,
    selectedProtocol,
    setSelectedProtocol,
    manualRefresh,
    updateAlertStatus,
    unreadAlertsCount,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return ctx;
}

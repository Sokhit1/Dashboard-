import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const hasValidCredentials =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl?.includes('your-project-id') &&
  !supabaseAnonKey?.includes('your-public-anon-key');

export const isSupabaseConfigured = hasValidCredentials;

export const supabase: SupabaseClient | null = hasValidCredentials
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      realtime: {
        params: {
          eventsPerSecond: 4,
        },
      },
    })
  : null;

/**
 * Subscribe to Supabase Realtime updates on network_metrics and network_alerts
 * when Supabase credentials are configured. Returns an unsubscribe cleanup function.
 */
export function subscribeToNetworkRealtime(onEvent: (table: string, payload: unknown) => void): () => void {
  if (!supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('netvision-telemetry')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'network_metrics' },
      (payload) => onEvent('network_metrics', payload),
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'network_alerts' },
      (payload) => onEvent('network_alerts', payload),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

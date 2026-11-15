import { NetworkTopology } from '../components/NetworkTopology';
import { useNetwork } from '../context/NetworkContext';

export function GraphPage() {
  const { assets, connections, isDemoMode } = useNetwork();

  const congestedCount = connections.filter((c) => c.status === 'congested').length;
  const droppedCount = connections.filter((c) => c.status === 'dropped').length;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-[#24538F] via-[#275A9B] to-[#2B62A7] pb-6 text-white dark:from-[#12284A] dark:via-[#142D52] dark:to-[#17335D]">
        <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Network Topology Graph</h1>
          <p className="mt-1 text-xs text-blue-100/80">
            {isDemoMode ? 'Demo Data · ' : ''}Interactive device mesh across Core, DMZ, Corporate, and OT-Plant zones
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Mapped Nodes</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{assets.length}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Active Links</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{connections.length}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Congested Paths</p>
              <p className="mt-1 text-xl font-bold text-amber-200 tabular-nums">{congestedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Dropped Links</p>
              <p className="mt-1 text-xl font-bold text-rose-200 tabular-nums">{droppedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <NetworkTopology assets={assets} connections={connections} />
      </main>
    </div>
  );
}

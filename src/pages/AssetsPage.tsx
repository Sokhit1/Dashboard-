import { AssetsTable } from '../components/AssetsTable';
import { useNetwork } from '../context/NetworkContext';

export function AssetsPage() {
  const { assets, snapshot, isDemoMode } = useNetwork();

  const onlineCount = assets.filter((a) => a.status === 'online').length;
  const degradedCount = assets.filter((a) => a.status === 'degraded').length;
  const offlineCount = assets.filter((a) => a.status === 'offline').length;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-[#24538F] via-[#275A9B] to-[#2B62A7] pb-6 text-white dark:from-[#12284A] dark:via-[#142D52] dark:to-[#17335D]">
        <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Network Assets Inventory</h1>
              <p className="mt-1 text-xs text-blue-100/80">
                {isDemoMode ? 'Demo Data · ' : ''}Discovered endpoints, OT controllers, and core infrastructure ({snapshot.kpis.assetsDiscovered.toLocaleString()} total inventory)
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Sampled Active Hosts</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{assets.length}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Online</p>
              <p className="mt-1 text-xl font-bold text-cyan-200 tabular-nums">{onlineCount}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Degraded</p>
              <p className="mt-1 text-xl font-bold text-amber-200 tabular-nums">{degradedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <p className="text-xs text-blue-100/80">Offline</p>
              <p className="mt-1 text-xl font-bold text-rose-200 tabular-nums">{offlineCount}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <AssetsTable assets={assets} />
      </main>
    </div>
  );
}

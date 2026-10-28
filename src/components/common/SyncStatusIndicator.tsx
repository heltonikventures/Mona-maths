import React, { useEffect, useState } from 'react';
import { soundManager } from '../../utils/sound';
import { syncManager, SyncState } from '../../utils/syncManager';

export const SyncStatusIndicator: React.FC = () => {
  const [syncInfo, setSyncInfo] = useState<{
    status: SyncState;
    lastSyncedAt: string | null;
    pendingCount: number;
    message?: string;
  }>(syncManager.getStatus());

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((info) => {
      setSyncInfo(info);
    });
    return unsubscribe;
  }, []);

  const handleManualSync = () => {
    soundManager.playClick();
    syncManager.triggerSync();
  };

  const formatLastSync = (ts: string | null) => {
    if (!ts) return 'Never';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <>
      {/* Clickable Status Badge in Header */}
      <button
        onClick={() => {
          soundManager.playClick();
          setShowModal(true);
        }}
        title="View Cloud & Offline Sync Status"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border transition-all active:scale-95 shadow-xs ${
          syncInfo.status === 'synced'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            : syncInfo.status === 'syncing'
            ? 'bg-indigo-50 border-indigo-300 text-indigo-800 animate-pulse'
            : syncInfo.status === 'offline'
            ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}
      >
        {syncInfo.status === 'synced' && (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Synced</span>
            <span className="text-xs">☁️</span>
          </>
        )}
        {syncInfo.status === 'syncing' && (
          <>
            <span className="text-xs animate-spin">🔄</span>
            <span className="hidden sm:inline">Syncing...</span>
          </>
        )}
        {syncInfo.status === 'offline' && (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="hidden sm:inline">Offline (Saved)</span>
            <span className="text-xs">💾</span>
          </>
        )}
        {syncInfo.status === 'error' && (
          <>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="hidden sm:inline">Retry Sync</span>
            <span className="text-xs">⚠️</span>
          </>
        )}
      </button>

      {/* Cloud & Device Synchronization Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-2xl relative text-center">
            {/* Close Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowModal(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition"
            >
              ✕
            </button>

            <div className="text-4xl mb-2">☁️</div>
            <h3 className="text-xl font-black text-slate-900 font-heading">
              Cloud & Offline Sync
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Powered by Service Worker background synchronization
            </p>

            {/* Status Card */}
            <div className="my-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600">Internet Connection:</span>
                <span
                  className={`font-black px-2 py-0.5 rounded-full ${
                    typeof navigator !== 'undefined' && navigator.onLine
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {typeof navigator !== 'undefined' && navigator.onLine ? 'Connected 🟢' : 'Offline 🟡'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600">Local Cache:</span>
                <span className="text-slate-800 font-black">Active (Cache & SW) ✓</span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600">Sync Status:</span>
                <span
                  className={`font-black ${
                    syncInfo.status === 'synced'
                      ? 'text-emerald-600'
                      : syncInfo.status === 'syncing'
                      ? 'text-indigo-600'
                      : syncInfo.status === 'offline'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {syncInfo.status === 'synced'
                    ? 'All Caught Up ✓'
                    : syncInfo.status === 'syncing'
                    ? 'Syncing in Progress...'
                    : syncInfo.status === 'offline'
                    ? 'Offline — Cached Locally'
                    : 'Sync Pending'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600">Last Synced to Server:</span>
                <span className="text-slate-800 font-black">
                  {formatLastSync(syncInfo.lastSyncedAt)}
                </span>
              </div>

              {syncInfo.pendingCount > 0 && (
                <div className="flex justify-between items-center text-xs font-bold text-amber-800 bg-amber-100 p-2 rounded-xl">
                  <span>Pending Offline Updates:</span>
                  <span className="font-black">{syncInfo.pendingCount}</span>
                </div>
              )}
            </div>

            <p className="text-[11px] font-semibold text-slate-500 mb-4 text-left leading-relaxed">
              When offline, all coins, stars, scores, and avatar items are cached safely on your device. The moment an internet connection is detected, the service worker automatically transmits your progress to the server!
            </p>

            {/* Action Button */}
            <div className="flex gap-2">
              <button
                onClick={handleManualSync}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-black rounded-2xl text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>🔄</span>
                <span>Sync Now</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowModal(false);
                }}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl text-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

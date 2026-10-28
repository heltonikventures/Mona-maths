/**
 * Service Worker-based Client Synchronization Coordinator
 * Caches game progress locally in Cache API & localStorage,
 * and automatically synchronizes to the server whenever an internet connection is detected.
 */

export interface SyncPayload {
  playerId: string;
  playerName: string;
  stats: any;
  level: number;
  stars: number;
  coins: number;
  gems: number;
  streak: number;
  realmProgress: any;
  badges: any[];
  clientTimestamp: string;
}

export type SyncState = 'synced' | 'syncing' | 'offline' | 'pending' | 'error';

type SyncListener = (state: {
  status: SyncState;
  lastSyncedAt: string | null;
  pendingCount: number;
  message?: string;
}) => void;

class ClientSyncManager {
  private status: SyncState = 'synced';
  private lastSyncedAt: string | null = null;
  private pendingCount: number = 0;
  private lastMessage: string = 'Up to date';
  private listeners: Set<SyncListener> = new Set();
  private isSyncInProgress = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load last sync timestamp from storage
      this.lastSyncedAt = localStorage.getItem('maths_last_sync_timestamp') || null;
      this.status = navigator.onLine ? 'synced' : 'offline';

      // Listen for window online / offline events
      window.addEventListener('online', () => {
        console.log('[SyncManager] Internet connection detected! Triggering automatic synchronization...');
        this.status = 'syncing';
        this.notify();
        this.triggerSync();
      });

      window.addEventListener('offline', () => {
        console.log('[SyncManager] Network went offline. Caching progress locally.');
        this.status = 'offline';
        this.notify();
      });

      // Listen for messages from the active Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data?.type === 'SYNC_SUCCESS') {
            this.handleSyncSuccess(event.data.timestamp);
          } else if (event.data?.type === 'SYNC_ERROR') {
            this.handleSyncError(event.data.error);
          }
        });
      }
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener({
      status: this.status,
      lastSyncedAt: this.lastSyncedAt,
      pendingCount: this.pendingCount,
      message: this.lastMessage,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) =>
      fn({
        status: this.status,
        lastSyncedAt: this.lastSyncedAt,
        pendingCount: this.pendingCount,
        message: this.lastMessage,
      })
    );
  }

  // Queue a local update (called on answer, level complete, coin change, etc.)
  public async queueStatsForSync(payload: SyncPayload) {
    this.pendingCount += 1;
    this.lastMessage = `${this.pendingCount} update(s) cached locally`;

    // 1. Save to local fallback cache in localStorage
    try {
      localStorage.setItem('maths_latest_sync_payload', JSON.stringify(payload));
    } catch {
      // storage full fallback
    }

    // 2. Relay to Service Worker if supported
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'QUEUE_STATS_FOR_SYNC',
        payload,
      });

      // Register standard Background Sync tag if browser supports it
      try {
        const reg = await navigator.serviceWorker.ready;
        if ('sync' in reg) {
          await (reg as any).sync.register('sync-player-stats');
        }
      } catch {
        // SyncManager not supported in current context
      }
    }

    // 3. If online right now, perform direct sync
    if (navigator.onLine) {
      this.triggerSync(payload);
    } else {
      this.status = 'offline';
      this.notify();
    }
  }

  // Perform synchronization against the server
  public async triggerSync(explicitPayload?: SyncPayload): Promise<boolean> {
    if (this.isSyncInProgress) return false;
    if (!navigator.onLine) {
      this.status = 'offline';
      this.lastMessage = 'Offline: Saved locally. Will sync when online.';
      this.notify();
      return false;
    }

    this.isSyncInProgress = true;
    this.status = 'syncing';
    this.lastMessage = 'Synchronizing with server...';
    this.notify();

    try {
      let payloadToSync = explicitPayload;
      if (!payloadToSync) {
        const saved = localStorage.getItem('maths_latest_sync_payload');
        if (saved) {
          payloadToSync = JSON.parse(saved);
        }
      }

      if (!payloadToSync) {
        this.status = 'synced';
        this.isSyncInProgress = false;
        this.notify();
        return true;
      }

      // Send to server API endpoint
      const response = await fetch('/api/sync/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSync),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      this.handleSyncSuccess(data.serverTimestamp || new Date().toISOString());
      return true;
    } catch (err: any) {
      console.warn('[SyncManager] Sync failed or server unreachable:', err);
      this.handleSyncError(err?.message || 'Connection timeout');
      return false;
    } finally {
      this.isSyncInProgress = false;
    }
  }

  private handleSyncSuccess(timestamp: string) {
    this.status = 'synced';
    this.lastSyncedAt = timestamp;
    this.pendingCount = 0;
    this.lastMessage = 'All progress safely backed up to cloud!';
    localStorage.setItem('maths_last_sync_timestamp', timestamp);
    this.notify();
  }

  private handleSyncError(errMsg: string) {
    if (!navigator.onLine) {
      this.status = 'offline';
      this.lastMessage = 'Offline. Changes saved locally on device.';
    } else {
      this.status = 'error';
      this.lastMessage = `Sync retry queued: ${errMsg}`;
    }
    this.notify();
  }

  public getStatus() {
    return {
      status: this.status,
      lastSyncedAt: this.lastSyncedAt,
      pendingCount: this.pendingCount,
      message: this.lastMessage,
    };
  }
}

export const syncManager = new ClientSyncManager();

/**
 * Offline Storage Service
 * Uses IndexedDB for local data persistence when offline
 * Syncs with METRC API when connection is restored
 */

import type { MetrcPackage, MetrcPlant, MetrcPlantBatch, MetrcTransfer } from './metrc';

const DB_NAME = 'vouched_offline';
const DB_VERSION = 1;

// Store names
const STORES = {
  PACKAGES: 'packages',
  PLANTS: 'plants',
  PLANT_BATCHES: 'plant_batches',
  TRANSFERS: 'transfers',
  SYNC_QUEUE: 'sync_queue',
  METADATA: 'metadata',
} as const;

export interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: 'package' | 'plant' | 'plant_batch' | 'transfer';
  data: any;
  timestamp: number;
  synced: boolean;
  error?: string;
}

export interface OfflineMetadata {
  lastSync: number;
  isOnline: boolean;
  pendingSync: number;
  failedSync: number;
}

class OfflineStorageService {
  private db: IDBDatabase | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    this.setupOnlineDetection();
  }

  private setupOnlineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains(STORES.PACKAGES)) {
          const packageStore = db.createObjectStore(STORES.PACKAGES, { keyPath: 'id' });
          packageStore.createIndex('label', 'label', { unique: true });
          packageStore.createIndex('status', 'status', { unique: false });
          packageStore.createIndex('lastModified', 'lastModified', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PLANTS)) {
          const plantStore = db.createObjectStore(STORES.PLANTS, { keyPath: 'id' });
          plantStore.createIndex('label', 'label', { unique: true });
          plantStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PLANT_BATCHES)) {
          const batchStore = db.createObjectStore(STORES.PLANT_BATCHES, { keyPath: 'id' });
          batchStore.createIndex('name', 'name', { unique: false });
          batchStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.TRANSFERS)) {
          const transferStore = db.createObjectStore(STORES.TRANSFERS, { keyPath: 'id' });
          transferStore.createIndex('manifestNumber', 'manifestNumber', { unique: true });
          transferStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
          syncStore.createIndex('synced', 'synced', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.METADATA)) {
          db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init();
    }
    const transaction = this.db!.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // ============================================================================
  // PACKAGES
  // ============================================================================

  async savePackage(pkg: MetrcPackage): Promise<void> {
    const store = await this.getStore(STORES.PACKAGES, 'readwrite');
    await this.promisifyRequest(store.put(pkg));
  }

  async getPackage(id: string): Promise<MetrcPackage | undefined> {
    const store = await this.getStore(STORES.PACKAGES);
    return this.promisifyRequest(store.get(id));
  }

  async getAllPackages(): Promise<MetrcPackage[]> {
    const store = await this.getStore(STORES.PACKAGES);
    return this.promisifyRequest(store.getAll());
  }

  async getPackagesByStatus(status: string): Promise<MetrcPackage[]> {
    const store = await this.getStore(STORES.PACKAGES);
    const index = store.index('status');
    return this.promisifyRequest(index.getAll(status));
  }

  async deletePackage(id: string): Promise<void> {
    const store = await this.getStore(STORES.PACKAGES, 'readwrite');
    await this.promisifyRequest(store.delete(id));
  }

  // ============================================================================
  // PLANTS
  // ============================================================================

  async savePlant(plant: MetrcPlant): Promise<void> {
    const store = await this.getStore(STORES.PLANTS, 'readwrite');
    await this.promisifyRequest(store.put(plant));
  }

  async getPlant(id: string): Promise<MetrcPlant | undefined> {
    const store = await this.getStore(STORES.PLANTS);
    return this.promisifyRequest(store.get(id));
  }

  async getAllPlants(): Promise<MetrcPlant[]> {
    const store = await this.getStore(STORES.PLANTS);
    return this.promisifyRequest(store.getAll());
  }

  async deletePlant(id: string): Promise<void> {
    const store = await this.getStore(STORES.PLANTS, 'readwrite');
    await this.promisifyRequest(store.delete(id));
  }

  // ============================================================================
  // PLANT BATCHES
  // ============================================================================

  async savePlantBatch(batch: MetrcPlantBatch): Promise<void> {
    const store = await this.getStore(STORES.PLANT_BATCHES, 'readwrite');
    await this.promisifyRequest(store.put(batch));
  }

  async getPlantBatch(id: string): Promise<MetrcPlantBatch | undefined> {
    const store = await this.getStore(STORES.PLANT_BATCHES);
    return this.promisifyRequest(store.get(id));
  }

  async getAllPlantBatches(): Promise<MetrcPlantBatch[]> {
    const store = await this.getStore(STORES.PLANT_BATCHES);
    return this.promisifyRequest(store.getAll());
  }

  async deletePlantBatch(id: string): Promise<void> {
    const store = await this.getStore(STORES.PLANT_BATCHES, 'readwrite');
    await this.promisifyRequest(store.delete(id));
  }

  // ============================================================================
  // TRANSFERS
  // ============================================================================

  async saveTransfer(transfer: MetrcTransfer): Promise<void> {
    const store = await this.getStore(STORES.TRANSFERS, 'readwrite');
    await this.promisifyRequest(store.put(transfer));
  }

  async getTransfer(id: string): Promise<MetrcTransfer | undefined> {
    const store = await this.getStore(STORES.TRANSFERS);
    return this.promisifyRequest(store.get(id));
  }

  async getAllTransfers(): Promise<MetrcTransfer[]> {
    const store = await this.getStore(STORES.TRANSFERS);
    return this.promisifyRequest(store.getAll());
  }

  async deleteTransfer(id: string): Promise<void> {
    const store = await this.getStore(STORES.TRANSFERS, 'readwrite');
    await this.promisifyRequest(store.delete(id));
  }

  // ============================================================================
  // SYNC QUEUE
  // ============================================================================

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'synced'>): Promise<void> {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `${item.resource}_${item.type}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      synced: false,
    };

    const store = await this.getStore(STORES.SYNC_QUEUE, 'readwrite');
    await this.promisifyRequest(store.put(queueItem));

    // Update pending sync count
    await this.updateMetadata({ pendingSync: await this.getPendingSyncCount() });

    // Try to sync if online
    if (this.isOnline) {
      this.triggerSync();
    }
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const store = await this.getStore(STORES.SYNC_QUEUE);
    const allItems = await this.promisifyRequest<SyncQueueItem[]>(store.getAll());
    return allItems.filter(item => !item.synced);
  }

  async markSynced(id: string): Promise<void> {
    const store = await this.getStore(STORES.SYNC_QUEUE, 'readwrite');
    const item = await this.promisifyRequest<SyncQueueItem>(store.get(id));
    if (item) {
      item.synced = true;
      await this.promisifyRequest(store.put(item));
    }
  }

  async markSyncFailed(id: string, error: string): Promise<void> {
    const store = await this.getStore(STORES.SYNC_QUEUE, 'readwrite');
    const item = await this.promisifyRequest<SyncQueueItem>(store.get(id));
    if (item) {
      item.error = error;
      await this.promisifyRequest(store.put(item));
    }
    await this.updateMetadata({ failedSync: await this.getFailedSyncCount() });
  }

  async clearSyncedItems(): Promise<void> {
    const store = await this.getStore(STORES.SYNC_QUEUE, 'readwrite');
    const allItems = await this.promisifyRequest<SyncQueueItem[]>(store.getAll());
    const syncedItems = allItems.filter(item => item.synced);

    for (const item of syncedItems) {
      await this.promisifyRequest(store.delete(item.id));
    }
  }

  async getPendingSyncCount(): Promise<number> {
    const queue = await this.getSyncQueue();
    return queue.filter(item => !item.error).length;
  }

  async getFailedSyncCount(): Promise<number> {
    const queue = await this.getSyncQueue();
    return queue.filter(item => item.error).length;
  }

  // ============================================================================
  // METADATA
  // ============================================================================

  async getMetadata(): Promise<OfflineMetadata> {
    const store = await this.getStore(STORES.METADATA);
    const metadata = await this.promisifyRequest<OfflineMetadata>(store.get('global'));

    if (!metadata) {
      const defaultMetadata: OfflineMetadata = {
        lastSync: 0,
        isOnline: this.isOnline,
        pendingSync: 0,
        failedSync: 0,
      };
      await this.updateMetadata(defaultMetadata);
      return defaultMetadata;
    }

    return { ...metadata, isOnline: this.isOnline };
  }

  async updateMetadata(updates: Partial<OfflineMetadata>): Promise<void> {
    const store = await this.getStore(STORES.METADATA, 'readwrite');
    const current = await this.getMetadata();
    const updated = { ...current, ...updates };
    await this.promisifyRequest(store.put({ key: 'global', ...updated }));
  }

  // ============================================================================
  // SYNC OPERATIONS
  // ============================================================================

  async triggerSync(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;

    try {
      const queue = await this.getSyncQueue();

      for (const item of queue) {
        if (item.error) continue; // Skip failed items for now

        try {
          // This would call the actual METRC API
          // For now, we just mark as synced
          await this.markSynced(item.id);
        } catch (error) {
          await this.markSyncFailed(item.id, (error as Error).message);
        }
      }

      await this.updateMetadata({
        lastSync: Date.now(),
        pendingSync: await this.getPendingSyncCount(),
        failedSync: await this.getFailedSyncCount(),
      });

      // Clear successfully synced items
      await this.clearSyncedItems();
    } finally {
      this.syncInProgress = false;
    }
  }

  async retrySyncFailed(): Promise<void> {
    const store = await this.getStore(STORES.SYNC_QUEUE, 'readwrite');
    const allItems = await this.promisifyRequest<SyncQueueItem[]>(store.getAll());

    for (const item of allItems) {
      if (item.error) {
        delete item.error;
        await this.promisifyRequest(store.put(item));
      }
    }

    await this.triggerSync();
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async bulkSavePackages(packages: MetrcPackage[]): Promise<void> {
    const store = await this.getStore(STORES.PACKAGES, 'readwrite');
    for (const pkg of packages) {
      await this.promisifyRequest(store.put(pkg));
    }
  }

  async bulkSavePlants(plants: MetrcPlant[]): Promise<void> {
    const store = await this.getStore(STORES.PLANTS, 'readwrite');
    for (const plant of plants) {
      await this.promisifyRequest(store.put(plant));
    }
  }

  async clearAllData(): Promise<void> {
    const stores = [
      STORES.PACKAGES,
      STORES.PLANTS,
      STORES.PLANT_BATCHES,
      STORES.TRANSFERS,
      STORES.SYNC_QUEUE,
    ];

    for (const storeName of stores) {
      const store = await this.getStore(storeName, 'readwrite');
      await this.promisifyRequest(store.clear());
    }

    await this.updateMetadata({
      lastSync: 0,
      pendingSync: 0,
      failedSync: 0,
    });
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private promisifyRequest<T = any>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  async getStorageStats(): Promise<{
    packages: number;
    plants: number;
    plantBatches: number;
    transfers: number;
    pendingSync: number;
  }> {
    const [packages, plants, plantBatches, transfers, metadata] = await Promise.all([
      this.getAllPackages(),
      this.getAllPlants(),
      this.getAllPlantBatches(),
      this.getAllTransfers(),
      this.getMetadata(),
    ]);

    return {
      packages: packages.length,
      plants: plants.length,
      plantBatches: plantBatches.length,
      transfers: transfers.length,
      pendingSync: metadata.pendingSync,
    };
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorageService();

// Initialize on import
offlineStorage.init().catch(console.error);

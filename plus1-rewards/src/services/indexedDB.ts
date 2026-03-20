import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface Plus1DB extends DBSchema {
  members: {
    key: string
    value: {
      id: string
      name: string
      phone?: string
      dob?: string
      qrCode: string
      activePolicy?: string
      createdAt: number
    }
  }
  wallets: {
    key: string
    value: {
      id: string
      memberId: string
      partnerId: string
      rewardsTotal: number
      policies: Record<string, any>
      status: 'active' | 'paused'
      createdAt: number
    }
  }
  transactions: {
    key: string
    value: {
      id: string
      partnerId: string
      memberId: string
      amount: number
      type: 'earn' | 'spend'
      status: 'pending_sync' | 'synced'
      createdAt: number
      offlineSignature?: string
    }
    indexes: { 'by-created': number }
  }
  syncQueue: {
    key: string
    value: {
      id: string
      action: string
      data: any
      timestamp: number
      synced: boolean
    }
  }
}

let db: IDBPDatabase<Plus1DB> | null = null

export async function initDB(): Promise<IDBPDatabase<Plus1DB>> {
  if (db) return db

  db = await openDB<Plus1DB>('+1-rewards', 1, {
    upgrade(db) {
      // Members store
      if (!db.objectStoreNames.contains('members')) {
        db.createObjectStore('members', { keyPath: 'id' })
      }

      // Wallets store
      if (!db.objectStoreNames.contains('wallets')) {
        db.createObjectStore('wallets', { keyPath: 'id' })
      }

      // Transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' })
        txStore.createIndex('by-created', 'createdAt')
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' })
      }
    },
  })

  return db
}

export async function getDB(): Promise<IDBPDatabase<Plus1DB>> {
  if (!db) {
    return initDB()
  }
  return db
}

export async function addTransaction(transaction: Plus1DB['transactions']['value']) {
  const database = await getDB()
  return database.add('transactions', transaction)
}

export async function getTransactions() {
  const database = await getDB()
  return database.getAll('transactions')
}

export async function addToSyncQueue(item: Plus1DB['syncQueue']['value']) {
  const database = await getDB()
  return database.add('syncQueue', item)
}

export async function getSyncQueue() {
  const database = await getDB()
  return database.getAll('syncQueue')
}

export async function clearSyncQueue() {
  const database = await getDB()
  const keys = await database.getAllKeys('syncQueue')
  for (const key of keys) {
    await database.delete('syncQueue', key)
  }
}

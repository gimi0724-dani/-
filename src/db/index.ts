import { openDB, type IDBPDatabase } from 'idb'
import type { Transaction, MerchantMap } from '../types'

const DB_NAME = '내가계부'
const DB_VERSION = 1

export type AppDB = {
  transactions: {
    key: string
    value: Transaction
    indexes: { date: Date; category: string; type: string }
  }
  merchantMap: {
    key: string
    value: MerchantMap
  }
  settings: {
    key: string
    value: { key: string; value: unknown }
  }
}

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null

export function getDB(): Promise<IDBPDatabase<AppDB>> {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' })
        txStore.createIndex('date', 'date')
        txStore.createIndex('category', 'category')
        txStore.createIndex('type', 'type')

        db.createObjectStore('merchantMap', { keyPath: 'merchant' })
        db.createObjectStore('settings', { keyPath: 'key' })
      },
    })
  }
  return dbPromise
}

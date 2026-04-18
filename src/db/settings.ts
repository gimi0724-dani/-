import { getDB } from './index'

export async function getSetting<T>(key: string): Promise<T | null> {
  const db = await getDB()
  const record = await db.get('settings', key)
  return record ? (record.value as T) : null
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB()
  await db.put('settings', { key, value })
}

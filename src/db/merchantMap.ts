import { getDB } from './index'
import type { MerchantMap, Category } from '../types'

export async function getMerchantCategory(merchant: string): Promise<Category | null> {
  const db = await getDB()
  const normalized = normalizeMerchant(merchant)

  // 정확히 일치하는 매핑 먼저 탐색
  const exact = await db.get('merchantMap', normalized)
  if (exact) return exact.category

  // prefix 부분 매칭 탐색 (예: "스타벅스강남점" → "스타벅스")
  const all = await db.getAll('merchantMap')
  const match = all.find(
    (m) => normalized.startsWith(m.merchant) || m.merchant.startsWith(normalized)
  )
  return match ? match.category : null
}

export async function setMerchantCategory(merchant: string, category: Category): Promise<void> {
  const db = await getDB()
  const normalized = normalizeMerchant(merchant)
  const existing = await db.get('merchantMap', normalized)

  const record: MerchantMap = {
    merchant: normalized,
    category,
    updatedAt: new Date(),
    count: (existing?.count ?? 0) + 1,
  }
  await db.put('merchantMap', record)
}

export function normalizeMerchant(merchant: string): string {
  return merchant.toLowerCase().replace(/[\s\W]/g, '')
}

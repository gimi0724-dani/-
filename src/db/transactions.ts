import { getDB } from './index'
import type { Transaction } from '../types'

export async function addTransaction(tx: Transaction): Promise<void> {
  const db = await getDB()
  await db.add('transactions', tx)
}

export async function getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('transactions', 'date')
  return all.filter((tx) => {
    const d = new Date(tx.date)
    return d.getFullYear() === year && d.getMonth() + 1 === month
  })
}

export async function updateTransaction(tx: Transaction): Promise<void> {
  const db = await getDB()
  await db.put('transactions', tx)
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('transactions', id)
}

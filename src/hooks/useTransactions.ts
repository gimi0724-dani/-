import { useState, useEffect, useCallback } from 'react'
import type { Transaction } from '../types'
import { getTransactionsByMonth, addTransaction, updateTransaction, deleteTransaction } from '../db/transactions'

export function useTransactions(year: number, month: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const load = useCallback(async () => {
    const data = await getTransactionsByMonth(year, month)
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setTransactions(data)
  }, [year, month])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (tx: Transaction) => {
    await addTransaction(tx)
    await load()
  }, [load])

  const update = useCallback(async (tx: Transaction) => {
    await updateTransaction(tx)
    await load()
  }, [load])

  const remove = useCallback(async (id: string) => {
    await deleteTransaction(id)
    await load()
  }, [load])

  return { transactions, add, update, remove, reload: load }
}

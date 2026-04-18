import { useMemo } from 'react'
import type { Transaction } from '../types'

export function useSummary(transactions: Transaction[]) {
  return useMemo(() => {
    let income = 0
    let expense = 0
    for (const tx of transactions) {
      if (tx.type === 'income') income += tx.amount
      else expense += tx.amount
    }
    return { income, expense, net: income - expense }
  }, [transactions])
}

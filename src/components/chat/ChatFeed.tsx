import { useEffect, useRef } from 'react'
import type { Transaction } from '../../types'
import { TransactionBubble } from './TransactionBubble'
import { DateDivider } from './DateDivider'
import { isSameDay } from '../../utils/format'

interface Props {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
}

export function ChatFeed({ transactions, onEdit }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transactions.length])

  if (transactions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <p className="text-4xl">💸</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>첫 거래를 입력해보세요</p>
        <p className="text-xs" style={{ color: '#4b5563' }}>"스타벅스 아아 4500"</p>
      </div>
    )
  }

  const items: React.ReactNode[] = []
  let lastDate: Date | null = null

  for (const tx of transactions) {
    const txDate = new Date(tx.date)
    if (!lastDate || !isSameDay(lastDate, txDate)) {
      items.push(<DateDivider key={`d-${tx.id}`} date={txDate} />)
      lastDate = txDate
    }
    items.push(<TransactionBubble key={tx.id} transaction={tx} onEdit={onEdit} />)
  }

  return (
    <div className="flex-1 overflow-y-auto py-2">
      {items}
      <div ref={bottomRef} />
    </div>
  )
}

import { useState } from 'react'
import type { Transaction } from './types'
import { Header } from './components/layout/Header'
import { ChatFeed } from './components/chat/ChatFeed'
import { InputBar } from './components/layout/InputBar'
import { useTransactions } from './hooks/useTransactions'
import { useSummary } from './hooks/useSummary'
import { useParser } from './hooks/useParser'
import { generateId } from './utils/uuid'
import type { ParseResult } from './types'

export default function App() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  const { transactions, add, update, remove } = useTransactions(year, month)
  const { income, expense, net } = useSummary(transactions)
  const { parseInput } = useParser()

  function handlePrev() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  function handleNext() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  async function handleSubmit(input: string, parsed: ParseResult) {
    const result = await parseInput(input)
    const tx: Transaction = {
      id: generateId(),
      date: new Date(),
      amount: result.amount,
      type: result.type,
      category: result.category,
      merchant: result.merchant,
      memo: result.memo,
      rawInput: input,
      createdAt: new Date(),
    }
    await add(tx)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#141414' }}>
      <Header
        year={year} month={month}
        income={income} expense={expense} net={net}
        onPrev={handlePrev} onNext={handleNext}
        onChart={() => {}} onReport={() => {}} onSettings={() => {}}
      />
      <ChatFeed transactions={transactions} onEdit={setEditingTx} />
      <InputBar onSubmit={handleSubmit} />
      {/* EditModal — Phase 4에서 구현 */}
      {editingTx && (
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setEditingTx(null)}
        >
          <div className="w-full rounded-t-2xl p-6" style={{ background: '#252525' }} onClick={e => e.stopPropagation()}>
            <p className="text-sm mb-1" style={{ color: '#9ca3af' }}>Phase 4에서 수정 기능 추가 예정</p>
            <p className="font-bold" style={{ color: '#ffffff' }}>{editingTx.merchant}</p>
            <button className="mt-4 text-sm" style={{ color: '#ff6500' }} onClick={() => remove(editingTx.id).then(() => setEditingTx(null))}>
              삭제하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import type { Transaction, ParseResult } from './types'
import { Header } from './components/layout/Header'
import { ChatFeed } from './components/chat/ChatFeed'
import { InputBar } from './components/layout/InputBar'
import { EditModal } from './components/modals/EditModal'
import { ChartModal } from './components/modals/ChartModal'
import { ReportModal } from './components/modals/ReportModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { useTransactions } from './hooks/useTransactions'
import { useSummary } from './hooks/useSummary'
import { useParser } from './hooks/useParser'
import { generateId } from './utils/uuid'

export default function App() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [showChart, setShowChart] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

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

  async function handleSubmit(input: string, _parsed: ParseResult) {
    try {
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
    } catch (e) {
      console.error('handleSubmit failed:', e)
    }
  }

  async function handleSave(tx: Transaction) {
    await update(tx)
    setEditingTx(null)
  }

  async function handleDelete(id: string) {
    await remove(id)
    setEditingTx(null)
  }

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#141414' }}>
      <Header
        year={year} month={month}
        income={income} expense={expense} net={net}
        onPrev={handlePrev} onNext={handleNext}
        onChart={() => setShowChart(true)} onReport={() => setShowReport(true)} onSettings={() => setShowSettings(true)}
      />
      <ChatFeed transactions={transactions} onEdit={setEditingTx} />
      <InputBar onSubmit={handleSubmit} />
      {editingTx && (
        <EditModal
          transaction={editingTx}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setEditingTx(null)}
        />
      )}
      {showChart && (
        <ChartModal transactions={transactions} year={year} month={month} onClose={() => setShowChart(false)} />
      )}
      {showReport && (
        <ReportModal transactions={transactions} year={year} month={month} onClose={() => setShowReport(false)} />
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

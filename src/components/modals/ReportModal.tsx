import { useMemo } from 'react'
import type { Transaction } from '../../types'
import { CATEGORY_EMOJI } from '../../types'
import { formatAmount } from '../../utils/format'

interface Props {
  transactions: Transaction[]
  year: number
  month: number
  onClose: () => void
}

export function ReportModal({ transactions, year, month, onClose }: Props) {
  const report = useMemo(() => {
    let income = 0
    let expense = 0
    const categoryMap: Record<string, number> = {}
    const merchantMap: Record<string, number> = {}

    for (const tx of transactions) {
      if (tx.type === 'income') {
        income += tx.amount
      } else {
        expense += tx.amount
        categoryMap[tx.category] = (categoryMap[tx.category] ?? 0) + tx.amount
        if (tx.merchant) {
          merchantMap[tx.merchant] = (merchantMap[tx.merchant] ?? 0) + tx.amount
        }
      }
    }

    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const topMerchants = Object.entries(merchantMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return { income, expense, net: income - expense, topCategories, topMerchants, txCount: transactions.length }
  }, [transactions])

  return (
    <div
      className="absolute inset-0 flex items-end justify-center z-10"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl overflow-y-auto"
        style={{ background: '#1e1e1e', maxHeight: '85vh', paddingTop: 20, paddingBottom: 40, paddingLeft: 20, paddingRight: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold text-base" style={{ color: '#ffffff' }}>{year}년 {month}월 리포트</p>
          <button onClick={onClose} style={{ color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {/* 월 요약 */}
        <div className="rounded-xl mb-4" style={{ background: '#252525', padding: 16 }}>
          <p className="text-xs mb-3" style={{ color: '#6b7280' }}>월 요약 · {report.txCount}건</p>
          <div className="flex justify-between">
            <div>
              <p className="text-xs mb-1" style={{ color: '#6b7280' }}>지출</p>
              <p className="font-bold text-sm" style={{ color: '#ffffff' }}>{formatAmount(report.expense)}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: '#6b7280' }}>수입</p>
              <p className="font-bold text-sm" style={{ color: '#ff6500' }}>{formatAmount(report.income)}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: '#6b7280' }}>순액</p>
              <p className="font-bold text-sm" style={{ color: report.net >= 0 ? '#ff6500' : '#ef4444' }}>
                {report.net >= 0 ? '+' : ''}{formatAmount(report.net)}
              </p>
            </div>
          </div>
        </div>

        {/* 카테고리 TOP 5 */}
        {report.topCategories.length > 0 && (
          <div className="mb-4">
            <p className="text-xs mb-3" style={{ color: '#6b7280' }}>카테고리별 지출</p>
            {report.topCategories.map(([cat, amount], i) => {
              const pct = report.expense > 0 ? Math.round(amount / report.expense * 100) : 0
              return (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: '#ffffff' }}>
                      {i + 1}. {CATEGORY_EMOJI[cat as keyof typeof CATEGORY_EMOJI]} {cat}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>{formatAmount(amount)}</span>
                  </div>
                  <div className="w-full rounded-full" style={{ background: '#333333', height: 4 }}>
                    <div className="rounded-full" style={{ background: '#ff6500', width: `${pct}%`, height: 4 }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 자주 간 곳 TOP 3 */}
        {report.topMerchants.length > 0 && (
          <div>
            <p className="text-xs mb-3" style={{ color: '#6b7280' }}>많이 쓴 곳 TOP 3</p>
            {report.topMerchants.map(([merchant, amount], i) => (
              <div key={merchant} className="flex items-center justify-between" style={{ paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #2a2a2a' }}>
                <span className="text-sm" style={{ color: '#ffffff' }}>
                  <span style={{ color: '#ff6500', marginRight: 8 }}>{i + 1}</span>{merchant}
                </span>
                <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>{formatAmount(amount)}</span>
              </div>
            ))}
          </div>
        )}

        {report.txCount === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: '#6b7280' }}>이번 달 기록이 없습니다</p>
        )}
      </div>
    </div>
  )
}

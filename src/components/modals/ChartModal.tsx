import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import type { Transaction } from '../../types'
import { CATEGORY_EMOJI } from '../../types'
import { formatAmount } from '../../utils/format'

interface Props {
  transactions: Transaction[]
  year: number
  month: number
  onClose: () => void
}

const COLORS = ['#ff6500', '#ff8c42', '#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#457b9d', '#6c757d']

export function ChartModal({ transactions, year, month, onClose }: Props) {
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}
    for (const tx of transactions) {
      if (tx.type === 'expense') {
        map[tx.category] = (map[tx.category] ?? 0) + tx.amount
      }
    }
    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount, emoji: CATEGORY_EMOJI[category as keyof typeof CATEGORY_EMOJI] }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const total = categoryData.reduce((s, d) => s + d.amount, 0)

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
          <p className="font-bold text-base" style={{ color: '#ffffff' }}>{year}년 {month}월 카테고리</p>
          <button onClick={onClose} style={{ color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {categoryData.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: '#6b7280' }}>지출 내역이 없습니다</p>
        ) : (
          <>
            {/* 파이차트 */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatAmount(Number(value))}
                  contentStyle={{ background: '#252525', border: 'none', borderRadius: 8, color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* 바차트 */}
            <ResponsiveContainer width="100%" height={180} style={{ marginTop: 16 }}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="category" width={70} tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickFormatter={(v) => `${CATEGORY_EMOJI[v as keyof typeof CATEGORY_EMOJI]} ${v}`}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* 카테고리 목록 */}
            <div style={{ marginTop: 20 }}>
              {categoryData.map((d, i) => (
                <div key={d.category} className="flex items-center justify-between" style={{ paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #2a2a2a' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm" style={{ color: '#ffffff' }}>{d.emoji} {d.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>{formatAmount(d.amount)}</p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{total > 0 ? Math.round(d.amount / total * 100) : 0}%</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

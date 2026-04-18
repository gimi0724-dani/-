import { useState } from 'react'
import type { Transaction, Category } from '../../types'
import { CATEGORIES, CATEGORY_EMOJI } from '../../types'
import { formatAmount } from '../../utils/format'
import { setMerchantCategory } from '../../db/merchantMap'

interface Props {
  transaction: Transaction
  onSave: (tx: Transaction) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function EditModal({ transaction, onSave, onDelete, onClose }: Props) {
  const [category, setCategory] = useState<Category>(transaction.category)
  const [amount, setAmount] = useState(String(transaction.amount))
  const [memo, setMemo] = useState(transaction.memo)

  async function handleSave() {
    const parsed = parseInt(amount.replace(/,/g, ''), 10)
    if (!parsed || isNaN(parsed)) return

    // 카테고리가 변경된 경우 학습 DB 업데이트
    if (category !== transaction.category && transaction.merchant) {
      await setMerchantCategory(transaction.merchant, category)
    }

    onSave({ ...transaction, category, amount: parsed, memo })
  }

  return (
    <div
      className="absolute inset-0 flex items-end justify-center z-10"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl"
        style={{ background: '#1e1e1e', paddingTop: 12, paddingLeft: 20, paddingRight: 20, paddingBottom: 40 }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <p className="font-bold text-base" style={{ color: '#ffffff', paddingLeft: 3 }}>
            {transaction.merchant}
          </p>
          <p className="text-sm" style={{ color: '#9ca3af', paddingRight: 3 }}>
            {formatAmount(transaction.amount)}
          </p>
        </div>

        {/* 금액 */}
        <div style={{ marginBottom: 18 }}>
          <p className="text-xs" style={{ color: '#6b7280', marginBottom: 4, paddingLeft: 3 }}>금액</p>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-xl text-sm outline-none"
            style={{ background: '#252525', color: '#ffffff', paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 10, display: 'flex', alignItems: 'center' }}
          />
        </div>

        {/* 메모 */}
        <div style={{ marginBottom: 18 }}>
          <p className="text-xs" style={{ color: '#6b7280', marginBottom: 4, paddingLeft: 3 }}>메모</p>
          <input
            type="text"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            className="w-full rounded-xl text-sm outline-none"
            style={{ background: '#252525', color: '#ffffff', paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 10, display: 'flex', alignItems: 'center' }}
            placeholder="메모 없음"
          />
        </div>

        {/* 카테고리 */}
        <div style={{ marginBottom: 18 }}>
          <p className="text-xs" style={{ color: '#6b7280', marginBottom: 8, paddingLeft: 3 }}>카테고리</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="rounded-full text-xs transition-all"
                style={{
                  background: category === cat ? '#ff6500' : '#333333',
                  color: category === cat ? '#ffffff' : '#9ca3af',
                  paddingLeft: 15, paddingRight: 15, paddingTop: 7, paddingBottom: 7,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {CATEGORY_EMOJI[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(transaction.id)}
            className="flex-1 rounded-xl text-sm font-semibold"
            style={{ background: '#333333', color: '#ef4444', paddingTop: 10, paddingBottom: 10 }}
          >
            삭제
          </button>
          <button
            onClick={handleSave}
            className="flex-2 py-3 rounded-xl text-sm font-semibold"
            style={{ background: '#ff6500', color: '#ffffff', flex: 2, paddingTop: 10, paddingBottom: 10 }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

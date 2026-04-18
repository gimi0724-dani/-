import type { Transaction } from '../../types'
import { CATEGORY_EMOJI } from '../../types'
import { formatAmount } from '../../utils/format'

interface Props {
  transaction: Transaction
  onEdit: (tx: Transaction) => void
}

export function TransactionBubble({ transaction: tx, onEdit }: Props) {
  const isIncome = tx.type === 'income'
  const emoji = CATEGORY_EMOJI[tx.category]

  return (
    <div className="flex justify-end px-4" style={{ marginBottom: 12 }}>
      <button
        onClick={() => onEdit(tx)}
        className="text-left rounded-2xl rounded-tr-sm max-w-[80%] active:opacity-70 transition-opacity" style={{ background: '#252525', padding: 12, paddingTop: 10, paddingBottom: 10 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full" style={{ background: '#333333', color: '#9ca3af', fontSize: 13 }}>
            {emoji} {tx.category}
          </span>
        </div>
        <p className="font-semibold text-sm" style={{ color: '#ffffff' }}>
          {tx.merchant}{tx.memo ? ` · ${tx.memo}` : ''}
        </p>
        <p className="text-base font-bold mt-0.5" style={{ color: isIncome ? '#ff6500' : '#ffffff' }}>
          {isIncome ? '+' : '-'}{formatAmount(tx.amount)}
        </p>
      </button>
    </div>
  )
}

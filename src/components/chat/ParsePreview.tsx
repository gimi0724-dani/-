import type { ParseResult } from '../../types'
import { CATEGORY_EMOJI } from '../../types'
import { formatAmount } from '../../utils/format'

export function ParsePreview({ result }: { result: ParseResult | null }) {
  if (!result || result.amount === 0) return null

  const isIncome = result.type === 'income'
  const emoji = CATEGORY_EMOJI[result.category]

  return (
    <div className="mx-3 mb-2 px-3 py-2 rounded-xl flex items-center gap-2 text-sm" style={{ background: '#252525' }}>
      <span style={{ color: '#9ca3af' }}>{emoji} {result.category}</span>
      <span className="flex-1 truncate" style={{ color: '#ffffff' }}>
        {result.merchant}{result.memo ? ` · ${result.memo}` : ''}
      </span>
      <span className="font-bold shrink-0" style={{ color: isIncome ? '#ff6500' : '#ffffff' }}>
        {isIncome ? '+' : '-'}{formatAmount(result.amount)}
      </span>
    </div>
  )
}

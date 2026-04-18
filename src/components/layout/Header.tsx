import { formatAmount, formatMonth } from '../../utils/format'

interface Props {
  year: number
  month: number
  income: number
  expense: number
  net: number
  onPrev: () => void
  onNext: () => void
  onChart: () => void
  onReport: () => void
  onSettings: () => void
}

export function Header({ year, month, income, expense, net, onPrev, onNext, onChart, onReport, onSettings }: Props) {
  const isCurrentMonth = (() => {
    const now = new Date()
    return now.getFullYear() === year && now.getMonth() + 1 === month
  })()

  return (
    <div className="shrink-0 px-4 pt-4 pb-3" style={{ borderBottom: '1px solid #333333' }}>
      {/* 월 이동 + 우상단 버튼 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="w-7 h-7 flex items-center justify-center rounded-full transition-opacity active:opacity-60" style={{ color: '#9ca3af' }}>
            ‹
          </button>
          <span className="font-bold text-base" style={{ color: '#ffffff' }}>
            {formatMonth(year, month)}
          </span>
          <button
            onClick={onNext}
            disabled={isCurrentMonth}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-opacity active:opacity-60 disabled:opacity-20"
            style={{ color: '#9ca3af' }}
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onChart} className="w-8 h-8 flex items-center justify-center rounded-full text-base active:opacity-60" title="카테고리 차트">
            📊
          </button>
          <button onClick={onReport} className="w-8 h-8 flex items-center justify-center rounded-full text-base active:opacity-60" title="월별 리포트">
            📋
          </button>
          <button onClick={onSettings} className="w-8 h-8 flex items-center justify-center rounded-full text-base active:opacity-60" title="설정">
            ⚙️
          </button>
        </div>
      </div>

      {/* 월 요약 */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl" style={{ background: '#252525', paddingLeft: 19, paddingRight: 12, paddingTop: 17, paddingBottom: 17 }}>
          <p className="text-xs mb-0.5" style={{ color: '#6b7280' }}>지출</p>
          <p className="font-bold text-sm" style={{ color: '#ffffff' }}>{formatAmount(expense)}</p>
        </div>
        <div className="flex-1 rounded-xl" style={{ background: '#252525', paddingLeft: 19, paddingRight: 12, paddingTop: 17, paddingBottom: 17 }}>
          <p className="text-xs mb-0.5" style={{ color: '#6b7280' }}>수입</p>
          <p className="font-bold text-sm" style={{ color: '#ff6500' }}>{formatAmount(income)}</p>
        </div>
        <div className="flex-1 rounded-xl" style={{ background: '#252525', paddingLeft: 19, paddingRight: 12, paddingTop: 17, paddingBottom: 17 }}>
          <p className="text-xs mb-0.5" style={{ color: '#6b7280' }}>순액</p>
          <p className="font-bold text-sm" style={{ color: net >= 0 ? '#ff6500' : '#ef4444' }}>
            {net >= 0 ? '+' : ''}{formatAmount(net)}
          </p>
        </div>
      </div>
    </div>
  )
}

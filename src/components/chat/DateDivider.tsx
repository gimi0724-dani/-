import { formatDate } from '../../utils/format'

export function DateDivider({ date }: { date: Date }) {
  return (
    <div className="flex items-center gap-3 my-[6px] px-4">
      <div className="flex-1 h-px" style={{ background: '#333333' }} />
      <span className="text-xs" style={{ color: '#6b7280' }}>{formatDate(date)}</span>
      <div className="flex-1 h-px" style={{ background: '#333333' }} />
    </div>
  )
}

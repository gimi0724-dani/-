export function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

export function formatDate(date: Date): string {
  const d = new Date(date)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export function formatMonth(year: number, month: number): string {
  return `${year}년 ${month}월`
}

export function isSameDay(a: Date, b: Date): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

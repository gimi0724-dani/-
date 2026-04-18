export function extractAmount(input: string): { amount: number; remaining: string } {
  // "3만", "3만원", "3.5만" 처리
  const manPattern = /(\d+(?:\.\d+)?)만원?/
  const manMatch = input.match(manPattern)
  if (manMatch) {
    const amount = Math.round(parseFloat(manMatch[1]) * 10000)
    const remaining = input.replace(manMatch[0], '').trim()
    return { amount, remaining }
  }

  // "1,234,567원" 또는 "1234567" 처리
  const numPattern = /[\d,]+(?:원)?/
  const numMatch = input.match(numPattern)
  if (numMatch) {
    const amount = parseInt(numMatch[0].replace(/[,원]/g, ''), 10)
    const remaining = input.replace(numMatch[0], '').trim()
    return { amount, remaining }
  }

  return { amount: 0, remaining: input }
}

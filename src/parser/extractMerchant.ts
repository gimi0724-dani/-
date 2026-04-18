import { INCOME_KEYWORDS } from './keywords'

export function extractMerchant(remaining: string): { merchant: string; memo: string } {
  const tokens = remaining.trim().split(/\s+/).filter(Boolean)

  if (tokens.length === 0) return { merchant: '', memo: '' }
  if (tokens.length === 1) return { merchant: tokens[0], memo: '' }

  // 수입 키워드가 포함되면 마지막 토큰이 키워드일 가능성 → 첫 토큰이 상호명
  const lastToken = tokens[tokens.length - 1]
  if (INCOME_KEYWORDS.includes(lastToken)) {
    return { merchant: tokens.slice(0, -1).join(' '), memo: '' }
  }

  // 첫 토큰 = 상호명, 나머지 = 메모
  return { merchant: tokens[0], memo: tokens.slice(1).join(' ') }
}

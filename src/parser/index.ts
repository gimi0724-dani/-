import type { ParseResult, Category } from '../types'
import { INCOME_KEYWORDS } from './keywords'
import { extractAmount } from './extractAmount'
import { extractMerchant } from './extractMerchant'
import { classifyCategory } from './classifyCategory'

export function parse(input: string, learnedCategory?: Category | null): ParseResult {
  const trimmed = input.trim()

  // 수입 키워드 감지
  const isIncome = INCOME_KEYWORDS.some((kw) => trimmed.includes(kw))
  const type = isIncome ? 'income' : 'expense'

  // 금액 추출
  const { amount, remaining } = extractAmount(trimmed)

  // 상호명 / 메모 분리 (수입 키워드 제거 후)
  const cleanedRemaining = INCOME_KEYWORDS.reduce(
    (str, kw) => str.replace(new RegExp(kw, 'g'), '').trim(),
    remaining,
  )
  const { merchant, memo } = extractMerchant(cleanedRemaining)

  // 카테고리: 학습된 매핑 → 수입 감지 → 키워드 사전
  let category: Category
  if (learnedCategory) {
    category = learnedCategory
  } else if (isIncome) {
    category = '수입'
  } else {
    category = classifyCategory(merchant, memo)
  }

  return { merchant, amount, type, category, memo }
}

// 브라우저 콘솔 검증용
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).parse = parse
}

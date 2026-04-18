import type { Category } from '../types'
import { CATEGORY_KEYWORDS } from './keywords'

export function classifyCategory(merchant: string, memo: string): Category {
  const haystack = (merchant + ' ' + memo).toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    Exclude<Category, '수입'>,
    string[],
  ][]) {
    if (keywords.some((kw) => haystack.includes(kw.toLowerCase()))) {
      return category
    }
  }

  return '기타'
}

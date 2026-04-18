export type Category =
  | '식비'
  | '카페'
  | '교통'
  | '쇼핑'
  | '문화/여가'
  | '주거/공과금'
  | '건강/의료'
  | '기타'
  | '수입'

export type TransactionType = 'expense' | 'income'

export interface Transaction {
  id: string
  date: Date
  amount: number
  type: TransactionType
  category: Category
  merchant: string
  memo: string
  rawInput: string
  createdAt: Date
}

export interface MerchantMap {
  merchant: string // 정규화된 소문자 상호명 (PK)
  category: Category
  updatedAt: Date
  count: number
}

export interface ParseResult {
  merchant: string
  amount: number
  type: TransactionType
  category: Category
  memo: string
}

export const CATEGORIES: Category[] = [
  '식비',
  '카페',
  '교통',
  '쇼핑',
  '문화/여가',
  '주거/공과금',
  '건강/의료',
  '기타',
  '수입',
]

export const CATEGORY_EMOJI: Record<Category, string> = {
  '식비': '🍚',
  '카페': '☕',
  '교통': '🚇',
  '쇼핑': '🛍️',
  '문화/여가': '🎬',
  '주거/공과금': '🏠',
  '건강/의료': '💊',
  '기타': '📦',
  '수입': '💰',
}

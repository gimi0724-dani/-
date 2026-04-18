import Anthropic from '@anthropic-ai/sdk'
import type { ParseResult, Category } from '../types'
import { CATEGORIES } from '../types'

const CATEGORY_LIST = CATEGORIES.join(', ')

export async function llmParse(input: string, apiKey: string): Promise<ParseResult | null> {
  if (!apiKey) return null

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const prompt = `한국어 가계부 입력을 분석해서 JSON으로만 응답해. 다른 텍스트 없이 JSON만.

입력: "${input}"

응답 형식:
{
  "merchant": "상호명 (브랜드/가게 이름만, 없으면 빈 문자열)",
  "amount": 숫자 (원 단위, 숫자만),
  "type": "expense" 또는 "income",
  "category": "${CATEGORY_LIST}" 중 하나,
  "memo": "추가 설명 (없으면 빈 문자열)"
}

규칙:
- amount는 숫자만 (콤마, 원 표시 없음)
- 월급/급여/수입/입금이면 type=income, category=수입
- category는 반드시 위 목록 중 하나`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const parsed = JSON.parse(jsonMatch[0])

    const category: Category = CATEGORIES.includes(parsed.category) ? parsed.category : '기타'
    const amount = typeof parsed.amount === 'number' ? parsed.amount : parseInt(String(parsed.amount).replace(/\D/g, ''), 10) || 0
    const type = parsed.type === 'income' ? 'income' : 'expense'

    return {
      merchant: String(parsed.merchant ?? ''),
      amount,
      type,
      category,
      memo: String(parsed.memo ?? ''),
    }
  } catch {
    return null
  }
}

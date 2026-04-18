import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const PORT = process.env.PORT ?? 3001

const CATEGORIES = ['식비', '카페', '교통', '쇼핑', '문화/여가', '주거/공과금', '건강/의료', '기타', '수입'] as const
type Category = typeof CATEGORIES[number]

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o.trim()))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.post('/api/parse', async (req, res) => {
  const { input } = req.body as { input?: string }
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'input required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const client = new Anthropic({ apiKey })

  const prompt = `한국어 가계부 입력을 분석해서 JSON으로만 응답해. 다른 텍스트 없이 JSON만.

입력: "${input}"

응답 형식:
{
  "merchant": "상호명 (브랜드/가게 이름만, 없으면 빈 문자열)",
  "amount": 숫자 (원 단위, 숫자만),
  "type": "expense" 또는 "income",
  "category": "${CATEGORIES.join(', ')}" 중 하나,
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
    if (!jsonMatch) return res.status(422).json({ error: 'parse failed' })

    const parsed = JSON.parse(jsonMatch[0])
    const category: Category = CATEGORIES.includes(parsed.category) ? parsed.category : '기타'
    const amount = typeof parsed.amount === 'number'
      ? parsed.amount
      : parseInt(String(parsed.amount ?? '0').replace(/\D/g, ''), 10) || 0

    return res.json({
      merchant: String(parsed.merchant ?? ''),
      amount,
      type: parsed.type === 'income' ? 'income' : 'expense',
      category,
      memo: String(parsed.memo ?? ''),
    })
  } catch (e) {
    console.error('Claude API error:', e)
    return res.status(500).json({ error: 'Claude API error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

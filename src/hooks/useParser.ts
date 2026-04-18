import { useCallback } from 'react'
import type { ParseResult } from '../types'
import { parse } from '../parser'
import { getMerchantCategory } from '../db/merchantMap'
import { llmParse } from '../parser/llmParser'

export const API_KEY_STORAGE = 'claude_api_key'

export function useParser() {
  const parseInput = useCallback(async (input: string): Promise<ParseResult> => {
    const preliminary = parse(input)
    const learned = await getMerchantCategory(preliminary.merchant)
    if (learned) return parse(input, learned)

    const local = preliminary

    // 로컬 파서가 실패한 경우(금액 0 또는 카테고리 기타)만 LLM 폴백
    const needsFallback = local.amount === 0 || local.category === '기타'
    if (needsFallback) {
      const apiKey = localStorage.getItem(API_KEY_STORAGE) ?? ''
      if (apiKey) {
        const llmResult = await llmParse(input, apiKey)
        if (llmResult && llmResult.amount > 0) return llmResult
      }
    }

    return local
  }, [])

  return { parseInput }
}

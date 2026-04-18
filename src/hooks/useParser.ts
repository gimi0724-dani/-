import { useCallback } from 'react'
import type { ParseResult } from '../types'
import { parse } from '../parser'
import { getMerchantCategory } from '../db/merchantMap'

export function useParser() {
  const parseInput = useCallback(async (input: string): Promise<ParseResult> => {
    const preliminary = parse(input)
    const learned = await getMerchantCategory(preliminary.merchant)
    if (learned) return parse(input, learned)
    return preliminary
  }, [])

  return { parseInput }
}

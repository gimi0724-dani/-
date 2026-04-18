import { useState } from 'react'
import type { ParseResult } from '../../types'
import { ParsePreview } from '../chat/ParsePreview'
import { parse } from '../../parser'

interface Props {
  onSubmit: (input: string, parsed: ParseResult) => void
}

export function InputBar({ onSubmit }: Props) {
  const [value, setValue] = useState('')
  const [preview, setPreview] = useState<ParseResult | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setValue(v)
    setPreview(v.trim() ? parse(v) : null)
  }

  function handleSubmit() {
    if (!value.trim() || !preview || preview.amount === 0) return
    onSubmit(value.trim(), preview)
    setValue('')
    setPreview(null)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="shrink-0 pb-safe pt-[3px]" style={{ borderTop: '1px solid #333333' }}>
      <ParsePreview result={preview} />
      <div className="flex items-center gap-2 px-3 py-3">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="또 어디 썼니?"
          className="flex-1 rounded-full text-sm outline-none h-8"
          style={{ background: '#252525', color: '#ffffff', paddingLeft: 21, paddingRight: 16 }}
        />
        <button
          onClick={handleSubmit}
          disabled={!preview || preview.amount === 0}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-opacity disabled:opacity-30"
          style={{ background: '#ff6500' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

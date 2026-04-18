import { useState } from 'react'
import { clearTransactions } from '../../db/transactions'
import { API_KEY_STORAGE } from '../../hooks/useParser'

interface Props {
  onClose: () => void
}

export function SettingsModal({ onClose }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem(API_KEY_STORAGE) ?? '')
  const [saved, setSaved] = useState(false)

  function handleSaveApiKey() {
    localStorage.setItem(API_KEY_STORAGE, apiKey.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleClearData() {
    if (!confirming) { setConfirming(true); return }
    await clearTransactions()
    setConfirming(false)
    onClose()
    window.location.reload()
  }

  return (
    <div
      className="absolute inset-0 flex items-end justify-center z-10"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl"
        style={{ background: '#1e1e1e', paddingTop: 12, paddingBottom: 40, paddingLeft: 20, paddingRight: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <p className="font-bold text-base" style={{ color: '#ffffff' }}>설정</p>
          <button onClick={onClose} style={{ color: '#9ca3af', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {/* 앱 정보 */}
        <div className="rounded-xl" style={{ background: '#252525', padding: 16, marginBottom: 4 }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#ffffff' }}>내가계부</p>
          <p className="text-xs" style={{ color: '#6b7280' }}>로컬 저장 · 백엔드 없음 · IndexedDB</p>
        </div>

        {/* Claude API 키 */}
        <div className="rounded-xl" style={{ background: '#252525', padding: 16, marginBottom: 4 }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#ffffff' }}>Claude API Key</p>
          <p className="text-xs" style={{ color: '#6b7280', marginBottom: 8 }}>
            로컬 파서 실패 시(금액 미인식, 기타 카테고리) LLM 폴백으로 사용됩니다.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={e => { setApiKey(e.target.value); setSaved(false) }}
            placeholder="sk-ant-..."
            className="w-full rounded-xl outline-none text-sm"
            style={{ background: '#333333', color: '#ffffff', padding: 10, fontSize: 14, marginBottom: 8 }}
          />
          <button
            onClick={handleSaveApiKey}
            className="w-full rounded-xl text-sm font-semibold"
            style={{ background: saved ? '#22c55e' : '#ff6500', color: '#ffffff', paddingTop: 10, paddingBottom: 10 }}
          >
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>

        {/* 데이터 초기화 */}
        <div className="rounded-xl" style={{ background: '#252525', padding: 16 }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#ffffff' }}>데이터 관리</p>
          <p className="text-xs" style={{ color: '#6b7280', marginBottom: 8 }}>모든 거래 내역을 삭제합니다. 되돌릴 수 없습니다.</p>
          <button
            onClick={handleClearData}
            className="w-full rounded-xl text-sm font-semibold"
            style={{ background: confirming ? '#ef4444' : '#333333', color: confirming ? '#ffffff' : '#ef4444', paddingTop: 10, paddingBottom: 10 }}
          >
            {confirming ? '정말 삭제하시겠습니까? (다시 탭)' : '전체 데이터 초기화'}
          </button>
        </div>
      </div>
    </div>
  )
}

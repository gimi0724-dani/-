# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인용 가계부 웹앱. 카카오톡 채팅창처럼 자연어로 입력하면("스타벅스 아아 4500") 자동으로 카테고리 분류 및 기록. 백엔드 없이 완전 로컬(IndexedDB) 동작.

## 기술 스택

- **Vite + React + TypeScript**
- **Tailwind CSS** — 다크모드 기본
- **Recharts** — 카테고리별 차트
- **idb** — IndexedDB 래퍼
- **PWA** — manifest.json (모바일 홈화면 추가 지원)

## 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 아키텍처

### 데이터 흐름

```
사용자 입력 → parser/ (파싱) → useParser hook → IndexedDB 저장 → UI 갱신
카테고리 수정 → merchantMap DB 업데이트 → 다음 입력 시 파싱 1순위 적용
```

### 파서 파이프라인 (`src/parser/`)

입력 문자열을 다음 순서로 처리:
1. `merchantMap` DB 조회 — 학습된 상호명 매핑이 있으면 즉시 사용 (최우선)
2. 수입 키워드 감지 — "월급", "급여", "수입", "입금" 등
3. `extractAmount.ts` — 숫자/콤마/단위 정규식으로 금액 추출
4. `extractMerchant.ts` — 금액 제거 후 상호명/메모 분리
5. `classifyCategory.ts` + `keywords.ts` — 키워드 사전 매칭으로 카테고리 추론

상호명 정규화: 소문자 + 공백/특수문자 제거. "스타벅스강남점" 매핑 없으면 "스타벅스" prefix 매칭 시도.

### IndexedDB 스키마 (`src/db/`)

**transactions** — 거래 내역
- 인덱스: `date`, `category`, `type`
- `rawInput` 필드에 원본 입력 보존 (재파싱 대비)

**merchantMap** — 학습 DB (카테고리 수정 시 자동 저장)
- PK: 정규화된 상호명 (소문자, 특수문자 제거)
- `count` 필드로 수정 횟수 추적

**settings** — 키-값 설정 저장

### 카테고리

`식비` `카페` `교통` `쇼핑` `문화/여가` `주거/공과금` `건강/의료` `기타` `수입`

카테고리 아이콘/키워드는 `src/parser/keywords.ts` 단일 파일에서 관리.

### 상태 관리

별도 상태관리 라이브러리 없음. `src/hooks/`의 custom hooks가 IndexedDB를 직접 읽어 React state로 관리:
- `useTransactions` — 월별 필터링된 거래 목록
- `useSummary` — 월 총 지출/수입/순액 계산
- `useParser` — 파싱 파이프라인 + merchantMap 조회 통합

### 디자인 시스템

Dribbble 다크 모바일 앱 UI 참고. `src/index.css`에 Tailwind `@theme` 토큰으로 정의:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-bg` | `#141414` | 앱 배경 |
| `--color-card` | `#252525` | 카드/말풍선 배경 |
| `--color-border` | `#333333` | 구분선 |
| `--color-orange` | `#ff6500` | 강조, 수입, 버튼 |
| `--color-text-primary` | `#ffffff` | 주 텍스트 |
| `--color-text-secondary` | `#9ca3af` | 보조 텍스트 |

### UI 구조

라우터 없음. 모달로 화면 전환:
- **Header** — 월 이동(◀▶) + 월 요약 숫자 + 우상단 버튼(차트/리포트/설정)
- **ChatFeed** — 말풍선 스크롤 피드, 날짜 구분선 포함, 최신이 맨 아래
- **InputBar** — 하단 고정, 타이핑 중 ParsePreview로 실시간 파싱 결과 표시
- **EditModal** — 거래 수정 시 카테고리 변경 → merchantMap 자동 학습

---

## 개발 계획

### Phase 1 - 프로젝트 기반 설정 ✅
- [x] Vite + React + TypeScript 프로젝트 초기화
- [x] 의존성 설치: `idb`, `recharts`, `tailwindcss`
- [x] Tailwind CSS + 디자인 시스템 설정
- [x] `src/types/index.ts` — Transaction, Category, MerchantMap 타입 정의
- [x] `src/db/` — IndexedDB 초기화 및 CRUD 함수 (transactions, merchantMap, settings)
- [x] 디자인 시스템 적용 — 다크 `#141414` + 오렌지 `#ff6500` (Dribbble 참고)

### Phase 2 - 파서 구현 ✅
- [x] `src/parser/keywords.ts` — 카테고리별 키워드 사전 + 수입 키워드 (`월급`, `급여`, `입금`, `페이` 등)
- [x] `src/parser/extractAmount.ts` — 만원/콤마/원 단위 정규식 금액 추출
- [x] `src/parser/extractMerchant.ts` — 상호명/메모 토큰 분리
- [x] `src/parser/classifyCategory.ts` — 키워드 사전 매칭
- [x] `src/parser/index.ts` — 파이프라인 조합 (학습된 매핑 → 수입 감지 → 키워드 사전)
- [x] `main.tsx`에서 `import.meta.env.DEV`일 때만 `window.parse` 노출 (콘솔 테스트용)

> **수입 키워드 주의**: `페이`는 카카오페이 결제 등 지출에서도 매칭될 수 있음. 오분류 시 Phase 4 학습 기능으로 교정.

### Phase 3 - 핵심 UI
- [ ] `App.tsx` — 전체 레이아웃 (Header + ChatFeed + InputBar)
- [ ] `components/layout/InputBar.tsx` — 하단 고정 입력창 + 전송 로직
- [ ] `components/chat/TransactionBubble.tsx` — 개별 거래 말풍선
- [ ] `components/chat/ChatFeed.tsx` — 스크롤 피드 + DateDivider
- [ ] `components/layout/Header.tsx` — 월 요약 + 월 이동 버튼
- [ ] `components/chat/ParsePreview.tsx` — 타이핑 중 실시간 파싱 미리보기

### Phase 4 - 학습 기능 + 수정
- [ ] `components/modals/EditModal.tsx` — 카테고리/금액/메모 수정 UI
- [ ] `src/hooks/useParser.ts` — merchantMap 조회 + 파싱 통합
- [ ] 수정 시 merchantMap 자동 업데이트 연결

### Phase 5 - 리포트 및 차트
- [ ] `src/hooks/useSummary.ts` — 월별 집계 계산
- [ ] `components/modals/ChartModal.tsx` — Recharts 파이차트 + 바차트
- [ ] `components/modals/ReportModal.tsx` — 월별 텍스트 요약
- [ ] `components/modals/SettingsModal.tsx` — 설정 화면

### Phase 6 - 마무리
- [ ] `public/manifest.json` + 아이콘 — PWA 설정
- [ ] 반응형 조정 — 모바일 375px 키보드 대응 (InputBar)
- [ ] 빈 상태 UI — 첫 진입 안내 화면

### Phase 7 - Claude API (LLM) 폴백 파서 (선택)
> 로컬 파서가 실패하는 경우에만 LLM 호출 → 비용 최소화

- [ ] `@anthropic-ai/sdk` 설치
- [ ] `src/parser/llmParser.ts` — Claude API 호출 (금액 0 또는 카테고리 "기타"일 때만 폴백)
- [ ] `src/hooks/useParser.ts` — 로컬 파서 우선, 실패 시 LLM 폴백으로 교체
- [ ] `SettingsModal`에 API Key 입력 UI 추가 (localStorage 저장)

**폴백 트리거 조건:**
- `amount === 0` (금액 추출 실패)
- `category === "기타"` (키워드 매칭 실패)

**적용 모델:** `claude-haiku-4-5` (빠르고 저렴, 단순 분류 작업에 적합)

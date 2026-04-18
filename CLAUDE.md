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

### UI 구조

라우터 없음. 모달로 화면 전환:
- **Header** — 월 이동(◀▶) + 월 요약 숫자 + 우상단 버튼(차트/리포트/설정)
- **ChatFeed** — 말풍선 스크롤 피드, 날짜 구분선 포함, 최신이 맨 아래
- **InputBar** — 하단 고정, 타이핑 중 ParsePreview로 실시간 파싱 결과 표시
- **EditModal** — 거래 수정 시 카테고리 변경 → merchantMap 자동 학습

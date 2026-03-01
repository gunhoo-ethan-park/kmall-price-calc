# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 로컬 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드 (배포 전 오류 확인용)
npm run lint     # ESLint 검사
vercel --prod    # Vercel 프로덕션 배포
```

## Architecture

**Next.js 16 App Router** 기반의 KMall 직원 전용 통합 계산기 웹앱.

### Route Groups

- `app/(auth)/login/` — 공유 비밀번호 로그인 페이지 (NextAuth Credentials Provider)
- `app/(dashboard)/` — 인증된 사용자 전용 영역. `layout.tsx`가 Navbar를 포함함
  - `page.tsx` — 홈 (계산기 툴 카드 목록)
  - `logistics/`, `sales-price/`, `margin/`, `profit/` — 각 계산기 페이지

### Authentication Flow

`middleware.ts` → `getToken()` 검사 → 미인증 시 `/login` 리다이렉트.
`lib/auth.ts`에 NextAuth 설정이 있으며, `SHARED_PASSWORD` 환경변수와 입력값을 직접 비교한다.
NextAuth v4를 사용한다 (`next-auth@4.x`, v5와 API 다름).

### Calculation Logic

모든 계산 공식은 **`lib/calculations.ts`** 에 순수 함수로 분리되어 있다. 각 페이지는 이 함수들을 import해서 사용한다. 새 계산기를 추가할 때는 여기에 함수를 먼저 추가한다.

- `calcLogistics` — 항공: `max(부피중량, 실중량) × 단가/kg`, 부피중량 = `L×W×H / 6000`. 해상: `CBM × 단가`, CBM = `L×W×H / 1,000,000`
- `calcSalesPrice` — `판매가 = (원가 + 물류비) / (1 - 수수료율 - 마진율)`
- `calcMargin` — `마진율 = (판매가 - 원가 - 물류비 - 수수료) / 판매가 × 100`
- `calcProfit` — `영업이익 = (판매가 - 원가 - 물류비 - 기타) × 수량`
- `formatNumber` — 천 단위 콤마 포맷 (ko-KR)

### Calculator Page Pattern

각 계산기 페이지는 동일한 패턴을 따른다:
1. `Row` 인터페이스로 다중 행 상태 관리 (`useState<Row[]>`)
2. 모든 숫자 입력은 `string`으로 저장 후 `parseFloat() || 0`으로 계산 시 변환
3. `getResult(row)` 함수가 `lib/calculations.ts` 함수를 호출해 실시간 결과 반환
4. `exportData` 배열을 `ExportButton`에 전달하면 xlsx 다운로드

### Environment Variables

| 변수 | 용도 |
|------|------|
| `NEXTAUTH_SECRET` | JWT 서명 키 |
| `NEXTAUTH_URL` | 배포 URL (예: `https://claude-n8n-tutorial.vercel.app`) |
| `SHARED_PASSWORD` | 직원 공유 비밀번호 |

로컬에서는 `.env.local`에 설정. Vercel에서는 `vercel env add` 또는 대시보드에서 관리.

### Known Issues

- Next.js 16에서 `middleware.ts` 파일명이 deprecated 경고를 출력하나 정상 작동함 (`proxy`로 변경 권고이지만 현재 무시)

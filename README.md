# 간다GO · 영남·제주 출장마사지 지역 안내 사이트

부산·대구·창원·경남·경북·제주 생활권 안내 정적(static) 웹사이트입니다.
데이터 + 템플릿 기반 정적 생성기로, `dist/`에 완성된 HTML이 만들어집니다.

## 빌드

```bash
npm install     # 개발용(sharp: 이미지 생성)
npm run build   # data/ + templates → dist/
```

`dist/` 폴더를 그대로 정적 호스팅(Netlify, Vercel, GitHub Pages, S3 등)에 올리면 됩니다.

## 구조

```
data/            사이트 콘텐츠(수정은 대부분 여기서)
  site.mjs       상호·전화·텔레그램·상단/푸터 메뉴
  regions.mjs    6개 권역(부산/대구/창원/경남/경북/제주)
  districts.mjs  시·군·구 상세(부산16·대구9·경남13·경북11·제주2)
  areas.mjs      14개 광역 생활권
  stations.mjs   역·터미널·공항 거점(28)
  programs.mjs   11개 마사지 프로그램
  guides.mjs     이용 장소 / 예약 전 확인
src/render.mjs   레이아웃·헤더·푸터·가격표·JSON-LD 스키마
build.mjs        페이지 생성 로직
assets/          css / js / images (그대로 배포됨)
dist/            빌드 결과물(배포 대상)
```

## 구현된 요구사항

- **푸터 CTA 버튼**: `웹사이트 제작문의`, `제휴문의` — 오렌지색, 텔레그램 링크 연결
- **상호/전화**: 간다GO · 0508-202-4719 (헤더·푸터·플로팅 버튼)
- **모바일 플로팅 전화 아이콘**: 우측 하단, 오렌지, 애니메이션(흔들림+펄스), 터치 시 전화 연결(`tel:`), 전 지역 노출
- **디스크립션 80자 이내**: 모든 페이지 (빌드 시 초과하면 경고)
- **스키마(JSON-LD)**: 모든 페이지에 Organization / WebPage / BreadcrumbList, FAQ가 있는 페이지에 FAQPage, 히어로 이미지에 ImageObject.
  - 실제 매장이 없으므로 `LocalBusiness` 미사용, 실제 후기가 없으므로 `Review`/`AggregateRating` 미사용.
- **가격표**: 60/90/120분(90,000·150,000·180,000원, 90분 추천) — 메인 포함 모든 지역/프로그램 페이지에 노출.
  이미지 대신 반응형 HTML 컴포넌트로 구현(접근성·SEO·모바일에서 이미지보다 유리).
- **히어로 배경 이미지**: `assets/images/hero.webp` (약 5.5KB, 50KB 이하). 모든 페이지 히어로에 배경으로 적용.
- **내부링크 강화**: 권역↔생활권↔프로그램↔이용 장소 상호 링크, 롱테일 키워드 앵커.
- **E-E-A-T / Who·How·Why**: 각 지역·생활권 페이지에 Who/How/Why 블록, 불법·선정적 서비스 불가 고지, 개인정보 안내 연결.
- **도어웨이/키워드 스터핑 회피**: 지역명만 바꾼 본문을 만들지 않도록 권역·시·군·구·생활권·거점마다 고유 특성(char)·교통(transport)·숙소 기준(stay)을 데이터로 분리. 출구별·노선별 페이지는 생성하지 않음.
- **전 지역 index 처리**: 모든 시·군·구(51)·생활권(14)·거점(28) 페이지가 고유 콘텐츠를 갖고 index됩니다(noindex 페이지 0). 총 134개 색인 페이지.

## ⚠️ 배포 전 반드시 교체할 값 (`data/site.mjs`)

| 항목 | 현재 값(placeholder) | 조치 |
|------|----------------------|------|
| `domain` | `https://www.relaxora.co.kr` | 실제 도메인으로 교체 (canonical·og·sitemap에 사용) |
| `telegram` / `telegramBuild` / `telegramPartner` | `https://t.me/gandago` | 실제 텔레그램 핸들로 교체 |
| `assets/images/hero.webp` | 자동 생성 플레이스홀더 | 원하는 실제 사진을 50KB 이하 webp로 교체(파일명 유지) |

## 페이지 확장

`data/`의 배열에 항목을 추가하면 페이지가 자동 생성됩니다.
지시서의 2차·3차 확장(나머지 구·군, 읍면 등)은 본문 2,000자 이상 확보 후
`noindex`를 해제하는 방식으로 순차 색인하세요.

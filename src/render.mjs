import { site, nav, footerNav } from "../data/site.mjs";

/* ---------- helpers ---------- */
export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (path) => site.domain.replace(/\/$/, "") + path;

/* ---------- price table (shown on every page) ---------- */
export const PRICE = [
  { course: "60분 코스", dur: "60분", amount: "90,000", desc: "기본 컨디션·릴랙스 케어", featured: false },
  { course: "90분 코스", dur: "90분", amount: "150,000", desc: "아로마 포함 추천 구성", featured: true },
  { course: "120분 코스", dur: "120분", amount: "180,000", desc: "전신 집중 프리미엄 케어", featured: false },
];

export function priceTable() {
  const cards = PRICE.map((p) => `
      <div class="price-card${p.featured ? " featured" : ""}">
        ${p.featured ? '<div class="price-badge">추천</div>' : ""}
        <div class="course">${p.course}</div>
        <div class="amount">${p.amount}<span>원</span></div>
        <div class="dur">${p.dur}</div>
        <div class="desc">${p.desc}</div>
        <a class="btn ${p.featured ? "btn-primary" : "btn-ghost"}" href="${site.phoneHref}">예약 문의</a>
      </div>`).join("");
  return `
  <section class="section" id="pricing" aria-labelledby="pricing-title">
    <div class="wrap">
      <div class="section-head">
        <span class="eyebrow">Price</span>
        <h2 id="pricing-title">이용 코스와 요금 살펴보기</h2>
        <p>60·90·120분 코스별 기준 요금이며, 숨은 비용 없이 있는 그대로 안내해 드립니다.</p>
      </div>
      <div class="pricing">${cards}</div>
      <p class="pricing-note">지역·예약 시간대·이동 거리에 따라 상담 시 최종 확인됩니다. <a href="/check/travel-fee/">상세 요금 안내 보기 →</a></p>
    </div>
  </section>`;
}

/* ---------- header ---------- */
function navMenu() {
  return nav.map((item) => {
    if (item.children) {
      const dd = item.children.map((c) => `<a href="${c.href}">${esc(c.label)}</a>`).join("");
      return `<li class="nav-item"><a class="nav-link" href="${item.href}">${esc(item.label)}<i class="caret"></i></a><div class="dropdown">${dd}</div></li>`;
    }
    return `<li class="nav-item"><a class="nav-link" href="${item.href}">${esc(item.label)}</a></li>`;
  }).join("");
}
function mobileMenu() {
  return nav.map((item) => {
    if (item.children) {
      const links = [`<a href="${item.href}">${esc(item.label)} 메인</a>`]
        .concat(item.children.map((c) => `<a href="${c.href}">${esc(c.label)}</a>`)).join("");
      return `<details><summary>${esc(item.label)}<span>+</span></summary>${links}</details>`;
    }
    return `<a href="${item.href}">${esc(item.label)}</a>`;
  }).join("");
}
function header() {
  return `
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="/">
        <span class="brand-mark">G</span>
        <span>${esc(site.brand)}<small>영남·제주 출장마사지</small></span>
      </a>
      <nav aria-label="주요 메뉴"><ul class="nav-menu">${navMenu()}</ul></nav>
      <div class="nav-cta">
        <a class="nav-tel" href="${site.phoneHref}">전화예약 <span>${esc(site.phone)}</span></a>
        <button class="nav-toggle" aria-label="메뉴 열기" aria-controls="mobileNav" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="nav-scrim"></div>
  <nav id="mobileNav" class="mobile-nav" aria-label="모바일 메뉴">
    <a href="${site.phoneHref}" class="btn btn-primary" style="width:100%;margin-bottom:14px">전화예약 ${esc(site.phone)}</a>
    ${mobileMenu()}
  </nav>`;
}

/* ---------- footer ---------- */
const tgIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.94 4.3 3.5 11.4c-1.1.44-1.09 1.06-.2 1.33l4.7 1.47 1.82 5.55c.22.6.11.84.74.84.49 0 .7-.22.98-.48l2.36-2.3 4.9 3.62c.9.5 1.55.24 1.78-.83l3.22-15.2c.33-1.31-.5-1.9-1.55-1.42Z"/></svg>`;

function footer() {
  const cols = Object.entries(footerNav).map(([title, links]) => `
        <div class="footer-col">
          <h4>${esc(title)}</h4>
          ${links.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join("")}
        </div>`).join("");
  return `
  <footer class="site-footer">
    <div class="footer-cta">
      <div class="wrap">
        <h2>웹사이트가 필요하신가요?</h2>
        <p>${esc(site.brand)}는 지역 안내 사이트 제작과 제휴 문의를 텔레그램으로 받고 있습니다.</p>
        <div class="footer-cta-btns">
          <a class="btn btn-primary btn-lg btn-tg" href="${site.telegramBuild}" target="_blank" rel="noopener">${tgIcon} 웹사이트 제작문의</a>
          <a class="btn btn-primary btn-lg btn-tg" href="${site.telegramPartner}" target="_blank" rel="noopener">${tgIcon} 제휴문의</a>
        </div>
      </div>
    </div>
    <div class="wrap footer-main">
      <div class="footer-brand">
        <a class="brand" href="/"><span class="brand-mark">G</span><span>${esc(site.brand)}<small>영남·제주 출장마사지</small></span></a>
        <p>부산·대구·창원·경남·경북·제주 생활권과 호텔·오피스텔·리조트·자택 이용 전 확인사항을 안내합니다.</p>
        <div class="footer-info" style="margin-top:16px">
          <div><b>상호</b> ${esc(site.brand)}</div>
          <div><b>전화예약</b> <a class="tel" href="${site.phoneHref}">${esc(site.phone)}</a></div>
        </div>
      </div>
      ${cols}
    </div>
    <div class="wrap footer-bottom">
      <span>© ${esc(site.brand)}. 불법·선정적 서비스는 제공하거나 안내하지 않습니다.</span>
      <span>영남·제주 출장마사지 지역 안내</span>
    </div>
  </footer>
  <a class="float-call" href="${site.phoneHref}" aria-label="전화 예약 ${esc(site.phone)}">
    <span class="fc-label">전화예약</span>
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2Z"/></svg>
  </a>`;
}

/* ---------- JSON-LD schema ---------- */
function schemaBlocks(page) {
  const blocks = [];

  // Organization
  blocks.push({
    "@context": "https://schema.org", "@type": "Organization",
    name: site.brand, url: site.domain,
    telephone: site.phone,
    areaServed: ["부산", "대구", "창원", "경상남도", "경상북도", "제주"],
    sameAs: [site.telegram].filter(Boolean),
  });

  // WebPage (+ optional primaryImage as ImageObject)
  const webpage = {
    "@context": "https://schema.org", "@type": "WebPage",
    name: page.title, description: page.desc, url: abs(page.path),
    inLanguage: "ko-KR",
    isPartOf: { "@type": "WebSite", name: site.brand, url: site.domain },
  };
  if (page.image) {
    webpage.primaryImageOfPage = {
      "@type": "ImageObject", url: abs(page.image), caption: page.title,
    };
  }
  blocks.push(webpage);

  // BreadcrumbList
  if (page.crumbs && page.crumbs.length) {
    blocks.push({
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: page.crumbs.map((c, i) => ({
        "@type": "ListItem", position: i + 1, name: c.label,
        item: c.href ? abs(c.href) : undefined,
      })),
    });
  }

  // FAQPage — only when FAQ content is actually rendered on the page
  if (page.faq && page.faq.length) {
    blocks.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question", name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return blocks.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join("\n  ");
}

/* ---------- layout ---------- */
export function layout(page) {
  const heroImg = page.image || "/assets/images/hero.webp";
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.desc)}">
  <link rel="canonical" href="${abs(page.path)}">
  ${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.brand)}">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.desc)}">
  <meta property="og:url" content="${abs(page.path)}">
  <meta property="og:image" content="${abs(page.ogImage || "/assets/images/hero.webp")}">
  <meta property="og:locale" content="${site.locale}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0b0f14">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="/assets/css/theme.css">
  ${schemaBlocks(page)}
</head>
<body>
  ${header()}
  <main style="--hero-image:url('${heroImg}')">
    ${page.body}
  </main>
  ${footer()}
  <script src="/assets/js/app.js" defer></script>
</body>
</html>`;
}

/* ---------- shared content blocks ---------- */
export function breadcrumbs(crumbs) {
  return `<div class="wrap"><nav class="crumbs" aria-label="탐색 경로">${crumbs
    .map((c, i) => (c.href && i < crumbs.length - 1
      ? `<a href="${c.href}">${esc(c.label)}</a><span class="sep">/</span>`
      : `<span>${esc(c.label)}</span>`)).join("")}</nav></div>`;
}

export function faqBlock(faq) {
  if (!faq || !faq.length) return "";
  return `
  <section class="section"><div class="wrap"><div class="article">
    <h2>자주 묻는 질문</h2>
    <div class="faq">
      ${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
    </div>
  </div></div></section>`;
}

export function whoHowWhy(region = "영남·제주") {
  return `
  <div class="whw">
    <div class="whw-item"><h4>WHO · 누가</h4><p>${esc(region)} 방문형 웰니스 서비스 이용 전, 위치·숙소 유형·건물 출입·예약 조건을 확인할 수 있도록 작성한 안내입니다.</p></div>
    <div class="whw-item"><h4>HOW · 어떻게</h4><p>공식 행정구역 자료와 실제 예약 전 확인 항목, 개인정보 처리 기준을 바탕으로 작성하며 최종 문구는 사람이 검수합니다.</p></div>
    <div class="whw-item"><h4>WHY · 왜</h4><p>검색 순위 조작이 아니라 이용 전 필요한 확인사항을 쉽게 안내하기 위한 목적이며, 불법·선정적 내용은 다루지 않습니다.</p></div>
  </div>`;
}

export function noticeBar() {
  return `<div class="wrap"><div class="notice-bar">
    <b>안내</b>
    <span>불법·선정적 서비스는 제공하거나 안내하지 않습니다. 방문 가능 여부는 실제 주소와 예약 조건 확인 후 안내하며, 예약 확인에 필요한 최소한의 개인정보만 사용합니다.</span>
  </div></div>`;
}

import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "./data/site.mjs";
import { regions, regionBySlug } from "./data/regions.mjs";
import { areas, areaBySlug } from "./data/areas.mjs";
import { programs, programBySlug } from "./data/programs.mjs";
import { usePlaces, checks } from "./data/guides.mjs";
import { districts, districtsByRegion } from "./data/districts.mjs";
import { stations, stationsByRegion } from "./data/stations.mjs";
import {
  layout, esc, priceTable, breadcrumbs, faqBlock, whoHowWhy, noticeBar,
} from "./src/render.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "dist");

/* ---------- writer + description guard ---------- */
const pages = [];
function emit(path, page) {
  if (page.desc && [...page.desc].length > 80) {
    console.warn(`⚠︎  description > 80자 (${[...page.desc].length}): ${path}`);
  }
  page.path = path;
  const html = layout(page);
  const dir = path === "/" ? OUT : join(OUT, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  if (!page.noindex) pages.push(path);
}

const HOME = { label: "홈", href: "/" };
const HERO = "/assets/images/hero.webp";

/* ---------- shared FAQ ---------- */
const COMMON_FAQ = [
  { q: "예약 전에 무엇을 확인하나요?", a: "실제 방문 주소, 가까운 생활권, 예약 가능 시간, 이동 기준, 숙소 유형을 확인한 뒤 안내합니다." },
  { q: "호텔이나 리조트에서도 이용할 수 있나요?", a: "숙소 정책, 객실 출입 가능 여부, 프런트 확인 방식, 예약자명, 야간 출입 가능 여부를 먼저 확인해야 합니다." },
  { q: "불법·선정적 서비스도 가능한가요?", a: "불법·선정적 서비스는 제공하거나 안내하지 않습니다." },
  { q: "개인정보는 어떻게 처리하나요?", a: "예약 확인과 연락에 필요한 최소 정보만 확인하며, 개인정보 처리 기준 페이지로 연결합니다." },
];

/* ---------- hero block ---------- */
function hero({ eyebrow, h1, lead, ctas = [] }) {
  const btns = ctas.map((c, i) =>
    `<a class="btn ${i === 0 ? "btn-primary" : "btn-ghost"} btn-lg" href="${c.href}">${esc(c.label)}</a>`).join("");
  return `
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-inner"><div class="wrap">
      <span class="eyebrow">${esc(eyebrow)}</span>
      <h1>${esc(h1)}</h1>
      <p class="lead">${esc(lead)}</p>
      <div class="hero-cta">${btns}</div>
    </div></div>
  </section>`;
}

function cardGrid(items, cols = 3) {
  return `<div class="grid grid-${cols}">${items.map((it) => `
    <a class="card" href="${it.href}">
      ${it.icon ? `<div class="card-icon">${it.icon}</div>` : ""}
      <h3>${esc(it.title)}</h3>
      <p>${esc(it.text)}</p>
      <span class="card-link">${esc(it.cta || "자세히 보기")}</span>
    </a>`).join("")}</div>`;
}

function relatedChips(items) {
  return `<div class="related">${items.map((i) => `<a class="chip" href="${i.href}">${esc(i.label)}</a>`).join("")}</div>`;
}

/* plain (Korean) text length of rendered HTML — for 2,000자 검증 */
function koLen(html) {
  const t = html.replace(/<[^>]+>/g, " ");
  return (t.match(/[가-힣]/g) || []).length;
}

/* infer a locality profile from its copy → tailors the 이동/숙소 문단 */
function profileOf(txt = "") {
  if (/(국가산단|산업단지|산단|조선|철강|항공산업|테크노폴리스)/.test(txt)) return "industrial";
  if (/(공항)/.test(txt)) return "airport";
  if (/(리조트|펜션|관광단지|보문|중문|관광 숙소|관광지)/.test(txt)) return "tourist";
  if (/(해안|해수욕|바다|해변|항만|어촌|해안도로)/.test(txt)) return "coastal";
  if (/(신도시|택지|주거 단지|아파트 단지)/.test(txt)) return "newtown";
  if (/(대학|대학가|캠퍼스)/.test(txt)) return "university";
  if (/(혁신도시|도청|행정|업무지구|금융단지|시청)/.test(txt)) return "admin";
  return "urban";
}
const PROFILE_PARA = {
  industrial: (n) => `${n}은(는) 산업단지·공단 인접 숙소 수요가 있는 지역으로, 정문과 동 번호, 정확한 숙소 주소와 이동 가능 시간을 확인하는 것이 특히 중요합니다. 장기 출장 숙소는 근무 일정에 따라 예약 시간이 유동적인 경우가 많으므로, 방문 희망 시간을 여유 있게 알려주시면 이동 동선을 맞춰 안내해 드립니다.`,
  airport: (n) => `${n}은(는) 공항 인접 숙소 이용이 많은 지역으로, 숙소의 정확한 위치와 이동 동선, 야간 출입 가능 여부를 먼저 확인하는 것이 좋습니다. 이동 수단과 도착 숙소 주소를 함께 전달해 주시면 예상 소요 시간과 이동 가능 여부를 확인해 안내해 드립니다.`,
  tourist: (n) => `${n}은(는) 리조트·호텔·펜션 등 관광 숙소가 넓게 분산되어 있어 숙소 간 이동 거리가 길어질 수 있습니다. 객실 정책과 외부 방문 가능 여부, 야간 이동 가능 시간을 예약 전에 확인해 두면, 성수기에도 방문 동선을 안정적으로 맞출 수 있습니다.`,
  coastal: (n) => `${n}은(는) 해안 숙박권이 형성되어 있어 성수기에는 이동 동선이 혼잡해질 수 있습니다. 해안 관광 숙소는 주차와 야간 출입 여건이 도심과 다른 경우가 많으므로, 숙소 유형과 이동 가능 시간을 함께 확인하면 방문이 원활합니다.`,
  newtown: (n) => `${n}은(는) 신도시 주거 단지가 넓게 조성된 지역으로, 대규모 아파트·오피스텔이 많아 동·호수와 공동현관 출입 방식 확인이 특히 중요합니다. 단지별로 방문자 등록 절차가 다를 수 있어, 예약 시 미리 확인해 두면 도착 후 안내가 빠릅니다.`,
  university: (n) => `${n}은(는) 대학가를 중심으로 원룸·오피스텔이 밀집한 지역으로, 건물마다 공동현관 방식과 호수 체계가 달라 확인이 필요합니다. 정확한 주소와 연락 가능한 연락처를 함께 남겨두시면 방문 안내가 원활합니다.`,
  admin: (n) => `${n}은(는) 행정·업무 기능이 모인 지역으로 오피스텔과 비즈니스호텔 이용이 많습니다. 업무 일정에 맞춘 예약이 많은 만큼, 희망 시간대와 숙소 유형을 미리 전달해 주시면 이동 동선을 맞춰 안내해 드립니다.`,
  urban: (n) => `${n}은(는) 도심 상권과 주거·업무 시설이 함께 있는 지역으로 건물마다 출입 방식이 다양합니다. 도심 오피스텔·비즈니스호텔은 공동현관과 프런트 확인 방식을 미리 확인해 두면 방문이 원활하며, 주거지는 동·호수와 방문자 등록 여부를 함께 확인합니다.`,
};

/* 2,000~2,500자 지역 본문 — 지역별 고유 데이터(char/transport/stay/programs)를 엮어 생성 */
function richArticle(ctx) {
  const { name, lead, transportText, stayText = "", includes = "", stationNames = [], programs = [], profile } = ctx;
  const prof = profile || profileOf(`${lead} ${stayText} ${transportText} ${includes}`);
  const progItems = programs.map((s) => programBySlug[s]).filter(Boolean);
  const progNames = progItems.map((p) => p.name).join(", ");
  const stationLine = stationNames.length
    ? `${name} 인근에서는 ${stationNames.join(", ")} 등이 주요 이동 거점입니다. `
    : "";

  return `
    <section class="section" style="padding-top:24px"><div class="wrap"><div class="article">

      <h2>${esc(name)} 생활권 특징</h2>
      <p>${esc(name)}은(는) ${esc(lead)}${includes ? ` 주요 생활권으로는 ${esc(includes)} 등이 있으며, 같은 ${esc(name)} 안에서도 도심 상권과 주거지, 숙소 밀집 구역의 이용 동선이 조금씩 다릅니다.` : ""}</p>
      <p>방문형 케어는 매장을 방문하는 방식과 달리 이용자가 머무는 위치와 숙소 유형에 따라 준비할 내용이 달라집니다. ${esc(name)}에서 예약을 계획하신다면 방문 주소와 건물 출입 방식, 예약 가능 시간을 먼저 확인해 두는 것이 좋으며, 방문 가능 여부는 실제 주소와 예약 조건을 확인한 뒤 안내해 드립니다.</p>

      <h2>가까운 역·터미널·공항 기준</h2>
      <p>${stationLine}${esc(transportText)}</p>
      <p>실제 이동 시간은 출발지와 도착 숙소의 위치, 예약 시간대의 교통 상황에 따라 달라집니다. 정확한 도로명 주소와 건물명을 전달해 주시면 이동 동선과 예상 소요 시간, 이동 가능 여부를 함께 확인해 안내해 드립니다. 출구별·노선별로 페이지를 나누어 안내하지는 않으며, 언제나 최종 숙소 주소를 기준으로 확인합니다.</p>

      <h2>호텔·숙소 이용 전 확인</h2>
      <p>${esc(name)}의 호텔·숙소를 이용하실 때는 객실까지 방문이 가능한 숙소인지, 프런트에서 방문 확인을 요구하는지, 예약자명과 객실 번호가 정확한지, 야간 시간대 외부 방문객 출입이 허용되는지를 미리 확인해야 합니다. 특급호텔이나 레지던스는 보안 정책이 엄격한 경우가 있어, 예약 단계에서 숙소 정책을 함께 확인하면 방문이 원활합니다.</p>

      <h2>오피스텔·아파트·자택 이용 전 확인</h2>
      <p>오피스텔은 공동현관 출입 방식(비밀번호 또는 카드 태그)과 정확한 호수, 엘리베이터 층 제한 여부를 확인해야 하며, 아파트·자택은 동·호수와 공동현관, 방문자 등록 절차, 주차 가능 여부를 미리 확인하는 것이 좋습니다. ${stayText ? esc(stayText) + " " : ""}건물마다 출입 방식이 다르므로, 연락이 닿는 연락처를 함께 남겨두시면 도착 시 안내가 빠릅니다.</p>

      <h2>산업단지·관광 숙소 이동 기준</h2>
      <p>${esc(PROFILE_PARA[prof](name))}</p>

      <h2>${esc(name)} 마사지 프로그램 선택 기준</h2>
      <p>${esc(name)}에서는 ${esc(progNames)} 프로그램이 많이 이용됩니다. ${progItems.map((p) => `<strong>${esc(p.name)}</strong>은(는) ${esc(p.lead)}`).join(" ")}</p>
      <p>코스는 60분 기본 컨디션·릴랙스 케어, 90분 아로마 포함 추천 구성, 120분 전신 집중 프리미엄 케어로 나뉩니다. 원하는 강도와 집중 부위, 이용 시간을 예약 시 전달해 주시면 ${esc(name)} 이용 목적에 맞게 안내해 드립니다.</p>

      <h2>예약 전 체크리스트</h2>
      <ul class="bullets">
        <li>방문 주소(도로명)와 건물명, 정확한 동·호수</li>
        <li>공동현관 출입 방식과 연락 가능한 연락처</li>
        <li>원하는 프로그램과 코스 시간(60·90·120분)</li>
        <li>예약 희망 시간대와 이동 가능 여부</li>
        <li>숙소 유형과 야간 출입 가능 여부</li>
      </ul>

      <h2>개인정보 처리 기준</h2>
      <p>${esc(name)} 예약 과정에서는 예약 확인과 연락에 필요한 최소한의 정보만 사용하며, 목적을 달성한 뒤에는 지체 없이 파기합니다. 자세한 기준은 <a class="inline" href="/policy/privacy/">개인정보 처리방침</a>에서 확인하실 수 있습니다.</p>

      <h2>불법·선정적 서비스 불가 안내</h2>
      <p>${esc(name)}에서도 불법·선정적 서비스는 제공하거나 안내하지 않으며, 합법적인 방문형 웰니스 안내만을 목적으로 합니다. 자세한 내용은 <a class="inline" href="/policy/prohibited/">불법·선정적 서비스 불가 안내</a>를 참고해 주세요.</p>

    </div></div></section>`;
}

/* ============================================================
   HOME
   ============================================================ */
function buildHome() {
  const regionCards = regions.map((r) => ({
    href: `/${r.slug}/`, title: r.name, text: r.desc, cta: `${r.name} 보기`,
  }));
  const programCards = programs.slice(0, 9).map((p) => ({
    href: `/program/${p.slug}/`, title: p.name, text: p.lead,
  }));
  const zoneChips = areas.map((a) => ({ label: a.name.replace(/권$/, ""), href: `/area/${a.slug}/` }));
  const useCards = usePlaces.map((u) => ({ href: `/use/${u.slug}/`, title: u.name, text: u.desc }));

  const body = `
    ${hero({
      eyebrow: "영남·제주 출장마사지",
      h1: "영남·제주 출장마사지 · 부산·대구·창원·경남·경북·제주 생활권 안내",
      lead: "부산 해운대, 대구 동성로, 창원 상남, 김해·양산, 포항·구미, 제주·서귀포 등 주요 생활권과 호텔·오피스텔·리조트·자택 이용 전 확인사항을 안내합니다.",
      ctas: [
        { label: "부산권 보기", href: "/busan/" }, { label: "제주권 보기", href: "/jeju/" },
        { label: "마사지 프로그램", href: "/program/" }, { label: "예약 전 확인", href: "/check/" },
      ],
    })}

    <section class="section"><div class="wrap"><div class="article" style="text-align:center;max-width:760px">
      <span class="eyebrow">Overview</span>
      <h2 style="font-size:32px;margin-bottom:16px">영남·제주권은 지역마다 이용 기준이 다릅니다</h2>
      <p style="color:var(--text-muted)">부산은 해안 숙소와 도심 상권, 대구는 내륙 광역시와 업무·주거 생활권, 창원은 산업도시와 도심 상권, 경남은 해안·조선·항공·신도시 생활권, 경북은 동해안·산업·관광 숙소, 제주는 공항·리조트·펜션·해안 숙소 기준이 중요합니다.</p>
    </div></div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Regions</span><h2>권역별 안내</h2><p>부산·대구·창원·경남·경북·제주 6개 권역을 생활권 단위로 안내합니다.</p></div>
      ${cardGrid(regionCards, 3)}
    </div></section>

    ${priceTable()}

    <section class="section"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Programs</span><h2>마사지 프로그램 안내</h2><p>스웨디시·타이마사지·아로마테라피 등 프로그램별 특징과 지역을 함께 안내합니다.</p></div>
      ${cardGrid(programCards, 3)}
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Living zones</span><h2>주요 생활권 바로가기</h2><p>14개 광역 생활권을 이동 거점과 숙소 유형 기준으로 안내합니다.</p></div>
      ${relatedChips(zoneChips)}
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Where</span><h2>이용 장소별 확인 기준</h2><p>자택·호텔·오피스텔·산업단지·리조트 등 장소별 확인사항을 안내합니다.</p></div>
      ${cardGrid(useCards, 4)}
    </div></section>

    ${noticeBar()}
    ${faqBlock(COMMON_FAQ)}
  `;

  emit("/", {
    title: "영남·제주 출장마사지｜부산·대구·창원·경남·경북·제주 홈타이 안내",
    desc: "영남·제주 출장마사지·홈타이 예약 전 부산·대구·창원·경남·경북·제주 주요 생활권과 숙소 이용 기준을 안내합니다.",
    image: HERO, crumbs: [HOME], faq: COMMON_FAQ, body,
  });
}

/* ============================================================
   REGION HUBS
   ============================================================ */
function buildRegions() {
  for (const r of regions) {
    const crumbs = [HOME, { label: r.name, href: `/${r.slug}/` }];
    const zoneCards = r.zones.map((z) => ({ href: z.href, title: z.label, text: (areaBySlug[z.href.split("/")[2]] || {}).desc || "생활권 안내" }));
    const rDistricts = districtsByRegion(r.slug);
    const districtChips = rDistricts.map((d) => ({ label: d.name, href: `/${r.slug}/${d.seg}/` }));
    const rStations = stationsByRegion(r.slug);
    const stationChips = rStations.map((s) => ({ label: s.name, href: `/station/${s.seg}/` }));
    const progCards = r.programs.map((slug) => {
      const p = programBySlug[slug];
      return { href: `/program/${p.slug}/`, title: p.name, text: p.lead };
    });
    const otherRegions = regions.filter((x) => x.slug !== r.slug).map((x) => ({ label: x.name, href: `/${x.slug}/` }));

    const faq = [
      { q: `${r.name} 전 지역 방문이 가능한가요?`, a: "실제 방문 주소, 가까운 생활권, 예약 가능 시간, 이동 기준, 숙소 유형을 확인한 뒤 안내합니다." },
      ...COMMON_FAQ.slice(1),
    ];

    const body = `
    ${hero({
      eyebrow: r.keyword, h1: r.h1, lead: r.lead,
      ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: "마사지 프로그램", href: "/program/" }, { label: "예약 전 확인", href: "/check/" }],
    })}
    ${breadcrumbs(crumbs)}

    ${richArticle({
      name: r.name.replace("권", ""),
      lead: r.character,
      transportText: r.transport,
      stayText: "",
      includes: r.zones.map((z) => z.label).join(", "),
      stationNames: rStations.slice(0, 4).map((s) => s.name),
      programs: r.programs,
    })}

    <section class="section" style="padding-top:0"><div class="wrap"><div class="article">
      ${districtChips.length ? `<h2>${esc(r.name)} 핵심 시·군·구</h2><p>주요 행정구역별 안내 페이지입니다.</p>${relatedChips(districtChips)}` : ""}
      ${stationChips.length ? `<h2>역·터미널·공항 거점</h2><p>거점 인접 숙소 이용 기준 안내입니다.</p>${relatedChips(stationChips)}` : ""}
    </div></div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Living zones</span><h2>${esc(r.name)} 핵심 생활권</h2></div>
      ${cardGrid(zoneCards, 3)}
    </div></section>

    ${priceTable()}

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Programs</span><h2>${esc(r.name)} 추천 프로그램</h2></div>
      ${cardGrid(progCards, 3)}
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap"><div class="article">
      <h2>Who, How, Why</h2>
      ${whoHowWhy(r.name)}
      <h2>관련 지역 보기</h2>
      ${relatedChips(otherRegions)}
    </div></div></section>

    ${faqBlock(faq)}`;

    emit(`/${r.slug}/`, {
      title: `${r.h1}｜${site.brand}`, desc: r.desc, image: HERO, crumbs, faq, body,
    });
  }
}

/* ---------- shared 숙소·확인 body block (locality pages) ---------- */
function stayCheckBlock() {
  return `
      <h2>호텔·오피스텔·자택 이용 전 확인</h2>
      <ul class="bullets">
        <li>호텔·숙소: 객실 출입 가능 여부, 프런트 확인 방식, 예약자명, 야간 출입 가능 여부</li>
        <li>오피스텔: 공동현관 출입 방식(비밀번호·카드), 정확한 호수, 엘리베이터 층 제한</li>
        <li>아파트·자택: 정확한 동·호수, 공동현관, 방문자 등록 여부, 주차 가능 여부</li>
        <li>산업단지·리조트: 정문·동 번호 또는 객실 정책, 이동 가능 시간</li>
      </ul>`;
}

/* ============================================================
   DISTRICTS (시·군·구 상세) — 전부 index
   ============================================================ */
function buildDistricts() {
  for (const d of districts) {
    const r = regionBySlug[d.region];
    const path = `/${r.slug}/${d.seg}/`;
    const crumbs = [HOME, { label: r.name, href: `/${r.slug}/` }, { label: d.name, href: path }];
    const cityName = r.name.replace("권", "");
    const progCards = d.programs.map((s) => { const p = programBySlug[s]; return { href: `/program/${p.slug}/`, title: p.name, text: p.lead }; });
    const siblings = districtsByRegion(r.slug).filter((x) => x.seg !== d.seg).slice(0, 8)
      .map((x) => ({ label: x.name, href: `/${r.slug}/${x.seg}/` }));
    const zoneArea = areaBySlug[d.zone.split("/")[2]];
    const related = [
      ...(zoneArea ? [{ label: `${zoneArea.name} 생활권`, href: d.zone }] : []),
      { label: `${r.name} 전체`, href: `/${r.slug}/` },
      ...siblings.slice(0, 5),
    ];
    const faq = [
      { q: `${d.name}에서도 방문이 가능한가요?`, a: `${d.name}의 정확한 주소와 가까운 생활권, 예약 가능 시간, 숙소 유형을 확인한 뒤 안내합니다.` },
      { q: `${d.name}에서 어떤 프로그램이 많이 이용되나요?`, a: `${d.programs.map((s) => programBySlug[s].name).join(", ")} 등이 이용되며, 원하는 강도와 집중 부위를 예약 시 전달해 주세요.` },
      ...COMMON_FAQ.slice(1),
    ];

    const body = `
    ${hero({ eyebrow: r.keyword, h1: `${d.name} 출장마사지 안내`, lead: d.char, ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: `${r.name} 메인`, href: `/${r.slug}/` }] })}
    ${breadcrumbs(crumbs)}

    ${richArticle({ name: d.name, lead: d.char, transportText: d.transport, stayText: d.stay, stationNames: stationsByRegion(r.slug).slice(0, 3).map((s) => s.name), programs: d.programs })}

    ${priceTable()}

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Programs</span><h2>${esc(d.name)} 추천 프로그램</h2></div>
      ${cardGrid(progCards, 3)}
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap"><div class="article">
      <h2>Who, How, Why</h2>${whoHowWhy(`${cityName} ${d.name}`)}
      <h2>관련 지역 보기</h2>${relatedChips(related)}
    </div></div></section>

    ${faqBlock(faq)}`;

    emit(path, {
      title: `${d.name} 출장마사지 안내｜${r.name}`,
      desc: `${d.name} 출장마사지 예약 전 생활권 특징과 숙소 유형·이동 기준·프로그램을 안내합니다.`,
      image: HERO, crumbs, faq, body,
    });
  }
}

/* ============================================================
   STATIONS (역·터미널·공항 거점) — 전부 index
   ============================================================ */
function buildStations() {
  const idxCrumbs = [HOME, { label: "역·터미널·공항 거점", href: "/station/" }];
  const cards = stations.map((s) => ({ href: `/station/${s.seg}/`, title: `${s.name}`, text: s.char.split(". ")[0] + "." }));
  emit("/station/", {
    title: "역·터미널·공항 거점 안내｜영남·제주 출장마사지｜" + site.brand,
    desc: "부산역·동대구역·제주공항 등 역·터미널·공항 거점 인접 숙소 출장마사지 이용 기준을 안내합니다.",
    image: HERO, crumbs: idxCrumbs,
    body: `${hero({ eyebrow: "Hubs", h1: "역·터미널·공항 거점 안내", lead: "부산역·동대구역·진주역·제주공항 등 주요 거점 인접 숙소의 이용 기준과 이동 동선을 안내합니다.", ctas: [{ label: "예약 문의", href: site.phoneHref }] })}
      ${breadcrumbs(idxCrumbs)}
      <section class="section" style="padding-top:24px"><div class="wrap">${cardGrid(cards, 3)}</div></section>
      ${noticeBar()}`,
  });

  for (const s of stations) {
    const r = regionBySlug[s.region];
    const path = `/station/${s.seg}/`;
    const crumbs = [...idxCrumbs, { label: s.name, href: path }];
    const progCards = s.programs.map((x) => { const p = programBySlug[x]; return { href: `/program/${p.slug}/`, title: p.name, text: p.lead }; });
    const zoneArea = areaBySlug[s.zone.split("/")[2]];
    const siblings = stationsByRegion(s.region).filter((x) => x.seg !== s.seg).slice(0, 6).map((x) => ({ label: x.name, href: `/station/${x.seg}/` }));
    const related = [
      ...(zoneArea ? [{ label: `${zoneArea.name} 생활권`, href: s.zone }] : []),
      { label: `${r.name} 전체`, href: `/${r.slug}/` },
      ...siblings,
    ];
    const faq = [
      { q: `${s.name} 인근 숙소도 이용할 수 있나요?`, a: `${s.name} 인근 숙소는 정확한 주소와 이동 가능 시간, 숙소 유형을 확인한 뒤 안내합니다.` },
      ...COMMON_FAQ.slice(1),
    ];
    const zoneName = zoneArea ? zoneArea.name : `${r.name}`;
    const body = `
    ${hero({ eyebrow: `${r.keyword} · ${s.kind}`, h1: `${s.name} 인근 출장마사지 안내`, lead: s.char, ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: "거점 전체", href: "/station/" }] })}
    ${breadcrumbs(crumbs)}

    ${richArticle({
      name: `${s.name} 인근`,
      lead: `${s.char} ${s.name}은(는) ${zoneName} 생활권과 이어지는 ${s.kind}입니다.`,
      transportText: `${s.name}은(는) ${s.kind}로서 인근 숙소 접근성이 좋아 출장·환승 이용이 많은 거점입니다. ${s.name}을(를) 기준으로 이동 동선을 확인하되, 안내는 언제나 최종 숙소 주소를 기준으로 진행합니다.`,
      stayText: `${s.name} 인근은 역세권 비즈니스호텔과 오피스텔이 많아`,
      stationNames: [],
      programs: s.programs,
      profile: profileOf(`${s.char} ${s.kind}`),
    })}

    ${priceTable()}
    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Programs</span><h2>추천 프로그램</h2></div>
      ${cardGrid(progCards, 3)}
    </div></section>
    <section class="section" style="padding-top:0"><div class="wrap"><div class="article">
      <h2>Who, How, Why</h2>${whoHowWhy(`${s.name} 인근`)}
      <h2>관련 지역 보기</h2>${relatedChips(related)}
    </div></div></section>
    ${faqBlock(faq)}`;

    emit(path, {
      title: `${s.name} 인근 출장마사지 안내｜${site.brand}`,
      desc: `${s.name} 인근 숙소 출장마사지 예약 전 이동 동선과 숙소 이용 기준을 안내합니다.`,
      image: HERO, crumbs, faq, body,
    });
  }
}

/* ============================================================
   AREAS (14 living zones)
   ============================================================ */
function buildAreas() {
  for (const a of areas) {
    const r = regionBySlug[a.region];
    const crumbs = [HOME, { label: r.name, href: `/${r.slug}/` }, { label: a.name, href: `/area/${a.slug}/` }];
    const progCards = a.programs.map((slug) => {
      const p = programBySlug[slug];
      return { href: `/program/${p.slug}/`, title: p.name, text: p.lead };
    });
    const siblingZones = r.zones.filter((z) => z.href !== `/area/${a.slug}/`).map((z) => ({ label: z.label, href: z.href }));
    const faq = [
      { q: `${a.name}에서도 방문이 가능한가요?`, a: `${a.includes} 등 생활권의 정확한 주소와 이동 가능 시간, 숙소 유형을 확인한 뒤 안내합니다.` },
      ...COMMON_FAQ.slice(1),
    ];

    const body = `
    ${hero({ eyebrow: `${r.keyword}`, h1: `${a.name} 출장마사지 안내`, lead: a.direction, ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: `${r.name} 메인`, href: `/${r.slug}/` }] })}
    ${breadcrumbs(crumbs)}

    ${richArticle({ name: a.name, lead: a.direction, transportText: `${a.stations.join(", ")}을(를) 기준으로 이동 동선과 시간을 확인합니다.`, stayText: "", includes: a.includes, stationNames: a.stations, programs: a.programs })}

    ${priceTable()}

    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><span class="eyebrow">Programs</span><h2>추천 프로그램</h2></div>
      ${cardGrid(progCards, 3)}
    </div></section>

    <section class="section" style="padding-top:0"><div class="wrap"><div class="article">
      <h2>Who, How, Why</h2>${whoHowWhy(a.name)}
      ${siblingZones.length ? `<h2>관련 지역 보기</h2>${relatedChips(siblingZones.concat([{ label: `${r.name} 전체`, href: `/${r.slug}/` }]))}` : ""}
    </div></div></section>

    ${faqBlock(faq)}`;

    emit(`/area/${a.slug}/`, {
      title: `${a.name} 출장마사지 안내｜${site.brand}`, desc: a.desc, image: HERO, crumbs, faq, body,
    });
  }
}

/* ============================================================
   PROGRAMS
   ============================================================ */
function buildPrograms() {
  const crumbs0 = [HOME, { label: "마사지 프로그램", href: "/program/" }];
  const cards = programs.map((p) => ({ href: `/program/${p.slug}/`, title: p.name, text: p.lead }));
  const body = `
    ${hero({ eyebrow: "Programs", h1: "영남·제주 출장마사지 프로그램 안내", lead: "스웨디시·타이마사지·아로마테라피·스포츠 마사지·발마사지 등 프로그램별 특징과 지역별 이용 기준을 안내합니다.", ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: "지역별 안내", href: "/" }] })}
    ${breadcrumbs(crumbs0)}
    <section class="section" style="padding-top:24px"><div class="wrap">${cardGrid(cards, 3)}</div></section>
    ${priceTable()}
    ${noticeBar()}`;
  emit("/program/", {
    title: "마사지 프로그램 안내｜스웨디시·타이·아로마｜" + site.brand,
    desc: "출장마사지 프로그램별 특징과 스웨디시·타이·아로마·스포츠·발마사지 지역별 이용 기준을 안내합니다.",
    image: HERO, crumbs: crumbs0, body,
  });

  for (const p of programs) {
    const crumbs = [...crumbs0, { label: p.name, href: `/program/${p.slug}/` }];
    const regionChips = p.regions.map((r) => ({ label: r, href: "/" }));
    const others = programs.filter((x) => x.slug !== p.slug).slice(0, 6).map((x) => ({ label: x.name, href: `/program/${x.slug}/` }));
    const faq = [
      { q: `${p.name}는 어떤 분에게 맞나요?`, a: p.body },
      ...COMMON_FAQ.slice(2),
    ];
    const body2 = `
    ${hero({ eyebrow: "Program", h1: `${p.name} 출장마사지 안내`, lead: p.lead, ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: "프로그램 전체", href: "/program/" }] })}
    ${breadcrumbs(crumbs)}
    <section class="section" style="padding-top:24px"><div class="wrap"><div class="article">
      <h2>${esc(p.name)} 특징</h2><p>${esc(p.body)}</p>
      <h2>코스 선택 기준</h2>
      <p>60분은 기본 컨디션·릴랙스 케어, 90분은 아로마 포함 추천 구성, 120분은 전신 집중 프리미엄 케어로 구성됩니다. 원하는 집중 부위와 강도를 예약 시 전달해 주세요.</p>
      <h2>주요 이용 지역</h2>${relatedChips(regionChips)}
    </div></div></section>
    ${priceTable()}
    <section class="section" style="padding-top:0"><div class="wrap"><div class="article">
      <h2>다른 프로그램 보기</h2>${relatedChips(others)}
    </div></div></section>
    ${noticeBar()}
    ${faqBlock(faq)}`;
    // men/women/night: keep index; couple/lomi also index (real content)
    emit(`/program/${p.slug}/`, {
      title: `${p.name} 출장마사지 안내｜${site.brand}`, desc: p.desc, image: HERO, crumbs, faq, body: body2,
    });
  }
}

/* ============================================================
   USE / CHECK guide pages
   ============================================================ */
function buildGuides() {
  // Use index
  const useCrumbs = [HOME, { label: "이용 장소 안내", href: "/use/" }];
  emit("/use/", {
    title: "이용 장소별 안내｜자택·호텔·오피스텔·산업단지｜" + site.brand,
    desc: "자택·호텔·오피스텔·산업단지·리조트 등 이용 장소별 출장마사지 예약 전 확인사항을 안내합니다.",
    image: HERO, crumbs: useCrumbs,
    body: `${hero({ eyebrow: "Where", h1: "이용 장소별 확인 기준", lead: "자택·호텔·오피스텔·산업단지·리조트 등 장소마다 출입 방식과 확인사항이 다릅니다.", ctas: [{ label: "예약 문의", href: site.phoneHref }] })}
      ${breadcrumbs(useCrumbs)}
      <section class="section" style="padding-top:24px"><div class="wrap">${cardGrid(usePlaces.map((u) => ({ href: `/use/${u.slug}/`, title: u.name, text: u.desc })), 4)}</div></section>
      ${noticeBar()}`,
  });
  for (const u of usePlaces) {
    const crumbs = [...useCrumbs, { label: u.name, href: `/use/${u.slug}/` }];
    emit(`/use/${u.slug}/`, {
      title: `${u.name} 출장마사지 이용 안내｜${site.brand}`, desc: u.desc, image: HERO, crumbs,
      body: `${hero({ eyebrow: "이용 장소", h1: `${u.name} 출장마사지 이용 안내`, lead: u.desc, ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: "이용 장소 전체", href: "/use/" }] })}
        ${breadcrumbs(crumbs)}
        <section class="section" style="padding-top:24px"><div class="wrap"><div class="article"><p>${esc(u.body)}</p>
          <h2>예약 전 확인</h2>${relatedChips(checks.map((c) => ({ label: c.name, href: `/check/${c.slug}/` })))}
        </div></div></section>
        ${noticeBar()}`,
    });
  }

  // Check index
  const chkCrumbs = [HOME, { label: "예약 전 확인", href: "/check/" }];
  emit("/check/", {
    title: "예약 전 확인 안내｜주소·건물 출입·이동 기준｜" + site.brand,
    desc: "출장마사지 예약 전 방문 주소·건물 출입·이동 기준·개인정보 확인사항을 안내합니다.",
    image: HERO, crumbs: chkCrumbs,
    body: `${hero({ eyebrow: "Check", h1: "예약 전 확인 안내", lead: "정확한 안내를 위해 방문 주소, 건물 출입, 이동 기준, 개인정보 처리 기준을 예약 전에 확인합니다.", ctas: [{ label: "예약 문의", href: site.phoneHref }] })}
      ${breadcrumbs(chkCrumbs)}
      <section class="section" style="padding-top:24px"><div class="wrap">${cardGrid(checks.map((c) => ({ href: `/check/${c.slug}/`, title: c.name, text: c.desc })), 3)}</div></section>
      ${noticeBar()}`,
  });
  for (const c of checks) {
    const crumbs = [...chkCrumbs, { label: c.name, href: `/check/${c.slug}/` }];
    emit(`/check/${c.slug}/`, {
      title: `${c.name}｜예약 전 확인｜${site.brand}`, desc: c.desc, image: HERO, crumbs,
      body: `${hero({ eyebrow: "예약 전 확인", h1: c.name, lead: c.desc, ctas: [{ label: "예약 문의", href: site.phoneHref }, { label: "예약 전 확인 전체", href: "/check/" }] })}
        ${breadcrumbs(crumbs)}
        <section class="section" style="padding-top:24px"><div class="wrap"><div class="article"><p>${esc(c.body)}</p></div></div></section>
        ${noticeBar()}`,
    });
  }
}

/* ============================================================
   POLICY / CONTACT / SITEMAP
   ============================================================ */
function staticPage(path, title, desc, h1, paragraphs, extra = "") {
  const crumbs = [HOME, { label: h1, href: path }];
  emit(path, {
    title: `${title}｜${site.brand}`, desc, image: HERO, crumbs,
    body: `${hero({ eyebrow: "Info", h1, lead: desc, ctas: [{ label: "예약 문의", href: site.phoneHref }] })}
      ${breadcrumbs(crumbs)}
      <section class="section" style="padding-top:24px"><div class="wrap"><div class="article">
        ${paragraphs.map((p) => (p.startsWith("##") ? `<h2>${esc(p.slice(2).trim())}</h2>` : `<p>${esc(p)}</p>`)).join("")}
        ${extra}
      </div></div></section>
      ${noticeBar()}`,
  });
}

function buildStatic() {
  staticPage("/policy/operation/", "운영 기준 안내", "출장마사지 운영 기준과 예약·이동·개인정보 처리 원칙을 안내합니다.",
    "운영 기준 안내",
    [
      "이 사이트는 부산·대구·창원·경남·경북·제주 지역 방문형 웰니스 서비스 이용 전 확인사항을 안내하기 위한 지역 안내 사이트입니다.",
      "## 예약·이동 기준", "방문 가능 여부는 실제 주소와 예약 조건 확인 후 안내하며, 지역·시간대·이동 거리에 따라 상담 시 최종 확인됩니다.",
      "## 콘텐츠 작성·검수", "공식 행정구역 자료와 실제 예약 전 확인 항목을 기준으로 작성하며, AI 보조 도구를 사용하더라도 최종 문구는 사람이 검수하고 중복·과장·허위 표현을 제거합니다.",
      "## 금지 사항", "무조건 가능·즉시 가능 보장·최저가·1위 등 과장 표현과 가짜 후기, 허위 평점은 사용하지 않습니다.",
    ]);

  staticPage("/policy/prohibited/", "불법·선정적 서비스 불가 안내", "불법·선정적 서비스는 제공하거나 안내하지 않는다는 운영 원칙을 안내합니다.",
    "불법·선정적 서비스 불가 안내",
    [
      "본 사이트는 합법적인 방문형 웰니스 안내만을 목적으로 하며, 불법·선정적 서비스는 제공하거나 안내하지 않습니다.",
      "선정적·불법을 암시하는 표현, 은밀 서비스, 허위 후기 등은 콘텐츠에 사용하지 않습니다.",
      "방문 가능 여부는 실제 주소와 예약 조건 확인 후 안내합니다.",
    ]);

  staticPage("/policy/privacy/", "개인정보 처리방침", "예약 확인·연락에 필요한 최소 개인정보만 사용하는 처리 기준을 안내합니다.",
    "개인정보 처리방침",
    [
      "본 사이트는 예약 확인과 연락에 필요한 최소한의 정보만 사용합니다.",
      "## 수집 항목", "예약 확인을 위한 연락처와 방문 관련 정보(주소·시간 등)에 한합니다.",
      "## 이용 목적", "예약 확인, 이동 안내, 고객 연락 목적으로만 사용하며 목적 달성 후 지체 없이 파기합니다.",
      "## 제3자 제공", "법령에 근거하거나 이용자가 동의한 경우를 제외하고 제3자에게 제공하지 않습니다.",
    ]);

  staticPage("/contact/", "문의하기", "전화·텔레그램을 통한 예약 문의와 제휴·제작 문의 방법을 안내합니다.",
    "문의하기",
    [
      "예약 문의는 전화로, 웹사이트 제작·제휴 문의는 텔레그램으로 받고 있습니다.",
      "## 전화예약", `${site.brand} 전화예약: ${site.phone}`,
      "## 텔레그램 문의", "웹사이트 제작문의와 제휴문의는 하단 푸터의 텔레그램 버튼을 이용해 주세요.",
    ],
    `<div class="hero-cta" style="margin-top:20px">
       <a class="btn btn-primary btn-lg" href="${site.phoneHref}">전화예약 ${esc(site.phone)}</a>
       <a class="btn btn-ghost btn-lg" href="${site.telegramBuild}" target="_blank" rel="noopener">웹사이트 제작문의</a>
       <a class="btn btn-ghost btn-lg" href="${site.telegramPartner}" target="_blank" rel="noopener">제휴문의</a>
     </div>`);

  // HTML sitemap page
  const groups = [
    ["권역", regions.map((r) => ({ label: r.name, href: `/${r.slug}/` }))],
    ["시·군·구", districts.map((d) => ({ label: `${regionBySlug[d.region].name.replace("권", "")} ${d.name}`, href: `/${d.region}/${d.seg}/` }))],
    ["생활권", areas.map((a) => ({ label: a.name, href: `/area/${a.slug}/` }))],
    ["역·터미널·공항", stations.map((s) => ({ label: s.name, href: `/station/${s.seg}/` }))],
    ["프로그램", programs.map((p) => ({ label: p.name, href: `/program/${p.slug}/` }))],
    ["이용 장소", usePlaces.map((u) => ({ label: u.name, href: `/use/${u.slug}/` }))],
    ["예약 전 확인", checks.map((c) => ({ label: c.name, href: `/check/${c.slug}/` }))],
  ];
  const smBody = groups.map(([t, items]) => `<h2>${t}</h2>${relatedChips(items)}`).join("");
  staticPage("/sitemap-page/", "사이트맵", "영남·제주 출장마사지 안내 사이트의 전체 페이지 목록입니다.",
    "사이트맵", ["전체 페이지를 한눈에 확인할 수 있습니다."], smBody);
}

/* ============================================================
   sitemap.xml + robots.txt
   ============================================================ */
function buildSitemap() {
  const urls = pages.map((p) => `  <url><loc>${site.domain.replace(/\/$/, "")}${p}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
    .replace("sitemap.org/schemas", "sitemaps.org/schemas");
  writeFileSync(join(OUT, "sitemap.xml"), xml);
  writeFileSync(join(OUT, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${site.domain.replace(/\/$/, "")}/sitemap.xml\n`);
}

/* ============================================================
   RUN
   ============================================================ */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(__dirname, "assets"), join(OUT, "assets"), { recursive: true });

// favicon / manifest files must sit at the site root
for (const f of ["favicon.ico", "favicon.svg", "apple-touch-icon.png", "icon-16.png",
  "icon-32.png", "icon-192.png", "icon-512.png", "site.webmanifest"]) {
  cpSync(join(__dirname, "assets/favicon", f), join(OUT, f));
}

buildHome();
buildRegions();
buildDistricts();
buildAreas();
buildStations();
buildPrograms();
buildGuides();
buildStatic();
buildSitemap();

console.log(`✓ built ${pages.length} indexed pages → dist/`);

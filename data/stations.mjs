// 역·터미널·공항 거점 페이지 — 거점 인접 숙소 이용 기준 안내(전부 index).
// 출구별·노선별 페이지는 만들지 않습니다(스팸 정책 회피).
export const stations = [
  /* 부산 */
  { region: "busan", seg: "busan-station", name: "부산역", kind: "KTX역", zone: "/area/busan-seomyeon-gwangalli/", programs: ["foot-massage", "aroma-therapy"],
    char: "부산의 KTX 관문으로 전국 철도 접근성이 가장 좋은 거점입니다. 역 인접 비즈니스호텔과 초량 일대 숙소가 밀집해 있어 출장·환승 이용이 많습니다." },
  { region: "busan", seg: "seomyeon-station", name: "서면역", kind: "환승역", zone: "/area/busan-seomyeon-gwangalli/", programs: ["deep-tissue", "aroma-therapy"],
    char: "1·2호선 환승 요지이자 부산 최대 도심 상권의 중심입니다. 오피스텔과 비즈니스호텔이 밀집해 도심 어디로든 이동이 편리합니다." },
  { region: "busan", seg: "haeundae-station", name: "해운대역", kind: "관광 거점", zone: "/area/busan-haeundae-centum/", programs: ["swedish", "aroma-therapy"],
    char: "해운대 해수욕장과 특급호텔·레지던스가 인접한 관광 거점입니다. 성수기 이동 동선 혼잡을 고려해 예약 시간대를 확인합니다." },
  { region: "busan", seg: "centum-city-station", name: "센텀시티역", kind: "업무 거점", zone: "/area/busan-haeundae-centum/", programs: ["aroma-therapy", "deep-tissue"],
    char: "벡스코·센텀 업무지구와 레지던스가 인접한 거점으로, 전시·업무 출장 수요가 높습니다. 오피스텔 공동현관 방식을 확인합니다." },
  { region: "busan", seg: "gimhae-airport", name: "김해공항", kind: "공항", zone: "/area/busan-west-airport-industrial/", programs: ["foot-massage", "sports-massage"],
    char: "부산·경남 관문 공항으로 명지·강서 인접 숙소 이용이 많습니다. 공항 인접 숙소는 위치와 야간 이동 가능 시간을 확인합니다." },
  { region: "busan", seg: "sasang-terminal", name: "사상시외버스터미널", kind: "터미널", zone: "/area/busan-west-airport-industrial/", programs: ["sports-massage", "foot-massage"],
    char: "서부산 교통 요지로 경전철·지하철 환승이 편리한 거점입니다. 산단 인접 숙소와 오피스텔 이용이 많습니다." },

  /* 대구 */
  { region: "daegu", seg: "dongdaegu-station", name: "동대구역", kind: "KTX·SRT역", zone: "/area/daegu-dongdaegu-dalseo-dalseong/", programs: ["foot-massage", "sports-massage"],
    char: "대구의 KTX·SRT 관문이자 복합환승센터가 있는 거점입니다. 역세권 비즈니스호텔이 밀집해 출장·환승 이용이 많습니다." },
  { region: "daegu", seg: "daegu-station", name: "대구역", kind: "철도역", zone: "/area/daegu-dongseongno-suseong/", programs: ["aroma-therapy", "foot-massage"],
    char: "동성로 도심 상권과 인접한 철도 거점으로, 도심 오피스텔·호텔 이용이 많습니다. 공동현관 방식과 호수를 확인합니다." },
  { region: "daegu", seg: "banwoldang-station", name: "반월당역", kind: "환승역", zone: "/area/daegu-dongseongno-suseong/", programs: ["aroma-therapy", "deep-tissue"],
    char: "1·2호선 환승 요지이자 도심 상권 중심입니다. 오피스텔이 밀집해 도심 접근성이 가장 좋은 거점입니다." },
  { region: "daegu", seg: "beomeo-station", name: "범어역", kind: "업무 거점", zone: "/area/daegu-dongseongno-suseong/", programs: ["aroma-therapy", "deep-tissue"],
    char: "수성구 범어 업무·주거 밀집지의 거점으로, 고급 주거 단지와 오피스텔이 많습니다. 방문자 등록 절차를 확인합니다." },
  { region: "daegu", seg: "seongseo-industrial-station", name: "성서산업단지역", kind: "산단 거점", zone: "/area/daegu-dongdaegu-dalseo-dalseong/", programs: ["sports-massage", "deep-tissue"],
    char: "성서산단 인접 거점으로 산업 출장 숙소 이용이 많습니다. 정문·동 번호와 이동 가능 시간을 확인합니다." },
  { region: "daegu", seg: "seodaegu-station", name: "서대구역", kind: "KTX역", zone: "/area/daegu-dongdaegu-dalseo-dalseong/", programs: ["foot-massage", "sports-massage"],
    char: "대구 서부의 신설 KTX 거점으로 성서·달서 접근성이 좋습니다. 역세권 숙소와 산단 인접 숙소 이용이 많습니다." },

  /* 창원·경남 */
  { region: "changwon", seg: "changwon-central-station", name: "창원중앙역", kind: "KTX역", zone: "/area/changwon-masan-jinhae/", programs: ["sports-massage", "aroma-therapy"],
    char: "창원의 KTX 거점으로 상남·중앙 도심과 인접합니다. 도심 오피스텔·비즈니스호텔 이용이 많습니다." },
  { region: "changwon", seg: "changwon-station", name: "창원역", kind: "철도역", zone: "/area/changwon-masan-jinhae/", programs: ["sports-massage", "foot-massage"],
    char: "창원 북부와 국가산단 인접 철도 거점입니다. 산단 출장 숙소 이용이 많아 정확한 주소 확인이 중요합니다." },
  { region: "changwon", seg: "masan-station", name: "마산역", kind: "철도역", zone: "/area/changwon-masan-jinhae/", programs: ["deep-tissue", "foot-massage"],
    char: "마산 구도심과 인접한 철도 거점으로, 합포·회원 주거·상권 이용이 많습니다. 공동현관과 호수를 확인합니다." },
  { region: "gyeongnam", seg: "jinju-station", name: "진주역", kind: "KTX·SRT역", zone: "/area/jinju-sacheon/", programs: ["sports-massage", "aroma-therapy"],
    char: "서부 경남의 KTX·SRT 관문으로 혁신도시와 인접합니다. 혁신도시 오피스텔·비즈니스호텔 이용이 많습니다." },
  { region: "gyeongnam", seg: "yangsan-station", name: "양산역", kind: "지하철역", zone: "/area/gimhae-yangsan/", programs: ["thai-massage", "foot-massage"],
    char: "부산 2호선 연장 거점으로 부산 생활권과 밀접합니다. 물금·양산 신도시 아파트·오피스텔 이용이 많습니다." },
  { region: "gyeongnam", seg: "mulgeum-station", name: "물금역", kind: "철도역", zone: "/area/gimhae-yangsan/", programs: ["thai-massage", "aroma-therapy"],
    char: "물금신도시 인접 철도 거점으로 신도시 주거 수요가 큽니다. 공동현관과 동·호수를 확인합니다." },
  { region: "gyeongnam", seg: "geoje-gohyeon-terminal", name: "고현시외버스터미널", kind: "터미널", zone: "/area/geoje-tongyeong/", programs: ["sports-massage", "foot-massage"],
    char: "거제 고현 도심의 교통 거점으로 조선업 인접 숙소 이용이 많습니다. 정확한 주소와 이동 시간을 확인합니다." },

  /* 경북 */
  { region: "gyeongbuk", seg: "pohang-station", name: "포항역", kind: "KTX역", zone: "/area/pohang-gyeongju/", programs: ["aroma-therapy", "sports-massage"],
    char: "포항의 KTX 관문으로 철강산단과 영일대 해안 접근성이 좋습니다. 산단 숙소와 해안 호텔 이용이 나뉩니다." },
  { region: "gyeongbuk", seg: "gyeongju-station", name: "경주역(신경주)", kind: "KTX·SRT역", zone: "/area/pohang-gyeongju/", programs: ["aroma-therapy", "couple"],
    char: "경주의 KTX·SRT 관문으로 보문단지·황리단길 관광 숙소와 연결됩니다. 관광 성수기 이동 동선을 확인합니다." },
  { region: "gyeongbuk", seg: "gumi-station", name: "구미역", kind: "철도역", zone: "/area/gumi-gimcheon/", programs: ["sports-massage", "deep-tissue"],
    char: "구미 도심과 국가산단 인접 철도 거점입니다. 장기 출장 오피스텔·산단 숙소 이용이 많습니다." },
  { region: "gyeongbuk", seg: "gimcheon-gumi-station", name: "김천구미역", kind: "KTX역", zone: "/area/gumi-gimcheon/", programs: ["sports-massage", "foot-massage"],
    char: "김천·구미 혁신도시·산단을 잇는 KTX 거점입니다. 혁신도시 오피스텔·비즈니스호텔 이용이 많습니다." },
  { region: "gyeongbuk", seg: "andong-station", name: "안동역", kind: "철도역", zone: "/area/andong-gyeongsan-yeongcheon/", programs: ["aroma-therapy", "foot-massage"],
    char: "경북 북부 행정 중심의 철도 거점으로 도청신도시와 연결됩니다. 도심·신도시 숙소 이용이 많습니다." },
  { region: "gyeongbuk", seg: "gyeongsan-station", name: "경산역", kind: "철도역", zone: "/area/andong-gyeongsan-yeongcheon/", programs: ["sports-massage", "foot-massage"],
    char: "대구 인접 대학가·산업 거점으로 대구 생활권과 밀접합니다. 대학가 오피스텔·산단 숙소 이용이 많습니다." },

  /* 제주 */
  { region: "jeju", seg: "jeju-airport", name: "제주국제공항", kind: "공항", zone: "/area/jeju-city-airport/", programs: ["swedish", "aroma-therapy"],
    char: "제주 관문 공항으로 연동·노형 도심 숙소와 렌터카 이동이 중심입니다. 숙소 주소와 이동 시간을 함께 확인합니다." },
  { region: "jeju", seg: "jeju-bus-terminal", name: "제주시외버스터미널", kind: "터미널", zone: "/area/jeju-city-airport/", programs: ["swedish", "foot-massage"],
    char: "제주시 도심 교통 거점으로 연동·이도 숙소와 인접합니다. 도심 오피스텔 공동현관 방식을 확인합니다." },
  { region: "jeju", seg: "seogwipo-terminal", name: "서귀포버스터미널", kind: "터미널", zone: "/area/seogwipo-jungmun-coast/", programs: ["aroma-therapy", "couple"],
    char: "서귀포 도심과 중문 방향 이동 거점입니다. 리조트·펜션이 분산되어 있어 이동 거리를 확인합니다." },
];

export const stationsByRegion = (region) => stations.filter((s) => s.region === region);

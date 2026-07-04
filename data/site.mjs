// Global site configuration — edit brand / contact / links here.
export const site = {
  brand: "간다GO",
  brandEn: "GANDAGO",
  tagline: "영남·제주 출장마사지 안내",
  domain: "https://relaxora.pages.dev", // 운영 도메인
  phone: "0508-202-4719",
  phoneHref: "tel:0508-202-4719",
  // 텔레그램 채널/문의 링크 — 실제 핸들로 교체하세요.
  telegram: "https://t.me/gandago",
  telegramBuild: "https://t.me/gandago",     // 웹사이트 제작문의
  telegramPartner: "https://t.me/gandago",   // 제휴문의
  locale: "ko_KR",
};

// Top navigation with dropdowns (label → href, or children)
export const nav = [
  { label: "홈", href: "/" },
  {
    label: "부산권", href: "/busan/", children: [
      { label: "해운대·센텀", href: "/area/busan-haeundae-centum/" },
      { label: "서면·전포", href: "/area/busan-seomyeon-gwangalli/" },
      { label: "부산 서부·공항·산단", href: "/area/busan-west-airport-industrial/" },
    ],
  },
  {
    label: "대구권", href: "/daegu/", children: [
      { label: "동성로·수성", href: "/area/daegu-dongseongno-suseong/" },
      { label: "동대구·달서·달성", href: "/area/daegu-dongdaegu-dalseo-dalseong/" },
    ],
  },
  {
    label: "창원권", href: "/changwon/", children: [
      { label: "창원·마산·진해", href: "/area/changwon-masan-jinhae/" },
    ],
  },
  {
    label: "경남권", href: "/gyeongnam/", children: [
      { label: "김해·양산", href: "/area/gimhae-yangsan/" },
      { label: "진주·사천", href: "/area/jinju-sacheon/" },
      { label: "거제·통영", href: "/area/geoje-tongyeong/" },
    ],
  },
  {
    label: "경북권", href: "/gyeongbuk/", children: [
      { label: "포항·경주", href: "/area/pohang-gyeongju/" },
      { label: "구미·김천", href: "/area/gumi-gimcheon/" },
      { label: "안동·경산·영천", href: "/area/andong-gyeongsan-yeongcheon/" },
    ],
  },
  {
    label: "제주권", href: "/jeju/", children: [
      { label: "제주시·공항", href: "/area/jeju-city-airport/" },
      { label: "서귀포·중문", href: "/area/seogwipo-jungmun-coast/" },
    ],
  },
  { label: "마사지 프로그램", href: "/program/" },
  { label: "이용 안내", href: "/check/" },
];

// Footer link columns
export const footerNav = {
  지역: [
    { label: "부산권", href: "/busan/" },
    { label: "대구권", href: "/daegu/" },
    { label: "창원권", href: "/changwon/" },
    { label: "경남권", href: "/gyeongnam/" },
    { label: "경북권", href: "/gyeongbuk/" },
    { label: "제주권", href: "/jeju/" },
  ],
  안내: [
    { label: "마사지 프로그램", href: "/program/" },
    { label: "역·터미널·공항 거점", href: "/station/" },
    { label: "이용 장소 안내", href: "/use/" },
    { label: "예약 전 확인", href: "/check/" },
    { label: "운영 기준", href: "/policy/operation/" },
    { label: "불법·선정적 서비스 불가", href: "/policy/prohibited/" },
    { label: "개인정보 처리방침", href: "/policy/privacy/" },
    { label: "사이트맵", href: "/sitemap-page/" },
  ],
};

import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ─────────────────────────────────────────────
// THEME + i18n · 3 языка в 1 · логика score/burnout не меняется
// ─────────────────────────────────────────────
const LangCtx = createContext({ lang: "ru", theme: "dark", t: (k) => k, tx: (o) => o });
const useLang = () => useContext(LangCtx);

const THEMES = {
  dark: {
    bg: "#0F0D0B", card: "rgba(255,255,255,0.03)", cardBorder: "#2A2520",
    ink: "#E8E0D4", inkSoft: "#7A6E62", inkMuted: "#B0A090",
    accent: "#C8A97E", line: "#2A2520", primaryBtnBg: "#C8A97E", primaryBtnText: "#0F0D0B",
    progressInactive: "#2A2520", optionBg: "rgba(255,255,255,0.02)",
    optionSelectedBg: "rgba(200,169,126,0.08)", metricBg: "rgba(255,255,255,0.022)",
    trackBg: "#1E1B18", softBg: "#1A1713", arrow: "#4A4036",
  },
  light: {
    // Контраст как на тёмной: тёмный текст на креме, вторичный не «выцветает»
    bg: "#F1E9D3", card: "#FAF6E8", cardBorder: "rgba(44,40,31,0.18)",
    ink: "#2A261F", inkSoft: "#5A5144", inkMuted: "#4A4338",
    accent: "#8B5E2F", line: "rgba(44,40,31,0.16)", primaryBtnBg: "#8B5E2F", primaryBtnText: "#FAF6E8",
    progressInactive: "rgba(44,40,31,0.18)", optionBg: "rgba(44,40,31,0.04)",
    optionSelectedBg: "rgba(139,94,47,0.14)", metricBg: "#F7F0DC",
    trackBg: "rgba(44,40,31,0.10)", softBg: "#EDE4CC", arrow: "#6A6054",
  },
};

const UI = {
  ru: {
    subtitle: "茶道 · твое личное пространство", intro: "Не о чае. О возвращении к себе.",
    diary: "🌕 Чайный дневник", library: "📜 Чайная библиотека", admin: "⚙️ Админка",
    back: "← назад", next: "Следующий вопрос", resultBtn: "Узнать результат",
    again: "Пройти заново", share: "Поделиться с другом ↗", loading: "Загружаю…",
    mypathTitle: "МОЙ ПУТЬ", dayQuestion: "ВОПРОС ДНЯ", dominantState: "доминирующее состояние",
    doNow: "ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС",
    howPractice: "КАК ПРАКТИКОВАТЬ",
    howBrew: "КАК ЗАВАРИВАТЬ",
    assemblyPoint: "ТОЧКА СБОРКИ",
    burnoutLevel: "УРОВЕНЬ ВЫГОРАНИЯ",
    selfDeception: "СКЛОННОСТЬ К САМООБМАНУ",
    hormoneCode: "ГОРМОНАЛЬНЫЙ КОД",
    allSeven: "ВСЕ СЕМЬ СИСТЕМ",
    truthScale: "МАСШТАБ ПРАВДЫ",
    testsAndPractices: "ТЕСТЫ И ПРАКТИКИ",
    favoriteTea: "ЛЮБИМЫЙ ЧАЙ",
    favoritePractice: "ЛЮБИМАЯ ПРАКТИКА",
    goChannel: "Перейти в канал 🌕",
    followChannel: "Следить в канале 🌕",
    findYoutube: "Найти на YouTube ↗",
    nextAdvice: "Следующий совет",
    myTrajectory: "Моя траектория",
    notebook: "Мой блокнот",
    teaShop: "Чайная лавка",
    weekMap: "КАРТА НЕДЕЛИ",
    monthMap: "КАРТА МЕСЯЦА",
    yearMap: "КАРТА ГОДА",
    weekSummary: "Итог недели",
    monthSummary: "Итог месяца",
    yearSummary: "Годовой отчет",
    whereLifeGoes: "КУДА ДВИЖЕТСЯ ЖИЗНЬ",
    whereYouGo90: "КУДА ТЫ ДВИЖЕШЬСЯ · 90 ДНЕЙ",
    aboutData: "О ТВОИХ ДАННЫХ",
    anonymity: "Анонимность",
    onlyYou: "видишь только ты, хранится на твоём устройстве",
    viaTelegram: "через Telegram",
    saved: "сохранено 🌙",
    sealed: "запечатано",
    opensToday: "откроется сегодня",
    tryAgain: "попробовать снова",
    loadFail: "Не удалось загрузить",
    brewingNums: "Завариваю цифры…",
    brewing: "Заваривается...",
    collectingPath: "Собираем твой путь...",
    loadingPath: "Загружаю твой путь...",
    openingNotes: "Открываю тихие записи...",
    littleData: "Ещё мало данных",
    trajWillShow: "и траектория начнёт проявляться.",
    whereLife: "куда движется твоя жизнь",
    dominantMood: "доминирующее настроение",
    burnoutStat: "уровень выгорания",
    selfDeceptStat: "склонность к самообману",
    assemblyStat: "точка сборки",
    favTeaStat: "любимый чай",
    favPractStat: "любимая практика",
    spaceStats: "статистика пространства",
    uniquePeople: "Уникальных людей",
    totalOpens: "Всего открытий",
    avgScore: "средний балл",
    results: "результатов",
    unique: "уникальных",
    selfDeceptDist: "САМООБМАН · РАСПРЕДЕЛЕНИЕ",
    checkApi: "Проверь API / KV на Vercel",
    noExtra: "Без лишнего. Только то, что работает.",
    personalThoughts: "Твоё личное пространство для мыслей.",
    placeForThoughts: "место, куда можно положить мысли",
    letterToSelf: "Письмо себе — открыть",
    questionReflect: "ВОПРОС ДЛЯ РАЗМЫШЛЕНИЯ",
    byResults: "по результатам опроса",
    emptyQuiz: "Пройди опросник «Честный разговор с собой» — и здесь появится твоя точка сборки.",
    emptyTea: "Пройди тест чая — и здесь появится твой любимый.",
    emptyMood: "Отмечай настроение каждый день — и здесь появится твоя траектория.",
    menu: {
      quiz: { title: "Честный разговор с собой", desc: "Самооценка · выгорание · 25 вопросов" },
      selfhonesty: { title: "Склонность к самообману", desc: "Тест на самообман · 14 вопросов" },
      hormones: { title: "Гормональный код", desc: "7 систем · 10 вопросов" },
      hormoneguide: { title: "Всё о гормонах", desc: "Гид: как привести 7 систем в порядок" },
      teaquiz: { title: "Найти свой чай", desc: "Под внутреннее состояние · 5 вопросов" },
      meditation: { title: "Моя практика", desc: "Подбор под внутреннее состояние · 20 вопросов" },
      meditationguidance: { title: "Наставления по медитации", desc: "Одна простая и самая действенная практика" },
      dailycheck: { title: "Компас состояния", desc: "Точно узнай, что сейчас не так, и что с этим делать · 10 вопросов" },
      mood: { title: "Мой день сегодня", desc: "Отметить своё состояние" },
      mypath: { title: "Мой профиль", desc: "Мои результаты и прогресс" },
    },
  },
  uk: {
    subtitle: "茶道 · твій особистий простір", intro: "Не про чай. Про повернення до себе.",
    diary: "🌕 Чайний щоденник", library: "📜 Чайна бібліотека", admin: "⚙️ Адмінка",
    back: "← назад", next: "Наступне питання", resultBtn: "Дізнатися результат",
    again: "Пройти знову", share: "Поділитися з другом ↗", loading: "Завантажую…",
    mypathTitle: "МІЙ ШЛЯХ", dayQuestion: "ПИТАННЯ ДНЯ", dominantState: "домінуючий стан",
    doNow: "ЩО РОБИТИ ПРЯМО ЗАРАЗ",
    howPractice: "ЯК ПРАКТИКУВАТИ",
    howBrew: "ЯК ЗАВАРЮВАТИ",
    assemblyPoint: "ТОЧКА ЗБІРКИ",
    burnoutLevel: "РІВЕНЬ ВИГОРАННЯ",
    selfDeception: "СХИЛЬНІСТЬ ДО САМООБМАНУ",
    hormoneCode: "ГОРМОНАЛЬНИЙ КОД",
    allSeven: "УСІ СІМ СИСТЕМ",
    truthScale: "МАСШТАБ ПРАВДИ",
    testsAndPractices: "ТЕСТИ І ПРАКТИКИ",
    favoriteTea: "УЛЮБЛЕНИЙ ЧАЙ",
    favoritePractice: "УЛЮБЛЕНА ПРАКТИКА",
    goChannel: "Перейти в канал 🌕",
    followChannel: "Стежити в каналі 🌕",
    findYoutube: "Знайти на YouTube ↗",
    nextAdvice: "Наступна порада",
    myTrajectory: "Моя траєкторія",
    notebook: "Мій блокнот",
    teaShop: "Чайна крамниця",
    weekMap: "КАРТА ТИЖНЯ",
    monthMap: "КАРТА МІСЯЦЯ",
    yearMap: "КАРТА РОКУ",
    weekSummary: "Підсумок тижня",
    monthSummary: "Підсумок місяця",
    yearSummary: "Річний звіт",
    whereLifeGoes: "КУДИ РУХАЄТЬСЯ ЖИТТЯ",
    whereYouGo90: "КУДИ ТИ РУХАЄШСЯ · 90 ДНІВ",
    aboutData: "ПРО ТВОЇ ДАНІ",
    anonymity: "Анонімність",
    onlyYou: "бачиш лише ти, зберігається на твоєму пристрої",
    viaTelegram: "через Telegram",
    saved: "збережено 🌙",
    sealed: "запечатано",
    opensToday: "відкриється сьогодні",
    tryAgain: "спробувати знову",
    loadFail: "Не вдалося завантажити",
    brewingNums: "Заварюю цифри…",
    brewing: "Заварюється...",
    collectingPath: "Збираємо твій шлях...",
    loadingPath: "Завантажую твій шлях...",
    openingNotes: "Відкриваю тихі записи...",
    littleData: "Ще мало даних",
    trajWillShow: "і траєкторія почне проявлятися.",
    whereLife: "куди рухається твоє життя",
    dominantMood: "домінуючий настрій",
    burnoutStat: "рівень вигорання",
    selfDeceptStat: "схильність до самообману",
    assemblyStat: "точка збірки",
    favTeaStat: "улюблений чай",
    favPractStat: "улюблена практика",
    spaceStats: "статистика простору",
    uniquePeople: "Унікальних людей",
    totalOpens: "Усього відкриттів",
    avgScore: "середній бал",
    results: "результатів",
    unique: "унікальних",
    selfDeceptDist: "САМООБМАН · РОЗПОДІЛ",
    checkApi: "Перевір API / KV на Vercel",
    noExtra: "Без зайвого. Лише те, що працює.",
    personalThoughts: "Твій особистий простір для думок.",
    placeForThoughts: "місце, куди можна покласти думки",
    letterToSelf: "Лист собі — відкрити",
    questionReflect: "ПИТАННЯ ДЛЯ РОЗДУМІВ",
    byResults: "за результатами опитування",
    emptyQuiz: "Пройди опитувальник «Чесна розмова з собою» — і тут з'явиться твоя точка збірки.",
    emptyTea: "Пройди тест чаю — і тут з'явиться твій улюблений.",
    emptyMood: "Відмічай настрій щодня — і тут з'явиться твоя траєкторія.",
    menu: {
      quiz: { title: "Чесна розмова з собою", desc: "Самооцінка · вигорання · 25 питань" },
      selfhonesty: { title: "Схильність до самообману", desc: "Тест на самообман · 14 питань" },
      hormones: { title: "Гормональний код", desc: "7 систем · 10 питань" },
      hormoneguide: { title: "Все про гормони", desc: "Гід: як привести 7 систем до ладу" },
      teaquiz: { title: "Знайти свій чай", desc: "Під внутрішній стан · 5 питань" },
      meditation: { title: "Моя практика", desc: "Підбір під внутрішній стан · 20 питань" },
      meditationguidance: { title: "Настанови з медитації", desc: "Одна проста і найдієвіша практика" },
      dailycheck: { title: "Компас стану", desc: "Точно дізнайся, що зараз не так, і що з цим робити · 10 питань" },
      mood: { title: "Мій день сьогодні", desc: "Відмітити свій стан" },
      mypath: { title: "Мій профіль", desc: "Мої результати та прогрес" },
    },
  },
  en: {
    subtitle: "茶道 · your personal space", intro: "Not about tea. About coming back to yourself.",
    diary: "🌕 Tea diary", library: "📜 Tea library", admin: "⚙️ Admin",
    back: "← back", next: "Next question", resultBtn: "See the result",
    again: "Take again", share: "Share with a friend ↗", loading: "Loading…",
    mypathTitle: "MY PATH", dayQuestion: "QUESTION OF THE DAY", dominantState: "dominant state",
    doNow: "WHAT TO DO RIGHT NOW",
    howPractice: "HOW TO PRACTICE",
    howBrew: "HOW TO BREW",
    assemblyPoint: "ASSEMBLY POINT",
    burnoutLevel: "BURNOUT LEVEL",
    selfDeception: "TENDENCY TO SELF-DECEPTION",
    hormoneCode: "HORMONAL CODE",
    allSeven: "ALL SEVEN SYSTEMS",
    truthScale: "SCALE OF TRUTH",
    testsAndPractices: "TESTS & PRACTICES",
    favoriteTea: "FAVORITE TEA",
    favoritePractice: "FAVORITE PRACTICE",
    goChannel: "Go to the channel 🌕",
    followChannel: "Follow the channel 🌕",
    findYoutube: "Find on YouTube ↗",
    nextAdvice: "Next tip",
    myTrajectory: "My trajectory",
    notebook: "My notebook",
    teaShop: "Tea shop",
    weekMap: "WEEK MAP",
    monthMap: "MONTH MAP",
    yearMap: "YEAR MAP",
    weekSummary: "Week summary",
    monthSummary: "Month summary",
    yearSummary: "Year report",
    whereLifeGoes: "WHERE LIFE IS GOING",
    whereYouGo90: "WHERE YOU'RE HEADED · 90 DAYS",
    aboutData: "ABOUT YOUR DATA",
    anonymity: "Anonymity",
    onlyYou: "only you see it; stored on your device",
    viaTelegram: "via Telegram",
    saved: "saved 🌙",
    sealed: "sealed",
    opensToday: "opens today",
    tryAgain: "try again",
    loadFail: "Failed to load",
    brewingNums: "Brewing the numbers…",
    brewing: "Brewing...",
    collectingPath: "Gathering your path...",
    loadingPath: "Loading your path...",
    openingNotes: "Opening quiet notes...",
    littleData: "Not enough data yet",
    trajWillShow: "and the trajectory will start to show.",
    whereLife: "where your life is heading",
    dominantMood: "dominant mood",
    burnoutStat: "burnout level",
    selfDeceptStat: "self-deception tendency",
    assemblyStat: "assembly point",
    favTeaStat: "favorite tea",
    favPractStat: "favorite practice",
    spaceStats: "space statistics",
    uniquePeople: "Unique people",
    totalOpens: "Total opens",
    avgScore: "average score",
    results: "results",
    unique: "unique",
    selfDeceptDist: "SELF-DECEPTION · DISTRIBUTION",
    checkApi: "Check API / KV on Vercel",
    noExtra: "Nothing extra. Only what works.",
    personalThoughts: "Your private space for thoughts.",
    placeForThoughts: "a place to put thoughts down",
    letterToSelf: "Letter to self — open",
    questionReflect: "QUESTION FOR REFLECTION",
    byResults: "based on survey results",
    emptyQuiz: "Take the 'Honest talk with yourself' quiz — and your assembly point will appear here.",
    emptyTea: "Take the tea test — and your favorite will appear here.",
    emptyMood: "Mark your mood every day — and your trajectory will appear here.",
    menu: {
      quiz: { title: "Honest talk with yourself", desc: "Self-assessment · burnout · 25 questions" },
      selfhonesty: { title: "Tendency to self-deception", desc: "Self-deception test · 14 questions" },
      hormones: { title: "Hormonal code", desc: "7 systems · 10 questions" },
      hormoneguide: { title: "All about hormones", desc: "Guide: bringing 7 systems into balance" },
      teaquiz: { title: "Find your tea", desc: "Based on your inner state · 5 questions" },
      meditation: { title: "My practice", desc: "Matched to your inner state · 20 questions" },
      meditationguidance: { title: "Meditation guidance", desc: "One simple, most effective practice" },
      dailycheck: { title: "State compass", desc: "Find out exactly what's off, and what to do about it · 10 questions" },
      mood: { title: "My day today", desc: "Mark how you feel" },
      mypath: { title: "My profile", desc: "My results and progress" },
    },
  },
};


function tx(lang, val) {
  if (val == null) return val;
  if (typeof val === "string" || typeof val === "number") return val;
  if (typeof val === "object" && (val.ru != null || val.uk != null || val.en != null))
    return val[lang] ?? val.ru ?? val.en ?? val.uk ?? "";
  return val;
}

function buildStyles(themeName) {
  const c = THEMES[themeName] || THEMES.dark;
  const isDark = themeName === "dark";
  return {
    screen: { minHeight:"100vh", backgroundColor:c.bg, color:c.ink, fontFamily:"'Georgia','Times New Roman',serif", padding:"24px 20px 40px", display:"flex", flexDirection:"column", boxSizing:"border-box", transition:"background-color 0.2s,color 0.2s" },
    screenHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" },
    backBtn: { background:"none", border:"none", color:c.inkSoft, fontSize:"14px", cursor:"pointer", padding:"0 0 20px 0", alignSelf:"flex-start", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" },
    backBtnBottom: { background:"none", border:"none", color:c.inkSoft, fontSize:"14px", cursor:"pointer", padding:"20px 0 0 0", alignSelf:"flex-start", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" },
    hintBtn: { background:"none", border:`1px solid ${c.line}`, color:c.inkSoft, fontSize:"12px", cursor:"pointer", width:"22px", height:"22px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
    homeHeader: { textAlign:"center", paddingTop:"12px", paddingBottom:"8px" },
    moonIcon: { fontSize:"40px", marginBottom:"12px" },
    homeTitle: { fontSize:"32px", fontWeight:"normal", margin:"0 0 6px", letterSpacing:"0.1em", color:c.ink },
    homeSubtitle: { fontSize:"13px", color:c.inkSoft, letterSpacing:"0.15em", margin:0 },
    homeIntro: { textAlign:"center", fontSize:"15px", color:c.inkMuted, fontStyle:"italic", margin:"28px 0 36px", lineHeight:1.6 },
    menuList: { display:"flex", flexDirection:"column", gap:"12px" },
    menuCard: { background:c.card, border:`1px solid ${c.cardBorder}`, borderRadius:"12px", padding:"16px", display:"flex", alignItems:"center", gap:"14px", cursor:"pointer", textAlign:"left", color:c.ink, transition:"border-color 0.2s" },
    menuCardIcon: { fontSize:"18px", width:"32px", textAlign:"center", color:c.accent },
    menuCardContent: { flex:1 },
    menuCardTitle: { margin:"0 0 4px", fontSize:"15px", fontWeight:"normal", letterSpacing:"0.02em", whiteSpace:"normal", lineHeight:1.4 },
    menuCardDesc: { margin:0, fontSize:"12px", color:c.inkSoft, letterSpacing:"0.03em" },
    menuCardArrow: { color:c.arrow, fontSize:"18px" },
    shopBtn: { width:"100%", padding:"14px", backgroundColor:"transparent", color:c.inkSoft, border:`1px solid ${c.line}`, borderRadius:"10px", fontSize:"13px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" },
    controls: { position:"sticky", top:0, zIndex:20, display:"flex", justifyContent:"flex-end", gap:"6px", padding:"8px 0 4px", marginBottom:"4px", background:`linear-gradient(${c.bg} 70%, transparent)` },
    langBtn: { fontFamily:"ui-monospace,Menlo,Consolas,monospace", fontSize:"12px", background:"transparent", color:c.inkSoft, border:`1px solid ${c.line}`, borderRadius:"4px", padding:"5px 9px", cursor:"pointer" },
    langBtnActive: { fontFamily:"ui-monospace,Menlo,Consolas,monospace", fontSize:"12px", background:c.accent, color: isDark?"#0F0D0B":"#FAF5E7", border:`1px solid ${c.accent}`, borderRadius:"4px", padding:"5px 9px", cursor:"pointer", fontWeight:700 },
    themeBtn: { fontFamily:"ui-monospace,Menlo,Consolas,monospace", fontSize:"14px", background:c.card, color:c.ink, border:`1px solid ${c.line}`, borderRadius:"4px", padding:"4px 10px", cursor:"pointer", lineHeight:1.2 },
    quizProgress: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" },
    quizCategory: { fontSize:"11px", letterSpacing:"0.2em", color:c.accent },
    quizCounter: { fontSize:"12px", color:c.inkSoft },
    progressTrack: { display:"flex", gap:"6px", marginBottom:"28px" },
    progressDot: { flex:1, height:"2px", borderRadius:"1px", transition:"background-color 0.3s" },
    questionText: { fontSize:"20px", lineHeight:1.5, marginBottom:"28px", color:c.ink, fontWeight:"normal" },
    optionsList: { display:"flex", flexDirection:"column", gap:"10px", flex:1, marginBottom:"24px" },
    optionBtn: { background:c.optionBg, border:`1px solid ${c.line}`, borderRadius:"10px", padding:"14px", display:"flex", alignItems:"flex-start", gap:"12px", cursor:"pointer", textAlign:"left", transition:"border-color 0.2s,background-color 0.2s" },
    optionRadio: { color:c.accent, fontSize:"16px", lineHeight:1.4, flexShrink:0 },
    optionText: { fontSize:"14px", color: isDark?"#D0C8BC":c.ink, lineHeight:1.5, fontFamily:"'Georgia',serif" },
    resultContainer: { display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"20px", textAlign:"center", flex:1 },
    resultEmoji: { fontSize:"52px", marginBottom:"16px" },
    resultTitle: { fontSize:"28px", fontWeight:"normal", margin:"0 0 6px", letterSpacing:"0.05em" },
    resultSubtitle: { fontSize:"14px", color:c.inkSoft, fontStyle:"italic", margin:"0 0 20px" },
    progressBar: { width:"100%", height:"3px", backgroundColor:c.progressInactive, borderRadius:"2px", marginBottom:"8px", overflow:"hidden" },
    progressFill: { height:"100%", borderRadius:"2px", transition:"width 0.8s ease" },
    progressLabel: { fontSize:"12px", color:c.inkSoft, marginBottom:"24px" },
    resultText: { fontSize:"15px", lineHeight:1.7, color: isDark?"#C0B8AC":c.inkMuted, fontStyle:"italic", marginBottom:"20px", textAlign:"left" },
    teaNoteBox: { width:"100%", backgroundColor: isDark?"rgba(200,169,126,0.06)":"rgba(176,132,84,0.1)", border:`1px solid ${isDark?"rgba(200,169,126,0.15)":"rgba(176,132,84,0.25)"}`, borderRadius:"10px", padding:"14px", marginBottom:"24px" },
    teaNoteText: { margin:0, fontSize:"13px", color:c.accent, fontStyle:"italic", lineHeight:1.6, textAlign:"left" },
    wisdomContainer: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 0", textAlign:"center" },
    teaIcon: { fontSize:"48px", marginBottom:"32px" },
    wisdomText: { fontSize:"20px", lineHeight:1.7, color:c.ink, fontStyle:"italic", marginBottom:"28px" },
    wisdomLine: { width:"40px", height:"1px", backgroundColor: isDark?"#4A4036":c.line, marginBottom:"12px" },
    wisdomHint: { fontSize:"12px", color: isDark?"#4A4036":c.inkSoft, letterSpacing:"0.1em", margin:0 },
    primaryBtn: { width:"100%", padding:"16px", backgroundColor:c.primaryBtnBg, color:c.primaryBtnText, border:"none", borderRadius:"10px", fontSize:"14px", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"'Georgia',serif", transition:"opacity 0.2s", marginBottom:"12px", boxSizing:"border-box" },
    ghostBtn: { width:"100%", padding:"14px", backgroundColor:"transparent", color:c.inkSoft, border:`1px solid ${c.line}`, borderRadius:"10px", fontSize:"13px", cursor:"pointer", fontFamily:"'Georgia',serif" },
    shareBtn: { width:"100%", padding:"14px", backgroundColor:"transparent", color:c.accent, border:`1px solid ${isDark?"rgba(200,169,126,0.3)":"rgba(176,132,84,0.35)"}`, borderRadius:"10px", fontSize:"13px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em", marginTop:"18px", marginBottom:"12px", boxSizing:"border-box" },
    statCard: { background:c.card, border:`1px solid ${c.line}`, borderRadius:"10px", padding:"14px", textAlign:"center" },
    statNum: { margin:"0 0 4px", fontSize:"24px", color:c.accent, fontWeight:"normal" },
    statLabel: { margin:0, fontSize:"11px", color:c.inkSoft, letterSpacing:"0.05em" },
    sectionHead: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px", marginTop:"22px" },
    sectionTitle: { fontSize:"12px", letterSpacing:"0.2em", color:c.accent, margin:0 },
    infoBtn: { width:"22px", height:"22px", borderRadius:"50%", border:`1px solid ${isDark?"#3A3028":c.line}`, background:"none", color: isDark?"#6A6058":c.inkSoft, fontSize:"11px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Georgia',serif" },
    infoTooltip: { position:"absolute", right:0, top:"28px", width:"220px", background:c.softBg, border:`1px solid ${isDark?"#3A3028":c.line}`, borderRadius:"10px", padding:"12px", fontSize:"11px", color: isDark?"#9A8E80":c.inkSoft, fontStyle:"italic", lineHeight:1.7, zIndex:50, textAlign:"left", boxShadow:"0 8px 24px rgba(0,0,0,0.25)", boxSizing:"border-box" },
    metricBlock: { background:c.metricBg, border:`1px solid ${c.line}`, borderRadius:"14px", padding:"18px 16px", marginBottom:"4px", boxSizing:"border-box" },
    metricTop: { display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"16px", gap:"10px" },
    metricNumWrap: { display:"flex", alignItems:"flex-end", gap:"2px", lineHeight:1 },
    metricNum: { fontSize:"56px", lineHeight:1, letterSpacing:"-0.03em" },
    metricUnit: { fontSize:"18px", color: isDark?"#5A5048":c.inkSoft, marginBottom:"8px" },
    metricRightName: { margin:"0 0 3px", fontSize:"15px", color:c.ink },
    metricRightSub: { margin:0, fontSize:"11px", color:c.inkSoft, fontStyle:"italic" },
    metricTrack: { width:"100%", height:"8px", background:c.trackBg, borderRadius:"4px", position:"relative", marginBottom:"9px", overflow:"visible" },
    metricFill: { height:"100%", borderRadius:"4px", position:"relative", transition:"width 1.3s cubic-bezier(.4,0,.2,1)" },
    metricFillDot: { position:"absolute", right:"-1px", top:"50%", transform:"translateY(-50%)", width:"16px", height:"16px", borderRadius:"50%", border:`2px solid ${c.bg}`, display:"block" },
    scaleLabels: { display:"flex", justifyContent:"space-between" },
    scaleLabel: { fontSize:"10px", color: isDark?"#6A6058":c.inkSoft, letterSpacing:"0.04em", fontWeight: isDark?400:500 },
    scaleLabelHi: { fontSize:"10px", letterSpacing:"0.04em" },
    metricQuote: { padding:"10px 13px", background: isDark?"rgba(200,169,126,0.05)":"rgba(176,132,84,0.08)", borderLeft:`2px solid ${isDark?"rgba(200,169,126,0.25)":"rgba(176,132,84,0.3)"}`, borderRadius:"0 6px 6px 0", marginTop:"13px" },
    metricQuoteText: { margin:0, fontSize:"12px", color: isDark?"#8A7E72":c.inkMuted, fontStyle:"italic", lineHeight:1.75 },
    thermoWrap: { position:"relative", marginBottom:"3px" },
    thermoZones: { display:"flex", gap:"3px", height:"8px", borderRadius:"4px", overflow:"hidden" },
    thermoZone: { flex:1, borderRadius:"2px" },
    thermoMarker: { position:"absolute", top:"50%", transform:"translate(-50%,-50%)", width:"16px", height:"16px", background:"#E8D4A8", borderRadius:"50%", border:`2px solid ${c.bg}`, boxShadow:"0 0 10px rgba(232,212,168,0.45)", transition:"left 1.2s cubic-bezier(.4,0,.2,1)" },
    othersList: { display:"flex", flexDirection:"column", gap:"8px", marginTop:"14px" },
    otherRow: { display:"flex", alignItems:"center", gap:"10px" },
    otherEmoji: { fontSize:"15px", width:"24px", textAlign:"center", flexShrink:0 },
    otherName: { fontSize:"13px", color:c.inkSoft, flex:1 },
    otherPct: { fontSize:"13px", color: isDark?"#6A6058":c.inkSoft, flexShrink:0 },
    stepsBlock: { background:c.card, border:`1px solid ${isDark?"#1E1B18":c.line}`, borderRadius:"12px", padding:"16px", marginTop:"12px" },
    stepsTitle: { margin:"0 0 14px", fontSize:"10px", letterSpacing:"0.18em", color: isDark?"#4A4036":c.inkSoft },
  };
}

let S = buildStyles((() => { try { return localStorage.getItem("teabro-theme") || "dark"; } catch { return "dark"; } })());

// ─────────────────────────────────────────────
// TELEGRAM CLOUD STORAGE HELPER
// ─────────────────────────────────────────────
const CS = {
  get: (key) => new Promise((resolve) => {
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.getItem(key, (err, val) => resolve(err ? null : val));
    } else {
      resolve(localStorage.getItem(key));
    }
  }),
  set: (key, val) => new Promise((resolve) => {
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(key, val, () => resolve());
    } else {
      localStorage.setItem(key, val);
      resolve();
    }
  }),
  // Забирает много ключей ОДНИМ запросом к CloudStorage вместо N последовательных
  // getItem-вызовов. Раньше циклы по 90-365 дней делали await CS.get() по одному
  // ключу за раз — каждый со своим round-trip к Telegram-бриджу. На таком
  // количестве подряд идущих вызовов клиент либо тормозит (экран выглядит
  // зависшим на "Загружаю..."), либо часть вызовов вообще не резолвится —
  // тогда loading никогда не становится false и экран виснет по-настоящему.
  getMultiple: (keys) => new Promise((resolve) => {
    if (!keys.length) return resolve({});
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.getItems(keys, (err, values) => resolve(err ? {} : (values || {})));
    } else {
      const result = {};
      keys.forEach(k => { result[k] = localStorage.getItem(k); });
      resolve(result);
    }
  }),
};

// ─────────────────────────────────────────────
// СЕРВЕРНАЯ СТАТИСТИКА
// ─────────────────────────────────────────────
const STATS_URL = "https://teabro-app.vercel.app/api/stats";

// Очередь только для пары "open" + "snapshot" — именно они гонятся друг с
// другом в момент загрузки приложения (обе стреляют почти одновременно при
// монтировании), и это единственная реальная точка гонки для Blob-записи
// (read → modify → write не атомарны). Только эти два события идут через
// неё — так они не перезаписывают инкременты друг друга.
let _loadQueue = Promise.resolve();
function loadQueuedFetch(url) {
  _loadQueue = _loadQueue.then(async () => {
    for (let i = 0; i < 3; i++) {
      try {
        const res = await fetch(url, { keepalive: true, cache: "no-store" });
        if (res.ok) return;
      } catch {}
    }
  });
  return _loadQueue;
}

// Действия пользователя (mood/tea/meditation/quiz/selfhonesty) стреляют
// сразу и НЕЗАВИСИМО друг от друга и от _loadQueue — не встают в очередь
// позади чего-то ещё. Раньше все события шли через один общий queue, и если
// Telegram WebView закрывал JS-контекст мини-аппа до того, как очередь
// доходила до позднего события — оно терялось. Каждое из этих действий
// разнесено по времени с "open"/"snapshot" (пользователь совершает их не в
// момент загрузки), так что реальный риск гонки с ними минимален —
// но задержка на ожидание чужой очереди была реальным и ощутимым риском.
//
// Доставка через navigator.sendBeacon(), а не fetch(keepalive:true):
// пользователь часто закрывает приложение сразу после действия (выбрал
// эмоцию — и вышел), а fetch с keepalive в Android WebView (на чём обычно
// построен встроенный браузер Telegram) исторически ненадёжен — запрос
// может оборваться вместе с закрытием контекста. sendBeacon создан именно
// для доставки данных, переживающей закрытие страницы.
async function statEvent(action, uid, extra) {
  const payload = { action, ...(uid ? { uid } : {}), ...(extra || {}) };
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (navigator.sendBeacon(STATS_URL, blob)) return;
    } catch {}
  }
  // fallback, если sendBeacon недоступен или отказал
  const qs = new URLSearchParams(payload).toString();
  const url = `${STATS_URL}?${qs}`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { keepalive: true, cache: "no-store" });
      if (res.ok) return;
    } catch {}
  }
}

// Достаёт id пользователя Telegram прямо из URL-хеша (tgWebAppData), который
// сам Telegram подставляет при запуске Mini App — СИНХРОННО, без ожидания
// того, успеет ли загрузиться внешний telegram-web-app.js. Это устраняет
// саму причину пропавших chatId: раньше единственным источником uid был
// window.Telegram.WebApp.initDataUnsafe.user, который появляется только
// после выполнения стороннего скрипта с telegram.org — на медленной связи
// или подтормаживающем CDN это могло не уложиться в тайм-аут ожидания,
// и юзер (реально зашедший через бота) получал браузерный fallback-id
// без chatId, а значит без единого шанса получить пуш.
function parseTelegramUserFromHash() {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
    const hashParams = new URLSearchParams(hash);
    const tgWebAppData = hashParams.get("tgWebAppData");
    if (!tgWebAppData) return null;
    const dataParams = new URLSearchParams(tgWebAppData);
    const userRaw = dataParams.get("user");
    if (!userRaw) return null;
    const user = JSON.parse(userRaw);
    return user?.id ? String(user.id) : null;
  } catch {
    return null;
  }
}

// Единый способ получить uid + chat_id (для событий вне основного loadMood)
function getUidChat() {
  let uid = parseTelegramUserFromHash();
  if (!uid) {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    uid = tgUser?.id ? String(tgUser.id) : null;
  }
  const chatId = uid; // в TG Mini App user.id === chat_id
  if (!uid) {
    try {
      let stored = localStorage.getItem("teabro_uid");
      if (!stored) { stored = "b_" + Math.random().toString(36).slice(2, 10); localStorage.setItem("teabro_uid", stored); }
      uid = stored;
    } catch {}
  }
  return { uid, chatId };
}

// ─────────────────────────────────────────────
// 100 СОВЕТОВ ДНЯ
// ─────────────────────────────────────────────
const WISDOMS = [
  { text: { ru: "Чай не торопит. Он просто есть.", uk: "Чай не поспішає. Він просто є.", en: "Tea doesn't rush. It simply is." }, mood: "general" },
  { text: { ru: "Суета — это когда ты занят(а), но не присутствуешь.", uk: "Суєта — це коли ти зайнятий(а), але не присутній(я).", en: "Busyness is when you're occupied but not present." }, mood: "general" },
  { text: { ru: "Первый глоток — самый честный момент дня.", uk: "Перший ковток — найчесніший момент дня.", en: "The first sip is the most honest moment of the day." }, mood: "general" },
  { text: { ru: "Ты не можешь вернуться к себе бегом.", uk: "Ти не можеш повернутися до себе бігом.", en: "You can't return to yourself by running." }, mood: "general" },
  { text: { ru: "Тишина — не отсутствие звука. Это присутствие себя.", uk: "Тиша — не відсутність звуку. Це присутність себе.", en: "Silence is not the absence of sound. It is the presence of yourself." }, mood: "general" },
  { text: { ru: "Пуэр учит одному: хорошее не торопится.", uk: "Пуер вчить одному: добре не поспішає.", en: "Puerh teaches one thing: the good does not hurry." }, mood: "general" },
  { text: { ru: "Остановиться — это не слабость. Это выбор.", uk: "Зупинитися — це не слабкість. Це вибір.", en: "Stopping is not weakness. It is a choice." }, mood: "general" },
  { text: { ru: "Некоторые вещи понимаются только за чашкой.", uk: "Деякі речі розуміються лише за чашкою.", en: "Some things are understood only over a cup." }, mood: "general" },
  { text: { ru: "Твой день начинается не с будильника. С первого осознанного вдоха.", uk: "Твій день починається не з будильника. З першого усвідомленого вдиху.", en: "Your day begins not with an alarm. With the first conscious breath." }, mood: "general" },
  { text: { ru: "Медленная жизнь — не значит пустая.", uk: "Повільне життя — не означає порожнє.", en: "A slow life does not mean an empty one." }, mood: "general" },
  { text: { ru: "Чай не решает проблемы. Он напоминает, что ты живой.", uk: "Чай не вирішує проблеми. Він нагадує, що ти живий.", en: "Tea doesn't solve problems. It reminds you that you're alive." }, mood: "general" },
  { text: { ru: "Хаос снаружи — не повод для хаоса внутри.", uk: "Хаос ззовні — не привід для хаосу всередині.", en: "Chaos outside is no reason for chaos inside." }, mood: "general" },
  { text: { ru: "Самый важный момент — этот.", uk: "Найважливіший момент — цей.", en: "The most important moment is this one." }, mood: "general" },
  { text: { ru: "Не каждую мысль нужно думать до конца.", uk: "Не кожну думку потрібно думати до кінця.", en: "Not every thought needs to be thought through." }, mood: "general" },
  { text: { ru: "Тело знает, когда ты далеко от себя. Оно всегда знает.", uk: "Тіло знає, коли ти далеко від себе. Воно завжди знає.", en: "The body knows when you're far from yourself. It always knows." }, mood: "general" },
  { text: { ru: "Выдержанный пуэр не спешил стать собой. И ты не спеши.", uk: "Витриманий пуер не поспішав стати собою. І ти не поспішай.", en: "Aged puerh did not rush to become itself. Don't rush either." }, mood: "general" },
  { text: { ru: "Иногда лучшее, что можно сделать — ничего не делать.", uk: "Іноді найкраще, що можна зробити — нічого не робити.", en: "Sometimes the best thing to do is nothing." }, mood: "general" },
  { text: { ru: "Внутри всегда тише, чем снаружи. Нужно просто войти.", uk: "Всередині завжди тихіше, ніж ззовні. Потрібно просто увійти.", en: "It's always quieter inside than outside. You only need to enter." }, mood: "general" },
  { text: { ru: "Чай заваривают дважды: руками и вниманием.", uk: "Чай заварюють двічі: руками і увагою.", en: "Tea is brewed twice: with hands and with attention." }, mood: "general" },
  { text: { ru: "Пока все ищут дофамин — мы завариваем пуэр.", uk: "Поки всі шукають дофамін — ми заварюємо пуер.", en: "While everyone seeks dopamine — we brew puerh." }, mood: "general" },
  { text: { ru: "Тишина — это тоже ответ.", uk: "Тиша — це теж відповідь.", en: "Silence is also an answer." }, mood: "general" },
  { text: { ru: "Ты становишься тем, на что тратишь свое внимание.", uk: "Ти стаєш тим, на що витрачаєш свою увагу.", en: "You become what you spend your attention on." }, mood: "general" },
  { text: { ru: "Самое сложное сегодня — остаться наедине со своими мыслями.", uk: "Найскладніше сьогодні — залишитися наодинці зі своїми думками.", en: "The hardest thing today is to stay alone with your thoughts." }, mood: "general" },
  { text: { ru: "Усталость не всегда от работы. Иногда — от потока информации.", uk: "Втома не завжди від роботи. Іноді — від потоку інформації.", en: "Fatigue is not always from work. Sometimes from the stream of information." }, mood: "general" },
  { text: { ru: "Настоящая жизнь редко происходит внутри экрана.", uk: "Справжнє життя рідко відбувається всередині екрана.", en: "Real life rarely happens inside a screen." }, mood: "general" },
  { text: { ru: "Иногда тишина лечит лучше, чем очередной скроллинг.", uk: "Іноді тиша лікує краще, ніж черговий скролінг.", en: "Sometimes silence heals better than another scroll." }, mood: "general" },
  { text: { ru: "Самая дорогая валюта сегодня — внимание.", uk: "Найдорожча валюта сьогодні — увага.", en: "The most expensive currency today is attention." }, mood: "general" },
  { text: { ru: "Чем больше шума вокруг — тем дальше человек от себя.", uk: "Чим більше шуму навколо — тим далі людина від себе.", en: "The more noise around — the farther a person is from themselves." }, mood: "general" },
  { text: { ru: "Не все, что привлекает внимание, заслуживает его.", uk: "Не все, що привертає увагу, заслуговує на неї.", en: "Not everything that draws attention deserves it." }, mood: "general" },
  { text: { ru: "Один тихий час лучше десяти шумных дней.", uk: "Одна тиха година краща за десять шумних днів.", en: "One quiet hour is better than ten noisy days." }, mood: "general" },
  { text: { ru: "Тревога приходит, когда ты живешь в будущем. Вернись сюда.", uk: "Тривога приходить, коли ти живеш у майбутньому. Повернися сюди.", en: "Anxiety comes when you live in the future. Come back here." }, mood: "bai" },
  { text: { ru: "Выдохни. Прямо сейчас. Медленно.", uk: "Видихни. Просто зараз. Повільно.", en: "Exhale. Right now. Slowly." }, mood: "bai" },
  { text: { ru: "Не все, что пугает — опасно. Иногда это просто неизвестность.", uk: "Не все, що лякає — небезпечне. Іноді це просто невідомість.", en: "Not everything that scares is dangerous. Sometimes it's just the unknown." }, mood: "bai" },
  { text: { ru: "Белый чай не борется с тревогой. Он просто создает другой ритм.", uk: "Білий чай не бореться з тривогою. Він просто створює інший ритм.", en: "White tea doesn't fight anxiety. It simply creates another rhythm." }, mood: "bai" },
  { text: { ru: "Тревога — это не ты. Это погода внутри. Она пройдет.", uk: "Тривога — це не ти. Це погода всередині. Вона мине.", en: "Anxiety is not you. It's weather inside. It will pass." }, mood: "bai" },
  { text: { ru: "Одна чашка чая. Один вдох. Один момент. Больше ничего не нужно.", uk: "Одна чашка чаю. Один вдих. Один момент. Більше нічого не потрібно.", en: "One cup of tea. One breath. One moment. Nothing more is needed." }, mood: "bai" },
  { text: { ru: "Самое тревожное время — между делами. Займи руки чаем.", uk: "Найтривожніший час — між справами. Займи руки чаєм.", en: "The most anxious time is between tasks. Occupy your hands with tea." }, mood: "bai" },
  { text: { ru: "Позволь мыслям идти мимо. Ты не обязан(а) за каждой бежать.", uk: "Дозволь думкам іти повз. Ти не зобов'язаний(а) за кожною бігти.", en: "Let thoughts pass by. You don't have to chase every one." }, mood: "bai" },
  { text: { ru: "Когда внутри шумно — замедли внешнее. Тело успокаивает голову.", uk: "Коли всередині шумно — сповільни зовнішнє. Тіло заспокоює голову.", en: "When it's noisy inside — slow the outside. The body calms the head." }, mood: "bai" },
  { text: { ru: "Три вдоха медленнее, чем обычно. Это уже практика.", uk: "Три вдихи повільніше, ніж зазвичай. Це вже практика.", en: "Three breaths slower than usual. That is already practice." }, mood: "bai" },
  { text: { ru: "Все, что ты сейчас чувствуешь — временно. Даже это.", uk: "Все, що ти зараз відчуваєш — тимчасове. Навіть це.", en: "Everything you feel now is temporary. Even this." }, mood: "bai" },
  { text: { ru: "Не решай сегодня то, что можно решить завтра со свежей головой.", uk: "Не вирішуй сьогодні те, що можна вирішити завтра зі свіжою головою.", en: "Don't decide today what can wait for a clearer head tomorrow." }, mood: "bai" },
  { text: { ru: "Твое тело не враг. Оно просто сигнализирует. Прислушайся.", uk: "Твоє тіло не ворог. Воно просто сигналізує. Прислухайся.", en: "Your body is not the enemy. It is simply signaling. Listen." }, mood: "bai" },
  { text: { ru: "Иногда достаточно просто сесть и не делать ничего важного.", uk: "Іноді достатньо просто сісти і не робити нічого важливого.", en: "Sometimes it's enough to just sit and do nothing important." }, mood: "bai" },
  { text: { ru: "Тревога любит темноту. Зажги свет. Завари чай.", uk: "Тривога любить темряву. Запали світло. Завари чай.", en: "Anxiety loves darkness. Turn on the light. Brew tea." }, mood: "bai" },
  { text: { ru: "Раздражение — это сигнал. Что-то важное требует внимания.", uk: "Роздратування — це сигнал. Щось важливе потребує уваги.", en: "Irritation is a signal. Something important needs attention." }, mood: "shu" },
  { text: { ru: "Шу пуэр тяжелый и земляной. Он тянет вниз — и это то, что нужно.", uk: "Шу пуер важкий і земляний. Він тягне вниз — і це те, що потрібно.", en: "Shou puerh is heavy and earthy. It pulls down — and that is what is needed." }, mood: "shu" },
  { text: { ru: "Злость — это энергия. Вопрос только куда ее направить.", uk: "Злість — це енергія. Питання лише куди її спрямувати.", en: "Anger is energy. The only question is where to direct it." }, mood: "shu" },
  { text: { ru: "Когда все раздражает — обычно дело не в людях. Дело в усталости.", uk: "Коли все дратує — зазвичай справа не в людях. Справа у втомі.", en: "When everything irritates — it's usually not about people. It's about fatigue." }, mood: "shu" },
  { text: { ru: "Не отвечай, пока не остынешь. Чай помогает остыть.", uk: "Не відповідай, поки не охолонеш. Чай допомагає охолонути.", en: "Don't answer until you've cooled down. Tea helps cool down." }, mood: "shu" },
  { text: { ru: "Позволь себе быть не в духе. Без объяснений.", uk: "Дозволь собі бути не в дусі. Без пояснень.", en: "Allow yourself to be out of sorts. Without explanations." }, mood: "shu" },
  { text: { ru: "Тело зажато — значит что-то долго держишь. Можно отпустить.", uk: "Тіло затиснуте — значить щось довго тримаєш. Можна відпустити.", en: "Body is tight — means you've been holding something long. You can let go." }, mood: "shu" },
  { text: { ru: "Иногда лучшее что можно сделать со злостью — переждать ее.", uk: "Іноді найкраще що можна зробити зі злістю — перечекати її.", en: "Sometimes the best thing to do with anger is wait it out." }, mood: "shu" },
  { text: { ru: "Первый глоток темного пуэра. Тяжелый. Теплый. Заземляет.", uk: "Перший ковток темного пуеру. Важкий. Теплий. Заземлює.", en: "First sip of dark puerh. Heavy. Warm. Grounding." }, mood: "shu" },
  { text: { ru: "Ты не обязан(а) быть мягким(ой) когда внутри огонь. Просто не обожги других.", uk: "Ти не зобов'язаний(а) бути м'яким(ою) коли всередині вогонь. Просто не обпечи інших.", en: "You don't have to be soft when there's fire inside. Just don't burn others." }, mood: "shu" },
  { text: { ru: "Раздражение часто прячет за собой боль. Что болит на самом деле?", uk: "Роздратування часто ховає за собою біль. Що болить насправді?", en: "Irritation often hides pain. What actually hurts?" }, mood: "shu" },
  { text: { ru: "Сделай паузу прежде чем говорить. Пять секунд меняют многое.", uk: "Зроби паузу перш ніж говорити. П'ять секунд змінюють багато.", en: "Pause before speaking. Five seconds change a lot." }, mood: "shu" },
  { text: { ru: "Жар внутри просит выхода. Движение, воздух, теплый чай.", uk: "Жар всередині просить виходу. Рух, повітря, теплий чай.", en: "Heat inside asks for an outlet. Movement, air, warm tea." }, mood: "shu" },
  { text: { ru: "Не каждый конфликт нужно выигрывать. Некоторые — просто пережить.", uk: "Не кожен конфлікт потрібно вигравати. Деякі — просто пережити.", en: "Not every conflict needs winning. Some — simply surviving." }, mood: "shu" },
  { text: { ru: "После раздражения всегда приходит тишина. Подожди ее.", uk: "Після роздратування завжди приходить тиша. Почекай її.", en: "After irritation silence always comes. Wait for it." }, mood: "shu" },
  { text: { ru: "Туман в голове — это не глупость. Это сигнал: нужен отдых.", uk: "Туман у голові — це не дурість. Це сигнал: потрібен відпочинок.", en: "Fog in the head is not stupidity. It's a signal: rest is needed." }, mood: "sheng" },
  { text: { ru: "Шэн пуэр горьковатый и живой. Он открывает окно в голове.", uk: "Шен пуер гіркуватий і живий. Він відкриває вікно в голові.", en: "Sheng puerh is bitterish and alive. It opens a window in the head." }, mood: "sheng" },
  { text: { ru: "Не пытайся думать через туман. Сначала — стакан воды и тишина.", uk: "Не намагайся думати крізь туман. Спочатку — склянка води і тиша.", en: "Don't try to think through fog. First — a glass of water and silence." }, mood: "sheng" },
  { text: { ru: "Одна задача. Не список. Одна.", uk: "Одне завдання. Не список. Одне.", en: "One task. Not a list. One." }, mood: "sheng" },
  { text: { ru: "Рассеянность — это усталый мозг. Не ленивый.", uk: "Розсіяність — це втомлений мозок. Не лінивий.", en: "Scattered attention is a tired brain. Not a lazy one." }, mood: "sheng" },
  { text: { ru: "Иногда ясность приходит не когда думаешь, а когда перестаешь.", uk: "Іноді ясність приходить не коли думаєш, а коли припиняєш.", en: "Sometimes clarity comes not when you think, but when you stop." }, mood: "sheng" },
  { text: { ru: "Первый пролив — слей. Со второго начинается настоящий чай.", uk: "Перший пролив — злий. З другого починається справжній чай.", en: "First rinse — pour out. Real tea starts from the second." }, mood: "sheng" },
  { text: { ru: "Выйди на воздух. Пять минут. Мозгу нужен кислород, не кофе.", uk: "Вийди на повітря. П'ять хвилин. Мозку потрібен кисень, не кава.", en: "Go outside. Five minutes. The brain needs oxygen, not coffee." }, mood: "sheng" },
  { text: { ru: "Туман рассеивается сам. Твоя задача — не мешать.", uk: "Туман розсіюється сам. Твоє завдання — не заважати.", en: "Fog clears on its own. Your job is not to interfere." }, mood: "sheng" },
  { text: { ru: "Запиши что в голове. Бумага освобождает место внутри.", uk: "Запиши що в голові. Папір звільняє місце всередині.", en: "Write down what's in your head. Paper frees space inside." }, mood: "sheng" },
  { text: { ru: "Не принимай важных решений в тумане. Подожди ясности.", uk: "Не приймай важливих рішень у тумані. Почекай ясності.", en: "Don't make important decisions in fog. Wait for clarity." }, mood: "sheng" },
  { text: { ru: "Чай без спешки. Мысли — тоже без спешки.", uk: "Чай без поспіху. Думки — теж без поспіху.", en: "Tea without hurry. Thoughts — also without hurry." }, mood: "sheng" },
  { text: { ru: "Иногда нужно просто сидеть с чашкой и смотреть в одну точку.", uk: "Іноді потрібно просто сидіти з чашкою і дивитися в одну точку.", en: "Sometimes you just need to sit with a cup and look at one point." }, mood: "sheng" },
  { text: { ru: "Усталый ум ищет стимуляции. Ему нужна тишина.", uk: "Втомлений розум шукає стимуляції. Йому потрібна тиша.", en: "A tired mind seeks stimulation. It needs silence." }, mood: "sheng" },
  { text: { ru: "После тумана всегда приходит момент когда все встает на место.", uk: "Після туману завжди приходить момент коли все стає на місце.", en: "After fog there always comes a moment when everything falls into place." }, mood: "sheng" },
  { text: { ru: "Пустота — это не конец. Это пространство перед чем-то новым.", uk: "Порожнеча — це не кінець. Це простір перед чимось новим.", en: "Emptiness is not the end. It is space before something new." }, mood: "dahong" },
  { text: { ru: "Да Хун Пао греет изнутри. Медленно. Он не кричит — вставай.", uk: "Да Хун Пао гріє зсередини. Повільно. Він не кричить — вставай.", en: "Da Hong Pao warms from inside. Slowly. It doesn't shout — get up." }, mood: "dahong" },
  { text: { ru: "Когда нет сил — не нужно их искать. Просто не трать то, что есть.", uk: "Коли немає сил — не потрібно їх шукати. Просто не витрачай те, що є.", en: "When there's no strength — don't hunt for it. Just don't spend what you have." }, mood: "dahong" },
  { text: { ru: "Апатия часто приходит после долгого напряжения. Ты просто устал(а).", uk: "Апатія часто приходить після довгої напруги. Ти просто втомився(лась).", en: "Apathy often comes after long strain. You're simply tired." }, mood: "dahong" },
  { text: { ru: "Один маленький шаг. Не план. Один шаг.", uk: "Один маленький крок. Не план. Один крок.", en: "One small step. Not a plan. One step." }, mood: "dahong" },
  { text: { ru: "Тело помнит радость даже когда голова забыла. Дай ему тепло.", uk: "Тіло пам'ятає радість навіть коли голова забула. Дай йому тепло.", en: "The body remembers joy even when the head forgot. Give it warmth." }, mood: "dahong" },
  { text: { ru: "Не заставляй себя хотеть. Позволь желанию прийти само.", uk: "Не змушуй себе хотіти. Дозволь бажанню прийти самому.", en: "Don't force yourself to want. Let desire come on its own." }, mood: "dahong" },
  { text: { ru: "Солнце. Вода. Тепло чашки в руках. Этого уже достаточно.", uk: "Сонце. Вода. Тепло чашки в руках. Цього вже достатньо.", en: "Sun. Water. Warmth of a cup in your hands. That is already enough." }, mood: "dahong" },
  { text: { ru: "В пустоте можно найти себя. Если не бежать от нее.", uk: "У порожнечі можна знайти себе. Якщо не тікати від неї.", en: "In emptiness you can find yourself — if you don't run from it." }, mood: "dahong" },
  { text: { ru: "Ты не сломан. Ты на паузе. Разница огромная.", uk: "Ти не зламаний. Ти на паузі. Різниця величезна.", en: "You are not broken. You are on pause. The difference is huge." }, mood: "dahong" },
  { text: { ru: "Жареный теплый вкус Да Хун Пао. Это вкус возвращения.", uk: "Смажений теплий смак Да Хун Пао. Це смак повернення.", en: "The roasted warm taste of Da Hong Pao. The taste of returning." }, mood: "dahong" },
  { text: { ru: "Иногда нужно просто дать себе разрешение ничего не чувствовать.", uk: "Іноді потрібно просто дати собі дозвіл нічого не відчувати.", en: "Sometimes you simply need permission to feel nothing." }, mood: "dahong" },
  { text: { ru: "После пустоты всегда что-то прорастает. Всегда.", uk: "Після порожнечі завжди щось проростає. Завжди.", en: "After emptiness something always grows. Always." }, mood: "dahong" },
  { text: { ru: "Не оценивай себя в плохие дни. Просто переживи их.", uk: "Не оцінюй себе у погані дні. Просто переживи їх.", en: "Don't judge yourself on bad days. Just live through them." }, mood: "dahong" },
  { text: { ru: "Маленькая радость считается. Вкусный чай — это уже победа.", uk: "Маленька радість рахується. Смачний чай — це вже перемога.", en: "Small joy counts. Good tea is already a win." }, mood: "dahong" },
  { text: { ru: "Усталость от людей — это не нелюдимость. Это потребность в себе.", uk: "Втома від людей — це не нелюдськість. Це потреба в собі.", en: "Tiredness of people is not unsociability. It is a need for yourself." }, mood: "tguan" },
  { text: { ru: "Те Гуань Инь цветочный и тихий. Он уводит внутрь.", uk: "Те Гуань Інь квітковий і тихий. Він веде всередину.", en: "Tie Guan Yin is floral and quiet. It leads inward." }, mood: "tguan" },
  { text: { ru: "Ты не обязан(а) быть доступным(ой) всегда. Граница — это уважение к себе.", uk: "Ти не зобов'язаний(а) бути доступним(ою) завжди. Межа — це повага до себе.", en: "You don't have to be available always. A boundary is respect for yourself." }, mood: "tguan" },
  { text: { ru: "Закрой дверь. Этот чай не любит компании.", uk: "Закрий двері. Цей чай не любить компанії.", en: "Close the door. This tea doesn't like company." }, mood: "tguan" },
  { text: { ru: "Тишина с собой — не одиночество. Это восстановление.", uk: "Тиша з собою — не самотність. Це відновлення.", en: "Quiet with yourself is not loneliness. It is recovery." }, mood: "tguan" },
  { text: { ru: "После людей нужно время на себя. Это не эгоизм.", uk: "Після людей потрібен час на себе. Це не егоїзм.", en: "After people you need time for yourself. That is not egoism." }, mood: "tguan" },
  { text: { ru: "Побудь в тишине столько, сколько нужно. Никто не считает.", uk: "Побудь у тиші стільки, скільки потрібно. Ніхто не рахує.", en: "Stay in silence as long as you need. No one is counting." }, mood: "tguan" },
  { text: { ru: "Интроверт или экстраверт — всем нужна пауза от мира.", uk: "Інтроверт чи екстраверт — усім потрібна пауза від світу.", en: "Introvert or extrovert — everyone needs a pause from the world." }, mood: "tguan" },
  { text: { ru: "Сегодня можно никуда не торопиться и ни перед кем не отчитываться.", uk: "Сьогодні можна нікуди не поспішати і ні перед ким не звітувати.", en: "Today you can rush nowhere and report to no one." }, mood: "tguan" },
  { text: { ru: "Чашка чая в тишине. Только ты. Этого достаточно.", uk: "Чашка чаю в тиші. Тільки ти. Цього достатньо.", en: "A cup of tea in silence. Only you. That is enough." }, mood: "tguan" },
  { text: { ru: "Энергия есть — но она ищет берег. Габа помогает ей найти русло.", uk: "Енергія є — але вона шукає берег. Габа допомагає їй знайти русло.", en: "Energy is there — but it seeks a shore. GABA helps it find a channel." }, mood: "gaba" },
  { text: { ru: "Не каждый подъём нужно куда-то направлять. Иногда просто побудь в нём.", uk: "Не кожен підйом потрібно кудись спрямовувати. Іноді просто побудь у ньому.", en: "Not every rise needs directing somewhere. Sometimes just stay in it." }, mood: "gaba" },
  { text: { ru: "Много идей, много желаний — это богатство. Одна чашка помогает выбрать главное.", uk: "Багато ідей, багато бажань — це багатство. Одна чашка допомагає обрати головне.", en: "Many ideas, many desires — that is wealth. One cup helps choose what matters." }, mood: "gaba" },
  { text: { ru: "Габа не замедляет. Она выравнивает. Разница огромная.", uk: "Габа не сповільнює. Вона вирівнює. Різниця величезна.", en: "GABA doesn't slow. It levels. The difference is huge." }, mood: "gaba" },
  { text: { ru: "Скорость без направления — это просто шум. Остановись на минуту.", uk: "Швидкість без напрямку — це просто шум. Зупинись на хвилину.", en: "Speed without direction is just noise. Stop for a minute." }, mood: "gaba" },
  { text: { ru: "Хорошее состояние тоже требует внимания. Не трать его впустую.", uk: "Хороший стан теж вимагає уваги. Не витрачай його марно.", en: "A good state also needs attention. Don't waste it." }, mood: "gaba" },
  { text: { ru: "Ты на подъёме — значит сейчас хорошее время для важного.", uk: "Ти на підйомі — отже зараз хороший час для важливого.", en: "You're rising — so now is a good time for what matters." }, mood: "gaba" },
  { text: { ru: "Сила и покой не противоречат друг другу. Они могут быть одновременно.", uk: "Сила і спокій не суперечать одне одному. Вони можуть бути одночасно.", en: "Strength and calm don't contradict. They can exist at once." }, mood: "gaba" },
  { text: { ru: "Радость — это тоже состояние, которое стоит замечать. Не только боль.", uk: "Радість — це теж стан, який варто помічати. Не лише біль.", en: "Joy is also a state worth noticing. Not only pain." }, mood: "general" },
  { text: { ru: "Хороший день — это не случайность. Это что-то в тебе сделало его таким.", uk: "Хороший день — це не випадковість. Це щось у тобі зробило його таким.", en: "A good day is not an accident. Something in you made it so." }, mood: "general" },
  { text: { ru: "Когда внутри светло — не торопись это объяснять. Просто живи в этом.", uk: "Коли всередині світло — не поспішай це пояснювати. Просто живи в цьому.", en: "When it's light inside — don't rush to explain. Just live in it." }, mood: "general" },
  { text: { ru: "Воодушевление — редкий гость. Встреть его без спешки.", uk: "Натхнення — рідкісний гість. Зустрінь його без поспіху.", en: "Inspiration is a rare guest. Meet it without hurry." }, mood: "general" },
  { text: { ru: "Спокойствие — не скука. Это высшая форма присутствия.", uk: "Спокій — не нудьга. Це вища форма присутності.", en: "Calm is not boredom. It is the highest form of presence." }, mood: "general" },
];


// ─────────────────────────────────────────────
// ЭМОЦИИ
// ─────────────────────────────────────────────

const EMOTION_I18N = {
  joy: { label: { ru:"Радость", uk:"Радість", en:"Joy" }, desc: { ru:"Лёгкое, беспричинное «хорошо прямо сейчас»", uk:"Легке, безпричинне «добре просто зараз»", en:"A light, unprompted good right now" } },
  inspired: { label: { ru:"Воодушевление", uk:"Натхнення", en:"Inspired" }, desc: { ru:"Есть силы и хочется действовать", uk:"Є сили і хочеться діяти", en:"Energy and desire to act" } },
  drive: { label: { ru:"Драйв / Подъём", uk:"Драйв / Підйом", en:"Drive / High" }, desc: { ru:"День в кайф: энергия, всё горит", uk:"День у кайф: енергія, усе горить", en:"A great day: energy, everything clicks" } },
  calm: { label: { ru:"Спокойствие", uk:"Спокій", en:"Calm" }, desc: { ru:"Ровный внутренний штиль", uk:"Рівний внутрішній штиль", en:"Steady inner stillness" } },
  grateful: { label: { ru:"Благодарность", uk:"Вдячність", en:"Gratitude" }, desc: { ru:"Ценю то, что уже есть", uk:"Ціную те, що вже є", en:"I value what I already have" } },
  pride: { label: { ru:"Гордость", uk:"Гордість", en:"Pride" }, desc: { ru:"Доволен(льна) собой за поступок", uk:"Задоволений(а) собою за вчинок", en:"Pleased with myself for something specific" } },
  love: { label: { ru:"Любовь", uk:"Любов", en:"Love" }, desc: { ru:"Тёплое, нежное", uk:"Тепле, ніжне", en:"Warm and tender" } },
  inspiration: { label: { ru:"Вдохновение", uk:"Натхнення (творче)", en:"Creative spark" }, desc: { ru:"Идея, творческий импульс", uk:"Ідея, творчий імпульс", en:"An idea, a creative impulse" } },
  excitement: { label: { ru:"Азарт", uk:"Азарт", en:"Excitement" }, desc: { ru:"Тянет рискнуть", uk:"Тягне ризикнути", en:"Want to risk and try" } },
  anxiety: { label: { ru:"Тревога", uk:"Тривога", en:"Anxiety" }, desc: { ru:"Беспокойство о будущем", uk:"Занепокоєння про майбутнє", en:"Worry about what hasn't happened" } },
  lonely: { label: { ru:"Одиночество", uk:"Самотність", en:"Loneliness" }, desc: { ru:"Отдельно от всех", uk:"Окремо від усіх", en:"Separate from everyone" } },
  angry: { label: { ru:"Злость", uk:"Злість", en:"Anger" }, desc: { ru:"Хочется резко отреагировать", uk:"Хочеться різко відреагувати", en:"Want to react sharply" } },
  tired: { label: { ru:"Усталость", uk:"Втома", en:"Tiredness" }, desc: { ru:"Тело просит отдыха", uk:"Тіло просить відпочинку", en:"Body asks for rest" } },
  sad: { label: { ru:"Грусть", uk:"Сум", en:"Sadness" }, desc: { ru:"Тихая печаль", uk:"Тихий смуток", en:"Quiet sorrow" } },
  disappointed: { label: { ru:"Разочарование", uk:"Розчарування", en:"Disappointment" }, desc: { ru:"Ждал одно — получил другое", uk:"Чекав одне — отримав інше", en:"Expected one thing, got another" } },
  boredom: { label: { ru:"Скука", uk:"Нудьга", en:"Boredom" }, desc: { ru:"Ничего не увлекает", uk:"Нічого не захоплює", en:"Nothing engages" } },
};
function emotionLabel(id, lang) { return tx(lang, EMOTION_I18N[id]?.label) || id; }
function emotionDesc(id, lang) { return tx(lang, EMOTION_I18N[id]?.desc) || ""; }

const EMOTIONS = [
  { id: "joy",          emoji: "😊", label: "Радость",        mood: "general", score: 9, desc: "Лёгкое, беспричинное \u201Cхорошо прямо сейчас\u201D" },
  { id: "inspired",     emoji: "💪", label: "Воодушевление",  mood: "general", score: 9, desc: "Есть силы и хочется действовать" },
  { id: "drive",        emoji: "🔥", label: "Драйв / Подъём", mood: "general", score: 8, desc: "День в кайф: энергия, всё горит, всё получается" },
  { id: "calm",         emoji: "😌", label: "Спокойствие",    mood: "general", score: 8, desc: "Ровный внутренний штиль, ничего не тревожит" },
  { id: "grateful",     emoji: "🙏", label: "Благодарность",  mood: "general", score: 9, desc: "Ценю то, что уже есть, а не хочу большего" },
  { id: "pride",        emoji: "🦁", label: "Гордость",       mood: "general", score: 8, desc: "Доволен(льна) собой за конкретный поступок" },
  { id: "love",         emoji: "🥰", label: "Любовь",         mood: "general", score: 9, desc: "Тёплое, нежное — нежность и любовь вместе" },
  { id: "inspiration",  emoji: "✨", label: "Вдохновение",    mood: "general", score: 8, desc: "Идея, творческий импульс — тоньше, чем Воодушевление" },
  { id: "excitement",   emoji: "🃏", label: "Азарт",          mood: "gaba",    score: 7, desc: "Тянет рискнуть, попробовать, посоревноваться" },
  { id: "anxiety",      emoji: "😟", label: "Тревога",        mood: "bai",     score: 3, desc: "Беспокойство о том, что ещё не случилось" },
  { id: "lonely",       emoji: "🍂", label: "Одиночество",    mood: "bai",     score: 3, desc: "Чувствую себя отдельно от всех, даже среди людей" },
  { id: "angry",        emoji: "🤬", label: "Злость",         mood: "shu",     score: 2, desc: "Сильнее раздражения — хочется резко отреагировать" },
  { id: "tired",        emoji: "😴", label: "Усталость",      mood: "tguan",   score: 3, desc: "Физически нет сил, тело просит отдыха" },
  { id: "sad",          emoji: "😔", label: "Грусть",         mood: "dahong",  score: 2, desc: "Тихая печаль, часто про потерю или прошлое" },
  { id: "disappointed", emoji: "😕", label: "Разочарование",  mood: "dahong",  score: 3, desc: "Ждал(а) одно — получил(ось) другое" },
  { id: "boredom",      emoji: "🥱", label: "Скука",          mood: "dahong",  score: 4, desc: "Ничего не увлекает, время тянется" },
];

// ─────────────────────────────────────────────
// ТИТУЛЫ
// ─────────────────────────────────────────────
const TITLES = [
  { days: 1,   emoji: "🌱", name: { ru: "Росток", uk: "Паросток", en: "Sprout" },           desc: { ru: "Первый шаг сделан.", uk: "Перший крок зроблено.", en: "The first step is done." } },
  { days: 7,   emoji: "🍃", name: { ru: "Наблюдатель", uk: "Спостерігач", en: "Observer" },      desc: { ru: "7 дней рядом с собой.", uk: "7 днів поруч із собою.", en: "7 days beside yourself." } },
  { days: 21,  emoji: "🌿", name: { ru: "Практик", uk: "Практик", en: "Practitioner" },          desc: { ru: "21 день — это уже привычка.", uk: "21 день — це вже звичка.", en: "21 days — already a habit." } },
  { days: 40,  emoji: "🍵", name: { ru: "Хранитель тишины", uk: "Хранитель тиші", en: "Keeper of silence" }, desc: { ru: "40 дней практики.", uk: "40 днів практики.", en: "40 days of practice." } },
  { days: 90,  emoji: "🌕", name: { ru: "Мастер паузы", uk: "Майстер паузи", en: "Master of the pause" },     desc: { ru: "90 дней — редкость.", uk: "90 днів — рідкість.", en: "90 days — rare." } },
  { days: 365, emoji: "✦",  name: { ru: "Путь чая", uk: "Шлях чаю", en: "Path of tea" },         desc: { ru: "Год. Это все.", uk: "Рік. Це все.", en: "A year. That's everything." } },
];


function getCurrentTitle(streak) {
  let title = TITLES[0];
  for (const t of TITLES) { if (streak >= t.days) title = t; }
  return title;
}

// ─────────────────────────────────────────────
// АРХЕТИПЫ
// ─────────────────────────────────────────────
const ARCHETYPES = [
  {
    id: "peaceful",
    emoji: "🌿",
    name: { ru: "Умиротворённый", uk: "Умиротворений", en: "Peaceful" },
    desc: { ru: "Спокойствие и благодарность — твой частый фон. Тебе уже достаточно того, что есть, и это редкое качество.", uk: "Спокій і вдячність — твій частий фон. Тобі вже достатньо того, що є, і це рідкісна якість.", en: "Calm and gratitude are your frequent background. You already have enough of what is — a rare quality." },
    condition: (stats) => ((stats.calm||0) + (stats.grateful||0)) / stats.total > 0.4,
  },
  {
    id: "warm",
    emoji: "🦁",
    name: { ru: "Тёплый", uk: "Теплий", en: "Warm" },
    desc: { ru: "Любовь и гордость случаются у тебя чаще других состояний. Ты цени́шь близких и себя — редкое сочетание.", uk: "Любов і гордість трапляються у тебе частіше за інші стани. Ти цінуєш близьких і себе — рідкісне поєднання.", en: "Love and pride occur more often than other states. You value those close to you and yourself — a rare mix." },
    condition: (stats) => ((stats.love||0) + (stats.pride||0)) / stats.total > 0.4,
  },
  {
    id: "inspired_arch",
    emoji: "✨",
    name: { ru: "Вдохновлённый", uk: "Натхненний", en: "Inspired" },
    desc: { ru: "Радость, воодушевление и вдохновение — твой частый фон. В тебе много света, который тянет делиться собой.", uk: "Радість, натхнення і натхнення — твій частий фон. У тобі багато світла, яке тягне ділитися собою.", en: "Joy, uplift and inspiration are your frequent background. There's much light in you that wants to be shared." },
    condition: (stats) => ((stats.joy||0) + (stats.inspired||0) + (stats.inspiration||0)) / stats.total > 0.4,
  },
  {
    id: "drive_seeker",
    emoji: "🔥",
    name: { ru: "Искатель драйва", uk: "Шукач драйву", en: "Drive seeker" },
    desc: { ru: "Драйв и азарт — твои частые спутники. Энергии много, и тебя тянет пробовать, рисковать, соревноваться.", uk: "Драйв і азарт — твої часті супутники. Енергії багато, і тебе тягне пробувати, ризикувати, змагатися.", en: "Drive and thrill are frequent companions. There's a lot of energy, and you're drawn to try, risk, compete." },
    condition: (stats) => ((stats.drive||0) + (stats.excitement||0)) / stats.total > 0.4,
  },
  {
    id: "anxious",
    emoji: "⚡",
    name: { ru: "Тревожный", uk: "Тривожний", en: "Anxious" },
    desc: { ru: "Тревога — твой частый фон последнее время. Ты чутко считываешь риски и детали — иногда можно позволить себе довериться моменту.", uk: "Тривога — твій частий фон останнім часом. Ти чутливо зчитуєш ризики і деталі — іноді можна дозволити собі довіритися моменту.", en: "Anxiety has been your frequent background lately. You sense risks and details keenly — sometimes you can trust the moment." },
    condition: (stats) => (stats.anxiety||0) / stats.total > 0.3,
  },
  {
    id: "boiling",
    emoji: "🌋",
    name: { ru: "Кипящий", uk: "Киплячий", en: "Boiling" },
    desc: { ru: "Злость — твой частый фон последнее время. Внутри копится жар — важно найти для него безопасный выход.", uk: "Злість — твій частий фон останнім часом. Всередині накопичується жар — важливо знайти для нього безпечний вихід.", en: "Anger has been your frequent background lately. Heat builds inside — important to find a safe outlet for it." },
    condition: (stats) => (stats.angry||0) / stats.total > 0.3,
  },
  {
    id: "restorer",
    emoji: "🍵",
    name: { ru: "Восстанавливающийся", uk: "Відновлюваний", en: "Restoring" },
    desc: { ru: "Усталость и скука — твой фон последнее время. Тело и голова просят паузы. Ты уже делаешь правильный шаг, замечая это.", uk: "Втома і нудьга — твій фон останнім часом. Тіло і голова просять паузи. Ти вже робиш правильний крок, помічаючи це.", en: "Fatigue and boredom have been your background lately. Body and mind ask for a pause. Noticing that is already the right step." },
    condition: (stats) => ((stats.tired||0) + (stats.boredom||0)) / stats.total > 0.4,
  },
  {
    id: "quiet",
    emoji: "🍂",
    name: { ru: "Затихший", uk: "Затихий", en: "Quieted" },
    desc: { ru: "Грусть, одиночество или разочарование — твой частый фон. Это не слабость, а сигнал: тебе сейчас нужно немного тепла.", uk: "Смуток, самотність або розчарування — твій частий фон. Це не слабкість, а сигнал: тобі зараз потрібно трохи тепла.", en: "Sadness, loneliness or disappointment are frequent. Not weakness — a signal: you need a little warmth right now." },
    condition: (stats) => ((stats.sad||0) + (stats.lonely||0) + (stats.disappointed||0)) / stats.total > 0.4,
  },
  {
    id: "seeker",
    emoji: "🧭",
    name: { ru: "В поиске", uk: "У пошуку", en: "Seeking" },
    desc: { ru: "Состояния меняются без явного паттерна. Ты в поиске себя — и это честная фаза.", uk: "Стани змінюються без явного патерну. Ти в пошуку себе — і це чесна фаза.", en: "States shift without a clear pattern. You're seeking yourself — an honest phase." },
    condition: () => true,
  },
];


function getArchetype(emotionCounts, total) {
  if (total < 30) return null;
  const stats = { ...emotionCounts, total };
  return ARCHETYPES.find(a => a.condition(stats));
}

// ─────────────────────────────────────────────
// ТРАЕКТОРИИ ЖИЗНИ
// ─────────────────────────────────────────────
const TRAJECTORIES = [
  {
    id: "opening",
    emoji: "🌅",
    name: { ru: "Жизнь открывается", uk: "Життя відкривається", en: "Life is opening" },
    dominantIds: ["joy", "drive", "excitement", "inspired", "inspiration"],
    verdict: (top) => ({
      ru: `Последнее время ты чаще в ${top[0].label.toLowerCase()}${top[1] ? ` и ${top[1].label.toLowerCase()}` : ""}. Жизнь движется в сторону раскрытия.`,
      uk: `Останнім часом ти частіше в ${top[0].label.toLowerCase()}${top[1] ? ` і ${top[1].label.toLowerCase()}` : ""}. Життя рухається в бік розкриття.`,
      en: `Lately you're more often in ${top[0].label.toLowerCase()}${top[1] ? ` and ${top[1].label.toLowerCase()}` : ""}. Life is moving toward opening.`,
    }),
    question: { ru: "Что именно сейчас даёт тебе эту энергию? Стоит это беречь.", uk: "Що саме зараз дає тобі цю енергію? Варто це берегти.", en: "What exactly is giving you this energy now? It's worth protecting." },
  },
  {
    id: "deepening",
    emoji: "🌊",
    name: { ru: "Жизнь углубляется", uk: "Життя поглиблюється", en: "Life is deepening" },
    dominantIds: ["calm", "grateful", "pride", "love"],
    verdict: () => ({
      ru: "Преобладает спокойствие и тепло к себе. Ты движешься внутрь — это ценный период.",
      uk: "Переважає спокій і тепло до себе. Ти рухаєшся всередину — це цінний період.",
      en: "Calm and warmth toward yourself predominate. You're moving inward — a valuable period.",
    }),
    question: { ru: "Что ты сейчас готов(а) отпустить, чтобы углубиться ещё?", uk: "Що ти зараз готовий(а) відпустити, щоб поглибитися ще?", en: "What are you ready to let go of to go deeper still?" },
  },
  {
    id: "pausing",
    emoji: "🍂",
    name: { ru: "Жизнь на паузе", uk: "Життя на паузі", en: "Life on pause" },
    dominantIds: ["tired", "boredom", "sad", "lonely", "disappointed"],
    verdict: () => ({
      ru: "Усталость, пустота или тяжесть преобладают. Это не провал — это сигнал замедлиться.",
      uk: "Втома, порожнеча або важкість переважають. Це не провал — це сигнал сповільнитися.",
      en: "Fatigue, emptiness or heaviness predominate. Not a failure — a signal to slow down.",
    }),
    question: { ru: "Чего тебе сейчас не хватает больше всего — отдыха, тепла, смысла?", uk: "Чого тобі зараз не вистачає найбільше — відпочинку, тепла, сенсу?", en: "What do you need most right now — rest, warmth, meaning?" },
  },
  {
    id: "tension",
    emoji: "⚡",
    name: { ru: "Жизнь в напряжении", uk: "Життя в напрузі", en: "Life under tension" },
    dominantIds: ["anxiety", "angry"],
    verdict: () => ({
      ru: "Тревога или злость часто на поверхности. Внутри много энергии — важно дать ей безопасный выход.",
      uk: "Тривога або злість часто на поверхні. Всередині багато енергії — важливо дати їй безпечний вихід.",
      en: "Anxiety or anger is often on the surface. There's a lot of energy inside — important to give it a safe outlet.",
    }),
    question: { ru: "Где тело держит напряжение сильнее всего — и что оно пытается сказать?", uk: "Де тіло тримає напругу найсильніше — і що воно намагається сказати?", en: "Where does the body hold tension most — and what is it trying to say?" },
  },
  {
    id: "mixed",
    emoji: "🌤",
    name: { ru: "Жизнь в движении", uk: "Життя в русі", en: "Life in motion" },
    dominantIds: [],
    verdict: () => ({
      ru: "Состояния меняются. Нет одного доминирующего фона — ты в живом процессе.",
      uk: "Стани змінюються. Немає одного домінуючого фону — ти в живому процесі.",
      en: "States shift. There's no single dominant background — you're in a living process.",
    }),
    question: { ru: "Что сейчас самое живое в тебе — даже если это неспокойно?", uk: "Що зараз найживіше в тобі — навіть якщо це неспокійно?", en: "What is most alive in you right now — even if it's restless?" },
  },
];


function getTrend(weekStats, monthStats) {
  if (!weekStats || !monthStats) return null;
  const diff = parseFloat(weekStats.avgScore) - parseFloat(monthStats.avgScore);
  if (diff >= 0.8) return { arrow: "↑", label: "растёт", color: "#7FB77E" };
  if (diff <= -0.8) return { arrow: "↓", label: "снижается", color: "#B77E7E" };
  return { arrow: "→", label: "стабильно", color: "#C8A97E" };
}

function getTrajectory(stats) {
  if (!stats || stats.total < 7) return null;
  const sorted = Object.entries(stats.counts).sort((a, b) => b[1] - a[1]);
  const topIds = sorted.filter(([, v]) => v > 0).slice(0, 2).map(([id]) => id);
  const topEmotions = topIds.map(id => EMOTIONS.find(e => e.id === id)).filter(Boolean);
  const c = stats.counts;
  const signalCount = (c.anxiety||0) + (c.angry||0);
  const pauseCount = (c.tired||0) + (c.sad||0) + (c.lonely||0) + (c.boredom||0) + (c.disappointed||0);
  const openCount = (c.joy||0) + (c.drive||0) + (c.excitement||0) + (c.inspired||0) + (c.inspiration||0);
  const deepCount = (c.calm||0) + (c.grateful||0) + (c.pride||0) + (c.love||0);
  // Негативные квадранты проверяем первыми — если человеку тяжело, важнее
  // это заметить, чем отчитаться про открывающуюся жизнь по случайному перевесу.
  if (signalCount / stats.total > 0.4) { const t = TRAJECTORIES.find(t => t.id === "tension"); return { ...t, topEmotions }; }
  if (pauseCount / stats.total > 0.4) { const t = TRAJECTORIES.find(t => t.id === "pausing"); return { ...t, topEmotions }; }
  if (openCount / stats.total > 0.45) { const t = TRAJECTORIES.find(t => t.id === "opening"); return { ...t, topEmotions }; }
  if (deepCount / stats.total > 0.4) { const t = TRAJECTORIES.find(t => t.id === "deepening"); return { ...t, topEmotions }; }
  const t = TRAJECTORIES.find(t => t.id === "mixed");
  return { ...t, topEmotions };
}

// ─────────────────────────────────────────────
// ОПРОСНИК
// ─────────────────────────────────────────────
const QUESTIONS_QUIZ = [
  { id: 1, category: { ru: "УТРО", uk: "РАНОК", en: "MORNING" }, text: { ru: "Как начинается твоё утро в последнее время?", uk: "Як починається твій ранок останнім часом?", en: "How does your morning usually start lately?" }, options: [
    { text: { ru: "Просыпаюсь с предвкушением. Хочется начать день.", uk: "Прокидаюся з передчуттям. Хочеться почати день.", en: "I wake up with anticipation. I want to start the day." }, score: 3, burnout: 0 },
    { text: { ru: "Встаю спокойно. Несколько минут просто лежу, слушаю тишину.", uk: "Встаю спокійно. Кілька хвилин просто лежу, слухаю тишу.", en: "I get up calmly. A few minutes I just lie there, listening to the quiet." }, score: 3, burnout: 0 },
    { text: { ru: "Встаю нормально, но первое что делаю — беру телефон.", uk: "Встаю нормально, але перше що роблю — беру телефон.", en: "I get up fine, but the first thing I do is grab my phone." }, score: 2, burnout: 1 },
    { text: { ru: "Будильник несколько раз. Встаю уже на бегу.", uk: "Будильник кілька разів. Встаю вже на бігу.", en: "Snooze several times. I get up already in a rush." }, score: 1, burnout: 2 },
    { text: { ru: "Утро ощущается как насилие. Я уже что-то должен(на).", uk: "Ранок відчувається як насилля. Я вже щось винен(на).", en: "Morning feels like violence. I already owe something." }, score: 0, burnout: 3 },
  ] },
  { id: 2, category: { ru: "ТИШИНА", uk: "ТИША", en: "SILENCE" }, text: { ru: "Как ты себя чувствуешь наедине с собой — без музыки, экрана?", uk: "Як ти себе відчуваєш наодинці з собою — без музики, екрана?", en: "How do you feel alone with yourself — no music, no screen?" }, options: [
    { text: { ru: "Спокойно. Мне хорошо в своей компании.", uk: "Спокійно. Мені добре у своїй компанії.", en: "Calm. I'm fine in my own company." }, score: 3, burnout: 0 },
    { text: { ru: "Нормально, иногда даже интересно побыть с собой.", uk: "Нормально, іноді навіть цікаво побути з собою.", en: "Fine — sometimes even interesting to be with myself." }, score: 3, burnout: 0 },
    { text: { ru: "Немного неловко. Хочется чем-то заполнить тишину.", uk: "Трохи ніяково. Хочеться чимось заповнити тишу.", en: "A bit awkward. I want to fill the silence with something." }, score: 2, burnout: 1 },
    { text: { ru: "Тревожно. Мысли начинают крутиться.", uk: "Тривожно. Думки починають крутитися.", en: "Anxious. Thoughts start spinning." }, score: 1, burnout: 2 },
    { text: { ru: "Невыносимо. Избегаю таких моментов.", uk: "Нестерпно. Уникаю таких моментів.", en: "Unbearable. I avoid moments like that." }, score: 0, burnout: 3 },
  ] },
  { id: 3, category: { ru: "ТЕЛО", uk: "ТІЛО", en: "BODY" }, text: { ru: "Как ты ощущаешь своё тело прямо сейчас?", uk: "Як ти відчуваєш своє тіло просто зараз?", en: "How do you sense your body right now?" }, options: [
    { text: { ru: "Живое, лёгкое. Чувствую его.", uk: "Живе, легке. Відчуваю його.", en: "Alive, light. I can feel it." }, score: 3, burnout: 0 },
    { text: { ru: "В целом нормально, без особых сигналов.", uk: "Загалом нормально, без особливих сигналів.", en: "Mostly fine, no strong signals." }, score: 3, burnout: 0 },
    { text: { ru: "Есть напряжение — плечи, челюсть, спина.", uk: "Є напруга — плечі, щелепа, спина.", en: "There's tension — shoulders, jaw, back." }, score: 2, burnout: 1 },
    { text: { ru: "Тяжёлое, усталое. Хочется лечь.", uk: "Важке, втомлене. Хочеться лягти.", en: "Heavy, tired. I want to lie down." }, score: 1, burnout: 2 },
    { text: { ru: "Почти не замечаю тело. Оно «выключено».", uk: "Майже не помічаю тіло. Воно «вимкнене».", en: "I barely notice my body. It's 'switched off'." }, score: 0, burnout: 3 },
  ] },
  { id: 4, category: { ru: "СМЫСЛ", uk: "СЕНС", en: "MEANING" }, text: { ru: "Есть ли что-то, ради чего ты с удовольствием встаёшь?", uk: "Чи є щось, заради чого ти із задоволенням встаєш?", en: "Is there something you gladly get up for?" }, options: [
    { text: { ru: "Да. Есть дело, люди или смысл, которые тянут вперёд.", uk: "Так. Є справа, люди чи сенс, що тягнуть уперед.", en: "Yes. There's work, people, or meaning that pulls me forward." }, score: 3, burnout: 0 },
    { text: { ru: "Скорее да. Не всегда ярко, но опора есть.", uk: "Скоріше так. Не завжди яскраво, але опора є.", en: "Mostly yes. Not always bright, but there's an anchor." }, score: 3, burnout: 0 },
    { text: { ru: "Иногда. Чаще просто делаю то, что надо.", uk: "Іноді. Частіше просто роблю те, що треба.", en: "Sometimes. More often I just do what needs to be done." }, score: 2, burnout: 1 },
    { text: { ru: "Сложно вспомнить. Дни похожи один на другой.", uk: "Важко згадати. Дні схожі один на одного.", en: "Hard to remember. Days blend into each other." }, score: 1, burnout: 2 },
    { text: { ru: "Нет. Встаю потому что надо, не потому что хочу.", uk: "Ні. Встаю бо треба, не бо хочу.", en: "No. I get up because I must, not because I want to." }, score: 0, burnout: 3 },
  ] },
  { id: 5, category: { ru: "НАСТОЯЩЕЕ", uk: "ЗАРАЗ", en: "PRESENT" }, text: { ru: "Где ты находишься прямо сейчас — внутри?", uk: "Де ти зараз — всередині?", en: "Where are you right now — inside?" }, options: [
    { text: { ru: "В себе. Чувствую опору и ясность.", uk: "У собі. Відчуваю опору і ясність.", en: "In myself. I feel grounded and clear." }, score: 3, burnout: 0 },
    { text: { ru: "В основном здесь, иногда уплываю мыслями.", uk: "Здебільшого тут, іноді думками тікаю.", en: "Mostly here; sometimes my mind drifts." }, score: 3, burnout: 0 },
    { text: { ru: "Где-то между. Не до конца присутствую.", uk: "Десь між. Не до кінця присутній(я).", en: "Somewhere in between. Not fully present." }, score: 2, burnout: 1 },
    { text: { ru: "В голове — в планах, тревогах, списках.", uk: "У голові — у планах, тривогах, списках.", en: "In my head — plans, worries, lists." }, score: 1, burnout: 2 },
    { text: { ru: "Далеко от себя. Как будто живу на автопилоте.", uk: "Далеко від себе. Ніби живу на автопілоті.", en: "Far from myself. Like living on autopilot." }, score: 0, burnout: 3 },
  ] },
  { id: 6, category: { ru: "ЭНЕРГИЯ", uk: "ЕНЕРГІЯ", en: "ENERGY" }, text: { ru: "Как ты чувствуешь себя в начале рабочего дня?", uk: "Як ти себе відчуваєш на початку робочого дня?", en: "How do you feel at the start of a workday?" }, options: [
    { text: { ru: "С энергией и интересом.", uk: "З енергією та інтересом.", en: "With energy and interest." }, score: 3, burnout: 0 },
    { text: { ru: "Спокойно, готов(а) к делу.", uk: "Спокійно, готовий(а) до справи.", en: "Calm, ready to work." }, score: 3, burnout: 0 },
    { text: { ru: "Нейтрально — просто начинаю.", uk: "Нейтрально — просто починаю.", en: "Neutral — I just start." }, score: 2, burnout: 1 },
    { text: { ru: "С тяжестью. Нужно себя раскачивать.", uk: "З важкістю. Треба себе розкачати.", en: "With heaviness. I need to push myself." }, score: 1, burnout: 2 },
    { text: { ru: "С отвращением или сильной усталостью.", uk: "З огидою або сильною втомою.", en: "With aversion or deep fatigue." }, score: 0, burnout: 3 },
  ] },
  { id: 7, category: { ru: "ЭНЕРГИЯ", uk: "ЕНЕРГІЯ", en: "ENERGY" }, text: { ru: "Хватает ли тебе сил на себя после основных дел?", uk: "Чи вистачає тобі сил на себе після основних справ?", en: "Do you have energy left for yourself after main tasks?" }, options: [
    { text: { ru: "Да. Остаётся время и силы на своё.", uk: "Так. Залишається час і сили на своє.", en: "Yes. Time and energy remain for myself." }, score: 3, burnout: 0 },
    { text: { ru: "Обычно да, если день не перегружен.", uk: "Зазвичай так, якщо день не перевантажений.", en: "Usually yes, if the day isn't overloaded." }, score: 3, burnout: 0 },
    { text: { ru: "Редко. Чаще к вечеру уже пусто.", uk: "Рідко. Частіше ввечері вже порожньо.", en: "Rarely. By evening I'm often empty." }, score: 2, burnout: 1 },
    { text: { ru: "Почти нет. Весь ресурс уходит на «надо».", uk: "Майже немає. Весь ресурс іде на «треба».", en: "Almost none. All resource goes to 'musts'." }, score: 1, burnout: 2 },
    { text: { ru: "Нет. После дел я полностью выжат(а).", uk: "Ні. Після справ я повністю виснажений(а).", en: "No. After tasks I'm completely drained." }, score: 0, burnout: 3 },
  ] },
  { id: 8, category: { ru: "ЭНЕРГИЯ", uk: "ЕНЕРГІЯ", en: "ENERGY" }, text: { ru: "Как ты восстанавливаешься после нагрузки?", uk: "Як ти відновлюєшся після навантаження?", en: "How do you recover after strain?" }, options: [
    { text: { ru: "Легко. Знаю, что мне помогает, и делаю это.", uk: "Легко. Знаю, що мені допомагає, і роблю це.", en: "Easily. I know what helps and I do it." }, score: 3, burnout: 0 },
    { text: { ru: "В целом получается отдохнуть.", uk: "Загалом вдається відпочити.", en: "I mostly manage to rest." }, score: 3, burnout: 0 },
    { text: { ru: "Иногда отдыхаю, иногда просто «выпадаю».", uk: "Іноді відпочиваю, іноді просто «випадаю».", en: "Sometimes I rest, sometimes I just zone out." }, score: 2, burnout: 1 },
    { text: { ru: "Плохо. Отдых не восстанавливает.", uk: "Погано. Відпочинок не відновлює.", en: "Badly. Rest doesn't restore me." }, score: 1, burnout: 2 },
    { text: { ru: "Почти не восстанавливаюсь. Усталость копится.", uk: "Майже не відновлююсь. Втома накопичується.", en: "I barely recover. Fatigue piles up." }, score: 0, burnout: 3 },
  ] },
  { id: 9, category: { ru: "ЭНЕРГИЯ", uk: "ЕНЕРГІЯ", en: "ENERGY" }, text: { ru: "Как ты реагируешь на новые задачи или просьбы?", uk: "Як ти реагуєш на нові задачі чи прохання?", en: "How do you react to new tasks or requests?" }, options: [
    { text: { ru: "С интересом или спокойной готовностью.", uk: "З інтересом або спокійною готовністю.", en: "With interest or calm readiness." }, score: 3, burnout: 0 },
    { text: { ru: "Нормально, если понимаю зачем.", uk: "Нормально, якщо розумію навіщо.", en: "Fine if I understand why." }, score: 3, burnout: 0 },
    { text: { ru: "Сначала напряжение, потом втягиваюсь.", uk: "Спочатку напруга, потім втягуюсь.", en: "Tension first, then I get into it." }, score: 2, burnout: 1 },
    { text: { ru: "Раздражение или усталость от самой мысли.", uk: "Роздратування або втома від самої думки.", en: "Irritation or fatigue at the mere thought." }, score: 1, burnout: 2 },
    { text: { ru: "Ощущение, что ещё одна капля переполнит.", uk: "Відчуття, що ще одна крапля переповнить.", en: "A sense that one more drop will overflow." }, score: 0, burnout: 3 },
  ] },
  { id: 10, category: { ru: "ЭНЕРГИЯ", uk: "ЕНЕРГІЯ", en: "ENERGY" }, text: { ru: "Каким ты бываешь к вечеру?", uk: "Яким ти буваєш увечері?", en: "What are you like in the evening?" }, options: [
    { text: { ru: "Живой(ая), могу ещё чем-то заниматься с удовольствием.", uk: "Живий(а), можу ще чимось займатися із задоволенням.", en: "Alive — I can still do something with pleasure." }, score: 3, burnout: 0 },
    { text: { ru: "Спокойный(ая), день завершён мягко.", uk: "Спокійний(а), день завершено м'яко.", en: "Calm; the day ends gently." }, score: 3, burnout: 0 },
    { text: { ru: "Усталый(ая), но в пределах нормы.", uk: "Втомлений(а), але в межах норми.", en: "Tired, but within normal." }, score: 2, burnout: 1 },
    { text: { ru: "Вымотан(а). Хочется только отключиться.", uk: "Знесилений(а). Хочеться лише вимкнутися.", en: "Wiped out. I only want to switch off." }, score: 1, burnout: 2 },
    { text: { ru: "Пустой(ая) или раздражённый(ая) без сил.", uk: "Порожній(я) або роздратований(а) без сил.", en: "Empty or irritated, with no energy left." }, score: 0, burnout: 3 },
  ] },
  { id: 11, category: { ru: "МОТИВАЦИЯ", uk: "МОТИВАЦІЯ", en: "MOTIVATION" }, text: { ru: "Как ты относишься к своей работе или основному делу?", uk: "Як ти ставишся до своєї роботи чи основної справи?", en: "How do you relate to your work or main activity?" }, options: [
    { text: { ru: "С смыслом и уважением. Это часть меня.", uk: "Зі сенсом і повагою. Це частина мене.", en: "With meaning and respect. It's part of me." }, score: 3, burnout: 0 },
    { text: { ru: "В целом нормально, бывают хорошие дни.", uk: "Загалом нормально, бувають хороші дні.", en: "Mostly fine; there are good days." }, score: 3, burnout: 0 },
    { text: { ru: "Смешанно — то интересно, то тянет.", uk: "Змішано — то цікаво, то тягне.", en: "Mixed — sometimes interesting, sometimes draining." }, score: 2, burnout: 1 },
    { text: { ru: "Как к обязанности. Без тепла.", uk: "Як до обов'язку. Без тепла.", en: "Like a duty. Without warmth." }, score: 1, burnout: 2 },
    { text: { ru: "Тяжело. Хочется убежать или всё бросить.", uk: "Важко. Хочеться втекти або все кинути.", en: "Hard. I want to escape or quit everything." }, score: 0, burnout: 3 },
  ] },
  { id: 12, category: { ru: "МОТИВАЦИЯ", uk: "МОТИВАЦІЯ", en: "MOTIVATION" }, text: { ru: "Видишь ли ты отдачу от своих усилий?", uk: "Чи бачиш ти віддачу від своїх зусиль?", en: "Do you see a return on your efforts?" }, options: [
    { text: { ru: "Да. Вижу результат и чувствую отдачу.", uk: "Так. Бачу результат і відчуваю віддачу.", en: "Yes. I see results and feel the return." }, score: 3, burnout: 0 },
    { text: { ru: "Часто да, хотя не всегда сразу.", uk: "Часто так, хоч не завжди одразу.", en: "Often yes, though not always right away." }, score: 3, burnout: 0 },
    { text: { ru: "Иногда. Не всегда понятно, ради чего.", uk: "Іноді. Не завжди зрозуміло, заради чого.", en: "Sometimes. It's not always clear what for." }, score: 2, burnout: 1 },
    { text: { ru: "Редко. Усилия будто уходят в пустоту.", uk: "Рідко. Зусилля ніби йдуть у порожнечу.", en: "Rarely. Efforts feel like they vanish." }, score: 1, burnout: 2 },
    { text: { ru: "Нет. Кажется, что тружусь впустую.", uk: "Ні. Здається, що працюю марно.", en: "No. It feels like I'm working for nothing." }, score: 0, burnout: 3 },
  ] },
  { id: 13, category: { ru: "МОТИВАЦИЯ", uk: "МОТИВАЦІЯ", en: "MOTIVATION" }, text: { ru: "Когда ты последний раз делал(а) что-то с настоящим удовольствием?", uk: "Коли ти востаннє робив(ла) щось із справжнім задоволенням?", en: "When did you last do something with real pleasure?" }, options: [
    { text: { ru: "Недавно. Помню это ощущение.", uk: "Нещодавно. Пам'ятаю це відчуття.", en: "Recently. I remember that feeling." }, score: 3, burnout: 0 },
    { text: { ru: "В течение последних недель.", uk: "Протягом останніх тижнів.", en: "Within the last few weeks." }, score: 3, burnout: 0 },
    { text: { ru: "Давно — несколько месяцев назад.", uk: "Давно — кілька місяців тому.", en: "A while ago — months back." }, score: 2, burnout: 1 },
    { text: { ru: "Сложно вспомнить.", uk: "Важко згадати.", en: "Hard to remember." }, score: 1, burnout: 2 },
    { text: { ru: "Не помню такого совсем.", uk: "Не пам'ятаю такого взагалі.", en: "I don't remember that at all." }, score: 0, burnout: 3 },
  ] },
  { id: 14, category: { ru: "МОТИВАЦИЯ", uk: "МОТИВАЦІЯ", en: "MOTIVATION" }, text: { ru: "Умеешь ли ты отключаться от дел в нерабочее время?", uk: "Чи вмієш ти відключатися від справ у неробочий час?", en: "Can you switch off from work outside work hours?" }, options: [
    { text: { ru: "Да. Граница есть, и я её держу.", uk: "Так. Межа є, і я її тримаю.", en: "Yes. There's a boundary and I keep it." }, score: 3, burnout: 0 },
    { text: { ru: "В основном да, иногда мысли возвращаются.", uk: "Здебільшого так, іноді думки повертаються.", en: "Mostly yes; sometimes thoughts return." }, score: 3, burnout: 0 },
    { text: { ru: "С трудом. Голова продолжает крутить задачи.", uk: "Насилу. Голова продовжує крутити задачі.", en: "With difficulty. My head keeps spinning tasks." }, score: 2, burnout: 1 },
    { text: { ru: "Почти не умею. Дела преследуют.", uk: "Майже не вмію. Справи переслідують.", en: "I almost can't. Work follows me." }, score: 1, burnout: 2 },
    { text: { ru: "Нет. Даже «отдых» занят мыслями о делах.", uk: "Ні. Навіть «відпочинок» зайнятий думками про справи.", en: "No. Even 'rest' is full of work thoughts." }, score: 0, burnout: 3 },
  ] },
  { id: 15, category: { ru: "МОТИВАЦИЯ", uk: "МОТИВАЦІЯ", en: "MOTIVATION" }, text: { ru: "Как ты себя чувствуешь в общении с людьми?", uk: "Як ти себе відчуваєш у спілкуванні з людьми?", en: "How do you feel in contact with people?" }, options: [
    { text: { ru: "Живо и открыто. Общение питает.", uk: "Живо і відкрито. Спілкування живить.", en: "Alive and open. Connection nourishes me." }, score: 3, burnout: 0 },
    { text: { ru: "В целом комфортно с близкими.", uk: "Загалом комфортно з близькими.", en: "Mostly comfortable with people close to me." }, score: 3, burnout: 0 },
    { text: { ru: "Выборочно — с одними легко, с другими тяжело.", uk: "Вибірково — з одними легко, з іншими важко.", en: "Selectively — easy with some, hard with others." }, score: 2, burnout: 1 },
    { text: { ru: "Часто устаю от людей. Нужно много тишины после.", uk: "Часто втомлююся від людей. Після потрібна багато тиші.", en: "I often tire of people. I need a lot of quiet after." }, score: 1, burnout: 2 },
    { text: { ru: "Избегаю. Общение забирает последние силы.", uk: "Уникаю. Спілкування забирає останні сили.", en: "I avoid it. Interaction takes my last energy." }, score: 0, burnout: 3 },
  ] },
  { id: 16, category: { ru: "ЭМОЦИИ", uk: "ЕМОЦІЇ", en: "EMOTIONS" }, text: { ru: "Как ты себя чувствуешь эмоционально в последнее время?", uk: "Як ти себе відчуваєш емоційно останнім часом?", en: "How have you felt emotionally lately?" }, options: [
    { text: { ru: "Устойчиво. Чувства живые и понятные.", uk: "Стійко. Почуття живі й зрозумілі.", en: "Steady. Feelings are alive and clear." }, score: 3, burnout: 0 },
    { text: { ru: "В целом ровно, бывают спады.", uk: "Загалом рівно, бувають спади.", en: "Mostly even, with some dips." }, score: 3, burnout: 0 },
    { text: { ru: "Качается — то лучше, то хуже.", uk: "Хитається — то краще, то гірше.", en: "It swings — better, then worse." }, score: 2, burnout: 1 },
    { text: { ru: "Часто приглушённо или тревожно.", uk: "Часто приглушено або тривожно.", en: "Often muted or anxious." }, score: 1, burnout: 2 },
    { text: { ru: "Тяжело. Эмоции либо давят, либо их почти нет.", uk: "Важко. Емоції або тиснуть, або їх майже немає.", en: "Hard. Emotions either crush me or barely exist." }, score: 0, burnout: 3 },
  ] },
  { id: 17, category: { ru: "ЭМОЦИИ", uk: "ЕМОЦІЇ", en: "EMOTIONS" }, text: { ru: "Как ты относишься к ошибкам — своим или чужим?", uk: "Як ти ставишся до помилок — своїх чи чужих?", en: "How do you relate to mistakes — yours or others'?" }, options: [
    { text: { ru: "Спокойно. Ошибка — часть пути.", uk: "Спокійно. Помилка — частина шляху.", en: "Calmly. Mistakes are part of the path." }, score: 3, burnout: 0 },
    { text: { ru: "Немного корю себя, но отпускаю.", uk: "Трохи картаю себе, але відпускаю.", en: "I blame myself a bit, then let go." }, score: 3, burnout: 0 },
    { text: { ru: "Долго прокручиваю в голове.", uk: "Довго прокручую в голові.", en: "I replay them in my head for a long time." }, score: 2, burnout: 1 },
    { text: { ru: "Сильно критикую — себя или других.", uk: "Сильно критикую — себе або інших.", en: "I criticize hard — myself or others." }, score: 1, burnout: 2 },
    { text: { ru: "Ошибки давят ощущением провала.", uk: "Помилки тиснуть відчуттям провалу.", en: "Mistakes weigh on me as failure." }, score: 0, burnout: 3 },
  ] },
  { id: 18, category: { ru: "ЭМОЦИИ", uk: "ЕМОЦІЇ", en: "EMOTIONS" }, text: { ru: "Есть ли у тебя ощущение смысла и наполненности?", uk: "Чи є у тебе відчуття сенсу і наповненості?", en: "Do you have a sense of meaning and fullness?" }, options: [
    { text: { ru: "Да. Чувствую, зачем и куда иду.", uk: "Так. Відчуваю, навіщо і куди йду.", en: "Yes. I feel why and where I'm going." }, score: 3, burnout: 0 },
    { text: { ru: "В основном да, иногда сомневаюсь.", uk: "Здебільшого так, іноді сумніваюся.", en: "Mostly yes; sometimes I doubt." }, score: 3, burnout: 0 },
    { text: { ru: "Иногда проблески, но нестабильно.", uk: "Іноді спалахи, але нестабільно.", en: "Occasional flashes, but unstable." }, score: 2, burnout: 1 },
    { text: { ru: "Слабо. Больше рутина, чем смысл.", uk: "Слабко. Більше рутина, ніж сенс.", en: "Weakly. More routine than meaning." }, score: 1, burnout: 2 },
    { text: { ru: "Нет. Пустота или вопрос «ради чего всё».", uk: "Ні. Порожнеча або питання «заради чого все».", en: "No. Emptiness or 'what's the point of it all'." }, score: 0, burnout: 3 },
  ] },
  { id: 19, category: { ru: "ЭМОЦИИ", uk: "ЕМОЦІЇ", en: "EMOTIONS" }, text: { ru: "Как ты себя чувствуешь после отдыха — выходных или отпуска?", uk: "Як ти себе відчуваєш після відпочинку — вихідних чи відпустки?", en: "How do you feel after rest — a weekend or vacation?" }, options: [
    { text: { ru: "Восстановленным(ой). Отдых работает.", uk: "Відновленим(ою). Відпочинок працює.", en: "Restored. Rest works." }, score: 3, burnout: 0 },
    { text: { ru: "Лучше, хотя не всегда надолго.", uk: "Краще, хоч не завжди надовго.", en: "Better, though not always for long." }, score: 3, burnout: 0 },
    { text: { ru: "Слегка легче, но быстро возвращается усталость.", uk: "Трохи легше, але швидко повертається втома.", en: "Slightly lighter, but fatigue returns fast." }, score: 2, burnout: 1 },
    { text: { ru: "Почти так же. Отдых не помогает.", uk: "Майже так само. Відпочинок не допомагає.", en: "Almost the same. Rest doesn't help." }, score: 1, burnout: 2 },
    { text: { ru: "Хуже — мысль о возвращении к делам давит.", uk: "Гірше — думка про повернення до справ тисне.", en: "Worse — the thought of returning to tasks weighs on me." }, score: 0, burnout: 3 },
  ] },
  { id: 20, category: { ru: "ЭМОЦИИ", uk: "ЕМОЦІЇ", en: "EMOTIONS" }, text: { ru: "Как ты относишься к будущему прямо сейчас?", uk: "Як ти ставишся до майбутнього просто зараз?", en: "How do you feel about the future right now?" }, options: [
    { text: { ru: "С интересом и спокойной надеждой.", uk: "З інтересом і спокійною надією.", en: "With interest and calm hope." }, score: 3, burnout: 0 },
    { text: { ru: "В целом нормально, без сильной тревоги.", uk: "Загалом нормально, без сильної тривоги.", en: "Mostly fine, without strong anxiety." }, score: 3, burnout: 0 },
    { text: { ru: "Смешанно — есть и планы, и сомнения.", uk: "Змішано — є і плани, і сумніви.", en: "Mixed — plans and doubts both." }, score: 2, burnout: 1 },
    { text: { ru: "Тревожно. Будущее кажется неопределённым.", uk: "Тривожно. Майбутнє здається невизначеним.", en: "Anxious. The future feels uncertain." }, score: 1, burnout: 2 },
    { text: { ru: "Тяжело или пусто. Не хочется загадывать.", uk: "Важко або порожньо. Не хочеться загадувати.", en: "Heavy or empty. I don't want to look ahead." }, score: 0, burnout: 3 },
  ] },
  { id: 21, category: { ru: "ГРАНИЦА", uk: "МЕЖА", en: "BOUNDARY" }, text: { ru: "Умеешь ли ты говорить «нет» когда не хочешь что-то делать?", uk: "Чи вмієш ти казати «ні», коли не хочеш щось робити?", en: "Can you say no when you don't want to do something?" }, options: [
    { text: { ru: "Да. Без чувства вины.", uk: "Так. Без почуття провини.", en: "Yes. Without guilt." }, score: 3, burnout: 0 },
    { text: { ru: "В основном да, иногда соглашаюсь лишнее.", uk: "Здебільшого так, іноді погоджуюсь на зайве.", en: "Mostly yes; sometimes I agree to extra." }, score: 3, burnout: 0 },
    { text: { ru: "С трудом. Часто соглашаюсь против себя.", uk: "Насилу. Часто погоджуюсь всупереч собі.", en: "With difficulty. I often agree against myself." }, score: 2, burnout: 1 },
    { text: { ru: "Редко. Боюсь подвести или конфликтовать.", uk: "Рідко. Боюся підвести або конфліктувати.", en: "Rarely. I fear letting people down or conflict." }, score: 1, burnout: 2 },
    { text: { ru: "Почти никогда. «Нет» даётся очень тяжело.", uk: "Майже ніколи. «Ні» дається дуже важко.", en: "Almost never. Saying no is very hard." }, score: 0, burnout: 3 },
  ] },
  { id: 22, category: { ru: "ГРАНИЦА", uk: "МЕЖА", en: "BOUNDARY" }, text: { ru: "Есть ли у тебя время и пространство только для себя?", uk: "Чи є у тебе час і простір лише для себе?", en: "Do you have time and space only for yourself?" }, options: [
    { text: { ru: "Да. Регулярно и осознанно.", uk: "Так. Регулярно й усвідомлено.", en: "Yes. Regularly and intentionally." }, score: 3, burnout: 0 },
    { text: { ru: "Есть, хотя иногда его мало.", uk: "Є, хоч іноді його мало.", en: "Yes, though sometimes it's scarce." }, score: 3, burnout: 0 },
    { text: { ru: "Редко выкроить получается.", uk: "Рідко вдається викроїти.", en: "I rarely manage to carve it out." }, score: 2, burnout: 1 },
    { text: { ru: "Почти нет. Всё занято делами и людьми.", uk: "Майже немає. Усе зайнято справами і людьми.", en: "Almost none. Everything is taken by tasks and people." }, score: 1, burnout: 2 },
    { text: { ru: "Нет. «Я» всегда в конце списка.", uk: "Ні. «Я» завжди в кінці списку.", en: "No. 'Me' is always at the end of the list." }, score: 0, burnout: 3 },
  ] },
  { id: 23, category: { ru: "ГРАНИЦА", uk: "МЕЖА", en: "BOUNDARY" }, text: { ru: "Как ты относишься к отдыху и паузам?", uk: "Як ти ставишся до відпочинку і пауз?", en: "How do you relate to rest and pauses?" }, options: [
    { text: { ru: "Как к необходимой части жизни.", uk: "Як до необхідної частини життя.", en: "As a necessary part of life." }, score: 3, burnout: 0 },
    { text: { ru: "Понимаю важность, иногда позволяю себе.", uk: "Розумію важливість, іноді дозволяю собі.", en: "I understand the importance; I allow it sometimes." }, score: 3, burnout: 0 },
    { text: { ru: "Знаю что нужно, но часто откладываю.", uk: "Знаю що треба, але часто відкладаю.", en: "I know I need it, but often postpone." }, score: 2, burnout: 1 },
    { text: { ru: "Чувствую вину, когда отдыхаю.", uk: "Відчуваю провину, коли відпочиваю.", en: "I feel guilty when I rest." }, score: 1, burnout: 2 },
    { text: { ru: "Отдых кажется роскошью или слабостью.", uk: "Відпочинок здається розкішшю або слабкістю.", en: "Rest feels like a luxury or a weakness." }, score: 0, burnout: 3 },
  ] },
  { id: 24, category: { ru: "ГРАНИЦА", uk: "МЕЖА", en: "BOUNDARY" }, text: { ru: "Насколько твои действия совпадают с тем, чего ты реально хочешь?", uk: "Наскільки твої дії збігаються з тим, чого ти реально хочеш?", en: "How much do your actions match what you really want?" }, options: [
    { text: { ru: "В основном совпадают. Живу близко к себе.", uk: "Здебільшого збігаються. Живу близько до себе.", en: "They mostly match. I live close to myself." }, score: 3, burnout: 0 },
    { text: { ru: "Часто да, иногда делаю «как надо».", uk: "Часто так, іноді роблю «як треба».", en: "Often yes; sometimes I do 'what I should'." }, score: 3, burnout: 0 },
    { text: { ru: "Пополам — своё и чужие ожидания.", uk: "Пів на пів — своє і чужі очікування.", en: "Half and half — mine and others' expectations." }, score: 2, burnout: 1 },
    { text: { ru: "Редко. Многое делаю не из желания.", uk: "Рідко. Багато чого роблю не з бажання.", en: "Rarely. Much of what I do isn't from desire." }, score: 1, burnout: 2 },
    { text: { ru: "Почти не совпадают. Живу не свою жизнь.", uk: "Майже не збігаються. Живу не своє життя.", en: "They barely match. I'm not living my own life." }, score: 0, burnout: 3 },
  ] },
  { id: 25, category: { ru: "ГРАНИЦА", uk: "МЕЖА", en: "BOUNDARY" }, text: { ru: "Чувствуешь ли ты себя собой — в своей жизни?", uk: "Чи відчуваєш ти себе собою — у своєму житті?", en: "Do you feel like yourself — in your own life?" }, options: [
    { text: { ru: "Да. Это моя жизнь, и я в ней есть.", uk: "Так. Це моє життя, і я в ньому є.", en: "Yes. This is my life, and I am in it." }, score: 3, burnout: 0 },
    { text: { ru: "В основном да, иногда теряюсь.", uk: "Здебільшого так, іноді гублюся.", en: "Mostly yes; sometimes I lose myself." }, score: 3, burnout: 0 },
    { text: { ru: "То да, то нет. Зависит от дня.", uk: "То так, то ні. Залежить від дня.", en: "Sometimes yes, sometimes no. Depends on the day." }, score: 2, burnout: 1 },
    { text: { ru: "Слабо. Часто будто играю роль.", uk: "Слабко. Часто ніби граю роль.", en: "Weakly. Often it feels like I'm playing a role." }, score: 1, burnout: 2 },
    { text: { ru: "Нет. Далеко от себя настоящего.", uk: "Ні. Далеко від себе справжнього.", en: "No. Far from my real self." }, score: 0, burnout: 3 },
  ] },
];

const QUIZ_RESULTS = [
  { range: [0,18],   emoji: "🌫", title: { ru: "Очень далеко", uk: "Дуже далеко", en: "Very far" },  subtitle: { ru: "Туман поглотил дорогу", uk: "Туман поглинув дорогу", en: "Fog has swallowed the road" },          color: "#6B7B8D", text: { ru: "Ты бежишь уже давно. Так давно, что забыл(а) от чего. Связь с собой — тонкая, почти оборванная. Начни с одной чашки. Без телефона. Просто сиди.", uk: "Ти біжиш уже давно. Так давно, що забув(ла) від чого. Зв'язок із собою — тонкий, майже обірваний. Почни з однієї чашки. Без телефону. Просто сиди.", en: "You've been running for a long time. So long you forgot from what. The link to yourself is thin, almost broken. Start with one cup. No phone. Just sit." } },
  { range: [19,37],  emoji: "🌿", title: { ru: "На полпути", uk: "На півдорозі", en: "Halfway" },    subtitle: { ru: "Ты чувствуешь, что сбился(лась)", uk: "Ти відчуваєш, що збився(лась)", en: "You feel you've gone off track" },       color: "#7A9E7E", text: { ru: "Что-то внутри уже знает, что не так. Это важно — ты еще слышишь себя. Суета взяла свое, но не все. Войди в зазор — медленно.", uk: "Щось усередині вже знає, що не так. Це важливо — ти ще чуєш себе. Суєта взяла своє, але не все. Увійди в проміжок — повільно.", en: "Something inside already knows something's off. That matters — you still hear yourself. Busyness took its share, but not everything. Step into the gap — slowly." } },
  { range: [38,56],  emoji: "🍵", title: { ru: "Почти здесь", uk: "Майже тут", en: "Almost here" },  subtitle: { ru: "Ты возвращаешься", uk: "Ти повертаєшся", en: "You are returning" },                 color: "#C8A97E", text: { ru: "Ты чувствуешь разницу между суетой и тишиной — и иногда выбираешь тишину. Это уже много. Осталось сделать это привычкой.", uk: "Ти відчуваєш різницю між суєтою і тишею — і іноді обираєш тишу. Це вже багато. Залишилося зробити це звичкою.", en: "You feel the difference between busyness and quiet — and sometimes choose quiet. That's already a lot. What's left is to make it a habit." } },
  { range: [57,75],  emoji: "🌕", title: { ru: "Ты здесь", uk: "Ти тут", en: "You are here" },     subtitle: { ru: "Чашка стынет — ты не торопишься", uk: "Чашка стыне — ти не поспішаєш", en: "The cup cools — you don't rush" }, color: "#D4B896", text: { ru: "Ты умеешь быть там, где ты есть. Это редкость. Не потому что ты особенный — а потому что ты это выбираешь. Снова и снова.", uk: "Ти вмієш бути там, де ти є. Це рідкість. Не тому що ти особливий — а тому що ти це обираєш. Знову і знову.", en: "You know how to be where you are. That's rare. Not because you're special — but because you choose it. Again and again." } },
];


const BURNOUT_LEVELS = [
  { range: [0,20],  label: { ru: "Выгорания нет", uk: "Вигорання немає", en: "No burnout" },        color: "#7A9E7E", text: { ru: "Ты в ресурсе. Энергия есть, границы держишь, смысл чувствуешь. Продолжай беречь себя.", uk: "Ти в ресурсі. Енергія є, межі тримаєш, сенс відчуваєш. Продовжуй берегти себе.", en: "You're in resource. Energy is there, boundaries hold, meaning is felt. Keep taking care of yourself." } },
  { range: [21,40], label: { ru: "Начальные признаки", uk: "Початкові ознаки", en: "Early signs" },   color: "#C8A97E", text: { ru: "Усталость накапливается. Пока не критично, но стоит замедлиться и обратить внимание на себя.", uk: "Втома накопичується. Поки не критично, але варто сповільнитися і звернути увагу на себе.", en: "Fatigue is building up. Not critical yet, but it's worth slowing down and paying attention to yourself." } },
  { range: [41,55], label: { ru: "Среднее выгорание", uk: "Середнє вигорання", en: "Moderate burnout" },    color: "#B87333", text: { ru: "Ты работаешь на износ. Тело и психика сигналят. Нужна настоящая пауза — не выходные, а пересмотр ритма.", uk: "Ти працюєш на знос. Тіло і психіка сигналять. Потрібна справжня пауза — не вихідні, а перегляд ритму.", en: "You're running on empty. Body and mind are signaling. You need a real pause — not a weekend, but a rhythm reset." } },
  { range: [56,75], label: { ru: "Глубокое выгорание", uk: "Глибоке вигорання", en: "Deep burnout" },   color: "#8B4A4A", text: { ru: "Ресурс почти на нуле. Это серьезно. Не героизм, а необходимость — остановиться и позаботиться о себе.", uk: "Ресурс майже на нулі. Це серйозно. Не героїзм, а необхідність — зупинитися і подбати про себе.", en: "Resource is almost at zero. This is serious. Not heroism — a necessity to stop and care for yourself." } },
];


// ─────────────────────────────────────────────
// ТЕСТ: НАСКОЛЬКО ТЫ ЧЕСТЕН САМ С СОБОЙ
// ─────────────────────────────────────────────
// Шкала 1–5 по каждому пункту. Пункты с reverse:true считаются в обратную сторону (6 - score).
const SELF_HONESTY_QUESTIONS = [
  { id: 1,  category: { ru: "РЕШЕНИЯ", uk: "РІШЕННЯ", en: "DECISIONS" }, text: { ru: "Я всегда точно знаю, почему принял(а) то или иное решение", uk: "Я завжди точно знаю, чому прийняв(ла) те чи інше рішення", en: "I always know exactly why I made a given decision" }, reverse: false },
  { id: 2,  category: { ru: "РЕШЕНИЯ", uk: "РІШЕННЯ", en: "DECISIONS" }, text: { ru: "Иногда я принимаю решения и сам(а) не до конца понимаю почему", uk: "Іноді я приймаю рішення і сам(а) не до кінця розумію чому", en: "Sometimes I make decisions and don't fully understand why" }, reverse: true },
  { id: 3,  category: { ru: "ПРИВЫЧКИ", uk: "ЗВИЧКИ", en: "HABITS" }, text: { ru: "Если бы я захотел(а) избавиться от плохой привычки — легко бы это сделал(а)", uk: "Якби я захотів(ла) позбутися поганої звички — легко б це зробив(ла)", en: "If I wanted to drop a bad habit, I could do it easily" }, reverse: false },
  { id: 4,  category: { ru: "ПРИВЫЧКИ", uk: "ЗВИЧКИ", en: "HABITS" }, text: { ru: "У меня есть привычки, с которыми я реально борюсь и не всегда справляюсь", uk: "У мене є звички, з якими я реально борюся і не завжди справляюся", en: "I have habits I really struggle with and don't always manage" }, reverse: true },
  { id: 5,  category: { ru: "ОШИБКИ", uk: "ПОМИЛКИ", en: "MISTAKES" }, text: { ru: "Мне почти не в чем себя упрекнуть за последний год", uk: "Мені майже немає в чому себе дорікнути за останній рік", en: "I have almost nothing to blame myself for over the last year" }, reverse: false },
  { id: 6,  category: { ru: "ОШИБКИ", uk: "ПОМИЛКИ", en: "MISTAKES" }, text: { ru: "Если бы я вёл(а) честный список своих факапов за год, он был бы длинным", uk: "Якби я вів(ла) чесний список своїх факапів за рік, він був би довгим", en: "If I kept an honest list of my screw-ups for a year, it would be long" }, reverse: true },
  { id: 7,  category: { ru: "НЕУДАЧИ", uk: "НЕВДАЧІ", en: "FAILURES" }, text: { ru: "Мои неудачи почти всегда были вызваны внешними обстоятельствами", uk: "Мої невдачі майже завжди були спричинені зовнішніми обставинами", en: "My failures were almost always caused by external circumstances" }, reverse: false },
  { id: 8,  category: { ru: "НЕУДАЧИ", uk: "НЕВДАЧІ", en: "FAILURES" }, text: { ru: "Оглядываясь назад, я вижу решения, которые мог(ла) принять иначе", uk: "Оглядаючись назад, я бачу рішення, які міг(ла) прийняти інакше", en: "Looking back, I see decisions I could have made differently" }, reverse: true },
  { id: 9,  category: { ru: "ЭМОЦИИ", uk: "ЕМОЦІЇ", en: "EMOTIONS" }, text: { ru: "Я почти никогда не теряю контроль над эмоциями", uk: "Я майже ніколи не втрачаю контроль над емоціями", en: "I almost never lose control of my emotions" }, reverse: false },
  { id: 10,  category: { ru: "ЭМОЦИИ", uk: "ЕМОЦІЇ", en: "EMOTIONS" }, text: { ru: "Бывают моменты, когда эмоции берут надо мной верх, и я это признаю", uk: "Бувають моменти, коли емоції беруть наді мною гору, і я це визнаю", en: "There are moments when emotions take over, and I admit it" }, reverse: true },
  { id: 11,  category: { ru: "ЛЮДИ", uk: "ЛЮДИ", en: "PEOPLE" }, text: { ru: "Мои первые впечатления о людях почти всегда оказываются верны", uk: "Мої перші враження про людей майже завжди виявляються вірними", en: "My first impressions of people are almost always right" }, reverse: false },
  { id: 12,  category: { ru: "ЛЮДИ", uk: "ЛЮДИ", en: "PEOPLE" }, text: { ru: "Я не раз ошибался(ась) в людях, доверившись первому впечатлению", uk: "Я не раз помилявся(лась) в людях, довірившись першому враженню", en: "I've been wrong about people more than once by trusting first impressions" }, reverse: true },
  { id: 13,  category: { ru: "ЦЕННОСТИ", uk: "ЦІННОСТІ", en: "VALUES" }, text: { ru: "Я всегда действую в соответствии со своими ценностями, даже когда это трудно", uk: "Я завжди дію відповідно до своїх цінностей, навіть коли це важко", en: "I always act according to my values, even when it's hard" }, reverse: false },
  { id: 14,  category: { ru: "ЦЕННОСТИ", uk: "ЦІННОСТІ", en: "VALUES" }, text: { ru: "Бывали случаи, когда я поступал(а) вопреки своим ценностям, потому что так было проще", uk: "Були випадки, коли я чинив(ла) всупереч своїм цінностям, бо так було простіше", en: "There were times I acted against my values because it was easier" }, reverse: true },
];


const SELF_HONESTY_RESULTS = [
  { range: [0,25],   emoji: "🪞", title: { ru: "Трезвый взгляд", uk: "Тверезий погляд", en: "Clear-eyed view" },     subtitle: { ru: "Видишь себя без прикрас", uk: "Бачиш себе без прикрас", en: "You see yourself without polish" },     color: "#7A9E7E", text: { ru: "Ты редко приукрашиваешь себя перед собой. Признаёшь ошибки, замечаешь слабости, не строишь удобных версий прошлого. Это тяжелее эмоционально, но честнее — и в долгосрочной перспективе выгоднее.", uk: "Ти рідко прикрашаєш себе перед собою. Визнаєш помилки, помічаєш слабкості, не будуєш зручних версій минулого. Це важче емоційно, але чесніше — і в довгостроковій перспективі вигідніше.", en: "You rarely dress yourself up for yourself. You admit mistakes, notice weaknesses, don't build convenient versions of the past. It's harder emotionally, but more honest — and better long term." } },
  { range: [26,50],  emoji: "🌤", title: { ru: "В целом честно", uk: "Загалом чесно", en: "Mostly honest" },     subtitle: { ru: "Есть небольшие слепые пятна", uk: "Є невеликі сліпі плями", en: "Small blind spots exist" }, color: "#A9B98E", text: { ru: "В большинстве случаев ты видишь себя реалистично, но кое-где чуть смягчаешь картину в свою пользу. Это нормально — полностью без искажений не живёт никто. Стоит присмотреться к тем ответам, где балл был выше.", uk: "У більшості випадків ти бачиш себе реалістично, але де-не-де трохи пом'якшуєш картину на свою користь. Це нормально — повністю без викривлень ніхто не живе. Варто придивитися до тих відповідей, де бал був вищий.", en: "Most of the time you see yourself realistically, but in places you soften the picture in your favor. That's normal — no one lives without distortion. Look closer at answers where the score was higher." } },
  { range: [51,75],  emoji: "🌫", title: { ru: "Умеренный самообман", uk: "Помірний самообман", en: "Moderate self-deception" }, subtitle: { ru: "Есть удобные версии себя", uk: "Є зручні версії себе", en: "Convenient versions of yourself" },     color: "#C8A97E", text: { ru: "Ты периодически рассказываешь себе версию событий, где выглядишь лучше, чем было на самом деле. Это защитный механизм — но если он мешает видеть реальные проблемы, стоит начать замечать его в моменте.", uk: "Ти періодично розповідаєш собі версію подій, де виглядаєш краще, ніж було насправді. Це захисний механізм — але якщо він заважає бачити реальні проблеми, варто почати помічати його в моменті.", en: "You periodically tell yourself a version of events where you look better than it really was. It's a defense — but if it blocks real problems, start noticing it in the moment." } },
  { range: [76,100], emoji: "🎭", title: { ru: "Сильное приукрашивание", uk: "Сильне прикрашання", en: "Strong whitewashing" }, subtitle: { ru: "Себе — удобную версию", uk: "Собі — зручну версію", en: "A convenient version for yourself" },   color: "#B87333", text: { ru: "Ты склонен(на) верить в собственную непогрешимость и объяснять сбои внешними причинами. Честный взгляд внутрь может быть болезненным — но именно он открывает путь к реальным изменениям.", uk: "Ти схильний(на) вірити у власну непогрішність і пояснювати збої зовнішніми причинами. Чесний погляд усередину може бути болючим — але саме він відкриває шлях до реальних змін.", en: "You tend to believe in your own infallibility and blame setbacks on outside causes. An honest look inward can hurt — but that's what opens the path to real change." } },
];


// ─────────────────────────────────────────────
// СОВЕТЫ ПО САМООБМАНУ
// ─────────────────────────────────────────────
const SELF_HONESTY_ADVICE = {
  low: {
    label: { ru: "Держи то, что уже работает", uk: "Тримай те, що вже працює", en: "Keep what already works" },
    color: "#7A9E7E",
    why: { ru: "Ты видишь себя без искажений — это редкость и это тяжело эмоционально, но окупается доверием к себе.", uk: "Ти бачиш себе без викривлень — це рідкість і це важко емоційно, але окупається довірою до себе.", en: "You see yourself without distortion — rare and emotionally hard, but it pays off in self-trust." },
    steps: [
      { ru: "Не путай честность с самокритикой — трезвость не значит жёсткость к себе.", uk: "Не плутай чесність із самокритикою — тверезість не означає жорсткість до себе.", en: "Don't confuse honesty with self-criticism — clarity is not harshness toward yourself." },
      { ru: "Раз в неделю фиксируй одну вещь, которую сделал(а) хорошо — трезвый взгляд легко скатывается в излишнюю строгость.", uk: "Раз на тиждень фіксуй одну річ, яку зробив(ла) добре — тверезий погляд легко скочується в зайву строгість.", en: "Once a week note one thing you did well — a clear view easily tips into excess strictness." },
      { ru: "Делись честными наблюдениями о себе с близкими — это укрепляет привычку.", uk: "Ділися чесними спостереженнями про себе з близькими — це зміцнює звичку.", en: "Share honest observations about yourself with people close to you — it strengthens the habit." },
      { ru: "Замечай, когда начинаешь оправдываться — первый признак отката в самообман.", uk: "Помічай, коли починаєш виправдовуватися — перша ознака відкату в самообман.", en: "Notice when you start justifying — the first sign of sliding back into self-deception." },
      { ru: "Не жди идеала от себя — трезвость включает принятие ошибок, а не только их видение.", uk: "Не чекай ідеалу від себе — тверезість включає прийняття помилок, а не лише їх бачення.", en: "Don't demand perfection of yourself — clarity includes accepting mistakes, not only seeing them." },
    ],
    duration: { ru: "Поддерживающая практика · 5 минут в день", uk: "Підтримувальна практика · 5 хвилин на день", en: "Supportive practice · 5 minutes a day" },
  },
  mild: {
    label: { ru: "Замечай, где именно смягчаешь картину", uk: "Помічай, де саме пом'якшуєш картину", en: "Notice where you soften the picture" },
    color: "#A9B98E",
    why: { ru: "У тебя есть небольшие слепые пятна — это нормально, но стоит их найти, пока они не выросли.", uk: "У тебе є невеликі сліпі плями — це нормально, але варто їх знайти, поки вони не виросли.", en: "You have small blind spots — normal, but worth finding before they grow." },
    steps: [
      { ru: "Перечитай ответы теста — где балл был выше 3, там ищи конкретный пример из жизни.", uk: "Перечитай відповіді тесту — де бал був вищий за 3, там шукай конкретний приклад з життя.", en: "Reread the test answers — where the score was above 3, look for a concrete life example." },
      { ru: "Спроси у близкого человека: «В чём я себе, по-твоему, вру?» — и выслушай без защиты.", uk: "Спитай у близької людини: «У чому я собі, на твою думку, брешу?» — і вислухай без захисту.", en: "Ask someone close: 'Where do you think I lie to myself?' — and listen without defending." },
      { ru: "Веди короткие записи вечером: «Где я сегодня приукрасил(а) для себя ситуацию?»", uk: "Веди короткі записи ввечері: «Де я сьогодні прикрасив(ла) для себе ситуацію?»", en: "Keep short evening notes: 'Where did I polish the situation for myself today?'" },
      { ru: "Разделяй факт и интерпретацию — «я опоздал» вместо «у меня всегда что-то мешает».", uk: "Розділяй факт і інтерпретацію — «я запізнився» замість «мені завжди щось заважає».", en: "Separate fact and interpretation — 'I was late' instead of 'something always gets in the way'." },
      { ru: "Раз в месяц пересматривай одно решение — было ли оно таким осознанным, каким казалось?", uk: "Раз на місяць переглядай одне рішення — чи було воно таким усвідомленим, яким здавалося?", en: "Once a month revisit one decision — was it as conscious as it seemed?" },
    ],
    duration: { ru: "2–3 недели наблюдения · станет заметнее", uk: "2–3 тижні спостереження · стане помітніше", en: "2–3 weeks of observation · it will become clearer" },
  },
  medium: {
    label: { ru: "Пора смотреть чуть внимательнее", uk: "Час дивитися трохи уважніше", en: "Time to look a bit closer" },
    color: "#C8A97E",
    why: { ru: "Ты периодически строишь удобную версию себя — это защита, но она мешает видеть реальные проблемы.", uk: "Ти періодично будуєш зручну версію себе — це захист, але він заважає бачити реальні проблеми.", en: "You periodically build a convenient version of yourself — a defense, but it blocks real problems." },
    steps: [
      { ru: "Выбери одну область (работа/отношения/привычки) и честно распиши: что реально происходит, без смягчений.", uk: "Обери одну сферу (робота/стосунки/звички) і чесно розпиши: що реально відбувається, без пом'якшень.", en: "Pick one area (work/relationships/habits) and write honestly what is really going on, without softening." },
      { ru: "Найди человека, который скажет тебе правду, даже неприятную — и разреши ему это.", uk: "Знайди людину, яка скаже тобі правду, навіть неприємну — і дозволь їй це.", en: "Find someone who will tell you the truth, even the unpleasant kind — and allow them to." },
      { ru: "Отслеживай фразы-оправдания: «все так делают», «у меня не было выбора» — это маркеры самообмана.", uk: "Відстежуй фрази-виправдання: «всі так роблять», «у мене не було вибору» — це маркери самообману.", en: "Track justification phrases: 'everyone does it', 'I had no choice' — markers of self-deception." },
      { ru: "Раз в неделю задавай вопрос: «Что бы я увидел(а), если бы смотрел(а) на себя со стороны?»", uk: "Раз на тиждень став питання: «Що б я побачив(ла), якби дивився(лась) на себе збоку?»", en: "Once a week ask: 'What would I see if I looked at myself from the outside?'" },
      { ru: "Не пытайся исправить всё сразу — начни с одной честной мысли в день.", uk: "Не намагайся виправити все одразу — почни з однієї чесної думки на день.", en: "Don't try to fix everything at once — start with one honest thought a day." },
    ],
    duration: { ru: "4–6 недель практики · без спешки", uk: "4–6 тижнів практики · без поспіху", en: "4–6 weeks of practice · no rush" },
  },
  high: {
    label: { ru: "Нужен взгляд со стороны", uk: "Потрібен погляд збоку", en: "An outside view is needed" },
    color: "#B87333",
    why: { ru: "Ты часто веришь в свою непогрешимость больше, чем это оправдано — решения кажутся осознаннее, ошибки — не твоими.", uk: "Ти часто віриш у свою непогрішність більше, ніж це виправдано — рішення здаються усвідомленішими, помилки — не твоїми.", en: "You often believe in your own infallibility more than is justified — decisions seem more conscious, mistakes not yours." },
    steps: [
      { ru: "Найди человека (друга, психолога), который видит тебя иначе — и регулярно сверяйся с ним.", uk: "Знайди людину (друга, психолога), яка бачить тебе інакше — і регулярно звіряйся з нею.", en: "Find someone (friend, therapist) who sees you differently — and check in with them regularly." },
      { ru: "Веди дневник фактов без оценок: только «что случилось», без «почему я прав(а)».", uk: "Веди щоденник фактів без оцінок: лише «що сталося», без «чому я правий(а)».", en: "Keep a fact diary without judgments: only 'what happened', without 'why I was right'." },
      { ru: "Когда возникает сильная уверенность в своей правоте — поставь паузу и спроси: «А что, если я ошибаюсь?»", uk: "Коли виникає сильна впевненість у своїй правоті — постав паузу і спитай: «А що, якщо я помиляюся?»", en: "When strong certainty in being right appears — pause and ask: 'What if I'm wrong?'" },
      { ru: "Перечитай решения за последние полгода — какие из них ты сейчас назвал(а) бы иначе?", uk: "Перечитай рішення за останні півроку — які з них ти зараз назвав(ла) би інакше?", en: "Reread decisions from the last six months — which would you name differently now?" },
      { ru: "Не стыдись самообмана — стыд только усиливает его. Заметить — уже шаг к честности.", uk: "Не соромся самообману — сором лише підсилює його. Помітити — вже крок до чесності.", en: "Don't be ashamed of self-deception — shame only strengthens it. Noticing is already a step toward honesty." },
    ],
    duration: { ru: "Месяцы мягкой практики · с поддержкой", uk: "Місяці м'якої практики · з підтримкою", en: "Months of gentle practice · with support" },
  },
};


// ─────────────────────────────────────────────
// ТЕСТ: ГОРМОНАЛЬНЫЙ КОД (7 систем · 7 вопросов)
// ─────────────────────────────────────────────
const HORMONE_META = {
  dopamine:      { name: { ru: "Дофамин", uk: "Дофамін", en: "Dopamine" },       short: { ru: "мотивация и драйв", uk: "мотивація і драйв", en: "motivation and drive" },     color: "#C89B5C" },
  serotonin:     { name: { ru: "Серотонин", uk: "Серотонін", en: "Serotonin" },     short: { ru: "самооценка и опора", uk: "самооцінка і опора", en: "self-worth and support" },    color: "#A9B98E" },
  oxytocin:      { name: { ru: "Окситоцин", uk: "Окситоцин", en: "Oxytocin" },     short: { ru: "доверие и близость", uk: "довіра і близькість", en: "trust and closeness" },    color: "#C88FA0" },
  cortisol:      { name: { ru: "Кортизол", uk: "Кортизол", en: "Cortisol" },      short: { ru: "стресс и тревога", uk: "стрес і тривога", en: "stress and anxiety" },      color: "#B87333" },
  gaba:          { name: { ru: "ГАМК", uk: "ГАМК", en: "GABA" },          short: { ru: "сон и торможение", uk: "сон і гальмування", en: "sleep and inhibition" },      color: "#7B9EB0" },
  testosterone:  { name: { ru: "Тестостерон", uk: "Тестостерон", en: "Testosterone" },   short: { ru: "воля и напор", uk: "воля і напір", en: "will and drive" },          color: "#8B4A4A" },
  acetylcholine: { name: { ru: "Ацетилхолин", uk: "Ацетилхолін", en: "Acetylcholine" },   short: { ru: "фокус и ясность", uk: "фокус і ясність", en: "focus and clarity" },       color: "#7A9E7E" },
};

const HORMONE_QUESTIONS = [
  { key: "dopamine", category: { ru: "ДОФАМИН", uk: "ДОФАМІН", en: "DOPAMINE" }, text: { ru: "Что вы чувствуете в свободный день, когда можно делать что угодно?", uk: "Що ви відчуваєте у вільний день, коли можна робити що завгодно?", en: "What do you feel on a free day when you can do anything?" }, options: [
    { text: { ru: "Ничего не хочется, всё кажется бессмысленным", uk: "Нічого не хочеться, все здається безглуздим", en: "I want nothing; everything feels pointless" }, score: 1 },
    { text: { ru: "Сложно найти интерес, чаще скучаю", uk: "Складно знайти інтерес, частіше нудьгую", en: "Hard to find interest; I often get bored" }, score: 2 },
    { text: { ru: "Бывает интерес, бывает апатия — по-разному", uk: "Буває інтерес, буває апатія — по-різному", en: "Sometimes interest, sometimes apathy — varies" }, score: 3 },
    { text: { ru: "Обычно есть желание что-то сделать, но не всегда могу начать", uk: "Зазвичай є бажання щось зробити, але не завжди можу почати", en: "Usually I want to do something, but can't always start" }, score: 4 },
    { text: { ru: "Много интересов, легко нахожу, чем заняться", uk: "Багато інтересів, легко знаходжу, чим зайнятися", en: "Many interests; I easily find something to do" }, score: 5 },
  ]},
  { key: "serotonin", category: { ru: "СЕРОТОНИН", uk: "СЕРОТОНІН", en: "SEROTONIN" }, text: { ru: "Как вы относитесь к себе, когда остаётесь наедине с собой?", uk: "Як ви ставитесь до себе, коли залишаєтесь наодинці з собою?", en: "How do you treat yourself when alone with yourself?" }, options: [
    { text: { ru: "Чувствую себя ничтожеством, постоянно критикую себя", uk: "Відчуваю себе нікчемністю, постійно критикую себе", en: "I feel worthless; I constantly criticize myself" }, score: 1 },
    { text: { ru: "Сомневаюсь, часто собой недоволен(льна)", uk: "Сумніваюся, часто собою незадоволений(на)", en: "I doubt myself; often dissatisfied with myself" }, score: 2 },
    { text: { ru: "В целом нормально, но бывает неуверенность", uk: "Загалом нормально, але буває невпевненість", en: "Mostly fine, but sometimes uncertainty" }, score: 3 },
    { text: { ru: "Принимаю себя таким(ой), какой(ая) есть", uk: "Приймаю себе таким(ою), який(а) є", en: "I accept myself as I am" }, score: 4 },
    { text: { ru: "Ценю и уважаю себя, мне с собой комфортно", uk: "Ціную і поважаю себе, мені з собою комфортно", en: "I value and respect myself; I'm comfortable with myself" }, score: 5 },
  ]},
  { key: "oxytocin", category: { ru: "ОКСИТОЦИН", uk: "ОКСИТОЦИН", en: "OXYTOCIN" }, text: { ru: "Что вы чувствуете по поводу отношений с людьми?", uk: "Що ви відчуваєте щодо стосунків з людьми?", en: "How do you feel about relationships with people?" }, options: [
    { text: { ru: "Мне кажется, что меня никто не любит, я никому не доверяю", uk: "Мені здається, що мене ніхто не любить, я нікому не довіряю", en: "It feels like no one loves me; I trust no one" }, score: 1 },
    { text: { ru: "Есть пара близких, но в основном держу дистанцию", uk: "Є пара близьких, але здебільшого тримаю дистанцію", en: "A few close people, but I mostly keep distance" }, score: 2 },
    { text: { ru: "Доверяю проверенным людям, но не всем", uk: "Довіряю перевіреним людям, але не всім", en: "I trust proven people, but not everyone" }, score: 3 },
    { text: { ru: "Люблю людей, легко нахожу общий язык", uk: "Люблю людей, легко знаходжу спільну мову", en: "I like people; I easily find common ground" }, score: 4 },
    { text: { ru: "Чувствую тепло и поддержку от окружающих, мне легко в обществе", uk: "Відчуваю тепло і підтримку від оточення, мені легко в суспільстві", en: "I feel warmth and support from others; I'm at ease socially" }, score: 5 },
  ]},
  { key: "cortisol", category: { ru: "КОРТИЗОЛ", uk: "КОРТИЗОЛ", en: "CORTISOL" }, text: { ru: "Как вы чувствуете себя в течение обычного дня?", uk: "Як ви відчуваєте себе протягом звичайного дня?", en: "How do you feel during an ordinary day?" }, options: [
    { text: { ru: "Постоянно на взводе, разбит(а), не могу отдохнуть", uk: "Постійно на взводі, розбитий(а), не можу відпочити", en: "Constantly on edge, shattered; I can't rest" }, score: 1 },
    { text: { ru: "Часто чувствую тревогу и усталость, трудно расслабиться", uk: "Часто відчуваю тривогу і втому, важко розслабитися", en: "Often anxiety and fatigue; hard to relax" }, score: 2 },
    { text: { ru: "Бываю напряжён(а), но в целом справляюсь", uk: "Буваю напружений(а), але загалом справляюся", en: "Sometimes tense, but overall I cope" }, score: 3 },
    { text: { ru: "Иногда бывает тревога, но быстро проходит", uk: "Іноді буває тривога, але швидко минає", en: "Sometimes anxiety, but it passes quickly" }, score: 4 },
    { text: { ru: "Я спокоен(йна) и расслаблен(а), редко тревожусь", uk: "Я спокійний(а) і розслаблений(а), рідко тривожусь", en: "I'm calm and relaxed; I rarely worry" }, score: 5 },
  ]},
  { key: "gaba", category: { ru: "ГАМК", uk: "ГАМК", en: "GABA" }, text: { ru: "Как вы засыпаете и спите?", uk: "Як ви засинаєте і спите?", en: "How do you fall asleep and sleep?" }, options: [
    { text: { ru: "Мучаюсь бессонницей, просыпаюсь разбитым(ой)", uk: "Мучуся безсонням, прокидаюся розбитим(ою)", en: "I suffer insomnia; I wake up shattered" }, score: 1 },
    { text: { ru: "Часто долго ворочаюсь, сон поверхностный", uk: "Часто довго кручуся, сон поверхневий", en: "I often toss and turn; sleep is shallow" }, score: 2 },
    { text: { ru: "Иногда трудно заснуть, но в целом нормально", uk: "Іноді важко заснути, але загалом нормально", en: "Sometimes hard to fall asleep, but mostly OK" }, score: 3 },
    { text: { ru: "Обычно хорошо, но иногда бывают пробуждения", uk: "Зазвичай добре, але іноді бувають пробудження", en: "Usually well, but sometimes awakenings" }, score: 4 },
    { text: { ru: "Засыпаю мгновенно и сплю крепко", uk: "Засинаю миттєво і сплю міцно", en: "I fall asleep instantly and sleep deeply" }, score: 5 },
  ]},
  { key: "testosterone", category: { ru: "ТЕСТОСТЕРОН", uk: "ТЕСТОСТЕРОН", en: "TESTOSTERONE" }, text: { ru: "Как вы действуете, когда встречаете серьёзное препятствие?", uk: "Як ви дієте, коли зустрічаєте серйозну перешкоду?", en: "How do you act when you meet a serious obstacle?" }, options: [
    { text: { ru: "Часто отступаю, страшно, не верю в свои силы", uk: "Часто відступаю, страшно, не вірю у свої сили", en: "I often back off; I'm scared; I don't trust my strength" }, score: 1 },
    { text: { ru: "Пытаюсь, но быстро сдаюсь", uk: "Намагаюся, але швидко здаюся", en: "I try, but give up quickly" }, score: 2 },
    { text: { ru: "Иногда преодолеваю, иногда нет", uk: "Іноді долаю, іноді ні", en: "Sometimes I overcome, sometimes not" }, score: 3 },
    { text: { ru: "Обычно иду до конца, несмотря на страх", uk: "Зазвичай йду до кінця, попри страх", en: "I usually go all the way despite fear" }, score: 4 },
    { text: { ru: "Люблю вызовы, препятствия меня только заводят", uk: "Люблю виклики, перешкоди мене лише заводять", en: "I love challenges; obstacles only fire me up" }, score: 5 },
  ]},
  { key: "acetylcholine", category: { ru: "АЦЕТИЛХОЛИН", uk: "АЦЕТИЛХОЛІН", en: "ACETYLCHOLINE" }, text: { ru: "Насколько легко вам сосредоточиться и ясно мыслить?", uk: "Наскільки легко вам зосередитися і ясно мислити?", en: "How easy is it for you to focus and think clearly?" }, options: [
    { text: { ru: "В голове туман, не могу сконцентрироваться", uk: "У голові туман, не можу сконцентруватися", en: "Fog in the head; I can't concentrate" }, score: 1 },
    { text: { ru: "Часто отвлекаюсь, тяжело удерживать внимание", uk: "Часто відволікаюся, важко утримувати увагу", en: "I often get distracted; hard to hold attention" }, score: 2 },
    { text: { ru: "Средне, иногда бывает ясность", uk: "Середньо, іноді буває ясність", en: "Average; sometimes clarity appears" }, score: 3 },
    { text: { ru: "Обычно мысли ясные, могу погрузиться в работу", uk: "Зазвичай думки ясні, можу зануритися в роботу", en: "Usually clear thoughts; I can dive into work" }, score: 4 },
    { text: { ru: "Ум острый, легко фокусируюсь и запоминаю", uk: "Розум гострий, легко фокусуюся і запам'ятовую", en: "Mind is sharp; I focus and remember easily" }, score: 5 },
  ]},
];


// Доп. вопросы для точности — каждый частично уточняет несколько систем сразу,
// поэтому итоговый % перестаёт быть кратным 25 и становится «живым» числом.
const HORMONE_CROSS_QUESTIONS = [
  { key: "energy", category: { ru: "ЭНЕРГИЯ", uk: "ЕНЕРГІЯ", en: "ENERGY" }, text: { ru: "Как вы чувствуете уровень энергии на протяжении дня?", uk: "Як ви відчуваєте рівень енергії протягом дня?", en: "How do you feel your energy level through the day?" }, options: [
    { text: { ru: "Энергии почти нет, часто чувствую разбитость", uk: "Енергії майже немає, часто відчуваю розбитість", en: "Almost no energy; I often feel shattered" }, score: 1 },
    { text: { ru: "Энергии мало, к вечеру совсем никакой", uk: "Енергії мало, ввечері зовсім ніякої", en: "Little energy; by evening none at all" }, score: 2 },
    { text: { ru: "Энергия есть, но неравномерно — то густо, то пусто", uk: "Енергія є, але нерівномірно — то густо, то порожньо", en: "Energy is there, but uneven — thick then empty" }, score: 3 },
    { text: { ru: "В целом бодр(а), хватает на весь день", uk: "Загалом бадьорий(а), вистачає на весь день", en: "Mostly alert; enough for the whole day" }, score: 4 },
    { text: { ru: "Энергии много, легко выдерживаю нагрузку весь день", uk: "Енергії багато, легко витримую навантаження весь день", en: "Lots of energy; I easily handle load all day" }, score: 5 },
  ]},
  { key: "selfworth", category: { ru: "ЗАВИСИМОСТЬ ОТ ОЦЕНКИ", uk: "ЗАЛЕЖНІСТЬ ВІД ОЦІНКИ", en: "NEED FOR APPROVAL" }, text: { ru: "Насколько сильно ваше настроение зависит от мнения и реакции других людей?", uk: "Наскільки сильно ваш настрій залежить від думки і реакції інших людей?", en: "How strongly does your mood depend on others' opinions and reactions?" }, options: [
    { text: { ru: "Очень сильно — чужая реакция может испортить весь день", uk: "Дуже сильно — чужа реакція може зіпсувати весь день", en: "Very strongly — someone else's reaction can ruin the whole day" }, score: 1 },
    { text: { ru: "Часто оглядываюсь на мнение других", uk: "Часто оглядаюся на думку інших", en: "I often look to others' opinions" }, score: 2 },
    { text: { ru: "Иногда важно, иногда нет", uk: "Іноді важливо, іноді ні", en: "Sometimes it matters, sometimes not" }, score: 3 },
    { text: { ru: "Редко завишу от чужой оценки", uk: "Рідко залежу від чужої оцінки", en: "I rarely depend on others' evaluation" }, score: 4 },
    { text: { ru: "Почти не завишу — ориентируюсь на себя", uk: "Майже не залежу — орієнтуюся на себе", en: "Almost independent — I orient to myself" }, score: 5 },
  ]},
  { key: "recovery", category: { ru: "ВОССТАНОВЛЕНИЕ", uk: "ВІДНОВЛЕННЯ", en: "RECOVERY" }, text: { ru: "Как быстро вы приходите в себя после напряжённого дня или конфликта?", uk: "Як швидко ви приходите до себе після напруженого дня або конфлікту?", en: "How quickly do you recover after a tense day or conflict?" }, options: [
    { text: { ru: "Долго не могу отпустить, прокручиваю в голове", uk: "Довго не можу відпустити, прокручую в голові", en: "I can't let go for long; I replay it in my head" }, score: 1 },
    { text: { ru: "Восстановление занимает день и больше", uk: "Відновлення займає день і більше", en: "Recovery takes a day or more" }, score: 2 },
    { text: { ru: "Обычно прихожу в себя за несколько часов", uk: "Зазвичай приходжу до себе за кілька годин", en: "Usually I come back to myself in a few hours" }, score: 3 },
    { text: { ru: "Быстро отхожу, уже через пару часов в порядке", uk: "Швидко відходжу, уже через пару годин у порядку", en: "I bounce back fast; fine within a couple of hours" }, score: 4 },
    { text: { ru: "Почти сразу — умею быстро сбрасывать напряжение", uk: "Майже одразу — вмію швидко скидати напругу", en: "Almost at once — I can drop tension quickly" }, score: 5 },
  ]},
];


// Какая часть каждого доп. вопроса примешивается к каждой системе
const HORMONE_CROSS_AFFECTS = {
  energy:    { dopamine: 0.35, cortisol: 0.35, acetylcholine: 0.3 },
  selfworth: { serotonin: 0.5, oxytocin: 0.5 },
  recovery:  { gaba: 0.35, testosterone: 0.3, cortisol: 0.35 },
};

// Взвешенный итог по системе: своя прямая оценка + доля смежных доп. вопросов.
// Это и даёт нецелые/некруглые проценты вместо шага 25%.
function computeHormoneScores(mainScores, crossScores) {
  const result = {};
  Object.keys(mainScores).forEach(hKey => {
    let weightedSum = mainScores[hKey];
    let weightTotal = 1;
    Object.entries(HORMONE_CROSS_AFFECTS).forEach(([crossKey, affects]) => {
      const w = affects[hKey];
      if (w && crossScores[crossKey] !== undefined) {
        weightedSum += crossScores[crossKey] * w;
        weightTotal += w;
      }
    });
    result[hKey] = weightedSum / weightTotal;
  });
  return result;
}

// Тексты по каждой системе, индекс = score-1 (1..5)
const HORMONE_LEVEL_TEXTS = {
  dopamine: [
    { ru: "Дни идут по нулям — хочется, но не за что зацепиться. Так дофаминовая система выгорает: слишком много быстрых стимулов и слишком мало настоящего интереса.", uk: "Дні йдуть по нулях — хочеться, але немає за що зачепитися. Так дофамінова система вигорає: занадто багато швидких стимулів і занадто мало справжнього інтересу.", en: "Days go at zero — you want something, but nothing to grab onto. That's how the dopamine system burns out: too many quick stimuli and too little real interest." },
    { ru: "Желание где-то рядом, но плохо ловится. Тело просит движения, а ум не подсказывает куда.", uk: "Бажання десь поруч, але погано ловиться. Тіло просить руху, а розум не підказує куди.", en: "Desire is nearby but hard to catch. The body asks for movement; the mind doesn't say where." },
    { ru: "Идеи приходят, но быстро остывают — начать легче, чем довести до конца.", uk: "Ідеї приходять, але швидко остигають — почати легше, ніж довести до кінця.", en: "Ideas come but cool quickly — starting is easier than finishing." },
    { ru: "Драйв есть, просто иногда трудно сделать первый шаг. Обычно хватает одного небольшого действия, чтобы включиться.", uk: "Драйв є, просто іноді важко зробити перший крок. Зазвичай вистачає однієї невеликої дії, щоб увімкнутися.", en: "Drive is there; sometimes the first step is hard. Usually one small action is enough to switch on." },
    { ru: "Ты легко находишь, чем зажечься, и держишь интерес дольше большинства. Редкое и ценное состояние.", uk: "Ти легко знаходиш, чим запалитися, і тримаєш інтерес довше за більшість. Рідкісний і цінний стан.", en: "You easily find something to catch fire with and hold interest longer than most. A rare and valuable state." },
  ],
  serotonin: [
    { ru: "Внутренний голос слишком строг — критика идёт впереди любого действия.", uk: "Внутрішній голос занадто строгий — критика йде попереду будь-якої дії.", en: "The inner voice is too strict — criticism goes ahead of any action." },
    { ru: "Часто ищешь подтверждения снаружи, потому что внутри не хватает опоры.", uk: "Часто шукаєш підтвердження ззовні, бо всередині не вистачає опори.", en: "You often seek confirmation outside because support is missing inside." },
    { ru: "В целом ты в порядке с собой, но неуверенность заходит в гости чаще, чем хотелось бы.", uk: "Загалом ти в порядку з собою, але невпевненість заходить у гості частіше, ніж хотілося б.", en: "Overall you're fine with yourself, but uncertainty visits more often than you'd like." },
    { ru: "Ты принимаешь себя таким(ой), какой(ая) есть — без розовых очков, но и без самобичевания.", uk: "Ти приймаєш себе таким(ою), який(а) є — без рожевих окулярів, але і без самобичування.", en: "You accept yourself as you are — without rose glasses, but also without self-flagellation." },
    { ru: "Уважение к себе — не поза, а фон, на котором держится всё остальное.", uk: "Повага до себе — не поза, а фон, на якому тримається все інше.", en: "Respect for yourself is not a pose, but the background everything else rests on." },
  ],
  oxytocin: [
    { ru: "Доверие сейчас — дорогая валюта, и её почти не осталось. Это защита, но она же и изоляция.", uk: "Довіра зараз — дорога валюта, і її майже не залишилось. Це захист, але вона ж і ізоляція.", en: "Trust is expensive currency now, and almost none is left. Protection — and also isolation." },
    { ru: "Близких немного, дистанция — привычный способ не обжечься.", uk: "Близьких небагато, дистанція — звичний спосіб не обпектися.", en: "Few close people; distance is a familiar way not to get burned." },
    { ru: "Ты выбираешь, кому открыться, и это разумно — но иногда осторожность становится стеной.", uk: "Ти обираєш, кому відкритися, і це розумно — але іноді обережність стає стіною.", en: "You choose whom to open to, and that's wise — but sometimes caution becomes a wall." },
    { ru: "Люди даются легко, контакт не требует усилий — редкий ресурс.", uk: "Люди даються легко, контакт не потребує зусиль — рідкісний ресурс.", en: "People come easily; contact needs no effort — a rare resource." },
    { ru: "Тепло от окружающих не только чувствуется, но и подпитывает — система работает в плюс.", uk: "Тепло від оточення не лише відчувається, а й підживлює — система працює в плюс.", en: "Warmth from others is not only felt but nourishes — the system runs in surplus." },
  ],
  cortisol: [
    { ru: "Постоянно на взводе — тело давно не в покое, и это не характер, а состояние, которое требует внимания.", uk: "Постійно на взводі — тіло давно не в спокої, і це не характер, а стан, який потребує уваги.", en: "Constantly on edge — the body hasn't rested in a long time; this is a state that needs attention, not character." },
    { ru: "Тревога и усталость приходят часто, расслабиться получается с трудом.", uk: "Тривога і втома приходять часто, розслабитися виходить насилу.", en: "Anxiety and fatigue come often; relaxing is hard." },
    { ru: "Напряжение есть, но ты держишь его под контролем — пока.", uk: "Напруга є, але ти тримаєш її під контролем — поки.", en: "Tension is there, but you keep it under control — for now." },
    { ru: "Тревога заходит редко и быстро отпускает — хороший знак саморегуляции.", uk: "Тривога заходить рідко і швидко відпускає — хороший знак саморегуляції.", en: "Anxiety visits rarely and lets go quickly — a good sign of self-regulation." },
    { ru: "Спокойствие — твоё естественное состояние, а не результат усилий.", uk: "Спокій — твій природний стан, а не результат зусиль.", en: "Calm is your natural state, not the result of effort." },
  ],
  gaba: [
    { ru: "Бессонница выматывает — просыпаешься уже уставшим(ей), будто и не спал(а).", uk: "Безсоння виснажує — прокидаєшся вже втомленим(ою), ніби й не спав(ла).", en: "Insomnia drains you — you wake already tired, as if you never slept." },
    { ru: "Сон поверхностный, тело не до конца отпускает день.", uk: "Сон поверхневий, тіло не до кінця відпускає день.", en: "Sleep is shallow; the body doesn't fully release the day." },
    { ru: "Иногда трудно заснуть, но в целом система тормозит нормально.", uk: "Іноді важко заснути, але загалом система гальмує нормально.", en: "Sometimes hard to fall asleep, but overall the system brakes normally." },
    { ru: "Засыпаешь без борьбы, изредка просыпаешься — стабильная база.", uk: "Засинаєш без боротьби, зрідка прокидаєшся — стабільна база.", en: "You fall asleep without a fight, rarely wake — a stable base." },
    { ru: "Сон крепкий и быстрый — нервная система умеет вовремя выключаться.", uk: "Сон міцний і швидкий — нервова система вміє вчасно вимикатися.", en: "Sleep is deep and quick — the nervous system knows how to switch off in time." },
  ],
  testosterone: [
    { ru: "Страх идёт впереди действия — веры в свои силы сейчас не хватает.", uk: "Страх іде попереду дії — віри у свої сили зараз не вистачає.", en: "Fear goes ahead of action — faith in your strength is short right now." },
    { ru: "Ты пробуешь, но сдаёшься быстрее, чем мог(ла) бы.", uk: "Ти пробуєш, але здаєшся швидше, ніж міг(ла) б.", en: "You try, but give up sooner than you could." },
    { ru: "Иногда хватает воли пройти препятствие, иногда нет — зависит от дня.", uk: "Іноді вистачає волі пройти перешкоду, іноді ні — залежить від дня.", en: "Sometimes will is enough to clear the obstacle, sometimes not — depends on the day." },
    { ru: "Обычно идёшь до конца, даже когда страшно — воля работает.", uk: "Зазвичай ідеш до кінця, навіть коли страшно — воля працює.", en: "Usually you go all the way even when scared — will works." },
    { ru: "Вызовы зажигают, а не пугают — редкий и сильный ресурс.", uk: "Виклики запалюють, а не лякають — рідкісний і сильний ресурс.", en: "Challenges light you up rather than scare you — a rare and strong resource." },
  ],
  acetylcholine: [
    { ru: "В голове туман — сосредоточиться почти невозможно, ясности нет.", uk: "У голові туман — зосередитися майже неможливо, ясності немає.", en: "Fog in the head — focus is almost impossible; no clarity." },
    { ru: "Внимание ускользает, удержать фокус тяжело.", uk: "Увага вислизає, утримати фокус важко.", en: "Attention slips; holding focus is hard." },
    { ru: "Средний уровень — ясность бывает, но не всегда по заказу.", uk: "Середній рівень — ясність буває, але не завжди на замовлення.", en: "Average level — clarity comes, but not always on demand." },
    { ru: "Мысли обычно ясные, можешь погрузиться в работу.", uk: "Думки зазвичай ясні, можеш зануритися в роботу.", en: "Thoughts are usually clear; you can dive into work." },
    { ru: "Ум острый, фокус держится легко — это сильная сторона.", uk: "Розум гострий, фокус тримається легко — це сильна сторона.", en: "Mind is sharp; focus holds easily — a strong side." },
  ],
};


const HORMONE_ADVICE = {
  dopamine: {
    label: { ru: "Верни телу маленькие победы", uk: "Поверни тілу маленькі перемоги", en: "Give the body small wins" },
    steps: [
      { ru: "Разбей любое дело на шаг, который занимает меньше 5 минут — начало часто тяжелее самого дела.", uk: "Розбий будь-яку справу на крок, що займає менше 5 хвилин — початок часто важчий за саму справу.", en: "Break any task into a step under 5 minutes — starting is often harder than the task itself." },
      { ru: "Убери один источник быстрого дофамина на день (короткие видео, лента) и посмотри, что захочется взамен.", uk: "Прибери одне джерело швидкого дофаміну на день (короткі відео, стрічка) і подивись, що захочеться замість.", en: "Remove one quick-dopamine source for a day (short videos, feed) and see what you want instead." },
      { ru: "Отмечай сделанное, а не только планы — мозгу нужно подтверждение результата.", uk: "Відмічай зроблене, а не лише плани — мозку потрібне підтвердження результату.", en: "Mark what is done, not only plans — the brain needs proof of a result." },
      { ru: "Пройди тест «Найти свой чай» — иногда физический ритуал возвращает интерес быстрее, чем воля.", uk: "Пройди тест «Знайти свій чай» — іноді фізичний ритуал повертає інтерес швидше, ніж воля.", en: "Take the 'Find your tea' test — sometimes a physical ritual returns interest faster than willpower." },
    ],
    duration: { ru: "1–2 недели наблюдения · без резких решений", uk: "1–2 тижні спостереження · без різких рішень", en: "1–2 weeks of observation · no abrupt decisions" },
  },
  serotonin: {
    label: { ru: "Тренируй внутреннюю опору, а не внешнее одобрение", uk: "Тренуй внутрішню опору, а не зовнішнє схвалення", en: "Train inner support, not outer approval" },
    steps: [
      { ru: "Раз в день фиксируй одну вещь, которую сделал(а) хорошо — без «но» и оговорок.", uk: "Раз на день фіксуй одну річ, яку зробив(ла) добре — без «але» і застережень.", en: "Once a day note one thing you did well — without 'but' or caveats." },
      { ru: "Замечай момент, когда ищешь подтверждения у других, и спрашивай: а что думаю я сам(а)?", uk: "Помічай момент, коли шукаєш підтвердження в інших, і питай: а що думаю я сам(а)?", en: "Notice when you seek confirmation from others and ask: what do I think myself?" },
      { ru: "Сократи время в местах, где сравнение с другими включается автоматически.", uk: "Скороти час у місцях, де порівняння з іншими вмикається автоматично.", en: "Cut time in places where comparison with others switches on automatically." },
      { ru: "Говори с собой так, как говорил(а) бы с близким другом — мягче, чем привычный внутренний критик.", uk: "Говори з собою так, як говорив(ла) би з близьким другом — м'якше, ніж звичний внутрішній критик.", en: "Speak to yourself as you would to a close friend — softer than the usual inner critic." },
    ],
    duration: { ru: "2–4 недели · опора растёт медленно", uk: "2–4 тижні · опора росте повільно", en: "2–4 weeks · support grows slowly" },
  },
  oxytocin: {
    label: { ru: "Открывайся понемногу, а не сразу", uk: "Відкривайся потроху, а не одразу", en: "Open a little at a time, not all at once" },
    steps: [
      { ru: "Выбери одного человека и сделай маленький шаг навстречу — не признание, а просто внимание.", uk: "Обери одну людину і зроби маленький крок назустріч — не зізнання, а просто увага.", en: "Choose one person and take a small step toward them — not a confession, just attention." },
      { ru: "Замечай момент, когда включается защита в безопасной ситуации — это сигнал, а не факт об угрозе.", uk: "Помічай момент, коли вмикається захист у безпечній ситуації — це сигнал, а не факт про загрозу.", en: "Notice when defense switches on in a safe situation — a signal, not a fact about threat." },
      { ru: "Живой контакт (звонок, встреча) работает на эту систему сильнее переписки.", uk: "Живий контакт (дзвінок, зустріч) працює на цю систему сильніше за переписку.", en: "Live contact (call, meeting) works on this system more than messaging." },
      { ru: "Отмечай в «Мой день сегодня» моменты, когда тепло от людей всё же почувствовалось.", uk: "Відмічай у «Мій день сьогодні» моменти, коли тепло від людей усе ж відчулося.", en: "Note in 'My day today' moments when warmth from people was still felt." },
    ],
    duration: { ru: "Постепенно · доверие не форсируется", uk: "Поступово · довіра не форсується", en: "Gradually · trust cannot be forced" },
  },
  cortisol: {
    label: { ru: "Снижай фон, а не борись со стрессом в моменте", uk: "Знижуй фон, а не борись зі стресом у моменті", en: "Lower the baseline, don't fight stress in the moment" },
    steps: [
      { ru: "Найди 10 минут в день без задач и уведомлений — не награда, а необходимость.", uk: "Знайди 10 хвилин на день без задач і сповіщень — не нагорода, а необхідність.", en: "Find 10 minutes a day without tasks or notifications — not a reward, a necessity." },
      { ru: "Заметь, где тело держит напряжение (плечи, челюсть), и сознательно отпусти пару раз в день.", uk: "Поміть, де тіло тримає напругу (плечі, щелепа), і свідомо відпусти кілька разів на день.", en: "Notice where the body holds tension (shoulders, jaw) and consciously release a few times a day." },
      { ru: "Дыхательные практики из раздела «Моя практика» напрямую снижают напряжение за минуты.", uk: "Дихальні практики з розділу «Моя практика» напряму знижують напругу за хвилини.", en: "Breath practices from 'My practice' lower tension in minutes." },
      { ru: "Сократи источники фонового стресса, которые можно контролировать — начни с одного.", uk: "Скороти джерела фонового стресу, які можна контролювати — почни з одного.", en: "Cut background stress sources you can control — start with one." },
    ],
    duration: { ru: "Начни сегодня · эффект накопительный", uk: "Почни сьогодні · ефект накопичувальний", en: "Start today · cumulative effect" },
  },
  gaba: {
    label: { ru: "Готовь нервную систему ко сну заранее", uk: "Готуй нервову систему до сну заздалегідь", en: "Prepare the nervous system for sleep in advance" },
    steps: [
      { ru: "За час до сна убери яркий свет и экраны — это прямой сигнал телу тормозить.", uk: "За годину до сну прибери яскраве світло і екрани — це прямий сигнал тілу гальмувати.", en: "An hour before sleep remove bright light and screens — a direct signal for the body to slow down." },
      { ru: "Если мысли крутятся вечером — выпиши их на бумагу, не держи в голове.", uk: "Якщо думки крутяться ввечері — випиши їх на папір, не тримай у голові.", en: "If thoughts spin in the evening — write them on paper; don't keep them in the head." },
      { ru: "Тёплый чай без кофеина за 30–40 минут до сна — простой, но рабочий ритуал.", uk: "Теплий чай без кофеїну за 30–40 хвилин до сну — простий, але робочий ритуал.", en: "Warm caffeine-free tea 30–40 minutes before sleep — simple but effective ritual." },
      { ru: "Попробуй дыхательную практику перед сном из раздела «Моя практика».", uk: "Спробуй дихальну практику перед сном з розділу «Моя практика».", en: "Try a breath practice before sleep from 'My practice'." },
    ],
    duration: { ru: "3–7 дней до заметного эффекта", uk: "3–7 днів до помітного ефекту", en: "3–7 days until a noticeable effect" },
  },
  testosterone: {
    label: { ru: "Тренируй волю на маленьких препятствиях", uk: "Тренуй волю на маленьких перешкодах", en: "Train will on small obstacles" },
    steps: [
      { ru: "Выбери одно небольшое неприятное дело и сделай его сегодня, не откладывая.", uk: "Обери одну невелику неприємну справу і зроби її сьогодні, не відкладаючи.", en: "Pick one small unpleasant task and do it today without postponing." },
      { ru: "Замечай момент отступления — часто препятствие меньше, чем кажется в голове.", uk: "Помічай момент відступу — часто перешкода менша, ніж здається в голові.", en: "Notice the moment of retreat — often the obstacle is smaller than it seems in the head." },
      { ru: "Физическая нагрузка — один из самых прямых способов поддержать эту систему.", uk: "Фізичне навантаження — один із найпряміших способів підтримати цю систему.", en: "Physical load is one of the most direct ways to support this system." },
      { ru: "Не жди уверенности перед действием — она чаще приходит после первого шага.", uk: "Не чекай впевненості перед дією — вона частіше приходить після першого кроку.", en: "Don't wait for confidence before acting — it more often comes after the first step." },
    ],
    duration: { ru: "Накопительно · через регулярные small wins", uk: "Накопичувально · через регулярні small wins", en: "Cumulative · through regular small wins" },
  },
  acetylcholine: {
    label: { ru: "Дай мозгу паузы, а не больше усилий", uk: "Дай мозку паузи, а не більше зусиль", en: "Give the brain pauses, not more effort" },
    steps: [
      { ru: "Работай короткими блоками (25–40 минут) с настоящим перерывом между ними.", uk: "Працюй короткими блоками (25–40 хвилин) зі справжньою перервою між ними.", en: "Work in short blocks (25–40 min) with a real break between them." },
      { ru: "Проверь сон и питание в первую очередь — эта система садится от них быстрее всего.", uk: "Перевір сон і харчування в першу чергу — ця система сідає від них найшвидше.", en: "Check sleep and food first — this system drops from them fastest." },
      { ru: "Убери фоновый шум и уведомления на время сфокусированной работы.", uk: "Прибери фоновий шум і сповіщення на час сфокусованої роботи.", en: "Remove background noise and notifications during focused work." },
      { ru: "Одна медитативная пауза в середине дня возвращает ясность лучше, чем ещё одна чашка кофе.", uk: "Одна медитативна пауза в середині дня повертає ясність краще, ніж ще одна чашка кави.", en: "One meditative pause mid-day returns clarity better than another cup of coffee." },
    ],
    duration: { ru: "Эффект заметен за несколько дней", uk: "Ефект помітний за кілька днів", en: "Effect is noticeable in a few days" },
  },
};


// ─────────────────────────────────────────────
// ГОРМОНЫ: РОЛЬ / ПРИЗНАКИ ДЕФИЦИТА / КАК ПОДНЯТЬ ЕСТЕСТВЕННО
// (биологический угол — сон, свет, еда, тренировки; дополняет
// поведенческие HORMONE_ADVICE выше)
// ─────────────────────────────────────────────
const HORMONE_INFO = {
  dopamine: {
    role: { ru: "Мотивация, предвкушение награды, фокус, желание действовать. Именно он даёт ощущение «я хочу и могу».", uk: "Мотивація, передчуття нагороди, фокус, бажання діяти. Саме він дає відчуття «я хочу і можу».", en: "Motivation, anticipation of reward, focus, the drive to act. It's what gives the feeling 'I want to and I can'." },
    signs: { ru: "Апатия, прокрастинация, трудности с концентрацией, зависимость от быстрых удовольствий (соцсети, еда, короткие видео).", uk: "Апатія, прокрастинація, труднощі з концентрацією, залежність від швидких задоволень (соцмережі, їжа, короткі відео).", en: "Apathy, procrastination, trouble concentrating, dependence on quick pleasures (social media, food, short videos)." },
    raise: [
      { ru: "Ставь и закрывай небольшие цели — мозг любит «маленькие победы»", uk: "Став і закривай невеликі цілі — мозок любить «маленькі перемоги»", en: "Set and complete small goals — the brain loves 'small wins'" },
      { ru: "Силовые и любые регулярные тренировки", uk: "Силові й будь-які регулярні тренування", en: "Strength training and any regular exercise" },
      { ru: "Продукты с тирозином: яйца, мясо, бобовые, орехи, сыр, творог", uk: "Продукти з тирозином: яйця, м'ясо, бобові, горіхи, сир, творог", en: "Tyrosine-rich food: eggs, meat, legumes, nuts, cheese, cottage cheese" },
      { ru: "Хороший сон и утренний солнечный свет", uk: "Хороший сон і ранкове сонячне світло", en: "Good sleep and morning sunlight" },
      { ru: "Ограничь «дешёвый дофамин»: скроллинг, сладкое, постоянные уведомления", uk: "Обмеж «дешевий дофамін»: скролінг, солодке, постійні сповіщення", en: "Limit 'cheap dopamine': scrolling, sweets, constant notifications" },
    ],
  },
  serotonin: {
    role: { ru: "Настроение, сон, аппетит, снижает тревогу и раздражительность. Около 90% вырабатывается в кишечнике.", uk: "Настрій, сон, апетит, знижує тривогу і дратівливість. Близько 90% виробляється в кишечнику.", en: "Mood, sleep, appetite; lowers anxiety and irritability. About 90% is produced in the gut." },
    signs: { ru: "Тревога, внутреннее напряжение, проблемы со сном, тяга к сладкому и углеводам, ощущение «всё не так».", uk: "Тривога, внутрішнє напруження, проблеми зі сном, тяга до солодкого і вуглеводів, відчуття «все не так».", en: "Anxiety, inner tension, sleep problems, cravings for sweets and carbs, a sense that 'nothing is right'." },
    raise: [
      { ru: "Утренний яркий солнечный свет + ежедневные прогулки", uk: "Ранкове яскраве сонячне світло + щоденні прогулянки", en: "Bright morning sunlight + daily walks" },
      { ru: "Триптофан: индейка, курица, яйца, сыр, бананы, орехи + сложные углеводы", uk: "Триптофан: індичка, курка, яйця, сир, банани, горіхи + складні вуглеводи", en: "Tryptophan: turkey, chicken, eggs, cheese, bananas, nuts + complex carbs" },
      { ru: "Регулярные умеренные тренировки", uk: "Регулярні помірні тренування", en: "Regular moderate exercise" },
      { ru: "Здоровый кишечник: клетчатка, кефир, квашеная капуста", uk: "Здоровий кишечник: клітковина, кефір, квашена капуста", en: "Healthy gut: fiber, kefir, fermented food" },
      { ru: "Сон 7–9 часов и меньше хронического стресса", uk: "Сон 7–9 годин і менше хронічного стресу", en: "7–9 hours of sleep and less chronic stress" },
    ],
  },
  oxytocin: {
    role: { ru: "Усиливает привязанность, эмпатию, доверие, снижает стресс и чувство одиночества. Важен для отношений.", uk: "Посилює прив'язаність, емпатію, довіру, знижує стрес і почуття самотності. Важливий для стосунків.", en: "Strengthens attachment, empathy, trust; lowers stress and loneliness. Important for relationships." },
    signs: { ru: "Мало доверия, ощущение одиночества, дистанция в отношениях, трудно сближаться.", uk: "Мало довіри, відчуття самотності, дистанція у стосунках, важко зближуватись.", en: "Low trust, a sense of loneliness, distance in relationships, hard to get close to people." },
    raise: [
      { ru: "Физический контакт: объятия, массаж, рукопожатия", uk: "Фізичний контакт: обійми, масаж, рукостискання", en: "Physical contact: hugs, massage, handshakes" },
      { ru: "Качественное общение и время с близкими людьми", uk: "Якісне спілкування і час із близькими людьми", en: "Quality time and conversation with close people" },
      { ru: "Акты доброты и помощь другим", uk: "Акти доброти і допомога іншим", en: "Acts of kindness and helping others" },
      { ru: "Совместные активности и чувство принадлежности к группе", uk: "Спільні активності і відчуття приналежності до групи", en: "Shared activities and a sense of belonging to a group" },
    ],
  },
  cortisol: {
    role: { ru: "Помогает реагировать на стресс, поддерживает сахар в крови и давление. При хроническом повышении — разрушителен: подавляет тестостерон, серотонин, сон.", uk: "Допомагає реагувати на стрес, підтримує цукор у крові і тиск. При хронічному підвищенні — руйнівний: пригнічує тестостерон, серотонін, сон.", en: "Helps respond to stress, supports blood sugar and pressure. When chronically elevated it's destructive: suppresses testosterone, serotonin, sleep." },
    signs: { ru: "Жир на животе, тяга к сладкому, плохой сон, усталость с утра, тревога, снижение иммунитета.", uk: "Жир на животі, тяга до солодкого, поганий сон, втома з ранку, тривога, зниження імунітету.", en: "Belly fat, sugar cravings, poor sleep, morning fatigue, anxiety, weaker immunity." },
    raise: [
      { ru: "Качественный сон и стабильный режим", uk: "Якісний сон і стабільний режим", en: "Quality sleep and a stable routine" },
      { ru: "Дыхательные практики, медитация, прогулки на природе", uk: "Дихальні практики, медитація, прогулянки на природі", en: "Breathwork, meditation, walks in nature" },
      { ru: "Не перетренировываться", uk: "Не перетреновуватись", en: "Avoid overtraining" },
      { ru: "Стабильный сахар в крови: белок + жиры + клетчатка", uk: "Стабільний цукор у крові: білок + жири + клітковина", en: "Stable blood sugar: protein + fats + fiber" },
      { ru: "Ограничь кофеин после обеда", uk: "Обмеж кофеїн після обіду", en: "Limit caffeine after midday" },
    ],
  },
  gaba: {
    role: { ru: "Главный тормозной нейромедиатор. Успокаивает нервную систему, снижает возбуждение, тревогу и мышечное напряжение.", uk: "Головний гальмівний нейромедіатор. Заспокоює нервову систему, знижує збудження, тривогу і м'язову напругу.", en: "The main inhibitory neurotransmitter. Calms the nervous system, lowers arousal, anxiety and muscle tension." },
    signs: { ru: "Внутреннее напряжение, «не могу расслабиться», раздражительность, поверхностный сон.", uk: "Внутрішнє напруження, «не можу розслабитись», дратівливість, поверхневий сон.", en: "Inner tension, 'can't relax', irritability, shallow sleep." },
    raise: [
      { ru: "Качественный глубокий сон", uk: "Якісний глибокий сон", en: "Quality deep sleep" },
      { ru: "Магний (особенно глицинат или треонат)", uk: "Магній (особливо гліцинат або треонат)", en: "Magnesium (especially glycinate or threonate)" },
      { ru: "Дыхательные практики, йога, медитация", uk: "Дихальні практики, йога, медитація", en: "Breathwork, yoga, meditation" },
      { ru: "Меньше стимуляции вечером: кофеин, экраны", uk: "Менше стимуляції ввечері: кофеїн, екрани", en: "Less evening stimulation: caffeine, screens" },
    ],
  },
  testosterone: {
    role: { ru: "Рост мышц и силы, либидо, уверенность, энергия, мотивация. Важен и для мужчин, и для женщин.", uk: "Зростання м'язів і сили, лібідо, впевненість, енергія, мотивація. Важливий і для чоловіків, і для жінок.", en: "Muscle and strength growth, libido, confidence, energy, motivation. Important for both men and women." },
    signs: { ru: "Усталость, снижение либидо, набор жира (особенно на животе), потеря мышц, раздражительность или апатия.", uk: "Втома, зниження лібідо, набір жиру (особливо на животі), втрата м'язів, дратівливість або апатія.", en: "Fatigue, lower libido, gaining fat (especially belly), muscle loss, irritability or apathy." },
    raise: [
      { ru: "Силовые тренировки 3–4 раза в неделю (приседания, становая, жим, подтягивания)", uk: "Силові тренування 3–4 рази на тиждень (присідання, станова, жим, підтягування)", en: "Strength training 3–4x/week (squats, deadlift, press, pull-ups)" },
      { ru: "Сон 7–9 часов — тестостерон активно вырабатывается в глубоком сне", uk: "Сон 7–9 годин — тестостерон активно виробляється в глибокому сні", en: "7–9 hours of sleep — testosterone is produced mainly in deep sleep" },
      { ru: "Снижение избыточного жира (жировая ткань превращает тестостерон в эстроген)", uk: "Зниження надлишкового жиру (жирова тканина перетворює тестостерон на естроген)", en: "Reducing excess body fat (fat tissue converts testosterone into estrogen)" },
      { ru: "Цинк, магний, витамин D, достаточно холестерина в рационе", uk: "Цинк, магній, вітамін D, достатньо холестерину в раціоні", en: "Zinc, magnesium, vitamin D, enough dietary cholesterol" },
      { ru: "Управление стрессом — высокий кортизол подавляет тестостерон", uk: "Управління стресом — високий кортизол пригнічує тестостерон", en: "Managing stress — high cortisol suppresses testosterone" },
    ],
  },
  acetylcholine: {
    role: { ru: "Отвечает за память, обучение, концентрацию, ясность ума и когнитивные функции.", uk: "Відповідає за пам'ять, навчання, концентрацію, ясність розуму і когнітивні функції.", en: "Responsible for memory, learning, concentration, mental clarity and cognitive function." },
    signs: { ru: "Туман в голове, трудно сосредоточиться, забывчивость, рассеянное внимание.", uk: "Туман у голові, важко зосередитись, забудькуватість, розсіяна увага.", en: "Brain fog, trouble concentrating, forgetfulness, scattered attention." },
    raise: [
      { ru: "Холин в питании: яйца, печень, жирная рыба", uk: "Холін у харчуванні: яйця, печінка, жирна риба", en: "Dietary choline: eggs, liver, fatty fish" },
      { ru: "Умственная нагрузка + регулярная физическая активность", uk: "Розумове навантаження + регулярна фізична активність", en: "Mental effort + regular physical activity" },
      { ru: "Качественный сон", uk: "Якісний сон", en: "Quality sleep" },
    ],
  },
};

const RESPONSIBILITY_DISCLAIMER = { ru: "Это ориентиры на основе общих научных данных и практик, а не медицинская консультация и не диагноз. Перед серьёзными изменениями — особенно добавками — сдай анализы и посоветуйся со специалистом. Решения о своём здоровье и их результат — на тебе.", uk: "Це орієнтири на основі загальних наукових даних і практик, а не медична консультація і не діагноз. Перед серйозними змінами — особливо добавками — здай аналізи і порадься з фахівцем. Рішення про своє здоров'я і їх результат — на тобі.", en: "These are pointers based on general research and practice — not medical advice or a diagnosis. Before any serious change, especially supplements, get tested and consult a specialist. Decisions about your health, and their outcome, are yours." };

function HormoneInfoBlock({ hormoneKey, color }) {
  const { tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [open, setOpen] = useState(false);
  const info = HORMONE_INFO[hormoneKey];
  if (!info) return null;
  return (
    <div style={{ marginTop: "6px" }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", color: color || c.accent, fontSize: "12px", cursor: "pointer", padding: "4px 0", fontFamily: "'Georgia',serif", display: "flex", alignItems: "center", gap: "5px" }}>
        <span>{open ? "▾" : "▸"}</span>
        <span>{tx({ ru: "Что это и как поднять", uk: "Що це і як підняти", en: "What it is and how to raise it" })}</span>
      </button>
      {open && (
        <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: `1px solid ${c.line}`, borderRadius: "10px", marginTop: "4px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "12px", color: c.inkMuted, lineHeight: 1.6 }}>{tx(info.role)}</p>
          <p style={{ margin: "0 0 8px", fontSize: "11px", color: c.inkSoft, lineHeight: 1.6 }}>
            <span style={{ color: color || c.accent }}>{tx({ ru: "Признаки дефицита: ", uk: "Ознаки дефіциту: ", en: "Signs of deficiency: " })}</span>
            {tx(info.signs)}
          </p>
          <p style={{ margin: "0 0 6px", fontSize: "11px", letterSpacing: "0.08em", color: c.inkSoft }}>{tx({ ru: "КАК ПОДНЯТЬ ЕСТЕСТВЕННО", uk: "ЯК ПІДНЯТИ ПРИРОДНО", en: "HOW TO RAISE IT NATURALLY" })}</p>
          {info.raise.map((item, i) => (
            <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: c.inkMuted, lineHeight: 1.6 }}>· {tx(item)}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function HormoneScreen({ onBack, onGoCompass, onGoGuide }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengePresetHormone, setChallengePresetHormone] = useState(null);
  const ALL_Q = [...HORMONE_QUESTIONS, ...HORMONE_CROSS_QUESTIONS];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  useEffect(() => { statEvent("hormones"); }, []);
  if (showChallenge) return <ChallengeScreen onBack={() => setShowChallenge(false)} hormoneMode presetHormone={challengePresetHormone} />;
  if (showNotes) return <QuietNotes onBack={() => setShowNotes(false)} />;
  const q = ALL_Q[current];

  const handleNext = () => {
    if (selected === null || animating) return;
    setAnimating(true);
    const na = [...answers, { key: q.key, score: selected }];
    setTimeout(() => {
      setAnswers(na); setSelected(null);
      if (current + 1 >= ALL_Q.length) {
        setFinished(true);
        const main = {};
        const cross = {};
        na.forEach(a => {
          if (HORMONE_META[a.key]) main[a.key] = a.score;
          else cross[a.key] = a.score;
        });
        const finalScores = computeHormoneScores(main, cross);
        const avgPct = Math.round(
          Object.values(finalScores).reduce((s, v) => s + ((v - 1) / 4 * 100), 0) / Object.keys(finalScores).length
        );
        pushHistory("hormones_history", { main, cross, avgPct });
      } else { setCurrent(c => c + 1); }
      setAnimating(false);
    }, 300);
  };

  if (finished) {
    const main = {};
    const cross = {};
    answers.forEach(a => {
      if (HORMONE_META[a.key]) main[a.key] = a.score;
      else cross[a.key] = a.score;
    });
    const finalScores = computeHormoneScores(main, cross);
    const results = HORMONE_QUESTIONS.map(({ key }) => {
      const score = finalScores[key];
      const pct = Math.round((score - 1) / 4 * 100);
      const bucket = Math.min(5, Math.max(1, Math.round(score)));
      return {
        key,
        meta: HORMONE_META[key],
        score,
        pct,
        hiIndex: pct <= 25 ? 0 : pct <= 50 ? 1 : pct <= 75 ? 2 : 3,
        text: tx(HORMONE_LEVEL_TEXTS[key][bucket - 1]),
      };
    });
    const weak = results.filter(r => r.pct <= 37.5);
    const weakest = results.reduce((min, r) => (r.pct < min.pct ? r : min), results[0]);
    const advice = HORMONE_ADVICE[weakest.key];
    let summary;
    if (weak.length === 0) {
      summary = tx({ ru: "Критичных просадок нет — все семь систем держатся в рабочей зоне. Задача не в том, чтобы что-то чинить, а в том, чтобы удержать это состояние.", uk: "Критичних просідань немає — всі сім систем тримаються в робочій зоні. Завдання не в тому, щоб щось лагодити, а в тому, щоб утримати цей стан.", en: "No critical drops — all seven systems are holding in the working zone. The task isn't to fix something, it's to hold this state." });
    } else if (weak.length <= 2) {
      const linkWord = tx({ ru: weak.length === 1 ? "одно звено" : "пара звеньев", uk: weak.length === 1 ? "одна ланка" : "пара ланок", en: weak.length === 1 ? "one link" : "a couple of links" });
      const names = weak.map(r => tx(r.meta.name)).join(tx({ ru: " и ", uk: " і ", en: " and " }));
      summary = tx({ ru: `Просело ${linkWord} — ${names}. Системы связаны между собой, так что подтянуть одно часто помогает и соседним.`, uk: `Просіла ${linkWord} — ${names}. Системи пов'язані між собою, тож підтягнути одне часто допомагає й сусіднім.`, en: `${linkWord === "one link" ? "One link is" : "A couple of links are"} weak — ${names}. Systems are interconnected, so lifting one often helps the neighbors too.` });
    } else {
      summary = tx({ ru: "Просело сразу несколько систем, и они тянут друг друга вниз. Это не характер и не лень — это состояние, которое восстанавливается, но само не выправится.", uk: "Просіло одразу кілька систем, і вони тягнуть одна одну вниз. Це не характер і не лінь — це стан, який відновлюється, але сам не вирівняється.", en: "Several systems have dropped at once and are pulling each other down. This isn't a character trait or laziness — it's a state that can recover, but won't fix itself." });
    }
    const shareMsg = `Гормональный код 🧬\n${tx({ru:"Слабое звено",uk:"Слабка ланка",en:"Weak link"})}: ${tx(weakest.meta.name)}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;

    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={S.resultContainer}>
          <div style={S.sectionHead}>
            <p style={S.sectionTitle}>{t.hormoneCode}</p>
            <InfoButton text={tx({ ru: "«Семь систем, которые управляют мотивацией, спокойствием, сном и фокусом — по твоим ответам, не по анализам.»", uk: "«Сім систем, які керують мотивацією, спокоєм, сном і фокусом — за твоїми відповідями, не за аналізами.»", en: "«Seven systems that drive motivation, calm, sleep and focus — from your answers, not lab tests.»" })} />
          </div>
          <p style={{ margin: "0 0 18px", fontSize: "13px", color: c.inkMuted, lineHeight: 1.7, fontStyle: "italic" }}>«{summary}»</p>

          {results.map(r => (
            <div key={r.key} style={{ marginBottom: "14px" }}>
              <MetricBlock
                value={r.pct}
                rightName={tx(r.meta.name)}
                rightSub={tx(r.meta.short)}
                fillFrom="#241D14"
                fillTo={r.meta.color}
                dotColor={r.meta.color}
                numColor={r.meta.color}
                scaleLabels={[tx({ru:"низкий",uk:"низький",en:"low"}), tx({ru:"средний",uk:"середній",en:"medium"}), tx({ru:"хороший",uk:"хороший",en:"good"}), tx({ru:"высокий",uk:"високий",en:"high"})]}
                hiIndex={r.hiIndex}
                quote={`«${r.text}»`}
                animKey={`horm-${r.key}-${r.pct}`}
              />
              <HormoneInfoBlock hormoneKey={r.key} color={r.meta.color} />
              <button onClick={() => { setChallengePresetHormone(r.key); setShowChallenge(true); }} style={{ background: "none", border: "none", color: r.meta.color, fontSize: "11px", cursor: "pointer", padding: "4px 0 0", fontFamily: "'Georgia',serif", opacity: 0.85 }}>
                🧭 {tx({ ru: "Челлендж по этой системе", uk: "Челендж за цією системою", en: "Challenge for this system" })}
              </button>
            </div>
          ))}

          <div style={S.stepsBlock}>
            <p style={S.stepsTitle}>{tx({ru:"ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС",uk:"ЩО РОБИТИ ПРЯМО ЗАРАЗ",en:"WHAT TO DO RIGHT NOW"})} — {tx(weakest.meta.name).toUpperCase()}</p>
            {advice.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < advice.steps.length - 1 ? "12px" : "0" }}>
                <span style={{ fontSize: "11px", color: weakest.meta.color, flexShrink: 0, marginTop: "2px", minWidth: "16px" }}>{i + 1}.</span>
                <p style={{ margin: 0, fontSize: "13px", color: c.inkMuted, lineHeight: 1.7 }}>{tx(step)}</p>
              </div>
            ))}
            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${c.line}` }}>
              <p style={{ margin: 0, fontSize: "11px", color: c.inkSoft }}>⏱ {tx(advice.duration)}</p>
            </div>
          </div>

          <button onClick={() => { setChallengePresetHormone(weakest.key); setShowChallenge(true); }} style={{ width: "100%", padding: "14px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>🧭</span><span>{tx({ ru: "Пройти челлендж по этому направлению", uk: "Пройти челендж за цим напрямком", en: "Try a challenge for this direction" })}</span>
          </button>
          {onGoCompass && (
            <button onClick={onGoCompass} style={{ width: "100%", padding: "14px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span>🧭</span><span>{tx({ ru: "Узнать своё состояние подробнее в Компасе состояния", uk: "Дізнатись свій стан детальніше в Компасі стану", en: "Learn more about your state in the State compass" })}</span>
            </button>
          )}
          {onGoGuide && (
            <button onClick={onGoGuide} style={{ width: "100%", padding: "14px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span>🧬</span><span>{tx({ ru: "Всё о гормонах — гид по всем 7 системам", uk: "Все про гормони — гід по всіх 7 системах", en: "All about hormones — guide to all 7 systems" })}</span>
            </button>
          )}
          <button onClick={() => setShowNotes(true)} style={{ width: "100%", padding: "14px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>🌙</span><span>{t.notebook}</span>
          </button>
          <p style={{ margin: "14px 0 0", fontSize: "10.5px", color: c.inkSoft, lineHeight: 1.6, fontStyle: "italic" }}>{tx(RESPONSIBILITY_DISCLAIMER)}</p>

          <ShareButton text={shareMsg} />
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration: "none", display: "block", textAlign: "center", marginTop: "18px" }}>{t.goChannel}</a>
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false); }} style={S.ghostBtn}>{t.again}</button>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "10 вопросов, которые уточняют картину по семи системам — они управляют мотивацией, спокойствием, сном и фокусом. Отвечай первым, что откликается.", uk: "10 питань, які уточнюють картину по семи системах — вони керують мотивацією, спокоєм, сном і фокусом. Відповідай першим, що відгукується.", en: "10 questions that clarify the picture across seven systems — they govern motivation, calm, sleep and focus. Answer with whatever resonates first." })} />
      </div>
      <div style={S.quizProgress}><span style={S.quizCategory}>{tx(q.category)}</span><span style={S.quizCounter}>{current + 1} / {ALL_Q.length}</span></div>
      <div style={S.progressTrack}>{ALL_Q.map((_, i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />)}</div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition: "opacity 0.3s" }}>{tx(q.text)}</p>
      <div style={S.optionsList}>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(opt.score)} style={{ ...S.optionBtn, borderColor: selected === opt.score ? "#C8A97E" : "#2A2520", backgroundColor: selected === opt.score ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={S.optionRadio}>{selected === opt.score ? "◉" : "○"}</span>
            <span style={S.optionText}>{tx(opt.text)}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selected === null} style={{ ...S.primaryBtn, opacity: selected === null ? 0.3 : 1 }}>{current + 1 === ALL_Q.length ? t.resultBtn : t.next}</button>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ВСЁ О ГОРМОНАХ (информационный гид)
// ─────────────────────────────────────────────
function HormoneGuideScreen({ onBack, onGoTest }) {
  const { t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [showNotes, setShowNotes] = useState(false);
  if (showNotes) return <QuietNotes onBack={() => setShowNotes(false)} />;
  const keys = Object.keys(HORMONE_META);
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🧬</div>
        <p style={{ margin: "0 0 4px", fontSize: "11px", letterSpacing: "0.25em", color: c.accent }}>{tx({ ru: "ГИД", uk: "ГІД", en: "GUIDE" })}</p>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "normal", color: c.ink, letterSpacing: "0.04em" }}>{tx({ ru: "Всё о гормонах", uk: "Все про гормони", en: "All about your hormones" })}</h2>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: "13px", color: c.inkMuted, lineHeight: 1.7, fontStyle: "italic" }}>
        {tx({ ru: "Семь систем ниже управляют мотивацией, спокойствием, сном, близостью и фокусом. Они не работают по отдельности — просевший сон почти всегда тянет вниз и мотивацию, и настроение. Поэтому для продуктивной и приятной жизни важнее не «взвинтить» одну систему, а убрать то, что тянет вниз сразу несколько: обычно это сон, хронический стресс и постоянная стимуляция экранами.", uk: "Сім систем нижче керують мотивацією, спокоєм, сном, близькістю і фокусом. Вони не працюють окремо — просілий сон майже завжди тягне вниз і мотивацію, і настрій. Тому для продуктивного і приємного життя важливіше не «розкрутити» одну систему, а прибрати те, що тягне вниз одразу кілька: зазвичай це сон, хронічний стрес і постійна стимуляція екранами.", en: "The seven systems below drive motivation, calm, sleep, closeness and focus. They don't work in isolation — poor sleep almost always drags down motivation and mood too. So for a productive, pleasant life it matters more to remove what's dragging several systems down at once — usually sleep, chronic stress, and constant screen stimulation — than to try to max out any single one." })}
      </p>
      {keys.map(k => {
        const meta = HORMONE_META[k];
        const info = HORMONE_INFO[k];
        if (!info) return null;
        return (
          <div key={k} style={{ ...S.metricBlock, width: "100%", marginBottom: "14px", boxSizing: "border-box", borderLeft: `3px solid ${meta.color}` }}>
            <p style={{ margin: "0 0 2px", fontSize: "16px", color: meta.color, fontWeight: 600 }}>{tx(meta.name)}</p>
            <p style={{ margin: "0 0 10px", fontSize: "11px", color: c.inkSoft, fontStyle: "italic" }}>{tx(meta.short)}</p>
            <p style={{ margin: "0 0 8px", fontSize: "12px", color: c.inkMuted, lineHeight: 1.6 }}>{tx(info.role)}</p>
            <p style={{ margin: "0 0 10px", fontSize: "11px", color: c.inkSoft, lineHeight: 1.6 }}>
              <span style={{ color: meta.color }}>{tx({ ru: "Признаки дисбаланса: ", uk: "Ознаки дисбалансу: ", en: "Signs of imbalance: " })}</span>
              {tx(info.signs)}
            </p>
            <p style={{ margin: "0 0 6px", fontSize: "10.5px", letterSpacing: "0.08em", color: c.inkSoft }}>{tx({ ru: "КАК ПРИВЕСТИ В ПОРЯДОК", uk: "ЯК ПРИВЕСТИ ДО ЛАДУ", en: "HOW TO BRING IT INTO BALANCE" })}</p>
            {info.raise.map((item, i) => (
              <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: c.inkMuted, lineHeight: 1.6 }}>· {tx(item)}</p>
            ))}
          </div>
        );
      })}
      <p style={{ margin: "4px 0 18px", fontSize: "10.5px", color: c.inkSoft, lineHeight: 1.6, fontStyle: "italic" }}>{tx(RESPONSIBILITY_DISCLAIMER)}</p>
      {onGoTest && (
        <button onClick={onGoTest} style={{ ...S.ghostBtn, marginBottom: "10px" }}>🧬 {tx({ ru: "Пройти «Гормональный код» — узнать свои показатели", uk: "Пройти «Гормональний код» — дізнатись свої показники", en: "Take 'Hormonal code' — check your own levels" })}</button>
      )}
      <button onClick={() => setShowNotes(true)} style={S.ghostBtn}>🌙 {t.notebook}</button>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// СОВЕТЫ ПО ВЫГОРАНИЮ
// ─────────────────────────────────────────────
const BURNOUT_ADVICE = {
  none: {
    label: { ru: "Ты в ресурсе", uk: "Ти в ресурсі", en: "You're in resource" },
    color: "#7A9E7E",
    why: { ru: "Энергия есть, границы работают, смысл чувствуется. Это не «повезло» — это результат того, как ты относишься к себе. Задача сейчас — не потерять это.", uk: "Енергія є, межі працюють, сенс відчувається. Це не «пощастило» — це результат того, як ти ставишся до себе. Завдання зараз — не втратити це.", en: "Energy is there, boundaries work, meaning is felt. That's not luck — it's how you treat yourself. The task now is not to lose it." },
    steps: [
      { ru: "Замечай, что тебе помогает оставаться в ресурсе — и делай это намеренно, не только когда уже плохо.", uk: "Помічай, що допомагає залишатися в ресурсі — і роби це навмисно, не лише коли вже погано.", en: "Notice what helps you stay in resource — and do it on purpose, not only when things are already bad." },
      { ru: "Раз в неделю спрашивай себя: «Где я сейчас ближе всего к себе?» Это якорь.", uk: "Раз на тиждень питай себе: «Де я зараз найближче до себе?» Це якір.", en: "Once a week ask: 'Where am I closest to myself right now?' That's an anchor." },
      { ru: "Не жди кризиса, чтобы отдохнуть. Встраивай паузы в обычный ритм.", uk: "Не чекай кризи, щоб відпочити. Вбудовуй паузи в звичайний ритм.", en: "Don't wait for a crisis to rest. Build pauses into the normal rhythm." },
    ],
    duration: { ru: "поддерживающий режим · без срока", uk: "підтримувальний режим · без строку", en: "maintenance mode · no deadline" },
  },
  mild: {
    label: { ru: "Стоит замедлиться", uk: "Варто сповільнитися", en: "Worth slowing down" },
    color: "#C8A97E",
    why: { ru: "Усталость уже копится. Пока тело и психика ещё справляются — это лучший момент вмешаться. Небольшой сдвиг сейчас дешевле, чем большой потом.", uk: "Втома вже накопичується. Поки тіло і психіка ще справляються — це найкращий момент втрутитися. Невеликий зсув зараз дешевший, ніж великий потім.", en: "Fatigue is already building. While body and mind still cope — this is the best moment to intervene. A small shift now costs less than a big one later." },
    steps: [
      { ru: "Выпиши 3 вещи. Что высасывает энергию больше всего — работа, люди, соцсети, ожидания? Запиши честно.", uk: "Випиши 3 речі. Що висмоктує енергію найбільше — робота, люди, соцмережі, очікування? Запиши чесно.", en: "Write down 3 things. What drains energy most — work, people, social media, expectations? Write honestly." },
      { ru: "Введи «час тишины» — хотя бы три раза в неделю. Без экранов, без задач. Чай, прогулка, ничего.", uk: "Введи «годину тиші» — хоча б тричі на тиждень. Без екранів, без задач. Чай, прогулянка, нічого.", en: "Add an 'hour of quiet' — at least three times a week. No screens, no tasks. Tea, a walk, nothing." },
      { ru: "Посмотри на своё расписание. Есть ли в нём вообще место для тебя? Если нет — вставь насильно.", uk: "Подивись на свій розклад. Чи є в ньому взагалі місце для тебе? Якщо немає — встав насильно.", en: "Look at your schedule. Is there any room for you in it? If not — force one in." },
      { ru: "Поговори с кем-то, кому доверяешь. Не советоваться — просто выговориться. Это уже разгружает.", uk: "Поговори з кимось, кому довіряєш. Не радитися — просто виговоритися. Це вже розвантажує.", en: "Talk to someone you trust. Not for advice — just to speak. That already lightens the load." },
    ],
    duration: { ru: "2–3 недели мягкого режима · заметите разницу", uk: "2–3 тижні м'якого режиму · помітите різницю", en: "2–3 weeks of a gentle mode · you'll notice the difference" },
  },
  medium: {
    label: { ru: "Нужна настоящая пауза", uk: "Потрібна справжня пауза", en: "A real pause is needed" },
    color: "#B87333",
    why: { ru: "Ты работаешь в долг. Тело и психика уже посылают сигналы — и ты их, скорее всего, знаешь. Здесь не поможет «ещё один выходной». Нужна настоящая остановка и пересмотр ритма.", uk: "Ти працюєш у борг. Тіло і психіка вже надсилають сигнали — і ти їх, найімовірніше, знаєш. Тут не допоможе «ще один вихідний». Потрібна справжня зупинка і перегляд ритму.", en: "You're working on credit. Body and mind are already signaling — and you probably know it. 'One more day off' won't fix this. You need a real stop and a rhythm reset." },
    steps: [
      { ru: "Сначала тело. Сон — минимум 8 часов. Не как роскошь, а как лечение. Без переговоров.", uk: "Спочатку тіло. Сон — мінімум 8 годин. Не як розкіш, а як лікування. Без переговорів.", en: "Body first. Sleep — at least 8 hours. Not as a luxury, as treatment. Non-negotiable." },
      { ru: "Сократи список. Возьми лист бумаги и напиши всё, что на тебе висит. Выдели 3 важных. Остальное — отложи, делегируй, отмени.", uk: "Скороти список. Візьми аркуш паперу і напиши все, що на тобі висить. Виділи 3 важливих. Решту — відклади, делегуй, скасуй.", en: "Cut the list. Take a sheet and write everything on you. Mark 3 important. The rest — postpone, delegate, cancel." },
      { ru: "Каждый день — что-то только для удовольствия. Не «полезное». Именно бессмысленное: прогулка, кино, вкусная еда.", uk: "Щодня — щось лише для задоволення. Не «корисне». Саме безглузде: прогулянка, кіно, смачна їжа.", en: "Every day — something only for pleasure. Not 'useful'. Pointless on purpose: a walk, a film, good food." },
      { ru: "Прекрати объяснять себе почему ты устал(а). Просто устал(а) — и этого достаточно. Вина за усталость только усиливает её.", uk: "Припини пояснювати собі чому ти втомився(лась). Просто втомився(лась) — і цього достатньо. Провина за втому лише підсилює її.", en: "Stop explaining to yourself why you're tired. You're just tired — that's enough. Guilt about fatigue only deepens it." },
      { ru: "Поговори с врачом или психологом. Выгорание средней степени — медицинская история, не слабость. Это честнее и быстрее, чем справляться в одиночку.", uk: "Поговори з лікарем або психологом. Вигорання середнього ступеня — медична історія, не слабкість. Це чесніше і швидше, ніж справлятися наодинці.", en: "Talk to a doctor or psychologist. Moderate burnout is a medical story, not weakness. More honest and faster than coping alone." },
    ],
    duration: { ru: "4–8 недель восстановления · не пытайся сделать быстрее", uk: "4–8 тижнів відновлення · не намагайся зробити швидше", en: "4–8 weeks of recovery · don't try to rush it" },
  },
  deep: {
    label: { ru: "Остановиться — это единственное", uk: "Зупинитися — це єдине", en: "Stopping is the only option" },
    color: "#8B4A4A",
    why: { ru: "Ресурс на нуле. Это не про силу воли — это физиология. Продолжать в том же ритме — всё равно что бежать на сломанной ноге. Тело возьмёт своё силой, если ты не дашь ему это сейчас.", uk: "Ресурс на нулі. Це не про силу волі — це фізіологія. Продовжувати в тому ж ритмі — все одно що бігти на зламаній нозі. Тіло візьме своє силою, якщо ти не даси йому це зараз.", en: "Resource is at zero. This isn't about willpower — it's physiology. Keeping the same pace is like running on a broken leg. The body will take its share by force if you don't give it now." },
    steps: [
      { ru: "Первое и главное: скажи кому-то рядом — партнёру, другу, специалисту — что тебе плохо. Не героизируй. Это не слабость, это необходимость.", uk: "Перше і головне: скажи комусь поруч — партнеру, другу, фахівцю — що тобі погано. Не героїзуй. Це не слабкість, це необхідність.", en: "First and main: tell someone close — partner, friend, professional — that you're unwell. Don't play the hero. Not weakness — necessity." },
      { ru: "Убери всё, что можно убрать. Глубокое выгорание — не время для подвигов. Минимум задач, минимум обязательств. Буквально.", uk: "Прибери все, що можна прибрати. Глибоке вигорання — не час для подвигів. Мінімум задач, мінімум зобов'язань. Буквально.", en: "Remove everything you can. Deep burnout is not a time for feats. Minimum tasks, minimum obligations. Literally." },
      { ru: "Сон, еда, движение на свежем воздухе — это сейчас важнее всего остального. Не метафора. Физиология восстанавливается именно так.", uk: "Сон, їжа, рух на свіжому повітрі — це зараз важливіше за все інше. Не метафора. Фізіологія відновлюється саме так.", en: "Sleep, food, movement in fresh air — more important than everything else right now. Not a metaphor. Physiology recovers that way." },
      { ru: "Обратись к психологу или врачу. Это не крайняя мера — это то, что работает. Можно начать с онлайн-формата, если сложно выйти из дома.", uk: "Звернись до психолога або лікаря. Це не крайній захід — це те, що працює. Можна почати з онлайн-формату, якщо складно вийти з дому.", en: "See a psychologist or doctor. Not a last resort — what works. Online is fine if leaving home is hard." },
      { ru: "Не ставь срок восстановления. Вопрос «когда я снова буду в норме» создаёт давление. Просто живи сегодняшним днём.", uk: "Не став строк відновлення. Питання «коли я знову буду в нормі» створює тиск. Просто живи сьогоднішнім днем.", en: "Don't set a recovery deadline. 'When will I be normal again' creates pressure. Just live today." },
    ],
    duration: { ru: "Месяцы, не недели · доверяй своему темпу", uk: "Місяці, не тижні · довіряй своєму темпу", en: "Months, not weeks · trust your pace" },
  },
};


// ─────────────────────────────────────────────
// ТЕСТ ЧАЯ
// ─────────────────────────────────────────────
const TEA_QUESTIONS = [
  { id: 1, category: { ru: "СОСТОЯНИЕ", uk: "СТАН", en: "STATE" }, text: { ru: "Что сейчас происходит внутри?", uk: "Що зараз відбувається всередині?", en: "What is happening inside right now?" }, options: [
    { text: { ru: "Подъём. Энергия есть, но немного хаотична.", uk: "Підйом. Енергія є, але трохи хаотична.", en: "A high. Energy is there, but a bit chaotic." }, teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:0, gaba:2 } },
    { text: { ru: "Все раздражает. Внутри жар, хочется чтобы все отстали.", uk: "Все дратує. Всередині жар, хочеться щоб усі відчепилися.", en: "Everything irritates. Heat inside; I want everyone to leave me alone." }, teas: { shu:2, bai:0, tguan:0, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Туман. Мысли путаются, сложно сосредоточиться.", uk: "Туман. Думки плутаються, складно зосередитися.", en: "Fog. Thoughts tangle; hard to focus." }, teas: { shu:0, bai:0, tguan:0, sheng:2, dahong:0, gaba:1 } },
    { text: { ru: "Тревога. Мысли не останавливаются, внутри сжато.", uk: "Тривога. Думки не зупиняються, всередині стиснуто.", en: "Anxiety. Thoughts won't stop; something is tight inside." }, teas: { shu:0, bai:2, tguan:0, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Пустота. Нет энергии, нет желания.", uk: "Порожнеча. Немає енергії, немає бажання.", en: "Emptiness. No energy, no desire." }, teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:2, gaba:0 } },
    { text: { ru: "Устал(а) от всех. Хочу тишины и быть одному(одной).", uk: "Втомився(лась) від усіх. Хочу тиші і побути наодинці.", en: "Tired of everyone. I want quiet and to be alone." }, teas: { shu:0, bai:0, tguan:2, sheng:0, dahong:0, gaba:0 } },
  ]},
  { id: 2, category: { ru: "ТЕЛО", uk: "ТІЛО", en: "BODY" }, text: { ru: "Где чаще всего ощущаешь напряжение?", uk: "Де найчастіше відчуваєш напругу?", en: "Where do you most often feel tension?" }, options: [
    { text: { ru: "Тело в тонусе, но внутри лёгкий гул — не могу остановиться.", uk: "Тіло в тонусі, але всередині легкий гул — не можу зупинитися.", en: "Body is toned, but a light hum inside — I can't stop." }, teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:0, gaba:2 } },
    { text: { ru: "Шея и плечи — зажаты, почти всегда.", uk: "Шия і плечі — затиснуті, майже завжди.", en: "Neck and shoulders — tight, almost always." }, teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Голова — тяжесть или туман.", uk: "Голова — важкість або туман.", en: "Head — heaviness or fog." }, teas: { shu:0, bai:1, tguan:0, sheng:2, dahong:0, gaba:1 } },
    { text: { ru: "Грудь или живот — что-то сжимает изнутри.", uk: "Груди або живіт — щось стискає зсередини.", en: "Chest or belly — something squeezes from inside." }, teas: { shu:0, bai:2, tguan:1, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Нет напряжения — просто нет сил вообще.", uk: "Немає напруги — просто немає сил взагалі.", en: "No tension — just no strength at all." }, teas: { shu:0, bai:0, tguan:0, sheng:1, dahong:2, gaba:0 } },
    { text: { ru: "Не чувствую тело. Оно где-то есть, но не замечаю.", uk: "Не відчуваю тіло. Воно десь є, але не помічаю.", en: "I don't feel the body. It's somewhere, but I don't notice it." }, teas: { shu:1, bai:0, tguan:2, sheng:1, dahong:0, gaba:0 } },
  ]},
  { id: 3, category: { ru: "ЭНЕРГИЯ", uk: "ЕНЕРГІЯ", en: "ENERGY" }, text: { ru: "Какой у тебя сейчас уровень энергии?", uk: "Який у тебе зараз рівень енергії?", en: "What is your energy level right now?" }, options: [
    { text: { ru: "Высокая. Много идей, хочется всё и сразу.", uk: "Висока. Багато ідей, хочеться все і одразу.", en: "High. Many ideas; I want everything at once." }, teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:0, gaba:2 } },
    { text: { ru: "Взвинчен(а). Энергия есть, но она нервная, не туда.", uk: "Збуджений(а). Енергія є, але вона нервова, не туди.", en: "Wound up. Energy is there, but nervous, misdirected." }, teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Средняя. Могу работать, но без огня.", uk: "Середня. Можу працювати, але без вогню.", en: "Medium. I can work, but without fire." }, teas: { shu:0, bai:0, tguan:1, sheng:2, dahong:0, gaba:0 } },
    { text: { ru: "Низкая. Каждое действие требует усилия.", uk: "Низька. Кожна дія потребує зусилля.", en: "Low. Every action takes effort." }, teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:2, gaba:0 } },
    { text: { ru: "Почти ноль. Хочется лежать и не двигаться.", uk: "Майже нуль. Хочеться лежати і не рухатися.", en: "Almost zero. I want to lie still." }, teas: { shu:0, bai:1, tguan:2, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Волнами: то всплеск, то провал.", uk: "Хвилями: то сплеск, то провал.", en: "In waves: a spike, then a drop." }, teas: { shu:0, bai:0, tguan:0, sheng:2, dahong:1, gaba:0 } },
  ]},
  { id: 4, category: { ru: "ЖЕЛАНИЕ", uk: "БАЖАННЯ", en: "DESIRE" }, text: { ru: "Чего тебе сейчас больше всего хочется?", uk: "Чого тобі зараз найбільше хочеться?", en: "What do you want most right now?" }, options: [
    { text: { ru: "Направить энергию во что-то осмысленное.", uk: "Спрямувати енергію в щось осмислене.", en: "To channel energy into something meaningful." }, teas: { shu:0, bai:0, tguan:0, sheng:1, dahong:0, gaba:2 } },
    { text: { ru: "Чтобы все отстали и стало тише.", uk: "Щоб усі відчепилися і стало тихіше.", en: "For everyone to leave me alone and for it to get quieter." }, teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Прояснить голову. Собрать мысли.", uk: "Прояснити голову. Зібрати думки.", en: "To clear my head. Gather my thoughts." }, teas: { shu:0, bai:1, tguan:0, sheng:2, dahong:0, gaba:1 } },
    { text: { ru: "Успокоиться. Ощутить безопасность.", uk: "Заспокоїтися. Відчути безпеку.", en: "To calm down. Feel safe." }, teas: { shu:0, bai:2, tguan:1, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Получить хоть немного сил и тепла.", uk: "Отримати хоч трохи сил і тепла.", en: "To get at least a little strength and warmth." }, teas: { shu:0, bai:0, tguan:0, sheng:1, dahong:2, gaba:0 } },
    { text: { ru: "Побыть наедине с собой. Без ролей.", uk: "Побути наодинці з собою. Без ролей.", en: "To be alone with myself. Without roles." }, teas: { shu:1, bai:0, tguan:2, sheng:0, dahong:0, gaba:0 } },
  ]},
  { id: 5, category: { ru: "РИТМ", uk: "РИТМ", en: "RHYTHM" }, text: { ru: "Какой ритм тебе сейчас нужен?", uk: "Який ритм тобі зараз потрібен?", en: "What rhythm do you need right now?" }, options: [
    { text: { ru: "Живой, но без хаоса — с берегом.", uk: "Живий, але без хаосу — з берегом.", en: "Alive, but without chaos — with a shore." }, teas: { shu:0, bai:0, tguan:0, sheng:1, dahong:0, gaba:2 } },
    { text: { ru: "Медленный и тяжёлый. Как земля.", uk: "Повільний і важкий. Як земля.", en: "Slow and heavy. Like earth." }, teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Свежий и ясный. Как горный воздух.", uk: "Свіжий і ясний. Як гірське повітря.", en: "Fresh and clear. Like mountain air." }, teas: { shu:0, bai:0, tguan:0, sheng:2, dahong:1, gaba:0 } },
    { text: { ru: "Мягкий и обволакивающий.", uk: "М'який і обволікаючий.", en: "Soft and enveloping." }, teas: { shu:0, bai:2, tguan:1, sheng:0, dahong:0, gaba:0 } },
    { text: { ru: "Тёплый и питающий.", uk: "Теплий і живильний.", en: "Warm and nourishing." }, teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:2, gaba:0 } },
    { text: { ru: "Тихий и глубокий. Без внешнего шума.", uk: "Тихий і глибокий. Без зовнішнього шуму.", en: "Quiet and deep. Without outer noise." }, teas: { shu:0, bai:0, tguan:2, sheng:1, dahong:0, gaba:0 } },
  ]},
];


const TEA_RESULTS = {
  shu: { emoji:"✦", name: { ru: "Шу пуэр", uk: "Шу пуер", en: "Shou puerh" }, tag: { ru: "Заземление", uk: "Заземлення", en: "Grounding" }, color:"#8B6E4E", text: { ru: "Внутри сейчас жар — раздражение, зажатость, острые края. Шу пуэр не борется с этим. Он просто тяжелый, земляной, темный. Он тянет вниз — и это хорошо. Первый глоток немного притупляет края. К третьему начинаешь дышать.", uk: "Всередині зараз жар — роздратування, затиснутість, гострі краї. Шу пуер не бореться з цим. Він просто важкий, земляний, темний. Він тягне вниз — і це добре. Перший ковток трохи притуплює краї. До третього починаєш дихати.", en: "There's heat inside — irritation, tightness, sharp edges. Shou puerh doesn't fight it. It's simply heavy, earthy, dark. It pulls down — and that's good. The first sip softens the edges. By the third you start to breathe." }, note: { ru: "Заваривай горячим, пей медленно. Без телефона.", uk: "Заварюй гарячим, пий повільно. Без телефону.", en: "Brew hot, drink slowly. No phone." } },
  sheng: { emoji:"✦", name: { ru: "Шэн пуэр", uk: "Шен пуер", en: "Sheng puerh" }, tag: { ru: "Ясность", uk: "Ясність", en: "Clarity" }, color:"#6B8E6B", text: { ru: "В голове туман — мысли путаются, сложно собрать фокус. Шэн пуэр режет этот туман. Свежий, живой, немного резкий. Он не убаюкивает — он проясняет. После двух-трёх глотков появляется воздух.", uk: "У голові туман — думки плутаються, складно зібрати фокус. Шен пуер ріже цей туман. Свіжий, живий, трохи різкий. Він не заколисує — він прояснює. Після двох-трьох ковтків з'являється повітря.", en: "Fog in the head — thoughts tangle, hard to focus. Sheng puerh cuts through that fog. Fresh, alive, a little sharp. It doesn't lull — it clarifies. After two or three sips, air appears." }, note: { ru: "Не заливай кипятком слишком долго. Короткие проливы.", uk: "Не заливай окропом надто довго. Короткі протоки.", en: "Don't steep in boiling water too long. Short rinses." } },
  bai: { emoji:"✦", name: { ru: "Белый чай", uk: "Білий чай", en: "White tea" }, tag: { ru: "Спокойствие", uk: "Спокій", en: "Calm" }, color:"#A89880", text: { ru: "Внутри сжато. Тревога не отпускает. Белый чай не спорит с тревогой — он рядом. Мягкий, едва сладкий, почти невесомый. Он не требует. Просто остаётся. И постепенно сжатие ослабевает.", uk: "Всередині стиснуто. Тривога не відпускає. Білий чай не сперечається з тривогою — він поруч. М'який, ледь солодкий, майже невагомий. Він не вимагає. Просто залишається. І поступово стиснення слабшає.", en: "Something is tight inside. Anxiety won't let go. White tea doesn't argue with anxiety — it stays beside it. Soft, faintly sweet, almost weightless. It asks for nothing. It simply remains. And gradually the squeeze eases." }, note: { ru: "Тёплая вода, не кипяток. Пей в тишине.", uk: "Тепла вода, не окріп. Пий у тиші.", en: "Warm water, not boiling. Drink in silence." } },
  tguan: { emoji:"✦", name: { ru: "Те Гуань Инь", uk: "Те Гуань Інь", en: "Tie Guan Yin" }, tag: { ru: "Уединение", uk: "Усамітнення", en: "Solitude" }, color:"#7A9E7E", text: { ru: "Ты устал(а) от людей и шума. Те Гуань Инь уводит внутрь. Он не требует ничего. Просто сиди с ним. Это чай для того, чтобы снова стать собой.", uk: "Ти втомився(лась) від людей і шуму. Те Гуань Інь веде всередину. Він нічого не вимагає. Просто сиди з ним. Це чай для того, щоб знову стати собою.", en: "You're tired of people and noise. Tie Guan Yin draws you inward. It asks for nothing. Just sit with it. This is tea for becoming yourself again." }, note: { ru: "Закрой дверь. Этот чай не любит компании.", uk: "Закрий двері. Цей чай не любить компанії.", en: "Close the door. This tea doesn't like company." } },
  dahong: { emoji:"✦", name: { ru: "Да Хун Пао", uk: "Да Хун Пао", en: "Da Hong Pao" }, tag: { ru: "Тепло", uk: "Тепло", en: "Warmth" }, color:"#B87333", text: { ru: "Сил почти нет. Да Хун Пао даёт тепло без давления. Насыщенный, карамельный, устойчивый. Он не взбадривает — он питает. После чашки появляется чуть больше опоры.", uk: "Сил майже немає. Да Хун Пао дає тепло без тиску. Насичений, карамельний, стійкий. Він не підбадьорює — він живить. Після чашки з'являється трохи більше опори.", en: "Almost no strength left. Da Hong Pao gives warmth without pressure. Rich, caramel, steady. It doesn't hype — it nourishes. After a cup, a little more ground appears." }, note: { ru: "Пей горячим. Можно с чем-то тёплым рядом.", uk: "Пий гарячим. Можна з чимось теплим поруч.", en: "Drink hot. Something warm nearby helps." } },
  gaba: { emoji:"✦", name: { ru: "Габа улун", uk: "Габа улун", en: "GABA oolong" }, tag: { ru: "Равновесие", uk: "Рівновага", en: "Balance" }, color:"#7B9E87", text: { ru: "Энергия есть — но она ищет берег. Ты на подъёме, внутри много всего, идеи рождаются быстрее чем успеваешь их поймать. Габа не тормозит этот поток. Она выравнивает его. Мягкий, чуть фруктовый, без резкости.", uk: "Енергія є — але вона шукає берег. Ти на підйомі, всередині багато всього, ідеї народжуються швидше ніж встигаєш їх піймати. Габа не гальмує цей потік. Вона вирівнює його. М'який, трохи фруктовий, без різкості.", en: "Energy is there — but it seeks a shore. You're rising; a lot is moving inside; ideas appear faster than you can catch them. GABA doesn't brake that flow. It levels it. Soft, slightly fruity, without sharpness." }, note: { ru: "Вечер или пауза между делами. Не на бегу.", uk: "Вечір або пауза між справами. Не на бігу.", en: "Evening or a pause between tasks. Not on the run." } },
};


// ─────────────────────────────────────────────
// ТЕСТ МЕДИТАЦИЙ — 20 ВОПРОСОВ, 9 ПРАКТИК
// ─────────────────────────────────────────────
// shamatha, vipassana, metta, tummo, nidra, tonglen, b478, box, coherent

const MEDITATION_QUESTIONS = [
  { id: 1, category: { ru: "СОСТОЯНИЕ", uk: "СТАН", en: "STATE" }, text: { ru: "Что сейчас происходит у тебя внутри?", uk: "Що зараз відбувається у тебе всередині?", en: "What is happening inside you right now?" }, options: [
    { text: { ru: "Тревога. Мысли крутятся по кругу, не останавливаются.", uk: "Тривога. Думки крутяться по колу, не зупиняються.", en: "Anxiety. Thoughts loop and won't stop." }, p: { shamatha:2, b478:2, vipassana:1 } },
    { text: { ru: "Туман. Не понимаю себя, живу как на автопилоте.", uk: "Туман. Не розумію себе, живу як на автопілоті.", en: "Fog. I don't understand myself; I live on autopilot." }, p: { vipassana:2, shamatha:1, coherent:1 } },
    { text: { ru: "Пусто и холодно. Нет сил, нет желания.", uk: "Порожньо і холодно. Немає сил, немає бажання.", en: "Empty and cold. No strength, no desire." }, p: { tummo:2, metta:1, b478:1 } },
    { text: { ru: "Устал(а) от людей. Хочется тишины и одиночества.", uk: "Втомився(лась) від людей. Хочеться тиші й самотності.", en: "Tired of people. I want quiet and solitude." }, p: { metta:2, nidra:1, shamatha:1 } },
    { text: { ru: "Перегруз. Много всего, голова как котёл.", uk: "Перевантаження. Багато всього, голова як казан.", en: "Overloaded. Too much going on; head feels like a cauldron." }, p: { box:2, coherent:2, b478:1 } },
    { text: { ru: "Подъём. Энергия есть — хочу направить её глубже.", uk: "Підйом. Енергія є — хочу спрямувати її глибше.", en: "A rise. Energy is there — I want to direct it deeper." }, p: { tonglen:2, coherent:1, vipassana:1 } },
  ]},
  { id: 2, category: { ru: "ТЕЛО", uk: "ТІЛО", en: "BODY" }, text: { ru: "Как тело чувствует себя прямо сейчас?", uk: "Як тіло відчуває себе просто зараз?", en: "How does the body feel right now?" }, options: [
    { text: { ru: "Грудь сжата. Дышу поверхностно.", uk: "Груди стиснуті. Дихаю поверхнево.", en: "Chest is tight. Breathing is shallow." }, p: { b478:2, coherent:2, shamatha:1 } },
    { text: { ru: "Плечи и шея зажаты. Напряжение хроническое.", uk: "Плечі і шия затиснуті. Напруга хронічна.", en: "Shoulders and neck are locked. Chronic tension." }, p: { box:2, nidra:2, coherent:1 } },
    { text: { ru: "Тело как вата. Тяжёлое, без сил.", uk: "Тіло як вата. Важке, без сил.", en: "Body like cotton. Heavy, no strength." }, p: { tummo:2, nidra:1, metta:1 } },
    { text: { ru: "Тело будто чужое. Не замечаю его.", uk: "Тіло ніби чуже. Не помічаю його.", en: "Body feels foreign. I don't notice it." }, p: { vipassana:2, nidra:2, shamatha:1 } },
    { text: { ru: "Тело в тонусе. Есть приятная живость.", uk: "Тіло в тонусі. Є приємна жвавість.", en: "Body is toned. A pleasant aliveness." }, p: { tonglen:2, coherent:1, vipassana:1 } },
    { text: { ru: "Дрожь или лёгкая паника внутри.", uk: "Дрижання або легка паніка всередині.", en: "Trembling or mild panic inside." }, p: { b478:2, shamatha:2, box:1 } },
  ]},
  { id: 3, category: { ru: "ДЫХАНИЕ", uk: "ДИХАННЯ", en: "BREATH" }, text: { ru: "Как ты сейчас дышишь?", uk: "Як ти зараз дихаєш?", en: "How are you breathing right now?" }, options: [
    { text: { ru: "Поверхностно и часто. Замечаю когда вспоминаю.", uk: "Поверхнево і часто. Помічаю коли згадую.", en: "Shallow and fast. I notice when I remember." }, p: { b478:2, coherent:2, shamatha:1 } },
    { text: { ru: "Задерживаю дыхание не замечая.", uk: "Затримую дихання не помічаючи.", en: "I hold my breath without noticing." }, p: { box:2, b478:1, coherent:1 } },
    { text: { ru: "Нормально, но хочется дышать глубже.", uk: "Нормально, але хочеться дихати глибше.", en: "Normal, but I want to breathe deeper." }, p: { coherent:2, tummo:1, shamatha:1 } },
    { text: { ru: "Тяжело. Как будто что-то давит.", uk: "Важко. Ніби щось тисне.", en: "Heavy. As if something is pressing." }, p: { b478:2, nidra:1, coherent:2 } },
    { text: { ru: "Ровно и спокойно. Дыхание не беспокоит.", uk: "Рівно і спокійно. Дихання не турбує.", en: "Even and calm. Breath doesn't bother me." }, p: { vipassana:2, tonglen:2, metta:1 } },
    { text: { ru: "Глубоко. Тело само дышит хорошо.", uk: "Глибоко. Тіло само дихає добре.", en: "Deep. The body breathes well on its own." }, p: { tonglen:2, tummo:1, vipassana:1 } },
  ]},
  { id: 4, category: { ru: "МЫСЛИ", uk: "ДУМКИ", en: "THOUGHTS" }, text: { ru: "Что происходит с твоими мыслями?", uk: "Що відбувається з твоїми думками?", en: "What is happening with your thoughts?" }, options: [
    { text: { ru: "Прокручиваю одно и то же. Не могу остановить.", uk: "Прокручую одне й те саме. Не можу зупинити.", en: "I replay the same thing. Can't stop." }, p: { shamatha:2, b478:1, vipassana:1 } },
    { text: { ru: "Мысли скачут хаотично. Нет фокуса.", uk: "Думки стрибають хаотично. Немає фокусу.", en: "Thoughts jump chaotically. No focus." }, p: { shamatha:2, box:1, coherent:1 } },
    { text: { ru: "Туман. Мысли есть, но расплывчатые.", uk: "Туман. Думки є, але розмиті.", en: "Fog. Thoughts are there but blurry." }, p: { vipassana:2, shamatha:1, coherent:1 } },
    { text: { ru: "Думаю о других людях — их боли, проблемах.", uk: "Думаю про інших людей — їхній біль, проблеми.", en: "I think about other people — their pain, problems." }, p: { tonglen:2, metta:2, vipassana:1 } },
    { text: { ru: "Пустота. Мысли почти не приходят.", uk: "Порожнеча. Думки майже не приходять.", en: "Emptiness. Thoughts barely come." }, p: { tummo:1, nidra:2, metta:1 } },
    { text: { ru: "Мысли живые и быстрые. Идей много.", uk: "Думки живі й швидкі. Ідей багато.", en: "Thoughts are lively and fast. Many ideas." }, p: { tonglen:2, coherent:1, vipassana:1 } },
  ]},
  { id: 5, category: { ru: "ВРЕМЯ", uk: "ЧАС", en: "TIME" }, text: { ru: "Сколько времени ты готов(а) уделить практике прямо сейчас?", uk: "Скільки часу ти готовий(а) приділити практиці просто зараз?", en: "How much time are you ready to give practice right now?" }, options: [
    { text: { ru: "2–3 минуты. Совсем немного.", uk: "2–3 хвилини. Зовсім трохи.", en: "2–3 minutes. Very little." }, p: { b478:2, box:2, coherent:1 } },
    { text: { ru: "5–10 минут.", uk: "5–10 хвилин.", en: "5–10 minutes." }, p: { shamatha:2, tummo:2, box:1 } },
    { text: { ru: "10–15 минут.", uk: "10–15 хвилин.", en: "10–15 minutes." }, p: { vipassana:2, metta:2, tonglen:1 } },
    { text: { ru: "15–20 минут.", uk: "15–20 хвилин.", en: "15–20 minutes." }, p: { vipassana:2, shamatha:1, tonglen:2 } },
    { text: { ru: "20–40 минут. Хочу по-настоящему погрузиться.", uk: "20–40 хвилин. Хочу по-справжньому зануритися.", en: "20–40 minutes. I want to really go deep." }, p: { nidra:2, vipassana:1, tonglen:1 } },
    { text: { ru: "Нет предпочтений. Сколько нужно.", uk: "Немає вподобань. Скільки потрібно.", en: "No preference. As long as needed." }, p: { shamatha:1, vipassana:1, nidra:1, tonglen:1 } },
  ]},
  { id: 6, category: { ru: "МЕСТО", uk: "МІСЦЕ", en: "PLACE" }, text: { ru: "Где ты сейчас будешь практиковать?", uk: "Де ти зараз будеш практикувати?", en: "Where will you practice right now?" }, options: [
    { text: { ru: "На рабочем месте. Незаметно для окружающих.", uk: "На робочому місці. Непомітно для оточення.", en: "At the workplace. Unnoticed by others." }, p: { box:2, coherent:2, b478:1 } },
    { text: { ru: "Дома. Могу сесть как удобно.", uk: "Вдома. Можу сісти як зручно.", en: "At home. I can sit however is comfortable." }, p: { shamatha:2, vipassana:2, metta:1 } },
    { text: { ru: "Лёжа. Устал(а), хочу горизонталь.", uk: "Лежачи. Втомився(лась), хочу горизонталь.", en: "Lying down. Tired; I want horizontal." }, p: { nidra:2, metta:1, b478:1 } },
    { text: { ru: "В транспорте или на ходу.", uk: "У транспорті або на ходу.", en: "On transport or while walking." }, p: { coherent:2, box:2, b478:1 } },
    { text: { ru: "В тихом уединённом месте.", uk: "У тихому усамітненому місці.", en: "In a quiet secluded place." }, p: { tonglen:2, vipassana:1, shamatha:1 } },
    { text: { ru: "Неважно где. Главное — попробовать.", uk: "Неважливо де. Головне — спробувати.", en: "Wherever. The main thing is to try." }, p: { shamatha:1, b478:1, box:1, coherent:1 } },
  ]},
  { id: 7, category: { ru: "ОПЫТ", uk: "ДОСВІД", en: "EXPERIENCE" }, text: { ru: "Есть ли у тебя опыт медитации?", uk: "Чи є у тебе досвід медитації?", en: "Do you have meditation experience?" }, options: [
    { text: { ru: "Нет. Первый раз.", uk: "Ні. Перший раз.", en: "No. First time." }, p: { b478:2, box:2, coherent:2 } },
    { text: { ru: "Пробовал(а) пару раз, но нерегулярно.", uk: "Пробував(ла) кілька разів, але нерегулярно.", en: "Tried a couple of times, irregularly." }, p: { shamatha:2, b478:1, coherent:1 } },
    { text: { ru: "Есть базовая практика.", uk: "Є базова практика.", en: "I have a basic practice." }, p: { vipassana:2, metta:1, shamatha:1 } },
    { text: { ru: "Практикую регулярно.", uk: "Практикую регулярно.", en: "I practice regularly." }, p: { tonglen:2, vipassana:1, tummo:1 } },
    { text: { ru: "Знаком с буддийскими практиками.", uk: "Знайомий з буддійськими практиками.", en: "Familiar with Buddhist practices." }, p: { tonglen:2, tummo:2, vipassana:1 } },
    { text: { ru: "Мне ближе дыхательные техники.", uk: "Мені ближчі дихальні техніки.", en: "Breath techniques are closer to me." }, p: { b478:2, box:2, coherent:2 } },
  ]},
  { id: 8, category: { ru: "ЦЕЛЬ", uk: "МЕТА", en: "GOAL" }, text: { ru: "Чего ты хочешь от практики прямо сейчас?", uk: "Чого ти хочеш від практики просто зараз?", en: "What do you want from practice right now?" }, options: [
    { text: { ru: "Остановить мысли. Просто тишина внутри.", uk: "Зупинити думки. Просто тиша всередині.", en: "Stop the thoughts. Just quiet inside." }, p: { shamatha:2, b478:1, coherent:1 } },
    { text: { ru: "Понять себя лучше. Что-то прояснить.", uk: "Зрозуміти себе краще. Щось прояснити.", en: "Understand myself better. Clarify something." }, p: { vipassana:2, tonglen:1, shamatha:1 } },
    { text: { ru: "Почувствовать тепло. Вернуть себя.", uk: "Відчути тепло. Повернути себе.", en: "Feel warmth. Come back to myself." }, p: { metta:2, tummo:2, nidra:1 } },
    { text: { ru: "Успокоиться быстро. Здесь и сейчас.", uk: "Заспокоїтися швидко. Тут і зараз.", en: "Calm down quickly. Here and now." }, p: { b478:2, box:2, coherent:1 } },
    { text: { ru: "Глубокое расслабление. Отпустить всё.", uk: "Глибоке розслаблення. Відпустити все.", en: "Deep relaxation. Let everything go." }, p: { nidra:2, coherent:1, metta:1 } },
    { text: { ru: "Войти глубже. Не поверхность — суть.", uk: "Увійти глибше. Не поверхня — суть.", en: "Go deeper. Not the surface — the essence." }, p: { tonglen:2, tummo:1, vipassana:1 } },
  ]},
  { id: 9, category: { ru: "ЭМОЦИЯ", uk: "ЕМОЦІЯ", en: "EMOTION" }, text: { ru: "Какая эмоция сейчас самая сильная?", uk: "Яка емоція зараз найсильніша?", en: "Which emotion is strongest right now?" }, options: [
    { text: { ru: "Тревога или страх.", uk: "Тривога або страх.", en: "Anxiety or fear." }, p: { shamatha:2, b478:2, vipassana:1 } },
    { text: { ru: "Раздражение или злость.", uk: "Роздратування або злість.", en: "Irritation or anger." }, p: { box:2, coherent:2, b478:1 } },
    { text: { ru: "Грусть или одиночество.", uk: "Смуток або самотність.", en: "Sadness or loneliness." }, p: { metta:2, nidra:1, tonglen:1 } },
    { text: { ru: "Опустошённость или апатия.", uk: "Спустошеність або апатія.", en: "Emptiness or apathy." }, p: { tummo:2, metta:1, nidra:1 } },
    { text: { ru: "Воодушевление или внутренний подъём.", uk: "Натхнення або внутрішній підйом.", en: "Inspiration or an inner rise." }, p: { tonglen:2, coherent:1, vipassana:1 } },
    { text: { ru: "Спокойствие. Эмоций почти нет.", uk: "Спокій. Емоцій майже немає.", en: "Calm. Almost no emotion." }, p: { vipassana:2, shamatha:1, tonglen:1 } },
  ]},
  { id: 10, category: { ru: "СОН", uk: "СОН", en: "SLEEP" }, text: { ru: "Как ты спишь последнее время?", uk: "Як ти спиш останнім часом?", en: "How have you been sleeping lately?" }, options: [
    { text: { ru: "Плохо. Трудно заснуть или часто просыпаюсь.", uk: "Погано. Важко заснути або часто прокидаюся.", en: "Badly. Hard to fall asleep or I wake often." }, p: { b478:2, shamatha:1, nidra:1 } },
    { text: { ru: "Неглубоко. Утром будто не спал(а).", uk: "Неглибоко. Вранці ніби не спав(ла).", en: "Shallow. In the morning as if I didn't sleep." }, p: { coherent:2, b478:1, nidra:2 } },
    { text: { ru: "Нормально, но хочется больше отдыха.", uk: "Нормально, але хочеться більше відпочинку.", en: "OK, but I want more rest." }, p: { nidra:2, tummo:1, metta:1 } },
    { text: { ru: "Хорошо. Сон восстанавливает.", uk: "Добре. Сон відновлює.", en: "Well. Sleep restores me." }, p: { vipassana:1, tonglen:1, shamatha:1 } },
    { text: { ru: "Слишком много сплю. Нет энергии встать.", uk: "Занадто багато сплю. Немає енергії встати.", en: "I sleep too much. No energy to get up." }, p: { tonglen:2, vipassana:1, coherent:1 } },
    { text: { ru: "Разный сон. Зависит от дня.", uk: "Різний сон. Залежить від дня.", en: "Mixed sleep. Depends on the day." }, p: { tummo:2, box:1, coherent:1 } },
  ]},
  { id: 11, category: { ru: "ЛЮДИ", uk: "ЛЮДИ", en: "PEOPLE" }, text: { ru: "Как ты сейчас чувствуешь себя с людьми?", uk: "Як ти зараз відчуваєш себе з людьми?", en: "How do you feel with people right now?" }, options: [
    { text: { ru: "Устал(а) от общения. Хочу тишины.", uk: "Втомився(лась) від спілкування. Хочу тиші.", en: "Tired of contact. I want quiet." }, p: { metta:2, nidra:1, shamatha:1 } },
    { text: { ru: "Раздражён(а) на кого-то.", uk: "Роздратований(а) на когось.", en: "Irritated at someone." }, p: { tonglen:2, metta:2, b478:1 } },
    { text: { ru: "Одинок(а). Хочется контакта.", uk: "Самотній(я). Хочеться контакту.", en: "Lonely. I want contact." }, p: { box:2, coherent:1, shamatha:1 } },
    { text: { ru: "Нормально. Общение не беспокоит.", uk: "Нормально. Спілкування не турбує.", en: "Fine. Contact doesn't bother me." }, p: { metta:2, vipassana:1, tonglen:1 } },
    { text: { ru: "Тепло. Хочу больше близости и открытости.", uk: "Тепло. Хочу більше близькості й відкритості.", en: "Warm. I want more closeness and openness." }, p: { vipassana:1, coherent:1, shamatha:1 } },
    { text: { ru: "Нейтрально. Люди сейчас не в фокусе.", uk: "Нейтрально. Люди зараз не у фокусі.", en: "Neutral. People aren't in focus now." }, p: { metta:2, tonglen:2, vipassana:1 } },
  ]},
  { id: 12, category: { ru: "ТЕЛО-2", uk: "ТІЛО-2", en: "BODY-2" }, text: { ru: "Как ты относишься к своему телу прямо сейчас?", uk: "Як ти ставишся до свого тіла просто зараз?", en: "How do you relate to your body right now?" }, options: [
    { text: { ru: "Не чувствую его. Всё в голове.", uk: "Не відчуваю його. Усе в голові.", en: "I don't feel it. Everything is in the head." }, p: { vipassana:2, nidra:2, shamatha:1 } },
    { text: { ru: "Тело напряжено. Хочу его расслабить.", uk: "Тіло напружене. Хочу його розслабити.", en: "Body is tense. I want to relax it." }, p: { nidra:2, coherent:2, b478:1 } },
    { text: { ru: "Тело холодное или вялое. Нет тонуса.", uk: "Тіло холодне або мляве. Немає тонусу.", en: "Body is cold or sluggish. No tone." }, p: { tummo:2, box:1, coherent:1 } },
    { text: { ru: "Тело в порядке, но дышу зажато.", uk: "Тіло в порядку, але дихаю затиснуто.", en: "Body is fine, but breathing is tight." }, p: { b478:2, coherent:2, box:1 } },
    { text: { ru: "Чувствую тело хорошо. Есть приятная живость.", uk: "Відчуваю тіло добре. Є приємна жвавість.", en: "I feel the body well. Pleasant aliveness." }, p: { tonglen:2, vipassana:1, tummo:1 } },
    { text: { ru: "Есть боль или дискомфорт в конкретном месте.", uk: "Є біль або дискомфорт у конкретному місці.", en: "Pain or discomfort in a specific place." }, p: { vipassana:2, nidra:2, b478:1 } },
  ]},
  { id: 13, category: { ru: "РИТМ", uk: "РИТМ", en: "RHYTHM" }, text: { ru: "Какой темп тебе нужен прямо сейчас?", uk: "Який темп тобі потрібен просто зараз?", en: "What pace do you need right now?" }, options: [
    { text: { ru: "Очень медленный. Хочу буквально остановиться.", uk: "Дуже повільний. Хочу буквально зупинитися.", en: "Very slow. I want to literally stop." }, p: { nidra:2, shamatha:2, metta:1 } },
    { text: { ru: "Медленный и тихий. Без усилий.", uk: "Повільний і тихий. Без зусиль.", en: "Slow and quiet. Without effort." }, p: { shamatha:2, coherent:1, metta:1 } },
    { text: { ru: "Структурированный. Чёткие шаги.", uk: "Структурований. Чіткі кроки.", en: "Structured. Clear steps." }, p: { box:2, vipassana:1, b478:1 } },
    { text: { ru: "Ритмичный. Что-то успокаивающее и повторяющееся.", uk: "Ритмічний. Щось заспокійливе і повторюване.", en: "Rhythmic. Something calming and repeating." }, p: { coherent:2, b478:1, box:1 } },
    { text: { ru: "Активный. Что-то, что даст энергию.", uk: "Активний. Щось, що дасть енергію.", en: "Active. Something that will give energy." }, p: { tummo:2, tonglen:1, box:1 } },
    { text: { ru: "Неважно. Главное — что-то делать.", uk: "Неважливо. Головне — щось робити.", en: "Doesn't matter. The main thing is to do something." }, p: { shamatha:1, b478:1, coherent:1 } },
  ]},
  { id: 14, category: { ru: "ГЛУБИНА", uk: "ГЛИБИНА", en: "DEPTH" }, text: { ru: "Насколько ты готов(а) погрузиться?", uk: "Наскільки ти готовий(а) зануритися?", en: "How ready are you to go deep?" }, options: [
    { text: { ru: "Хочу просто успокоиться. Без глубины.", uk: "Хочу просто заспокоїтися. Без глибини.", en: "I just want to calm down. No depth." }, p: { b478:2, box:2, coherent:1 } },
    { text: { ru: "Готов(а) немного — понаблюдать за собой.", uk: "Готовий(а) трохи — поспостерігати за собою.", en: "Ready a little — to watch myself." }, p: { shamatha:2, vipassana:1, coherent:1 } },
    { text: { ru: "Хочу по-настоящему расслабиться и отпустить.", uk: "Хочу по-справжньому розслабитися і відпустити.", en: "I want to truly relax and let go." }, p: { nidra:2, metta:1, b478:1 } },
    { text: { ru: "Готов(а) исследовать что внутри.", uk: "Готовий(а) досліджувати що всередині.", en: "Ready to explore what's inside." }, p: { vipassana:2, tonglen:1, shamatha:1 } },
    { text: { ru: "Хочу тепла — для себя или кого-то.", uk: "Хочу тепла — для себе або когось.", en: "I want warmth — for myself or someone." }, p: { metta:2, tonglen:2, nidra:1 } },
    { text: { ru: "Готов(а) к самой глубокой практике.", uk: "Готовий(а) до найглибшої практики.", en: "Ready for the deepest practice." }, p: { tonglen:2, tummo:2, vipassana:1 } },
  ]},
  { id: 15, category: { ru: "ВНУТРИ", uk: "ВСЕРЕДИНІ", en: "INSIDE" }, text: { ru: "Есть ли ощущение холода или пустоты внутри?", uk: "Чи є відчуття холоду або порожнечі всередині?", en: "Is there a sense of cold or emptiness inside?" }, options: [
    { text: { ru: "Да. Внутри холодно и пусто.", uk: "Так. Всередині холодно і порожньо.", en: "Yes. Cold and empty inside." }, p: { tummo:2, metta:2, b478:1 } },
    { text: { ru: "Скорее да. Что-то погасло.", uk: "Скоріше так. Щось згасло.", en: "More yes. Something went out." }, p: { tummo:2, nidra:1, metta:1 } },
    { text: { ru: "Нет. Внутри нейтрально.", uk: "Ні. Всередині нейтрально.", en: "No. Neutral inside." }, p: { vipassana:1, shamatha:1, coherent:1 } },
    { text: { ru: "Нет. Внутри тепло и спокойно.", uk: "Ні. Всередині тепло і спокійно.", en: "No. Warm and calm inside." }, p: { tonglen:2, vipassana:1, metta:1 } },
    { text: { ru: "Нет. Внутри скорее перегруз и жар.", uk: "Ні. Всередині скоріше перевантаження і жар.", en: "No. More overload and heat inside." }, p: { box:2, coherent:2, b478:1 } },
    { text: { ru: "Трудно определить. Что-то смешанное.", uk: "Важко визначити. Щось змішане.", en: "Hard to tell. Something mixed." }, p: { vipassana:2, shamatha:1, nidra:1 } },
  ]},
  { id: 16, category: { ru: "ТРЕВОГА", uk: "ТРИВОГА", en: "ANXIETY" }, text: { ru: "Как часто ты замечаешь тревогу в теле?", uk: "Як часто ти помічаєш тривогу в тілі?", en: "How often do you notice anxiety in the body?" }, options: [
    { text: { ru: "Почти постоянно. Это мой фон.", uk: "Майже постійно. Це мій фон.", en: "Almost constantly. That's my background." }, p: { b478:2, shamatha:2, coherent:1 } },
    { text: { ru: "Часто. Особенно перед сном или в тишине.", uk: "Часто. Особливо перед сном або в тиші.", en: "Often. Especially before sleep or in silence." }, p: { b478:2, coherent:1, nidra:1 } },
    { text: { ru: "Иногда. Волнами.", uk: "Іноді. Хвилями.", en: "Sometimes. In waves." }, p: { shamatha:1, box:1, coherent:1 } },
    { text: { ru: "Редко. Тревоги почти нет.", uk: "Рідко. Тривоги майже немає.", en: "Rarely. Almost no anxiety." }, p: { vipassana:1, tonglen:1, tummo:1 } },
    { text: { ru: "Нет тревоги. Скорее апатия или пустота.", uk: "Немає тривоги. Скоріше апатія або порожнеча.", en: "No anxiety. More apathy or emptiness." }, p: { tummo:2, metta:1, nidra:1 } },
    { text: { ru: "Нет тревоги. Я в ресурсе.", uk: "Немає тривоги. Я в ресурсі.", en: "No anxiety. I'm in resource." }, p: { tonglen:2, vipassana:1, coherent:1 } },
  ]},
  { id: 17, category: { ru: "ОТДЫХ", uk: "ВІДПОЧИНОК", en: "REST" }, text: { ru: "Как ты отдыхаешь?", uk: "Як ти відпочиваєш?", en: "How do you rest?" }, options: [
    { text: { ru: "Сложно расслабиться. Тело держит напряжение даже в покое.", uk: "Складно розслабитися. Тіло тримає напругу навіть у спокої.", en: "Hard to relax. Body holds tension even at rest." }, p: { nidra:2, coherent:2, b478:1 } },
    { text: { ru: "Засыпаю перед экраном. Это мой отдых.", uk: "Засинаю перед екраном. Це мій відпочинок.", en: "I fall asleep in front of a screen. That's my rest." }, p: { nidra:2, vipassana:1, shamatha:1 } },
    { text: { ru: "Отдых помогает, но ненадолго.", uk: "Відпочинок допомагає, але ненадовго.", en: "Rest helps, but not for long." }, p: { vipassana:1, metta:1, nidra:1 } },
    { text: { ru: "Хорошо восстанавливаюсь в тишине.", uk: "Добре відновлююся в тиші.", en: "I recover well in silence." }, p: { shamatha:2, vipassana:1, tonglen:1 } },
    { text: { ru: "Отдыхаю через движение или активность.", uk: "Відпочиваю через рух або активність.", en: "I rest through movement or activity." }, p: { tummo:1, box:1, coherent:1 } },
    { text: { ru: "Отдыхаю хорошо. Сон глубокий.", uk: "Відпочиваю добре. Сон глибокий.", en: "I rest well. Sleep is deep." }, p: { tonglen:2, vipassana:1, tummo:1 } },
  ]},
  { id: 18, category: { ru: "СЕРДЦЕ", uk: "СЕРЦЕ", en: "HEART" }, text: { ru: "Что сейчас с твоим сердцем — в переносном смысле?", uk: "Що зараз з твоїм серцем — у переносному сенсі?", en: "How is your heart right now — in the figurative sense?" }, options: [
    { text: { ru: "Закрыто. Защищаюсь.", uk: "Закрите. Захищаюся.", en: "Closed. I'm protecting myself." }, p: { metta:2, tonglen:2, vipassana:1 } },
    { text: { ru: "Болит. За кого-то или за себя.", uk: "Болить. За когось або за себе.", en: "It hurts. For someone or for myself." }, p: { metta:2, tonglen:2, b478:1 } },
    { text: { ru: "Пусто. Не чувствую ничего особенного.", uk: "Порожнє. Не відчуваю нічого особливого.", en: "Empty. I don't feel anything special." }, p: { metta:2, tummo:1, nidra:1 } },
    { text: { ru: "Тревожится. Стучит быстро.", uk: "Тривожиться. Б'ється швидко.", en: "Anxious. Beating fast." }, p: { b478:2, coherent:2, shamatha:1 } },
    { text: { ru: "Спокойно. В равновесии.", uk: "Спокійно. У рівновазі.", en: "Calm. In balance." }, p: { vipassana:2, tonglen:1, shamatha:1 } },
    { text: { ru: "Открыто. Есть тепло и готовность.", uk: "Відкрите. Є тепло і готовність.", en: "Open. There is warmth and readiness." }, p: { tonglen:2, metta:2, vipassana:1 } },
  ]},
  { id: 19, category: { ru: "СЕЙЧАС", uk: "ЗАРАЗ", en: "NOW" }, text: { ru: "Что тебе нужно прямо сейчас больше всего?", uk: "Що тобі потрібно просто зараз найбільше?", en: "What do you need most right now?" }, options: [
    { text: { ru: "Быстро успокоиться. Здесь и сейчас.", uk: "Швидко заспокоїтися. Тут і зараз.", en: "To calm down fast. Here and now." }, p: { b478:2, box:2, coherent:1 } },
    { text: { ru: "Почувствовать себя. Вернуть контакт.", uk: "Відчути себе. Повернути контакт.", en: "To feel myself. Regain contact." }, p: { vipassana:2, nidra:1, shamatha:1 } },
    { text: { ru: "Тепло. Изнутри или снаружи.", uk: "Тепло. Зсередини або ззовні.", en: "Warmth. From inside or outside." }, p: { metta:2, tummo:2, nidra:1 } },
    { text: { ru: "Тишина внутри головы.", uk: "Тиша всередині голови.", en: "Quiet inside the head." }, p: { shamatha:2, coherent:1, b478:1 } },
    { text: { ru: "Глубокий отдых. Раствориться.", uk: "Глибокий відпочинок. Розчинитися.", en: "Deep rest. To dissolve." }, p: { nidra:2, metta:1, coherent:1 } },
    { text: { ru: "Глубина. Выйти за пределы поверхности.", uk: "Глибина. Вийти за межі поверхні.", en: "Depth. Beyond the surface." }, p: { tonglen:2, tummo:1, vipassana:1 } },
  ]},
  { id: 20, category: { ru: "ГОТОВНОСТЬ", uk: "ГОТОВНІСТЬ", en: "READINESS" }, text: { ru: "Какое слово лучше всего описывает тебя сейчас?", uk: "Яке слово найкраще описує тебе зараз?", en: "Which word best describes you right now?" }, options: [
    { text: { ru: "Тревожный(ая).", uk: "Тривожний(а).", en: "Anxious." }, p: { shamatha:2, b478:2, coherent:1 } },
    { text: { ru: "Опустошённый(ая).", uk: "Спустошений(а).", en: "Emptied out." }, p: { tummo:2, metta:1, nidra:1 } },
    { text: { ru: "Напряжённый(ая).", uk: "Напружений(а).", en: "Tense." }, p: { box:2, nidra:1, coherent:2 } },
    { text: { ru: "Потерянный(ая).", uk: "Загублений(а).", en: "Lost." }, p: { vipassana:2, shamatha:1, metta:1 } },
    { text: { ru: "Уставший(ая).", uk: "Втомлений(а).", en: "Tired." }, p: { nidra:2, b478:1, metta:1 } },
    { text: { ru: "Живой(ая).", uk: "Живий(а).", en: "Alive." }, p: { tonglen:2, coherent:1, vipassana:1 } },
  ]},
];


const MEDITATION_RESULTS = {
  shamatha: {
    emoji: "🌙",
    name: { ru: "Шаматха", uk: "Шаматха", en: "Shamatha" },
    fullName: { ru: "Шаматха (Śamatha)", uk: "Шаматха (Śamatha)", en: "Shamatha (Śamatha)" },
    tag: { ru: "Покой", uk: "Спокій", en: "Stillness" },
    tradition: { ru: "Тибетский буддизм · Базовая практика успокоения ума", uk: "Тибетський буддизм · Базова практика заспокоєння розуму", en: "Tibetan Buddhism · Basic mind-calming practice" },
    color: "#8B9EB0",
    why: { ru: "Твои мысли сейчас бегут быстрее тебя — тревога, хаос, внутренний шум. Шаматха не останавливает их силой. Она учит одному: возвращаться. Снова и снова. Это и есть практика.", uk: "Твої думки зараз біжать швидше за тебе — тривога, хаос, внутрішній шум. Шаматха не зупиняє їх силою. Вона вчить одному: повертатися. Знову і знову. Це і є практика.", en: "Your thoughts are running faster than you — anxiety, chaos, inner noise. Shamatha doesn't stop them by force. It teaches one thing: return. Again and again. That is the practice." },
    steps: [
      { ru: "Сядь прямо — на стул или на пол. Руки на коленях ладонями вниз.", uk: "Сядь прямо — на стілець або на підлогу. Руки на колінах долонями вниз.", en: "Sit upright — on a chair or the floor. Hands on knees, palms down." },
      { ru: "Глаза чуть приоткрыты, взгляд вниз под 45° — так меньше сонливости.", uk: "Очі трохи привідкриті, погляд вниз під 45° — так менше сонливості.", en: "Eyes slightly open, gaze down at 45° — less drowsiness that way." },
      { ru: "Найди ощущение дыхания на кончике носа. Прохлада на вдохе. Тепло на выдохе. Это твой якорь.", uk: "Знайди відчуття дихання на кінчику носа. Прохолода на вдиху. Тепло на видиху. Це твій якір.", en: "Find the sensation of breath at the tip of the nose. Cool on the in-breath. Warm on the out-breath. That is your anchor." },
      { ru: "Когда мысль уведёт — а она уведёт, это нормально — просто заметь и без раздражения вернись к носу.", uk: "Коли думка відведе — а вона відведе, це нормально — просто поміть і без роздратування повернись до носа.", en: "When a thought pulls you away — and it will, that's normal — just notice and return to the nose without irritation." },
      { ru: "Каждое возвращение и есть медитация. Не борьба. Возвращение.", uk: "Кожне повернення і є медитація. Не боротьба. Повернення.", en: "Every return is the meditation. Not a fight. A return." },
    ],
    duration: { ru: "10–15 минут · каждый день важнее чем долго", uk: "10–15 хвилин · кожен день важливіший ніж довго", en: "10–15 min · every day matters more than long sessions" },
    source: "Калу Ринпоче «Основы тибетского буддизма» · Шамар Ринпоче «Путь к освобождению»",
  },
  vipassana: {
    emoji: "✦",
    name: { ru: "Випассана", uk: "Віпассана", en: "Vipassana" },
    fullName: { ru: "Випассана (Vipassanā)", uk: "Віпассана (Vipassanā)", en: "Vipassana (Vipassanā)" },
    tag: { ru: "Ясность", uk: "Ясність", en: "Clarity" },
    tradition: { ru: "Тхеравада · Проникновение в природу опыта", uk: "Тхеравада · Проникнення в природу досвіду", en: "Theravada · Insight into the nature of experience" },
    color: "#7A9E7E",
    why: { ru: "Ты не до конца понимаешь, что с тобой происходит. Випассана — это не расслабление. Это честный взгляд: что есть прямо сейчас, без истории и оценки.", uk: "Ти не до кінця розумієш, що з тобою відбувається. Віпассана — це не розслаблення. Це чесний погляд: що є просто зараз, без історії й оцінки.", en: "You don't fully understand what's happening with you. Vipassana is not relaxation. It's an honest look: what is right now, without story or judgment." },
    steps: [
      { ru: "Сядь удобно, закрой глаза. Замечай подъём и опускание живота при дыхании.", uk: "Сядь зручно, закрий очі. Помічай підйом і опускання живота при диханні.", en: "Sit comfortably, close your eyes. Notice the rise and fall of the belly with breath." },
      { ru: "Мысленно называй: «подъём... опускание... подъём...»", uk: "Мисленно називай: «підйом... опускання... підйом...»", en: "Mentally label: 'rising... falling... rising...'" },
      { ru: "Появился звук — «слышу». Мысль — «думаю». Ощущение — «чувствую».", uk: "З'явився звук — «чую». Думка — «думаю». Відчуття — «відчуваю».", en: "A sound appears — 'hearing'. A thought — 'thinking'. A sensation — 'feeling'." },
      { ru: "Ты не анализируешь — только регистрируешь что есть прямо сейчас.", uk: "Ти не аналізуєш — лише реєструєш що є просто зараз.", en: "You don't analyze — you only register what is right now." },
      { ru: "Называние не даёт провалиться внутрь мысли. Ты остаёшься наблюдателем. Туман начнёт редеть.", uk: "Називання не дає провалитися всередину думки. Ти залишаєшся спостерігачем. Туман почне рідшати.", en: "Naming keeps you from falling into the thought. You stay the observer. The fog will thin." },
    ],
    duration: { ru: "15–20 минут · первые дни мыслей может быть больше — практика всё равно работает", uk: "15–20 хвилин · перші дні думок може бути більше — практика все одно працює", en: "15–20 min · first days may have more thoughts — practice still works" },
    source: "С.Н. Гоенка — 10-дневные ретриты Випассаны (по всему миру, бесплатно)",
  },
  metta: {
    emoji: "🕯️",
    name: { ru: "Метта", uk: "Метта", en: "Metta" },
    fullName: { ru: "Метта (Mettā)", uk: "Метта (Mettā)", en: "Metta (Mettā)" },
    tag: { ru: "Тепло", uk: "Тепло", en: "Warmth" },
    tradition: { ru: "Тхеравада · Любящая доброта", uk: "Тхеравада · Любляча доброта", en: "Theravada · Loving-kindness" },
    color: "#C8A97E",
    why: { ru: "Внутри холодно или пусто — от людей, от себя, от дня. Метта не требует любить весь мир. Она начинает с простого: пожелать себе хотя бы чуть-чуть тепла.", uk: "Всередині холодно або порожньо — від людей, від себе, від дня. Метта не вимагає любити весь світ. Вона починає з простого: побажати собі хоч трохи тепла.", en: "It's cold or empty inside — from people, from yourself, from the day. Metta doesn't require loving the whole world. It starts simple: wish yourself at least a little warmth." },
    steps: [
      { ru: "Сядь удобно. Положи правую руку на грудь — туда где сердце.", uk: "Сядь зручно. Поклади праву руку на груди — туди де серце.", en: "Sit comfortably. Place the right hand on the chest — where the heart is." },
      { ru: "Вспомни любой момент когда тебе было хорошо — даже совсем маленький. Почувствуй это тепло.", uk: "Згадай будь-який момент коли тобі було добре — навіть зовсім маленький. Відчуй це тепло.", en: "Recall any moment when you felt good — even a tiny one. Feel that warmth." },
      { ru: "Мысленно скажи себе — медленно, с паузами:\n«Пусть я буду счастлив.»\n«Пусть я буду в покое.»\n«Пусть мне будет хорошо.»", uk: "Мисленно скажи собі — повільно, з паузами:\n«Нехай я буду щасливий.»\n«Нехай я буду в спокої.»\n«Нехай мені буде добре.»", en: "Mentally say to yourself — slowly, with pauses:\n'May I be happy.'\n'May I be at peace.'\n'May I be well.'" },
      { ru: "Не нужно верить. Просто говори и замечай что происходит в груди.", uk: "Не потрібно вірити. Просто говори і помічай що відбувається в грудях.", en: "You don't need to believe. Just speak and notice what happens in the chest." },
      { ru: "Потом то же самое — близкому человеку. Потом нейтральному. Потом всем.", uk: "Потім те саме — близькій людині. Потім нейтральній. Потім усім.", en: "Then the same — to someone close. Then a neutral person. Then everyone." },
    ],
    duration: { ru: "10–15 минут · можно начинать только с себя — это честнее", uk: "10–15 хвилин · можна починати лише з себе — це чесніше", en: "10–15 min · you can start with yourself only — more honest" },
    source: "Шарон Зальцберг «Loving-Kindness» · Тит Нат Хан «Искусство любить»",
  },
  tummo: {
    emoji: "🔥",
    name: { ru: "Туммо", uk: "Туммо", en: "Tummo" },
    fullName: { ru: "Туммо (gtum-mo)", uk: "Туммо (gtum-mo)", en: "Tummo (gtum-mo)" },
    tag: { ru: "Огонь", uk: "Вогонь", en: "Fire" },
    tradition: { ru: "Тибетский буддизм · Внутренний жар", uk: "Тибетський буддизм · Внутрішній жар", en: "Tibetan Buddhism · Inner heat" },
    color: "#B87333",
    why: { ru: "Внутри холодно, нет сил, апатия. Туммо работает с телом и дыханием, чтобы вернуть внутренний огонь — не возбуждение, а живое тепло.", uk: "Всередині холодно, немає сил, апатія. Туммо працює з тілом і диханням, щоб повернути внутрішній вогонь — не збудження, а живе тепло.", en: "Cold inside, no strength, apathy. Tummo works with body and breath to bring back inner fire — not agitation, but living warmth." },
    steps: [
      { ru: "Сядь прямо, руки на коленях.", uk: "Сядь прямо, руки на колінах.", en: "Sit upright, hands on knees." },
      { ru: "Полный вдох через нос — сначала наполни живот, потом грудь. Задержи на 3–4 секунды.", uk: "Повний вдих через ніс — спочатку наповни живіт, потім груди. Затримай на 3–4 секунди.", en: "Full in-breath through the nose — fill the belly first, then the chest. Hold 3–4 seconds." },
      { ru: "Выдыхай через рот медленно — губы чуть сжаты, лёгкое усилие.", uk: "Видихай через рот повільно — губи трохи стиснуті, легке зусилля.", en: "Exhale through the mouth slowly — lips slightly pursed, light effort." },
      { ru: "Пока выдыхаешь — представляй: в области пупка маленький огонёк. С каждым выдохом он разгорается. Поднимается по позвоночнику. Наполняет грудь теплом.", uk: "Поки видихаєш — уявляй: в області пупка маленький вогник. З кожним видихом він розгорається. Піднімається по хребту. Наповнює груди теплом.", en: "While exhaling — imagine a small flame at the navel. With each out-breath it grows. Rises along the spine. Fills the chest with warmth." },
      { ru: "20–30 циклов. Не торопись. После — полежи минуту, почувствуй тело.", uk: "20–30 циклів. Не поспішай. Після — полежати хвилину, відчуй тіло.", en: "20–30 cycles. Don't rush. After — lie for a minute, feel the body." },
    ],
    duration: { ru: "10–15 минут", uk: "10–15 хвилин", en: "10–15 minutes" },
    source: "Чогьям Трунгпа «Шесть йог Наропы» · Исследования Герберта Бенсона, Harvard Medical School, 1982",
  },
  nidra: {
    emoji: "🌊",
    name: { ru: "Йога-нидра", uk: "Йога-нідра", en: "Yoga Nidra" },
    fullName: { ru: "Йога-нидра", uk: "Йога-нідра", en: "Yoga Nidra" },
    tag: { ru: "Глубокий отдых", uk: "Глибокий відпочинок", en: "Deep rest" },
    tradition: { ru: "Йога · Йогаический сон", uk: "Йога · Йогічний сон", en: "Yoga · Yogic sleep" },
    color: "#7B9EB0",
    why: { ru: "Тело держит напряжение даже когда ты «отдыхаешь». Нидра — это отдых без усилия: сознание мягко ведёт тело в глубокое расслабление.", uk: "Тіло тримає напругу навіть коли ти «відпочиваєш». Нідра — це відпочинок без зусилля: свідомість м'яко веде тіло в глибоке розслаблення.", en: "The body holds tension even when you 'rest'. Nidra is effortless rest: awareness gently guides the body into deep relaxation." },
    steps: [
      { ru: "Ляг на спину. Руки чуть в стороны, ладони вверх. Три медленных вдоха.", uk: "Ляж на спину. Руки трохи в сторони, долоні вгору. Три повільних вдихи.", en: "Lie on your back. Arms slightly out, palms up. Three slow breaths." },
      { ru: "Медленно веди внимание по телу — не напрягай, просто касайся вниманием и отпускай:", uk: "Повільно веди увагу по тілу — не напружуй, просто торкайся увагою і відпускай:", en: "Slowly guide attention through the body — don't tense, just touch with attention and release:" },
      { ru: "Правый большой палец → пальцы → ладонь → запястье → предплечье → локоть → плечо → шея → ухо → глаз → щека → губы → подбородок...", uk: "Правий великий палець → пальці → долоня → зап'ястя → передпліччя → лікоть → плече → шия → вухо → око → щока → губи → підборіддя...", en: "Right thumb → fingers → palm → wrist → forearm → elbow → shoulder → neck → ear → eye → cheek → lips → chin..." },
      { ru: "И так по всему телу. На каждой точке — секунда.", uk: "І так по всьому тілу. На кожній точці — секунда.", en: "And so through the whole body. One second at each point." },
      { ru: "В конце почувствуй всё тело сразу — тяжёлое, тёплое, единое.", uk: "Наприкінці відчуй усе тіло одразу — важке, тепле, єдине.", en: "At the end feel the whole body at once — heavy, warm, one." },
    ],
    duration: { ru: "20–40 минут · можно под аудиогид — на YouTube тысячи записей бесплатно", uk: "20–40 хвилин · можна під аудіогід — на YouTube тисячі записів безкоштовно", en: "20–40 min · audio guide optional — thousands free on YouTube" },
    source: "Свами Сатьянанда «Йога-нидра» · Приложение Insight Timer",
  },
  tonglen: {
    emoji: "🌑",
    name: { ru: "Тонглен", uk: "Тонглен", en: "Tonglen" },
    fullName: { ru: "Тонглен (gtong-len)", uk: "Тонглен (gtong-len)", en: "Tonglen (gtong-len)" },
    tag: { ru: "Открытость", uk: "Відкритість", en: "Openness" },
    tradition: { ru: "Тибетский буддизм · Принятие и отдача", uk: "Тибетський буддизм · Прийняття і віддача", en: "Tibetan Buddhism · Taking and sending" },
    color: "#9E7AB0",
    why: { ru: "Энергия есть, и ты готов(а) к глубине. Тонглен — практика дыхания, где ты не убегаешь от боли, а встречаешь её и отпускаешь.", uk: "Енергія є, і ти готовий(а) до глибини. Тонглен — практика дихання, де ти не тікаєш від болю, а зустрічаєш його і відпускаєш.", en: "Energy is there, and you're ready for depth. Tonglen is a breath practice where you don't flee pain — you meet it and let go." },
    steps: [
      { ru: "Сядь удобно, закрой глаза. Несколько вдохов — просто успокойся.", uk: "Сядь зручно, закрий очі. Кілька вдихів — просто заспокойся.", en: "Sit comfortably, close your eyes. A few breaths — just settle." },
      { ru: "На вдохе — представляй тёмный густой дым который входит в тебя. Это боль — чья-то или твоя прошлая. Не бойся. Ты принимаешь её в сердце.", uk: "На вдиху — уявляй темний густий дим який входить у тебе. Це біль — чийсь або твій минулий. Не бійся. Ти приймаєш його в серце.", en: "On the in-breath — imagine dark thick smoke entering you. That is pain — someone's or your past. Don't fear. You receive it in the heart." },
      { ru: "На выдохе — из сердца выходит чистый белый свет. Тепло. Пространство. Ты отдаёшь его — себе, кому-то конкретному, всем.", uk: "На видиху — з серця виходить чисте біле світло. Тепло. Простір. Ти віддаєш його — собі, комусь конкретному, усім.", en: "On the out-breath — pure white light leaves the heart. Warmth. Space. You give it — to yourself, to someone specific, to all." },
      { ru: "Вдох — тёмное. Выдох — светлое. Ритмично. Без усилия.", uk: "Вдих — темне. Видих — світле. Ритмічно. Без зусилля.", en: "In — dark. Out — light. Rhythmic. Without force." },
      { ru: "Это не истощает — это открывает. Чогьям Трунгпа называл это «лекарством от страха».", uk: "Це не виснажує — це відкриває. Чог'ям Трунгпа називав це «ліками від страху».", en: "This does not deplete — it opens. Chögyam Trungpa called it 'medicine for fear'." },
    ],
    duration: { ru: "10–15 минут", uk: "10–15 хвилин", en: "10–15 minutes" },
    source: "Пема Чодрон «Когда всё рушится» · Чогьям Трунгпа «Тренировка ума» · Патрул Ринпоче",
  },
  b478: {
    emoji: "🌬️",
    name: { ru: "4-7-8", uk: "4-7-8", en: "4-7-8" },
    fullName: { ru: "Дыхание 4-7-8", uk: "Дихання 4-7-8", en: "4-7-8 Breathing" },
    tag: { ru: "Быстрый покой", uk: "Швидкий спокій", en: "Quick calm" },
    tradition: { ru: "Современная физиология · Техника Эндрю Вейла", uk: "Сучасна фізіологія · Техніка Ендрю Вейла", en: "Modern physiology · Andrew Weil technique" },
    color: "#8BA89E",
    why: { ru: "Тебе нужно успокоиться здесь и сейчас. 4-7-8 работает через физиологию: удлиненный выдох включает парасимпатику.", uk: "Тобі потрібно заспокоїтися тут і зараз. 4-7-8 працює через фізіологію: подовжений видих вмикає парасимпатику.", en: "You need to calm down here and now. 4-7-8 works through physiology: a longer exhale activates the parasympathetic system." },
    steps: [
      { ru: "Сядь или ляг. Кончик языка у верхних зубов — держи так всё время.", uk: "Сядь або ляж. Кінчик язика біля верхніх зубів — тримай так увесь час.", en: "Sit or lie. Tip of the tongue at the upper teeth — keep it there the whole time." },
      { ru: "Выдохни полностью через рот с лёгким звуком.", uk: "Видихни повністю через рот з легким звуком.", en: "Exhale fully through the mouth with a light sound." },
      { ru: "Вдохни через нос, считая до 4.", uk: "Вдихни через ніс, рахуючи до 4.", en: "Inhale through the nose, counting to 4." },
      { ru: "Задержи дыхание, считая до 7.", uk: "Затримай дихання, рахуючи до 7.", en: "Hold the breath, counting to 7." },
      { ru: "Выдыхай через рот со звуком, считая до 8.", uk: "Видихай через рот зі звуком, рахуючи до 8.", en: "Exhale through the mouth with sound, counting to 8." },
      { ru: "Это один цикл. Сделай 4 цикла — не больше в первый раз, может закружиться голова.", uk: "Це один цикл. Зроби 4 цикли — не більше вперше, може закрутитися голова.", en: "That is one cycle. Do 4 cycles — no more the first time; the head may spin." },
    ],
    duration: { ru: "2–3 минуты · эффект заметен сразу · перед сном особенно сильно", uk: "2–3 хвилини · ефект помітний одразу · перед сном особливо сильно", en: "2–3 min · effect is immediate · especially strong before sleep" },
    source: "Dr. Andrew Weil «Breathing: The Master Key to Self Healing»",
  },
  box: {
    emoji: "⬜",
    name: { ru: "Квадрат", uk: "Квадрат", en: "Box breath" },
    fullName: { ru: "Квадратное дыхание", uk: "Квадратне дихання", en: "Box breathing" },
    tag: { ru: "Структура", uk: "Структура", en: "Structure" },
    tradition: { ru: "Военные / спецслужбы · Равномерный ритм", uk: "Військові / спецслужби · Рівномірний ритм", en: "Military / special forces · Even rhythm" },
    color: "#9E9E8A",
    why: { ru: "Перегруз и хаос. Квадратное дыхание даёт уму чёткую рамку: вдох — пауза — выдох — пауза. Ритм вместо шума.", uk: "Перевантаження і хаос. Квадратне дихання дає розуму чітку рамку: вдих — пауза — видих — пауза. Ритм замість шуму.", en: "Overload and chaos. Box breathing gives the mind a clear frame: in — hold — out — hold. Rhythm instead of noise." },
    steps: [
      { ru: "Представь квадрат. Каждая сторона — 4 секунды.", uk: "Уяви квадрат. Кожна сторона — 4 секунди.", en: "Imagine a square. Each side — 4 seconds." },
      { ru: "Вдох через нос — 4 секунды.", uk: "Вдих через ніс — 4 секунди.", en: "In through the nose — 4 seconds." },
      { ru: { ru: "Задержка — 4 секунды.", uk: "Затримка — 4 секунди.", en: "Hold — 4 seconds." }, uk: "Затримка — 4 секунди.", en: "Hold — 4 seconds." },
      { ru: "Выдох через рот — 4 секунды.", uk: "Видих через рот — 4 секунди.", en: "Out through the mouth — 4 seconds." },
      { ru: "Задержка — 4 секунды.", uk: "Затримка — 4 секунди.", en: "Hold — 4 seconds." },
      { ru: "Повтори 4–6 раз. Можно делать прямо на рабочем месте — никто не заметит.", uk: "Повтори 4–6 разів. Можна робити прямо на робочому місці — ніхто не помітить.", en: "Repeat 4–6 times. You can do it at the workplace — no one will notice." },
    ],
    duration: { ru: "2–4 минуты · можно в любом месте и положении", uk: "2–4 хвилини · можна в будь-якому місці і положенні", en: "2–4 min · any place and position" },
    source: "Mark Divine «Unbeatable Mind» · Исследования Stanford Neuroscience, 2023",
  },
  coherent: {
    emoji: "🌀",
    name: { ru: "Когерентное", uk: "Когерентне", en: "Coherent" },
    fullName: { ru: "Когерентное дыхание", uk: "Когерентне дихання", en: "Coherent breathing" },
    tag: { ru: "Равновесие", uk: "Рівновага", en: "Balance" },
    tradition: { ru: "HeartMath / физиология · 5–6 дыханий в минуту", uk: "HeartMath / фізіологія · 5–6 вдихів на хвилину", en: "HeartMath / physiology · 5–6 breaths per minute" },
    color: "#8E9E8A",
    why: { ru: "Нужно выровнять систему. Когерентное дыхание синхронизирует сердце и нервную систему — мягко, без усилий.", uk: "Потрібно вирівняти систему. Когерентне дихання синхронізує серце і нервову систему — м'яко, без зусиль.", en: "The system needs leveling. Coherent breathing synchronizes heart and nervous system — gently, without force." },
    steps: [
      { ru: "Сядь удобно. Дыши только через нос.", uk: "Сядь зручно. Дихай лише через ніс.", en: "Sit comfortably. Breathe only through the nose." },
      { ru: "Вдох — 5 секунд.", uk: "Вдих — 5 секунд.", en: "In — 5 seconds." },
      { ru: "Выдох — 5 секунд.", uk: "Видих — 5 секунд.", en: "Out — 5 seconds." },
      { ru: "Без пауз. Непрерывно. Плавно. Как волна.", uk: "Без пауз. Безперервно. Плавно. Як хвиля.", en: "No pauses. Continuous. Smooth. Like a wave." },
      { ru: "Первые минуты кажется медленно — это нормально. К 3-й минуте тело начнёт подстраиваться. К 5-й — почувствуешь ровность.", uk: "Перші хвилини здається повільно — це нормально. До 3-ї хвилини тіло почне підлаштовуватися. До 5-ї — відчуєш рівність.", en: "The first minutes feel slow — normal. By minute 3 the body starts adjusting. By 5 — you'll feel evenness." },
    ],
    duration: { ru: "5–10 минут · можно делать ежедневно утром", uk: "5–10 хвилин · можна робити щодня вранці", en: "5–10 min · can be done daily in the morning" },
    source: "Stephen Elliott «The New Science of Breath» · Институт HeartMath",
  },
};

// ─────────────────────────────────────────────
// УТИЛИТЫ
// ─────────────────────────────────────────────
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function getDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

function shareText(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://t.me/share/url?url=t.me/TeaBroLifeBot/TeaBro&text=${encoded}`;
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    window.open(url, "_blank");
  }
}

function ShareButton({ text, label }) {
  const { tx } = useLang();
  const resolvedLabel = label ?? tx({ ru: "Поделиться с другом ↗", uk: "Поділитися з другом ↗", en: "Share with a friend ↗" });
  return <button onClick={() => shareText(text)} style={S.shareBtn}>{resolvedLabel}</button>;
}

function HintPopup({ text }) {
  const { theme, tx } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative", marginBottom:"20px" }}>
      <button onClick={() => setOpen(o => !o)} style={S.hintBtn}>ℹ</button>
      {open && (
        <div style={{ position:"absolute", right:0, top:"30px", width:"220px", background:c.softBg, border:`1px solid ${isDark?"#2A2520":c.line}`, borderRadius:"10px", padding:"12px", fontSize:"12px", color:c.inkMuted, lineHeight:1.6, zIndex:100 }}>
          {text}
          <button onClick={() => setOpen(false)} style={{ display:"block", marginTop:"8px", background:"none", border:"none", color:c.inkSoft, cursor:"pointer", fontSize:"11px" }}>{tx({ru:'закрыть',uk:'закрити',en:'close'})}</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ИНФО-КНОПКА (ⓘ) С ТУЛТИПОМ — для метрик
// ─────────────────────────────────────────────
function InfoButton({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <div ref={ref} style={{ position:"relative", flexShrink:0 }}>
      <button onClick={() => setOpen(o => !o)} style={S.infoBtn}>i</button>
      {open && (
        <div style={S.infoTooltip}>
          <p style={{ margin:0 }}>{text}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// УНИВЕРСАЛЬНЫЙ МЕТРИК-БЛОК
// большое число % + шкала с маркером + подпись справа
// ─────────────────────────────────────────────
function MetricBlock({ value, rightName, rightSub, fillFrom, fillTo, scaleLabels, hiIndex, quote, numColor, dotColor, borderColor, others, animKey }) {
  const [animVal, setAnimVal] = useState(0);
  const [animWidth, setAnimWidth] = useState(0);
  useEffect(() => {
    setAnimVal(0);
    setAnimWidth(0);
    const t1 = setTimeout(() => {
      setAnimWidth(value);
      let n = 0;
      const step = Math.max(1, Math.ceil(value / 40));
      const t = setInterval(() => {
        n = Math.min(n + step, value);
        setAnimVal(n);
        if (n >= value) clearInterval(t);
      }, 20);
    }, 150);
    return () => clearTimeout(t1);
  }, [value, animKey]);

  return (
    <div style={{ ...S.metricBlock, ...(borderColor ? { borderColor } : {}) }}>
      <div style={S.metricTop}>
        <div style={S.metricNumWrap}>
          <span style={{ ...S.metricNum, color: numColor || "#C8A97E" }}>{animVal}</span>
          <span style={S.metricUnit}>%</span>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={S.metricRightName}>{rightName}</p>
          {rightSub && <p style={S.metricRightSub}>{rightSub}</p>}
        </div>
      </div>
      <div style={S.metricTrack}>
        <div style={{ ...S.metricFill, width:`${animWidth}%`, background:`linear-gradient(90deg, ${fillFrom}, ${fillTo})` }}>
          <span style={{ ...S.metricFillDot, background: dotColor || fillTo, boxShadow:`0 0 10px ${(dotColor||fillTo)}80` }} />
        </div>
      </div>
      <div style={S.scaleLabels}>
        {scaleLabels.map((l, i) => (
          <span key={i} style={i === hiIndex ? { ...S.scaleLabelHi, color: numColor || "#C8A97E" } : S.scaleLabel}>
            {l}{i === hiIndex ? " ◉" : ""}
          </span>
        ))}
      </div>
      {quote && (
        <div style={{ ...S.metricQuote, ...(borderColor ? { borderLeftColor: (numColor||"#C8A97E")+"40" } : {}) }}>
          <p style={S.metricQuoteText}>{quote}</p>
        </div>
      )}
      {others && others.length > 0 && (
        <div style={S.othersList}>
          {others.map((o, i) => (
            <div key={i} style={S.otherRow}>
              <span style={S.otherEmoji}>{o.emoji}</span>
              <span style={S.otherName}>{o.name}</span>
              <span style={S.otherPct}>{o.pct}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ТЕРМОМЕТР ВЫГОРАНИЯ — 4 зоны + маркер
// ─────────────────────────────────────────────
function BurnoutThermo({ value, rightName, rightSub, quote, animKey }) {
  const [animVal, setAnimVal] = useState(0);
  const [animLeft, setAnimLeft] = useState(0);
  useEffect(() => {
    setAnimVal(0);
    setAnimLeft(0);
    const t1 = setTimeout(() => {
      setAnimLeft(value);
      let n = 0;
      const step = Math.max(1, Math.ceil(value / 40));
      const t = setInterval(() => {
        n = Math.min(n + step, value);
        setAnimVal(n);
        if (n >= value) clearInterval(t);
      }, 20);
    }, 200);
    return () => clearTimeout(t1);
  }, [value, animKey]);

  const hiIndex = value <= 25 ? 0 : value <= 50 ? 1 : value <= 75 ? 2 : 3;
  const labels = ["НЕТ", "НАЧАЛО", "СРЕДНЕЕ", "ГЛУБОКОЕ"];

  return (
    <div style={S.metricBlock}>
      <div style={S.metricTop}>
        <div style={S.metricNumWrap}>
          <span style={{ ...S.metricNum, color:"#C8B878" }}>{animVal}</span>
          <span style={S.metricUnit}>%</span>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={S.metricRightName}>{rightName}</p>
          {rightSub && <p style={S.metricRightSub}>{rightSub}</p>}
        </div>
      </div>
      <div style={S.thermoWrap}>
        <div style={S.thermoZones}>
          <div style={{ ...S.thermoZone, background:"#2A4A2A" }} />
          <div style={{ ...S.thermoZone, background:"#4A4A1A" }} />
          <div style={{ ...S.thermoZone, background:"#5A3010" }} />
          <div style={{ ...S.thermoZone, background:"#5A1A1A" }} />
        </div>
        <div style={{ ...S.thermoMarker, left:`${animLeft}%` }} />
      </div>
      <div style={{ ...S.scaleLabels, marginTop:"10px" }}>
        {labels.map((l, i) => (
          <span key={i} style={i === hiIndex ? { ...S.scaleLabelHi, color:"#C8B878" } : S.scaleLabel}>
            {l}{i === hiIndex ? " ◉" : ""}
          </span>
        ))}
      </div>
      {quote && <div style={S.metricQuote}><p style={S.metricQuoteText}>{quote}</p></div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// ИСТОРИЯ РЕЗУЛЬТАТОВ — CloudStorage хелперы
// ─────────────────────────────────────────────
const HISTORY_LIMIT = 20;

async function pushHistory(key, entry) {
  try {
    const raw = await CS.get(key);
    let arr = raw ? JSON.parse(raw) : [];
    arr.push({ ...entry, ts: Date.now() });
    if (arr.length > HISTORY_LIMIT) arr = arr.slice(arr.length - HISTORY_LIMIT);
    await CS.set(key, JSON.stringify(arr));
    return arr;
  } catch {
    return [];
  }
}

async function getHistory(key) {
  try {
    const raw = await CS.get(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// считает % распределения по полю winner/result в массиве истории
function calcDistribution(history, field = "winner") {
  if (!history || history.length === 0) return [];
  const counts = {};
  history.forEach(h => { const k = h[field]; if (k) counts[k] = (counts[k]||0)+1; });
  const total = history.length;
  return Object.entries(counts)
    .map(([key, count]) => ({ key, count, pct: Math.round((count/total)*100) }))
    .sort((a,b) => b.count - a.count);
}

// средние последних N записей опросника
function calcQuizAverage(history, n = 3) {
  if (!history || history.length === 0) return null;
  const last = history.slice(-n);
  const avgScore = last.reduce((s,h) => s + (h.score||0), 0) / last.length;
  const avgBurnout = last.reduce((s,h) => s + (h.burnout||0), 0) / last.length;
  return { avgScore, avgBurnout, count: last.length };
}

// ─────────────────────────────────────────────
// КОМПАС СОСТОЯНИЯ — лёгкий ежедневный чек-ин
// ─────────────────────────────────────────────
// 10 показателей. Во всех вопросах score 5 = хорошо/спокойно, score 1 = плохо/тревожно —
// направление специально выровнено по всем 10, чтобы группировка ниже была простой.
const DAILYCHECK_QUESTIONS = [
  { key: "energy", label: { ru: "Энергия", uk: "Енергія", en: "Energy" }, text: { ru: "Сколько у тебя сейчас сил?", uk: "Скільки в тебе зараз сил?", en: "How much strength do you have right now?" }, options: [
    { text: { ru: "Почти на нуле", uk: "Майже на нулі", en: "Almost at zero" }, score: 1 },
    { text: { ru: "Мало, через силу", uk: "Мало, через силу", en: "Very little, forcing myself" }, score: 2 },
    { text: { ru: "Средне", uk: "Середньо", en: "Average" }, score: 3 },
    { text: { ru: "Хватает на дела", uk: "Вистачає на справи", en: "Enough for what I need" }, score: 4 },
    { text: { ru: "Полно сил", uk: "Повно сил", en: "Plenty of energy" }, score: 5 },
  ]},
  { key: "mood", label: { ru: "Настроение", uk: "Настрій", en: "Mood" }, text: { ru: "Какое сейчас настроение?", uk: "Який зараз настрій?", en: "How's your mood right now?" }, options: [
    { text: { ru: "Совсем тяжело", uk: "Зовсім важко", en: "Really heavy" }, score: 1 },
    { text: { ru: "Скорее плохое", uk: "Скоріше погане", en: "Rather bad" }, score: 2 },
    { text: { ru: "Никакое", uk: "Ніяке", en: "Neutral, flat" }, score: 3 },
    { text: { ru: "Скорее хорошее", uk: "Скоріше добре", en: "Rather good" }, score: 4 },
    { text: { ru: "Легко и светло", uk: "Легко і світло", en: "Light and easy" }, score: 5 },
  ]},
  { key: "tension", label: { ru: "Напряжение", uk: "Напруга", en: "Tension" }, text: { ru: "Насколько тело/голова напряжены?", uk: "Наскільки тіло/голова напружені?", en: "How tense is your body/mind?" }, options: [
    { text: { ru: "Как натянутая струна", uk: "Як натягнута струна", en: "Wound up like a spring" }, score: 1 },
    { text: { ru: "Сильно напряжён(а)", uk: "Сильно напружений(а)", en: "Quite tense" }, score: 2 },
    { text: { ru: "Есть немного", uk: "Є трохи", en: "A bit" }, score: 3 },
    { text: { ru: "Скорее расслаблен(а)", uk: "Скоріше розслаблений(а)", en: "Rather relaxed" }, score: 4 },
    { text: { ru: "Полностью расслаблен(а)", uk: "Повністю розслаблений(а)", en: "Fully relaxed" }, score: 5 },
  ]},
  { key: "anxiety", label: { ru: "Тревожность", uk: "Тривожність", en: "Anxiety" }, text: { ru: "Насколько сейчас тревожно?", uk: "Наскільки зараз тривожно?", en: "How anxious do you feel right now?" }, options: [
    { text: { ru: "Очень тревожно", uk: "Дуже тривожно", en: "Very anxious" }, score: 1 },
    { text: { ru: "Заметно тревожно", uk: "Помітно тривожно", en: "Noticeably anxious" }, score: 2 },
    { text: { ru: "Немного есть", uk: "Трохи є", en: "A little" }, score: 3 },
    { text: { ru: "Почти спокоен(на)", uk: "Майже спокійний(а)", en: "Almost calm" }, score: 4 },
    { text: { ru: "Полностью спокоен(на)", uk: "Повністю спокійний(а)", en: "Completely calm" }, score: 5 },
  ]},
  { key: "fatigue", label: { ru: "Усталость", uk: "Втома", en: "Fatigue" }, text: { ru: "Насколько ты устал(а)?", uk: "Наскільки ти втомлений(а)?", en: "How tired are you?" }, options: [
    { text: { ru: "Вымотан(а) до предела", uk: "Виснажений(а) до краю", en: "Exhausted to the limit" }, score: 1 },
    { text: { ru: "Сильно устал(а)", uk: "Сильно втомлений(а)", en: "Very tired" }, score: 2 },
    { text: { ru: "Есть усталость", uk: "Є втома", en: "Somewhat tired" }, score: 3 },
    { text: { ru: "Скорее бодр(а)", uk: "Скоріше бадьорий(а)", en: "Rather alert" }, score: 4 },
    { text: { ru: "Совсем не устал(а)", uk: "Зовсім не втомлений(а)", en: "Not tired at all" }, score: 5 },
  ]},
  { key: "sleep", label: { ru: "Сон", uk: "Сон", en: "Sleep" }, text: { ru: "Как спал(а) в последнее время?", uk: "Як спав(ла) останнім часом?", en: "How have you been sleeping lately?" }, options: [
    { text: { ru: "Почти не сплю", uk: "Майже не сплю", en: "Barely sleeping" }, score: 1 },
    { text: { ru: "Сон плохой, урывками", uk: "Сон поганий, уривками", en: "Poor, broken sleep" }, score: 2 },
    { text: { ru: "Средне", uk: "Середньо", en: "Average" }, score: 3 },
    { text: { ru: "В целом хорошо", uk: "Загалом добре", en: "Mostly good" }, score: 4 },
    { text: { ru: "Сплю отлично", uk: "Сплю відмінно", en: "Sleeping great" }, score: 5 },
  ]},
  { key: "focus", label: { ru: "Концентрация", uk: "Концентрація", en: "Focus" }, text: { ru: "Легко ли сейчас сосредоточиться?", uk: "Чи легко зараз зосередитися?", en: "Is it easy to focus right now?" }, options: [
    { text: { ru: "В голове туман", uk: "У голові туман", en: "Foggy-headed" }, score: 1 },
    { text: { ru: "Постоянно отвлекаюсь", uk: "Постійно відволікаюся", en: "Constantly distracted" }, score: 2 },
    { text: { ru: "Средне", uk: "Середньо", en: "Average" }, score: 3 },
    { text: { ru: "В целом собран(а)", uk: "Загалом зібраний(а)", en: "Reasonably focused" }, score: 4 },
    { text: { ru: "Ясная голова", uk: "Ясна голова", en: "Clear-headed" }, score: 5 },
  ]},
  { key: "social", label: { ru: "Общение", uk: "Спілкування", en: "Social" }, text: { ru: "Есть желание общаться с людьми?", uk: "Є бажання спілкуватися з людьми?", en: "Do you feel like connecting with people?" }, options: [
    { text: { ru: "Хочу побыть в одиночестве", uk: "Хочу побути на самоті", en: "I want to be alone" }, score: 1 },
    { text: { ru: "Скорее нет настроения", uk: "Скоріше немає настрою", en: "Not really in the mood" }, score: 2 },
    { text: { ru: "Как получится", uk: "Як вийде", en: "Whatever happens" }, score: 3 },
    { text: { ru: "Скорее хочется", uk: "Скоріше хочеться", en: "Rather want to" }, score: 4 },
    { text: { ru: "Очень хочется к людям", uk: "Дуже хочеться до людей", en: "Really want to be with people" }, score: 5 },
  ]},
  { key: "motivation", label: { ru: "Мотивация", uk: "Мотивація", en: "Motivation" }, text: { ru: "Есть желание что-то делать?", uk: "Є бажання щось робити?", en: "Do you feel like doing anything?" }, options: [
    { text: { ru: "Ничего не хочется", uk: "Нічого не хочеться", en: "I don't want anything" }, score: 1 },
    { text: { ru: "Через силу", uk: "Через силу", en: "Forcing myself" }, score: 2 },
    { text: { ru: "Средне", uk: "Середньо", en: "Average" }, score: 3 },
    { text: { ru: "Скорее есть настрой", uk: "Скоріше є настрій", en: "Rather motivated" }, score: 4 },
    { text: { ru: "Хочется действовать", uk: "Хочеться діяти", en: "Ready to act" }, score: 5 },
  ]},
  { key: "calm", label: { ru: "Внутреннее спокойствие", uk: "Внутрішній спокій", en: "Inner calm" }, text: { ru: "Насколько спокойно внутри?", uk: "Наскільки спокійно всередині?", en: "How calm do you feel inside?" }, options: [
    { text: { ru: "Совсем не спокойно", uk: "Зовсім не спокійно", en: "Not calm at all" }, score: 1 },
    { text: { ru: "Скорее неспокойно", uk: "Скоріше неспокійно", en: "Rather uneasy" }, score: 2 },
    { text: { ru: "Средне", uk: "Середньо", en: "Average" }, score: 3 },
    { text: { ru: "Скорее спокойно", uk: "Скоріше спокійно", en: "Rather calm" }, score: 4 },
    { text: { ru: "Полный внутренний покой", uk: "Повний внутрішній спокій", en: "Complete inner peace" }, score: 5 },
  ]},
];

// Банк действий по группам — тон "друга", а не инструкции.
const DAILYCHECK_ACTIONS = {
  recovery: [
    { id: "r1", text: { ru: "Ляг сегодня минут на 30 раньше обычного.", uk: "Ляж сьогодні хвилин на 30 раніше звичайного.", en: "Go to bed about 30 minutes earlier tonight." } },
    { id: "r2", text: { ru: "Дай себе 20 минут — вообще ничего не делай.", uk: "Дай собі 20 хвилин — взагалі нічого не роби.", en: "Give yourself 20 minutes of doing absolutely nothing." } },
    { id: "r3", text: { ru: "Выйди на улицу минут на 10, просто на свет.", uk: "Вийди на вулицю хвилин на 10, просто на світло.", en: "Step outside for 10 minutes, just into the light." } },
    { id: "r4", text: { ru: "Выпей воды и съешь что-то нормальное — тело часто путает голод с усталостью.", uk: "Випий води і з'їж щось нормальне — тіло часто плутає голод із втомою.", en: "Drink water and eat something real — the body often mistakes hunger for tiredness." } },
    { id: "r5", text: { ru: "Приляг на 15-20 минут, если получится.", uk: "Приляж на 15-20 хвилин, якщо вийде.", en: "Lie down for 15–20 minutes if you can." } },
    { id: "r6", text: { ru: "Сегодня без кофе и энергетиков после обеда.", uk: "Сьогодні без кави й енергетиків після обіду.", en: "No coffee or energy drinks after midday today." } },
    { id: "r7", text: { ru: "Сделай что-то простое и приятное — то, что раньше давало отдых, даже если сейчас не тянет.", uk: "Зроби щось просте й приємне — те, що раніше давало відпочинок, навіть якщо зараз не тягне.", en: "Do one small pleasant thing that used to feel restful — even if you don't feel like it right now." } },
    { id: "r8", text: { ru: "Отложи на завтра одно дело, которое можно отложить без последствий.", uk: "Відклади на завтра одну справу, яку можна відкласти без наслідків.", en: "Push one task to tomorrow that can safely wait." } },
    { id: "r9", text: { ru: "Прими тёплый душ или ванну — без телефона рядом.", uk: "Прийми теплий душ або ванну — без телефону поруч.", en: "Take a warm shower or bath — no phone nearby." } },
    { id: "r10", text: { ru: "Сократи экран за час до сна хотя бы сегодня.", uk: "Скороти екран за годину до сну хоча б сьогодні.", en: "Cut screen time an hour before bed, just for tonight." } },
  ],
  overload: [
    { id: "o1", text: { ru: "Отложи телефон минут на 15. Дай голове выдохнуть.", uk: "Відклади телефон хвилин на 15. Дай голові видихнути.", en: "Put your phone away for 15 minutes. Let your head breathe." } },
    { id: "o2", text: { ru: "Возьми лист и выпиши всё, что крутится в голове, без разбора.", uk: "Візьми аркуш і випиши все, що крутиться в голові, без розбору.", en: "Grab paper and dump everything spinning in your head, no filtering." } },
    { id: "o3", text: { ru: "Убери одну задачу из сегодняшнего списка — просто перенеси.", uk: "Прибери одну задачу з сьогоднішнього списку — просто перенеси.", en: "Drop one task from today's list — just move it to another day." } },
    { id: "o4", text: { ru: "Пройдись 10 минут без цели, просто чтобы переключиться.", uk: "Пройдись 10 хвилин без мети, просто щоб перемкнутися.", en: "Take a 10-minute walk with no purpose, just to switch gears." } },
    { id: "o5", text: { ru: "Наведи порядок на столе — 5 минут, не больше.", uk: "Наведи лад на столі — 5 хвилин, не більше.", en: "Tidy your desk — 5 minutes, no more." } },
    { id: "o6", text: { ru: "Выбери одну задачу на сегодня и честно назови остальное «не сегодня».", uk: "Обери одну задачу на сьогодні і чесно назви решту «не сьогодні».", en: "Pick one task for today and call the rest 'not today'." } },
    { id: "o7", text: { ru: "Сделай список дел на завтра прямо сейчас — голове легче отпустить, когда план записан.", uk: "Зроби список справ на завтра просто зараз — голові легше відпустити, коли план записаний.", en: "Write tomorrow's to-do list right now — it's easier for the mind to let go once it's on paper." } },
    { id: "o8", text: { ru: "Закрой все лишние вкладки и чаты — оставь только то, с чем работаешь сейчас.", uk: "Закрий усі зайві вкладки й чати — залиш тільки те, з чим працюєш зараз.", en: "Close every extra tab and chat — keep only what you're actually working on." } },
    { id: "o9", text: { ru: "Сделай 10 глубоких вдохов перед тем, как браться за следующее дело.", uk: "Зроби 10 глибоких вдихів перед тим, як братися за наступну справу.", en: "Take 10 deep breaths before starting the next task." } },
    { id: "o10", text: { ru: "Скажи «нет» или «не сейчас» одной необязательной просьбе сегодня.", uk: "Скажи «ні» або «не зараз» одному необов'язковому проханню сьогодні.", en: "Say 'no' or 'not now' to one optional request today." } },
  ],
  anxiety: [
    { id: "a1", text: { ru: "Подыши спокойно: 4 секунды вдох, 7 задержка, 8 выдох. Пару минут.", uk: "Подихай спокійно: 4 секунди вдих, 7 затримка, 8 видих. Пару хвилин.", en: "Breathe slowly: 4s in, 7s hold, 8s out. A couple of minutes." } },
    { id: "a2", text: { ru: "Пройдись 15 минут — движение реально сбрасывает тревогу.", uk: "Пройдись 15 хвилин — рух справді скидає тривогу.", en: "Walk for 15 minutes — movement really does drop anxiety." } },
    { id: "a3", text: { ru: "Закрой ленту новостей и соцсети на час.", uk: "Закрий стрічку новин і соцмережі на годину.", en: "Close the news feed and social media for an hour." } },
    { id: "a4", text: { ru: "Проговори вслух, что именно тревожит — коротко, пару минут.", uk: "Промов вголос, що саме тривожить — коротко, пару хвилин.", en: "Say out loud what's actually bothering you — just a couple of minutes." } },
    { id: "a5", text: { ru: "Заметь что-то хорошее в близком человеке и скажи ему об этом прямо сейчас.", uk: "Поміть щось хороше в близькій людині і скажи їй про це просто зараз.", en: "Notice something good in someone close and tell them right now." } },
    { id: "a6", text: { ru: "Назови вслух 5 вещей, которые видишь, 4 звука, которые слышишь, и 3 ощущения в теле.", uk: "Назви вголос 5 речей, які бачиш, 4 звуки, які чуєш, і 3 відчуття в тілі.", en: "Name out loud 5 things you see, 4 sounds you hear, and 3 things you feel." } },
    { id: "a7", text: { ru: "Подержи что-то холодное в руках минуту — простой способ немного остыть.", uk: "Потримай щось холодне в руках хвилину — простий спосіб трохи охолонути.", en: "Hold something cold for a minute — a simple way to reset a bit." } },
    { id: "a8", text: { ru: "Спроси себя: «что из этого я реально контролирую прямо сейчас?» — и займись только этим.", uk: "Спитай себе: «що з цього я реально контролюю просто зараз?» — і займись лише цим.", en: "Ask yourself: 'what part of this can I actually control right now?' — and focus only on that." } },
    { id: "a9", text: { ru: "Напиши тревожную мысль на бумаге — просто перенеси её из головы наружу.", uk: "Напиши тривожну думку на папері — просто перенеси її з голови назовні.", en: "Write the anxious thought down on paper — just move it out of your head." } },
    { id: "a10", text: { ru: "Разреши себе не решать это прямо сейчас — вернись к вопросу завтра.", uk: "Дозволь собі не вирішувати це просто зараз — повернись до питання завтра.", en: "Give yourself permission to not solve it right now — come back to it tomorrow." } },
  ],
  lowEnergy: [
    { id: "e1", text: { ru: "Выпей стакан воды прямо сейчас.", uk: "Випий склянку води просто зараз.", en: "Drink a glass of water right now." } },
    { id: "e2", text: { ru: "Съешь что-то нормальное — не кофе и не сладкое.", uk: "З'їж щось нормальне — не каву і не солодке.", en: "Eat something real — not coffee, not sugar." } },
    { id: "e3", text: { ru: "5 минут любого движения — потянись, пройдись.", uk: "5 хвилин будь-якого руху — потягнись, пройдись.", en: "5 minutes of any movement — stretch, walk around." } },
    { id: "e4", text: { ru: "Выйди на дневной свет хоть на пару минут.", uk: "Вийди на денне світло хоч на пару хвилин.", en: "Get some daylight, even for a couple of minutes." } },
    { id: "e5", text: { ru: "Дай себе короткий отдых лёжа, 10 минут.", uk: "Дай собі короткий відпочинок лежачи, 10 хвилин.", en: "Give yourself a short rest lying down, 10 minutes." } },
    { id: "e6", text: { ru: "Сделай одно маленькое дело, которое давно откладывал(а) — небольшое чувство «сделал» само подкидывает сил.", uk: "Зроби одну маленьку справу, яку давно відкладав(ла) — невелике відчуття «зробив» само додає сил.", en: "Do one small thing you've been putting off — a bit of accomplishment tends to lift energy on its own." } },
    { id: "e7", text: { ru: "Проветри комнату 5 минут — свежий воздух ощутимо бодрит.", uk: "Провітри кімнату 5 хвилин — свіже повітря помітно бадьорить.", en: "Air out the room for 5 minutes — fresh air noticeably helps." } },
    { id: "e8", text: { ru: "Позвони или напиши кому-то, с кем приятно общаться — даже пара фраз.", uk: "Зателефонуй або напиши комусь, з ким приємно спілкуватися — навіть пара фраз.", en: "Reach out to someone you enjoy talking to — even just a couple of lines." } },
    { id: "e9", text: { ru: "Поставь одну бодрую песню и просто послушай её целиком.", uk: "Постав одну бадьору пісню і просто прослухай її цілком.", en: "Put on one upbeat song and just listen to the whole thing." } },
    { id: "e10", text: { ru: "Сократи одну задачу до самого маленького первого шага и сделай только его.", uk: "Скороти одну задачу до найменшого першого кроку і зроби лише його.", en: "Shrink one task down to its smallest first step and do only that." } },
  ],
  focus: [
    { id: "f1", text: { ru: "Убери уведомления на телефоне на полчаса.", uk: "Прибери сповіщення на телефоні на пів години.", en: "Turn off phone notifications for half an hour." } },
    { id: "f2", text: { ru: "Возьми одну задачу и посвяти ей 20 минут, без переключений.", uk: "Візьми одну задачу і присвяти їй 20 хвилин, без перемикань.", en: "Pick one task and give it 20 minutes, no switching." } },
    { id: "f3", text: { ru: "Расчисти рабочее место — то, что перед глазами, влияет на голову.", uk: "Розчисти робоче місце — те, що перед очима, впливає на голову.", en: "Clear your workspace — what's in front of your eyes affects your head." } },
    { id: "f4", text: { ru: "Сделай паузу 5 минут перед тем, как начать — не бросайся сразу в дело.", uk: "Зроби паузу 5 хвилин перед тим, як почати — не кидайся одразу в справу.", en: "Take a 5-minute pause before you start — don't dive straight in." } },
    { id: "f5", text: { ru: "Закрой все вкладки кроме одной, с которой сейчас работаешь.", uk: "Закрий усі вкладки крім однієї, з якою зараз працюєш.", en: "Close every tab except the one you're working in." } },
    { id: "f6", text: { ru: "Поставь таймер на 25 минут и работай только над одной задачей до сигнала.", uk: "Постав таймер на 25 хвилин і працюй лише над однією задачею до сигналу.", en: "Set a 25-minute timer and work on just one task until it rings." } },
    { id: "f7", text: { ru: "Убери телефон в другую комнату на час.", uk: "Прибери телефон в іншу кімнату на годину.", en: "Put your phone in another room for an hour." } },
    { id: "f8", text: { ru: "Запиши три главных дела на сегодня и начни с самого простого.", uk: "Запиши три головні справи на сьогодні і почни з найпростішої.", en: "Write down your three main tasks for today and start with the simplest." } },
    { id: "f9", text: { ru: "Выпей воды и сделай пару потягиваний — тело влияет на ясность головы больше, чем кажется.", uk: "Випий води і зроби пару потягувань — тіло впливає на ясність голови більше, ніж здається.", en: "Drink some water and stretch a little — the body affects mental clarity more than it seems." } },
    { id: "f10", text: { ru: "Разбей задачу на 2-3 маленьких шага и берись только за первый.", uk: "Розбий задачу на 2-3 маленькі кроки і берись лише за перший.", en: "Break the task into 2–3 small steps and tackle only the first one." } },
  ],
  pause: [
    { id: "p1", text: { ru: "Завари чай, убери телефон и 10 минут просто ничего не решай.", uk: "Завари чай, прибери телефон і 10 хвилин просто нічого не вирішуй.", en: "Brew tea, put the phone away, and don't solve anything for 10 minutes." } },
    { id: "p2", text: { ru: "Посиди в тишине 5 минут, без музыки и звуков.", uk: "Посидь у тиші 5 хвилин, без музики і звуків.", en: "Sit in silence for 5 minutes, no music, no sound." } },
    { id: "p3", text: { ru: "Включи спокойную музыку минут на 10 и просто побудь с ней.", uk: "Увімкни спокійну музику хвилин на 10 і просто побудь із нею.", en: "Put on calm music for 10 minutes and just sit with it." } },
    { id: "p4", text: { ru: "Разреши себе несколько минут вообще ничего не делать.", uk: "Дозволь собі кілька хвилин узагалі нічого не робити.", en: "Give yourself a few minutes to do absolutely nothing." } },
    { id: "p5", text: { ru: "Пройдись спокойным шагом без телефона и без цели, минут 10.", uk: "Пройдись спокійним кроком без телефону і без мети, хвилин 10.", en: "Take a slow walk with no phone and no destination, about 10 minutes." } },
    { id: "p6", text: { ru: "Посмотри в окно минуту-две, никуда не спеша.", uk: "Подивись у вікно хвилину-дві, нікуди не поспішаючи.", en: "Look out the window for a minute or two, in no hurry." } },
    { id: "p7", text: { ru: "Заведи дневник состояния — запиши одной строкой, как прошёл день.", uk: "Заведи щоденник стану — запиши одним рядком, як минув день.", en: "Jot down the day in one short line — a tiny check-in with yourself." } },
    { id: "p8", text: { ru: "Сделай себе что-то маленькое и приятное — без повода, просто так.", uk: "Зроби собі щось маленьке й приємне — без приводу, просто так.", en: "Do something small and nice for yourself — no reason needed." } },
  ],
  meditationbreath: [
    { id: "mb1", text: { ru: "Сегодня посвяти сессии осознанного дыхания хотя бы 8 минут — не меньше вчерашнего.", uk: "Сьогодні присвяти сесії усвідомленого дихання хоча б 8 хвилин — не менше за вчора.", en: "Give today's mindful-breathing session at least 8 minutes — no less than yesterday." } },
    { id: "mb2", text: { ru: "Перед сессией сделай три медленных вдоха-выдоха, чтобы тело почувствовало паузу.", uk: "Перед сесією зроби три повільних вдихи-видихи, щоб тіло відчуло паузу.", en: "Before the session, take three slow breaths so the body feels the pause begin." } },
    { id: "mb3", text: { ru: "Сегодня выбери одну точку внимания — кончик носа или движение живота — и держись за неё весь сет.", uk: "Сьогодні обери одну точку уваги — кінчик носа або рух живота — і тримайся за неї весь сет.", en: "Today pick one point of attention — the tip of the nose or the belly's movement — and hold it the whole session." } },
    { id: "mb4", text: { ru: "Когда ум уйдёт в мысли — а он уйдёт — просто отметь «ушёл» и мягко верни его к дыханию.", uk: "Коли розум піде в думки — а він піде — просто відміть «пішов» і м'яко поверни його до дихання.", en: "When the mind wanders — and it will — just note 'wandered' and gently bring it back to the breath." } },
    { id: "mb5", text: { ru: "Сядь сегодня в то же время, что вчера — тело быстрее привыкает к практике по расписанию.", uk: "Сядь сьогодні в той самий час, що вчора — тіло швидше звикає до практики за розкладом.", en: "Sit at the same time as yesterday — the body settles into a scheduled practice faster." } },
    { id: "mb6", text: { ru: "После сессии одной фразой отметь, что было легче удерживать сегодня: тело, звук или сам счёт дыхания.", uk: "Після сесії однією фразою відміть, що було легше утримувати сьогодні: тіло, звук чи сам рахунок дихання.", en: "After the session, note in one line what was easier to hold today: the body, sound, or the breath count." } },
    { id: "mb7", text: { ru: "Если сегодня совсем нет сил на полную сессию — хотя бы 3 осознанных вдоха-выдоха посреди дня.", uk: "Якщо сьогодні зовсім немає сил на повну сесію — хоча б 3 усвідомлених вдихи-видихи посеред дня.", en: "If there's truly no energy for a full session today — at least 3 mindful breaths sometime during the day." } },
    { id: "mb8", text: { ru: "Заметь сегодня один момент за день, когда дыхание само стало короче или зажатее — и просто выдохни длиннее.", uk: "Поміть сьогодні один момент за день, коли дихання саме стало коротшим чи затиснутим — і просто видихни довше.", en: "Notice one moment today when the breath got shorter or tighter on its own — and just exhale a bit longer." } },
    { id: "mb9", text: { ru: "Сегодня не оценивай сессию как «хорошую» или «плохую» — просто отметь, что она случилась.", uk: "Сьогодні не оцінюй сесію як «хорошу» чи «погану» — просто відміть, що вона відбулася.", en: "Don't rate today's session as 'good' or 'bad' — just note that it happened." } },
    { id: "mb10", text: { ru: "Перед сном вспомни сегодняшнюю сессию одним образом или ощущением — и отпусти день.", uk: "Перед сном згадай сьогоднішню сесію одним образом чи відчуттям — і відпусти день.", en: "Before sleep, recall today's session with one image or sensation — and let the day go." } },
  ],
};

// Модификатор по слабому звену гормонов → приоритетная группа
// ─────────────────────────────────────────────
// ЧЕЛЛЕНДЖИ — структурированный эксперимент на N дней (не «привычка за N дней»:
// реальные данные по формированию привычек — в среднем ~66 дней, разброс 18-254+;
// поэтому челлендж честно подаётся как короткая серия попыток, а не гарантия результата)
// ─────────────────────────────────────────────
const CHALLENGE_GROUP_META = {
  recovery: { ru: "Восстановление", uk: "Відновлення", en: "Recovery" },
  overload: { ru: "Разгрузка", uk: "Розвантаження", en: "Overload relief" },
  anxiety: { ru: "Спокойствие", uk: "Спокій", en: "Calm" },
  lowEnergy: { ru: "Энергия", uk: "Енергія", en: "Energy" },
  focus: { ru: "Концентрация", uk: "Концентрація", en: "Focus" },
  pause: { ru: "Пауза", uk: "Пауза", en: "Pause" },
  meditationbreath: { ru: "Осознанное дыхание", uk: "Усвідомлене дихання", en: "Mindful breathing" },
};

const CHALLENGE_GROUP_DESC = {
  recovery: { ru: "Для тех дней, когда сил мало, а сон и отдых страдают.", uk: "Для тих днів, коли сил мало, а сон і відпочинок страждають.", en: "For the days when you're running low and rest keeps slipping." },
  overload: { ru: "Когда голова перегружена делами и мыслями.", uk: "Коли голова перевантажена справами і думками.", en: "For when your head is overloaded with tasks and thoughts." },
  anxiety: { ru: "Когда тревожно и трудно успокоиться.", uk: "Коли тривожно і важко заспокоїтися.", en: "For when you're anxious and struggling to settle down." },
  lowEnergy: { ru: "Когда энергии и мотивации не хватает на обычные дела.", uk: "Коли енергії та мотивації не вистачає на звичні справи.", en: "For when energy and motivation are running short." },
  focus: { ru: "Когда трудно сосредоточиться и мысли скачут.", uk: "Коли важко зосередитися і думки скачуть.", en: "For when it's hard to focus and thoughts keep jumping around." },
  pause: { ru: "Когда в целом всё ровно, но хочется научиться делать паузы.", uk: "Коли загалом усе рівно, але хочеться навчитися робити паузи.", en: "For when things are steady, but you want to practice taking real pauses." },
  meditationbreath: { ru: "Ежедневная практика осознанного дыхания из «Наставлений по медитации» — база, на которой строятся остальные техники.", uk: "Щоденна практика усвідомленого дихання з «Настанов з медитації» — база, на якій будуються інші техніки.", en: "The daily mindful-breathing practice from Meditation guidance — the foundation the other techniques build on." },
};

const CHALLENGE_REFLECTIONS = [
  { id: "rf1", text: { ru: "Что сегодня было самым тяжёлым моментом?", uk: "Що сьогодні було найважчим моментом?", en: "What was the hardest moment today?" } },
  { id: "rf2", text: { ru: "В какой момент сегодня стало чуть легче?", uk: "У який момент сьогодні стало трохи легше?", en: "When did things feel a little lighter today?" } },
  { id: "rf3", text: { ru: "Что бы ты сказал(а) себе сегодня утром, зная то, что знаешь сейчас?", uk: "Що б ти сказав(ла) собі сьогодні вранці, знаючи те, що знаєш зараз?", en: "What would you tell yourself this morning, knowing what you know now?" } },
  { id: "rf4", text: { ru: "Что сегодня отняло больше всего сил?", uk: "Що сьогодні забрало найбільше сил?", en: "What took the most energy today?" } },
  { id: "rf5", text: { ru: "За что можешь похвалить себя сегодня, даже за мелочь?", uk: "За що можеш похвалити себе сьогодні, навіть за дрібницю?", en: "What's one small thing you can give yourself credit for today?" } },
  { id: "rf6", text: { ru: "Что бы изменилось, если бы ты сделал(а) это же действие чуть дольше?", uk: "Що б змінилося, якби ти зробив(ла) цю ж дію трохи довше?", en: "What might change if you did this same thing a bit longer?" } },
  { id: "rf7", text: { ru: "Кто сегодня был рядом, пусть даже недолго?", uk: "Хто сьогодні був поруч, хай навіть недовго?", en: "Who was around today, even briefly?" } },
  { id: "rf8", text: { ru: "Что ты заметил(а) в своём теле сегодня?", uk: "Що ти помітив(ла) у своєму тілі сьогодні?", en: "What did you notice in your body today?" } },
  { id: "rf9", text: { ru: "Что сегодня получилось само, без усилий?", uk: "Що сьогодні вийшло само, без зусиль?", en: "What went smoothly today, without effort?" } },
  { id: "rf10", text: { ru: "Если бы сегодняшний день был цветом, каким?", uk: "Якби сьогоднішній день був кольором, яким?", en: "If today had a color, what would it be?" } },
  { id: "rf11", text: { ru: "Что из привычного ты сегодня пропустил(а) — и как это ощущалось?", uk: "Що зі звичного ти сьогодні пропустив(ла) — і як це відчувалося?", en: "What usual thing did you skip today — and how did that feel?" } },
  { id: "rf12", text: { ru: "Насколько сегодняшний день был похож на вчерашний?", uk: "Наскільки сьогоднішній день був схожий на вчорашній?", en: "How similar was today to yesterday?" } },
  { id: "rf13", text: { ru: "Что помогло тебе не бросить это действие сегодня?", uk: "Що допомогло тобі не кинути цю дію сьогодні?", en: "What helped you stick with this today?" } },
  { id: "rf14", text: { ru: "Есть ли момент, который хочется повторить завтра?", uk: "Чи є момент, який хочеться повторити завтра?", en: "Is there a moment you'd like to repeat tomorrow?" } },
  { id: "rf15", text: { ru: "Что было бы, если бы ты не сделал(а) это сегодня?", uk: "Що було б, якби ти не зробив(ла) це сьогодні?", en: "What would today look like if you hadn't done this?" } },
  { id: "rf16", text: { ru: "Кому бы ты сегодня сказал(а) спасибо?", uk: "Кому б ти сьогодні сказав(ла) дякую?", en: "Who would you thank today, if anyone?" } },
  { id: "rf17", text: { ru: "Что раздражало сегодня сильнее всего?", uk: "Що дратувало сьогодні найсильніше?", en: "What was the most annoying thing today?" } },
  { id: "rf18", text: { ru: "Насколько сегодня было проще или сложнее, чем вчера?", uk: "Наскільки сьогодні було простіше чи складніше, ніж учора?", en: "Was today easier or harder than yesterday?" } },
  { id: "rf19", text: { ru: "Что ты бы хотел(а) сделать иначе завтра?", uk: "Що б ти хотів(ла) зробити інакше завтра?", en: "What would you do differently tomorrow?" } },
  { id: "rf20", text: { ru: "Заметил(а) ли ты сегодня момент, когда сам(а) себя поддержал(а)?", uk: "Чи помітив(ла) ти сьогодні момент, коли сам(а) себе підтримав(ла)?", en: "Did you catch a moment today when you supported yourself?" } },
  { id: "rf21", text: { ru: "Что сегодня было неожиданным?", uk: "Що сьогодні було несподіваним?", en: "What surprised you today?" } },
  { id: "rf22", text: { ru: "На сколько из 10 ты гордишься тем, что не пропустил(а) сегодня?", uk: "На скільки з 10 ти пишаєшся тим, що не пропустив(ла) сьогодні?", en: "On a scale of 10, how proud are you that you didn't skip today?" } },
  { id: "rf23", text: { ru: "Что из сделанного сегодня хочется унести с собой в завтра?", uk: "Що з зробленого сьогодні хочеться понести з собою в завтра?", en: "What from today do you want to carry into tomorrow?" } },
  { id: "rf24", text: { ru: "Было ли сегодня легче начать, чем в первый день?", uk: "Чи було сьогодні легше почати, ніж першого дня?", en: "Was it easier to start today than on day one?" } },
  { id: "rf25", text: { ru: "Что бы ты посоветовал(а) другу в твоей сегодняшней ситуации?", uk: "Що б ти порадив(ла) другу у твоїй сьогоднішній ситуації?", en: "What would you tell a friend in your situation today?" } },
  { id: "rf26", text: { ru: "Какая мысль крутилась в голове чаще всего сегодня?", uk: "Яка думка крутилась у голові найчастіше сьогодні?", en: "What thought kept coming back today?" } },
  { id: "rf27", text: { ru: "Что сегодня напомнило тебе, что всё временно?", uk: "Що сьогодні нагадало тобі, що все тимчасово?", en: "What reminded you today that this is temporary?" } },
  { id: "rf28", text: { ru: "Если бы завтра было последним днём челленджа, что бы хотел(а) успеть?", uk: "Якби завтра був останній день челенджу, що б хотів(ла) встигнути?", en: "If tomorrow were the last day of the challenge, what would you want to finish?" } },
  { id: "rf29", text: { ru: "Что изменилось в теле или голове с первого дня?", uk: "Що змінилося в тілі чи голові з першого дня?", en: "What has shifted in body or mind since day one?" } },
  { id: "rf30", text: { ru: "Одним словом — как прошёл сегодняшний день?", uk: "Одним словом — як минув сьогоднішній день?", en: "In one word — how was today?" } },
];

// Ритуалы — многошаговые практики для челленджа (в отличие от короткого совета на день,
// который остаётся отдельной, доп. заметкой). Опираются на реальные, изученные техники и
// организованы в 3 яруса нарастающей сложности (та же логика, что в ступенчатой помощи
// CBT и в progressive-overload подходах к привычкам: не 3 одинаковых действия по кругу,
// а полноценный путь база → углубление → продвинутый уровень):
//  easy     — дни 1-10,  лёгкий вход, самые простые и короткие практики
//  medium   — дни 11-20, требуют больше внимания/времени, работа с причиной, а не симптомом
//  advanced — дни 21-30, для тех, кто прошёл базу — более длинные/самостоятельные практики
// Длина челленджа (10/20/30) — это просто "докуда" человек идёт по этому пути.
const CHALLENGE_RITUALS = {
  recovery: { easy: [
    { id: "rr1", title: { ru: "Ритуал вечернего восстановления", uk: "Ритуал вечірнього відновлення", en: "Evening recovery ritual" }, steps: [
      { ru: "За час до сна убери яркий свет и экраны — приглуши лампы.", uk: "За годину до сну прибери яскраве світло й екрани — приглуш лампи.", en: "An hour before bed, dim the lights and put screens away." },
      { ru: "Выпей тёплой воды или травяного чая, без кофеина.", uk: "Випий теплої води або трав'яного чаю, без кофеїну.", en: "Drink warm water or herbal tea, no caffeine." },
      { ru: "Запиши одной фразой, что сегодня получилось.", uk: "Запиши однією фразою, що сьогодні вийшло.", en: "Write down one thing that went well today, in one line." },
      { ru: "Ляг минимум на 20 минут раньше обычного.", uk: "Ляж мінімум на 20 хвилин раніше звичайного.", en: "Go to bed at least 20 minutes earlier than usual." },
    ]},
    { id: "rr2", title: { ru: "Ритуал маленького шага", uk: "Ритуал маленького кроку", en: "Small-step ritual" }, steps: [
      { ru: "Выбери одно небольшое дело, которое давно откладывал(а).", uk: "Обери одну невелику справу, яку давно відкладав(ла).", en: "Pick one small task you've been putting off." },
      { ru: "Разбей его на первый шаг, который займёт не больше 5 минут.", uk: "Розбий її на перший крок, який займе не більше 5 хвилин.", en: "Break it down to a first step that takes 5 minutes or less." },
      { ru: "Сделай только этот шаг — не весь план.", uk: "Зроби лише цей крок — не весь план.", en: "Do only that step — not the whole plan." },
      { ru: "Отметь, что почувствовал(а) сразу после.", uk: "Відміть, що відчув(ла) одразу після.", en: "Notice what you felt right after." },
    ]},
    { id: "rr3", title: { ru: "Ритуал дневного света и воды", uk: "Ритуал денного світла і води", en: "Daylight and water ritual" }, steps: [
      { ru: "В течение 30 минут после пробуждения выйди на дневной свет.", uk: "Протягом 30 хвилин після пробудження вийди на денне світло.", en: "Get daylight within 30 minutes of waking up." },
      { ru: "Выпей стакан воды до кофе или чая.", uk: "Випий склянку води до кави чи чаю.", en: "Drink a glass of water before coffee or tea." },
      { ru: "Сделай 5 минут лёгкой растяжки или ходьбы.", uk: "Зроби 5 хвилин легкої розтяжки або ходьби.", en: "Do 5 minutes of light stretching or walking." },
    ]},
  ], medium: [
    { id: "rm1", title: { ru: "Ритуал полного вечернего отключения", uk: "Ритуал повного вечірнього відключення", en: "Full evening shutdown ritual" }, steps: [
      { ru: "За 90 минут до сна убери все экраны — не приглуши, а именно убери из комнаты.", uk: "За 90 хвилин до сну прибери всі екрани — не приглуш, а саме прибери з кімнати.", en: "90 minutes before bed, remove all screens from the room — not just dim them." },
      { ru: "Приготовь одну вещь на завтра: одежду, сумку или список дел.", uk: "Приготуй одну річ на завтра: одяг, сумку або список справ.", en: "Prep one thing for tomorrow: clothes, a bag, or a to-do list." },
      { ru: "Прими тёплый душ или ванну — тело остывает после, и это помогает уснуть.", uk: "Прийми теплий душ або ванну — тіло охолоджується після, і це допомагає заснути.", en: "Take a warm shower or bath — the body cools afterward, which helps sleep." },
      { ru: "Ляг в одно и то же время, даже если не хочется спать.", uk: "Ляж в один і той самий час, навіть якщо не хочеться спати.", en: "Go to bed at the same time, even if you don't feel sleepy." },
    ]},
    { id: "rm2", title: { ru: "Ритуал телесного сканирования", uk: "Ритуал тілесного сканування", en: "Body scan ritual" }, steps: [
      { ru: "Ляг удобно, закрой глаза.", uk: "Ляж зручно, заплющ очі.", en: "Lie down comfortably, close your eyes." },
      { ru: "Пройдись вниманием от макушки до стоп, задерживаясь на каждой части тела 10-15 секунд.", uk: "Пройдись увагою від маківки до стоп, затримуючись на кожній частині тіла 10-15 секунд.", en: "Move your attention from head to feet, pausing 10–15 seconds on each part." },
      { ru: "Там, где чувствуешь напряжение, сознательно расслабь эту зону.", uk: "Там, де відчуваєш напругу, свідомо розслаб цю зону.", en: "Wherever you feel tension, consciously release it." },
      { ru: "Не старайся уснуть — просто дай телу почувствовать себя услышанным.", uk: "Не намагайся заснути — просто дай тілу відчути себе почутим.", en: "Don't try to fall asleep — just let the body feel heard." },
    ]},
    { id: "rm3", title: { ru: "Ритуал фиксированного подъёма", uk: "Ритуал фіксованого підйому", en: "Fixed wake-up ritual" }, steps: [
      { ru: "Встань в одно и то же время, даже если спал(а) плохо — это главный рычаг восстановления ритма.", uk: "Встань в один і той самий час, навіть якщо спав(ла) погано — це головний важіль відновлення ритму.", en: "Get up at the same time even after a bad night — it's the main lever for resetting rhythm." },
      { ru: "Сразу после подъёма — свет и вода, без пролёживания в телефоне.", uk: "Одразу після підйому — світло і вода, без лежання в телефоні.", en: "Right after waking: light and water, no lying in bed scrolling." },
      { ru: "В течение дня не пытайся «доспать» долгим дневным сном — максимум 20 минут, если совсем нужно.", uk: "Протягом дня не намагайся «доспати» довгим денним сном — максимум 20 хвилин, якщо зовсім треба.", en: "Don't try to catch up with a long nap — 20 minutes max if you really need it." },
    ]},
  ], advanced: [
    { id: "ra1", title: { ru: "Ритуал йога-нидры", uk: "Ритуал йога-нідри", en: "Yoga nidra ritual" }, steps: [
      { ru: "Ляг в тихом месте на 15-20 минут, включи любую запись йога-нидры или веди себя сам(а) голосом.", uk: "Ляж у тихому місці на 15-20 хвилин, увімкни будь-який запис йога-нідри або веди себе сам(а) голосом.", en: "Lie in a quiet spot for 15–20 minutes; play a yoga nidra recording or guide yourself aloud." },
      { ru: "Последовательно «отпускай» каждую часть тела, не двигаясь и не засыпая.", uk: "Послідовно «відпускай» кожну частину тіла, не рухаючись і не засинаючи.", en: "Sequentially 'release' each part of the body, without moving or falling asleep." },
      { ru: "После — не вскакивай, дай себе минуту вернуться.", uk: "Після — не схоплюйся, дай собі хвилину повернутися.", en: "Afterward, don't jump up — give yourself a minute to return." },
    ]},
    { id: "ra2", title: { ru: "Ритуал недельного энергоаудита", uk: "Ритуал тижневого енергоаудиту", en: "Weekly energy audit ritual" }, steps: [
      { ru: "Просмотри последние 7 дней: когда энергия была выше, а когда — на нуле.", uk: "Переглянь останні 7 днів: коли енергія була вищою, а коли — на нулі.", en: "Review the last 7 days: when was energy higher, when was it at zero." },
      { ru: "Найди одну вещь, которая стабильно забирает силы, и один час, который стабильно их отдаёт.", uk: "Знайди одну річ, яка стабільно забирає сили, і одну годину, яка стабільно їх повертає.", en: "Find one thing that reliably drains you, and one hour that reliably restores you." },
      { ru: "Реши, что одно из этого ты изменишь на следующей неделе — не всё сразу.", uk: "Вирішь, що одне з цього ти зміниш наступного тижня — не все одразу.", en: "Decide on one single change for next week — not everything at once." },
    ]},
    { id: "ra3", title: { ru: "Ритуал полного цифрового вечера офлайн", uk: "Ритуал повного цифрового вечора офлайн", en: "Full offline evening ritual" }, steps: [
      { ru: "С 19:00 (или за 3 часа до сна) телефон и ноутбук физически уходят в другую комнату.", uk: "З 19:00 (або за 3 години до сну) телефон і ноутбук фізично йдуть в іншу кімнату.", en: "From 7pm (or 3 hours before bed), phone and laptop physically go to another room." },
      { ru: "Заполни это время тем, что требует рук или тела: готовка, прогулка, книга, разговор.", uk: "Заповни цей час тим, що потребує рук або тіла: готування, прогулянка, книга, розмова.", en: "Fill the time with something hands-on or physical: cooking, a walk, a book, a conversation." },
      { ru: "Замечай, сколько раз рука тянется к телефону по привычке — не осуждай, просто замечай.", uk: "Помічай, скільки разів рука тягнеться до телефону за звичкою — не засуджуй, просто помічай.", en: "Notice how often your hand reaches for the phone out of habit — no judgment, just notice." },
    ]},
  ]},
  overload: { easy: [
    { id: "or1", title: { ru: "Ритуал разгрузки головы", uk: "Ритуал розвантаження голови", en: "Mind-dump ritual" }, steps: [
      { ru: "Возьми лист бумаги и выпиши всё, что крутится в голове, без разбора.", uk: "Візьми аркуш паперу і випиши все, що крутиться в голові, без розбору.", en: "Grab paper and dump everything on your mind, unfiltered." },
      { ru: "Обведи 1-2 пункта, которые реально важны сегодня.", uk: "Обведи 1-2 пункти, які реально важливі сьогодні.", en: "Circle the 1–2 items that actually matter today." },
      { ru: "Остальное перенеси на завтра или вычеркни.", uk: "Решту перенеси на завтра або викресли.", en: "Move the rest to tomorrow or cross it out." },
    ]},
    { id: "or2", title: { ru: "Ритуал цифрового минимализма", uk: "Ритуал цифрового мінімалізму", en: "Digital minimalism ritual" }, steps: [
      { ru: "Отключи уведомления на телефоне на 1 час.", uk: "Вимкни сповіщення на телефоні на 1 годину.", en: "Turn off phone notifications for 1 hour." },
      { ru: "Закрой все вкладки и чаты, кроме одного нужного.", uk: "Закрий усі вкладки й чати, крім одного потрібного.", en: "Close every tab and chat except the one you need." },
      { ru: "Займись одной задачей весь этот час.", uk: "Займись однією задачею всю цю годину.", en: "Work on just one task for that whole hour." },
    ]},
    { id: "or3", title: { ru: "Ритуал одной задачи", uk: "Ритуал однієї задачі", en: "Single-task ritual" }, steps: [
      { ru: "Выбери 1 задачу на сегодня и честно назови остальное «не сегодня».", uk: "Обери 1 задачу на сьогодні і чесно назви решту «не сьогодні».", en: "Pick 1 task for today and honestly call the rest 'not today'." },
      { ru: "Поставь таймер на 25 минут (техника Pomodoro).", uk: "Постав таймер на 25 хвилин (техніка Pomodoro).", en: "Set a 25-minute timer (Pomodoro technique)." },
      { ru: "Работай только над ней до сигнала, потом отдохни 5 минут.", uk: "Працюй лише над нею до сигналу, потім відпочинь 5 хвилин.", en: "Work only on it until it rings, then rest 5 minutes." },
    ]},
  ], medium: [
    { id: "om1", title: { ru: "Ритуал матрицы приоритетов", uk: "Ритуал матриці пріоритетів", en: "Priority matrix ritual" }, steps: [
      { ru: "Раздели лист на 4 квадрата: срочно/важно, важно/не срочно, срочно/не важно, ни то ни другое.", uk: "Розділи аркуш на 4 квадрати: терміново/важливо, важливо/не терміново, терміново/не важливо, ні те ні інше.", en: "Split a page into 4 quadrants: urgent/important, important/not urgent, urgent/not important, neither." },
      { ru: "Раскидай сегодняшние дела по квадратам — честно, без прокрастинации.", uk: "Розкидай сьогоднішні справи по квадратах — чесно, без прокрастинації.", en: "Sort today's tasks into the quadrants — honestly, no stalling." },
      { ru: "Начни с одного дела из «важно/не срочно» — именно эти обычно откладываются, а потом болят сильнее всего.", uk: "Почни з однієї справи з «важливо/не терміново» — саме ці зазвичай відкладаються, а потім болять найсильніше.", en: "Start with one 'important/not urgent' item — those get postponed and cost the most later." },
    ]},
    { id: "om2", title: { ru: "Ритуал пакетной обработки", uk: "Ритуал пакетної обробки", en: "Batch-processing ritual" }, steps: [
      { ru: "Определи 2 фиксированных окна в день для почты и сообщений — например 12:00 и 17:00.", uk: "Визнач 2 фіксовані вікна на день для пошти і повідомлень — наприклад 12:00 і 17:00.", en: "Set 2 fixed windows per day for email/messages — e.g. noon and 5pm." },
      { ru: "Всё остальное время держи уведомления выключенными.", uk: "Увесь інший час тримай сповіщення вимкненими.", en: "Keep notifications off the rest of the time." },
      { ru: "В отведённое окно отвечай быстро и по делу, не растягивай его.", uk: "У відведене вікно відповідай швидко і по суті, не розтягуй його.", en: "In the window, reply quickly and to the point — don't let it stretch." },
    ]},
    { id: "om3", title: { ru: "Ритуал глубокого блока 50/10", uk: "Ритуал глибокого блоку 50/10", en: "Deep-block 50/10 ritual" }, steps: [
      { ru: "Выбери одну задачу, требующую сосредоточенности.", uk: "Обери одну задачу, що потребує зосередженості.", en: "Pick one task that needs real focus." },
      { ru: "Работай 50 минут без единого переключения — телефон вне комнаты.", uk: "Працюй 50 хвилин без жодного перемикання — телефон поза кімнатою.", en: "Work 50 minutes with zero switching — phone out of the room." },
      { ru: "Отдохни полные 10 минут, не заглядывая в телефон, потом повтори при необходимости.", uk: "Відпочинь повні 10 хвилин, не зазираючи в телефон, потім повтори за потреби.", en: "Rest a full 10 minutes without checking your phone, then repeat if needed." },
    ]},
  ], advanced: [
    { id: "oa1", title: { ru: "Ритуал недельного разбора", uk: "Ритуал тижневого розбору", en: "Weekly review ritual" }, steps: [
      { ru: "Просмотри все открытые задачи и обязательства за последнюю неделю.", uk: "Переглянь усі відкриті задачі й зобов'язання за останній тиждень.", en: "Review all open tasks and commitments from the last week." },
      { ru: "Закрой или официально отпусти то, что зависло без действия больше 2 недель.", uk: "Закрий або офіційно відпусти те, що зависло без дії більше 2 тижнів.", en: "Close or formally let go of anything stalled with no action for 2+ weeks." },
      { ru: "Выпиши только 3 приоритета на следующую неделю — остальное подождёт.", uk: "Випиши лише 3 пріоритети на наступний тиждень — решта почекає.", en: "Write down only 3 priorities for next week — everything else can wait." },
    ]},
    { id: "oa2", title: { ru: "Ритуал одного главного дела", uk: "Ритуал однієї головної справи", en: "One main task ritual" }, steps: [
      { ru: "Определи с вечера самое неприятное или самое важное дело завтрашнего дня.", uk: "Визнач звечора найнеприємнішу або найважливішу справу завтрашнього дня.", en: "The night before, pick tomorrow's most unpleasant or most important task." },
      { ru: "Сделай именно его первым, до почты и мессенджеров.", uk: "Зроби саме її першою, до пошти і месенджерів.", en: "Do exactly that one first, before email and messaging apps." },
      { ru: "Заметь, как остальной день ощущается легче после этого.", uk: "Поміть, як решта дня відчувається легшою після цього.", en: "Notice how much lighter the rest of the day feels afterward." },
    ]},
    { id: "oa3", title: { ru: "Ритуал системы вместо списка", uk: "Ритуал системи замість списку", en: "System-over-list ritual" }, steps: [
      { ru: "Раздели день на 3-4 крупных блока: глубокая работа, встречи/общение, рутина, отдых.", uk: "Розділи день на 3-4 великих блоки: глибока робота, зустрічі/спілкування, рутина, відпочинок.", en: "Split the day into 3–4 blocks: deep work, meetings/communication, routine, rest." },
      { ru: "Заранее реши, какой блок для чего — не решай в моменте, что делать дальше.", uk: "Заздалегідь вирішь, який блок для чого — не вирішуй в моменті, що робити далі.", en: "Decide in advance what each block is for — don't decide in the moment." },
      { ru: "Следуй блокам один день подряд и оцени вечером, что сработало.", uk: "Дотримуйся блоків один день поспіль і оціни ввечері, що спрацювало.", en: "Follow the blocks for one full day and review in the evening what worked." },
    ]},
  ]},
  anxiety: { easy: [
    { id: "ar1", title: { ru: "Ритуал дыхания с длинным выдохом", uk: "Ритуал дихання з довгим видихом", en: "Long-exhale breathing ritual" }, steps: [
      { ru: "Сядь удобно, обе ноги на полу.", uk: "Сядь зручно, обидві ноги на підлозі.", en: "Sit comfortably, both feet on the floor." },
      { ru: "Вдох на 4 счёта, задержка на 7, выдох на 8.", uk: "Вдих на 4 рахунки, затримка на 7, видих на 8.", en: "Inhale for 4 counts, hold for 7, exhale for 8." },
      { ru: "Повтори 5-6 циклов подряд.", uk: "Повтори 5-6 циклів поспіль.", en: "Repeat 5–6 cycles in a row." },
      { ru: "Отметь, что изменилось в теле после.", uk: "Відміть, що змінилося в тілі після.", en: "Notice what changed in your body afterward." },
    ]},
    { id: "ar2", title: { ru: "Ритуал заземления 5-4-3-2-1", uk: "Ритуал заземлення 5-4-3-2-1", en: "5-4-3-2-1 grounding ritual" }, steps: [
      { ru: "Назови вслух 5 вещей, которые видишь.", uk: "Назви вголос 5 речей, які бачиш.", en: "Name 5 things you can see." },
      { ru: "Назови 4 звука, которые слышишь.", uk: "Назви 4 звуки, які чуєш.", en: "Name 4 sounds you can hear." },
      { ru: "Назови 3 ощущения в теле, 2 запаха и 1 вкус.", uk: "Назви 3 відчуття в тілі, 2 запахи і 1 смак.", en: "Name 3 things you feel, 2 smells, and 1 taste." },
    ]},
    { id: "ar3", title: { ru: "Ритуал переноса тревоги на бумагу", uk: "Ритуал перенесення тривоги на папір", en: "Worry-on-paper ritual" }, steps: [
      { ru: "Напиши тревожную мысль целиком, как есть.", uk: "Напиши тривожну думку цілком, як є.", en: "Write the anxious thought down exactly as it is." },
      { ru: "Спроси: что из этого я реально контролирую сейчас?", uk: "Запитай: що з цього я реально контролюю зараз?", en: "Ask: what part of this can I actually control right now?" },
      { ru: "Запиши один маленький шаг только по контролируемой части.", uk: "Запиши один маленький крок лише щодо контрольованої частини.", en: "Write down one small step for just the controllable part." },
    ]},
  ], medium: [
    { id: "am1", title: { ru: "Ритуал прогрессивной мышечной релаксации", uk: "Ритуал прогресивної м'язової релаксації", en: "Progressive muscle relaxation ritual" }, steps: [
      { ru: "Начни со стоп: напряги на 5 секунд, резко отпусти.", uk: "Почни зі стоп: напруж на 5 секунд, різко відпусти.", en: "Start with your feet: tense for 5 seconds, release sharply." },
      { ru: "Поднимайся вверх по телу — голени, бёдра, живот, руки, плечи, лицо — так же напрягая и отпуская каждую группу мышц.", uk: "Піднімайся вгору по тілу — гомілки, стегна, живіт, руки, плечі, обличчя — так само напружуючи й відпускаючи кожну групу м'язів.", en: "Move up the body — calves, thighs, stomach, arms, shoulders, face — tensing and releasing each group." },
      { ru: "В конце полежи минуту, замечая разницу между напряжением и расслаблением.", uk: "Наприкінці полеж хвилину, помічаючи різницю між напругою і розслабленням.", en: "Finish lying still for a minute, noticing the difference between tension and release." },
    ]},
    { id: "am2", title: { ru: "Ритуал запланированного беспокойства", uk: "Ритуал запланованого занепокоєння", en: "Scheduled worry ritual" }, steps: [
      { ru: "Выбери фиксированные 10 минут в день — например 18:00 — только для тревожных мыслей.", uk: "Обери фіксовані 10 хвилин на день — наприклад 18:00 — лише для тривожних думок.", en: "Pick a fixed 10 minutes daily — say 6pm — just for anxious thoughts." },
      { ru: "Весь день, когда приходит тревога не по расписанию, запиши её в 2 словах и отложи до назначенного времени.", uk: "Увесь день, коли тривога приходить не за розкладом, запиши її у 2 словах і відклади до призначеного часу.", en: "All day, when worry shows up off-schedule, jot it in 2 words and postpone it to that slot." },
      { ru: "В назначенное время дай себе подумать об этом столько, сколько нужно, и закрой блокнот.", uk: "У призначений час дай собі подумати про це стільки, скільки треба, і закрий блокнот.", en: "At the scheduled time, let yourself think it through fully, then close the notebook." },
    ]},
    { id: "am3", title: { ru: "Ритуал разбора мысли", uk: "Ритуал розбору думки", en: "Thought-record ritual" }, steps: [
      { ru: "Запиши тревожную мысль дословно.", uk: "Запиши тривожну думку дослівно.", en: "Write the anxious thought down word for word." },
      { ru: "Спроси: это факт или предположение? Какие есть доказательства за и против?", uk: "Запитай: це факт чи припущення? Які є докази за і проти?", en: "Ask: is this a fact or an assumption? What evidence is for and against it?" },
      { ru: "Сформулируй более взвешенную версию этой мысли — не «всё будет прекрасно», а честную и спокойную.", uk: "Сформулюй зваженішу версію цієї думки — не «все буде чудово», а чесну і спокійну.", en: "Write a more balanced version — not 'it'll be perfect,' but honest and calm." },
    ]},
  ], advanced: [
    { id: "aa1", title: { ru: "Ритуал лестницы столкновения", uk: "Ритуал драбини зіткнення", en: "Exposure-ladder ritual" }, steps: [
      { ru: "Выбери одну маленькую, управляемую ситуацию, которая обычно вызывает тревогу.", uk: "Обери одну маленьку, керовану ситуацію, яка зазвичай викликає тривогу.", en: "Pick one small, manageable situation that usually triggers anxiety." },
      { ru: "Сознательно зайди в неё сегодня, не избегая, на короткое время.", uk: "Свідомо зайди в неї сьогодні, не уникаючи, на короткий час.", en: "Deliberately step into it today, briefly, without avoiding it." },
      { ru: "После отметь, что тревога поднялась и снизилась сама, без побега.", uk: "Після відміть, що тривога піднялась і знизилась сама, без втечі.", en: "Afterward, notice that anxiety rose and fell on its own — without escaping." },
    ]},
    { id: "aa2", title: { ru: "Ритуал паузы самосострадания", uk: "Ритуал паузи самоспівчуття", en: "Self-compassion break ritual" }, steps: [
      { ru: "Положи руку на грудь и признай вслух: «Сейчас мне тяжело».", uk: "Поклади руку на груди і визнай вголос: «Зараз мені важко».", en: "Put a hand on your chest and say out loud: 'This is hard right now.'" },
      { ru: "Напомни себе: «Это часть человеческого опыта, не только моего».", uk: "Нагадай собі: «Це частина людського досвіду, не лише мого».", en: "Remind yourself: 'This is part of being human, not just my struggle.'" },
      { ru: "Спроси себя: что бы я сказал(а) другу в такой ситуации — и скажи это себе.", uk: "Запитай себе: що б я сказав(ла) другу в такій ситуації — і скажи це собі.", en: "Ask: what would I tell a friend in this situation — then say it to yourself." },
    ]},
    { id: "aa3", title: { ru: "Ритуал полного заземления через тело", uk: "Ритуал повного заземлення через тіло", en: "Full body-grounding ritual" }, steps: [
      { ru: "Встань, почувствуй стопы на полу, слегка покачайся из стороны в сторону.", uk: "Встань, відчуй стопи на підлозі, злегка похитайся з боку в бік.", en: "Stand up, feel your feet on the floor, sway gently side to side." },
      { ru: "Сделай 10 медленных приседаний или растяжек, синхронизируя движение с дыханием.", uk: "Зроби 10 повільних присідань або розтяжок, синхронізуючи рух з диханням.", en: "Do 10 slow squats or stretches, syncing movement with breath." },
      { ru: "Закончи 3 глубокими вдохами с длинным выдохом, стоя неподвижно.", uk: "Закінчи 3 глибокими вдихами з довгим видихом, стоячи нерухомо.", en: "Finish with 3 deep breaths and long exhales, standing still." },
    ]},
  ]},
  lowEnergy: { easy: [
    { id: "er1", title: { ru: "Ритуал утреннего запуска", uk: "Ритуал ранкового запуску", en: "Morning kickstart ritual" }, steps: [
      { ru: "Стакан воды сразу после пробуждения.", uk: "Склянка води одразу після пробудження.", en: "A glass of water right after waking up." },
      { ru: "5 минут любого движения — потянись, пройдись.", uk: "5 хвилин будь-якого руху — потягнись, пройдись.", en: "5 minutes of any movement — stretch, walk around." },
      { ru: "Нормальный завтрак, не только кофе.", uk: "Нормальний сніданок, не лише кава.", en: "A real breakfast, not just coffee." },
    ]},
    { id: "er2", title: { ru: "Ритуал маленькой победы", uk: "Ритуал маленької перемоги", en: "Small-win ritual" }, steps: [
      { ru: "Сделай одно маленькое дело, которое откладывал(а).", uk: "Зроби одну маленьку справу, яку відкладав(ла).", en: "Do one small thing you've been putting off." },
      { ru: "Отметь его как выполненное — вслух или письменно.", uk: "Відміть її як виконану — вголос або письмово.", en: "Mark it done — out loud or in writing." },
      { ru: "Дай себе 2 минуты просто порадоваться этому.", uk: "Дай собі 2 хвилини просто порадіти цьому.", en: "Give yourself 2 minutes to just feel good about it." },
    ]},
    { id: "er3", title: { ru: "Ритуал светового заряда", uk: "Ритуал світлового заряду", en: "Light-charge ritual" }, steps: [
      { ru: "Выйди на улицу минимум на 10 минут.", uk: "Вийди на вулицю мінімум на 10 хвилин.", en: "Step outside for at least 10 minutes." },
      { ru: "Не смотри в телефон — просто будь на свету.", uk: "Не дивись у телефон — просто будь на світлі.", en: "Don't look at your phone — just be in the light." },
      { ru: "Вернувшись, сделай одну простую задачу.", uk: "Повернувшись, зроби одну просту задачу.", en: "When you're back, do one simple task." },
    ]},
  ], medium: [
    { id: "em1", title: { ru: "Ритуал плана «если-то»", uk: "Ритуал плану «якщо-то»", en: "If-then plan ritual" }, steps: [
      { ru: "Выбери одно действие, которое хочешь сделать сегодня, несмотря на низкую энергию.", uk: "Обери одну дію, яку хочеш зробити сьогодні, попри низьку енергію.", en: "Pick one action you want to do today despite low energy." },
      { ru: "Сформулируй план: «Если наступит [время/ситуация], то я сделаю [действие]».", uk: "Сформулюй план: «Якщо настане [час/ситуація], то я зроблю [дія]».", en: "Write a plan: 'If [time/situation] happens, then I'll do [action].'" },
      { ru: "Держи план на виду и просто следуй ему, не спрашивая себя в моменте «хочу ли я».", uk: "Тримай план на видноті і просто дотримуйся його, не питаючи себе в моменті «чи хочу я».", en: "Keep the plan visible and just follow it — don't ask yourself 'do I feel like it' in the moment." },
    ]},
    { id: "em2", title: { ru: "Ритуал связки привычек", uk: "Ритуал зв'язки звичок", en: "Habit-stacking ritual" }, steps: [
      { ru: "Возьми одно действие, которое ты и так делаешь каждый день (чистка зубов, кофе).", uk: "Візьми одну дію, яку ти і так робиш щодня (чищення зубів, кава).", en: "Take one action you already do daily (brushing teeth, morning coffee)." },
      { ru: "Прикрепи к нему новое маленькое действие сразу после.", uk: "Прикріпи до неї нову маленьку дію одразу після.", en: "Attach a new small action right after it." },
      { ru: "Сделай связку сегодня хотя бы один раз, не пропуская первое звено.", uk: "Зроби зв'язку сьогодні хоча б один раз, не пропускаючи перше звено.", en: "Do the stack at least once today, without skipping the first link." },
    ]},
    { id: "em3", title: { ru: "Ритуал энергетического завтрака", uk: "Ритуал енергетичного сніданку", en: "Energy-breakfast ritual" }, steps: [
      { ru: "Съешь завтрак с белком в первый час после пробуждения, не только углеводы.", uk: "З'їж сніданок з білком у першу годину після пробудження, не лише вуглеводи.", en: "Eat a protein-forward breakfast in the first hour after waking, not just carbs." },
      { ru: "Добавь 10 минут движения — быстрая ходьба, лестница, растяжка.", uk: "Додай 10 хвилин руху — швидка ходьба, сходи, розтяжка.", en: "Add 10 minutes of movement — brisk walk, stairs, stretching." },
      { ru: "Отметь вечером, отличалось ли самочувствие от обычного дня.", uk: "Відміть увечері, чи відрізнявся стан від звичайного дня.", en: "In the evening, notice whether you felt different than a typical day." },
    ]},
  ], advanced: [
    { id: "ea1", title: { ru: "Ритуал приятной связки", uk: "Ритуал приємної зв'язки", en: "Temptation-bundling ritual" }, steps: [
      { ru: "Выбери задачу, которую откладываешь из-за низкой мотивации.", uk: "Обери задачу, яку відкладаєш через низьку мотивацію.", en: "Pick a task you keep postponing due to low motivation." },
      { ru: "Разреши себе что-то приятное только вместе с ней — любимую музыку, подкаст, вкусный напиток.", uk: "Дозволь собі щось приємне лише разом з нею — улюблену музику, подкаст, смачний напій.", en: "Allow yourself something enjoyable only while doing it — favorite music, a podcast, a nice drink." },
      { ru: "Начни задачу только вместе с этим приятным — не раньше и не отдельно.", uk: "Почни задачу лише разом з цим приємним — не раніше і не окремо.", en: "Start the task only paired with that reward — not before, not separately." },
    ]},
    { id: "ea2", title: { ru: "Ритуал 2-минутного правила", uk: "Ритуал 2-хвилинного правила", en: "2-minute rule ritual" }, steps: [
      { ru: "Возьми привычку, которую хочешь закрепить, и сократи её до версии на 2 минуты.", uk: "Візьми звичку, яку хочеш закріпити, і скороти її до версії на 2 хвилини.", en: "Take a habit you want to build and shrink it to a 2-minute version." },
      { ru: "Сделай только эту версию сегодня — без цели «раскрутиться» на большее.", uk: "Зроби лише цю версію сьогодні — без мети «розкрутитися» на більше.", en: "Do only that version today — no goal of stretching it further." },
      { ru: "Если появится желание продолжить дольше — это бонус, а не обязательство.", uk: "Якщо з'явиться бажання продовжити довше — це бонус, а не обов'язок.", en: "If you feel like continuing longer, that's a bonus, not a requirement." },
    ]},
    { id: "ea3", title: { ru: "Ритуал недельного восстановления ритма", uk: "Ритуал тижневого відновлення ритму", en: "Weekly rhythm-reset ritual" }, steps: [
      { ru: "Сравни сегодняшний подъём, приёмы пищи и движение с планом на неделю.", uk: "Порівняй сьогоднішній підйом, прийоми їжі й рух із планом на тиждень.", en: "Compare today's wake time, meals, and movement to your weekly plan." },
      { ru: "Верни на место один сбившийся элемент — время подъёма, обед, вечернюю прогулку.", uk: "Поверни на місце один збитий елемент — час підйому, обід, вечірню прогулянку.", en: "Put one drifted element back in place — wake time, lunch, an evening walk." },
      { ru: "Не пытайся исправить всё сразу — только один сбившийся ритм за раз.", uk: "Не намагайся виправити все одразу — лише один збитий ритм за раз.", en: "Don't try to fix everything at once — just one drifted rhythm at a time." },
    ]},
  ]},
  focus: { easy: [
    { id: "fr1", title: { ru: "Ритуал одной вкладки", uk: "Ритуал однієї вкладки", en: "Single-tab ritual" }, steps: [
      { ru: "Закрой все вкладки и приложения, кроме нужного.", uk: "Закрий усі вкладки й застосунки, крім потрібного.", en: "Close every tab and app except the one you need." },
      { ru: "Убери телефон в другую комнату или в сумку.", uk: "Прибери телефон в іншу кімнату або в сумку.", en: "Put your phone in another room or bag." },
      { ru: "Поставь таймер на 20 минут и начни.", uk: "Постав таймер на 20 хвилин і почни.", en: "Set a 20-minute timer and begin." },
    ]},
    { id: "fr2", title: { ru: "Ритуал маленьких шагов задачи", uk: "Ритуал маленьких кроків задачі", en: "Task-breakdown ritual" }, steps: [
      { ru: "Разбей задачу на 2-3 маленьких шага на бумаге.", uk: "Розбий задачу на 2-3 маленькі кроки на папері.", en: "Break the task into 2–3 small steps on paper." },
      { ru: "Берись только за первый, не думая об остальных.", uk: "Берись лише за перший, не думаючи про решту.", en: "Tackle only the first one, without thinking about the rest." },
      { ru: "Отметь его как сделанный, прежде чем перейти дальше.", uk: "Відміть його як зроблений, перш ніж перейти далі.", en: "Mark it done before moving on." },
    ]},
    { id: "fr3", title: { ru: "Ритуал чистого стола", uk: "Ритуал чистого столу", en: "Clear-desk ritual" }, steps: [
      { ru: "Убери с рабочего места всё лишнее — 3 минуты.", uk: "Прибери з робочого місця все зайве — 3 хвилини.", en: "Clear anything unneeded off your desk — 3 minutes." },
      { ru: "Оставь на виду только то, что нужно для текущей задачи.", uk: "Залиш на видноті лише те, що потрібно для поточної задачі.", en: "Keep visible only what's needed for the current task." },
      { ru: "Сделай один глубокий вдох перед началом.", uk: "Зроби один глибокий вдих перед початком.", en: "Take one deep breath before starting." },
    ]},
  ], medium: [
    { id: "fm1", title: { ru: "Ритуал дизайна пространства", uk: "Ритуал дизайну простору", en: "Space-design ritual" }, steps: [
      { ru: "Убери из поля зрения всё, что не относится к задаче — физически, не просто отвернись.", uk: "Прибери з поля зору все, що не стосується задачі — фізично, не просто відвернись.", en: "Physically remove everything unrelated to the task from view." },
      { ru: "Подготовь всё нужное заранее: вода, заметки, инструменты, чтобы не вставать посреди работы.", uk: "Підготуй усе потрібне заздалегідь: вода, нотатки, інструменти, щоб не вставати посеред роботи.", en: "Prep everything you'll need — water, notes, tools — so you don't get up mid-work." },
      { ru: "Начни с самого понятного шага задачи, чтобы включиться быстрее.", uk: "Почни з найзрозумілішого кроку задачі, щоб швидше увімкнутися.", en: "Start with the clearest, simplest step to get moving faster." },
    ]},
    { id: "fm2", title: { ru: "Ритуал монозадачности", uk: "Ритуал монозадачності", en: "Single-tasking ritual" }, steps: [
      { ru: "Выбери ровно одну задачу на ближайший час — ничего параллельно.", uk: "Обери рівно одну задачу на найближчу годину — нічого паралельно.", en: "Pick exactly one task for the next hour — nothing in parallel." },
      { ru: "Если приходит другая мысль или дело, запиши её на отдельный листок «потом», не переключайся.", uk: "Якщо приходить інша думка чи справа, запиши її на окремий листок «потім», не перемикайся.", en: "If another thought or task pops up, jot it on a 'later' list — don't switch." },
      { ru: "В конце часа посмотри на листок «потом» и реши, что из этого действительно срочно.", uk: "Наприкінці години подивись на листок «потім» і вирішь, що з цього справді термінове.", en: "At the end of the hour, look at the 'later' list and decide what's actually urgent." },
    ]},
    { id: "fm3", title: { ru: "Ритуал цифрового заката для работы", uk: "Ритуал цифрового заходу для роботи", en: "Work digital-sunset ritual" }, steps: [
      { ru: "Закрой все вкладки и приложения, не связанные с текущей задачей, на весь блок — не на 20 минут, а на 90.", uk: "Закрий усі вкладки й застосунки, не пов'язані з поточною задачею, на весь блок — не на 20 хвилин, а на 90.", en: "Close every unrelated tab and app for the whole block — 90 minutes, not 20." },
      { ru: "Переведи телефон в авиарежим или в другую комнату на это время.", uk: "Переведи телефон у режим польоту або в іншу кімнату на цей час.", en: "Put your phone on airplane mode or in another room for that time." },
      { ru: "После блока осознанно реши, что открыть заново, а не открывай всё по привычке.", uk: "Після блоку свідомо вирішь, що відкрити знову, а не відкривай усе за звичкою.", en: "After the block, deliberately choose what to reopen instead of everything by habit." },
    ]},
  ], advanced: [
    { id: "fa1", title: { ru: "Ритуал глубокой работы 90 минут", uk: "Ритуал глибокої роботи 90 хвилин", en: "90-minute deep work ritual" }, steps: [
      { ru: "Выбери самую сложную задачу на сегодня — ту, что требует настоящего мышления, не рутины.", uk: "Обери найскладнішу задачу на сьогодні — ту, що потребує справжнього мислення, не рутини.", en: "Pick today's hardest task — one that needs real thinking, not routine work." },
      { ru: "Работай над ней 90 минут одним заходом, без проверок телефона и почты.", uk: "Працюй над нею 90 хвилин одним заходом, без перевірок телефону й пошти.", en: "Work on it for 90 minutes straight, no phone or email checks." },
      { ru: "После — обязательный полноценный отдых минимум 20 минут, не полу-отдых с телефоном.", uk: "Після — обов'язковий повноцінний відпочинок мінімум 20 хвилин, не напіввідпочинок з телефоном.", en: "Afterward, take a real 20-minute break — not a half-break with your phone." },
    ]},
    { id: "fa2", title: { ru: "Ритуал недельного аудита внимания", uk: "Ритуал тижневого аудиту уваги", en: "Weekly attention-audit ritual" }, steps: [
      { ru: "Просмотри последнюю неделю: в какие моменты фокус ломался чаще всего?", uk: "Переглянь останній тиждень: у які моменти фокус ламався найчастіше?", en: "Review the last week: when did focus break most often?" },
      { ru: "Найди один повторяющийся триггер — уведомление, человека, привычку проверять телефон.", uk: "Знайди один повторюваний тригер — сповіщення, людину, звичку перевіряти телефон.", en: "Find one recurring trigger — a notification, a person, a phone-checking habit." },
      { ru: "Поставь сегодня одно конкретное ограничение именно на этот триггер.", uk: "Постав сьогодні одне конкретне обмеження саме на цей тригер.", en: "Set one specific limit on exactly that trigger today." },
    ]},
    { id: "fa3", title: { ru: "Ритуал сложной задачи по частям", uk: "Ритуал складної задачі по частинах", en: "Complex-task-in-stages ritual" }, steps: [
      { ru: "Раздели крупный проект на 3 этапа с чёткими результатами, а не просто «поработать».", uk: "Розділи великий проєкт на 3 етапи з чіткими результатами, а не просто «попрацювати».", en: "Split a big project into 3 stages with clear outcomes, not just 'work on it.'" },
      { ru: "Сегодня закрой только первый этап полностью, даже если он кажется маленьким.", uk: "Сьогодні закрий лише перший етап повністю, навіть якщо він здається маленьким.", en: "Today, fully close only stage one, even if it seems small." },
      { ru: "Отметь готовый этап явно — вычеркни, поставь галочку — мозгу нужно видеть завершение.", uk: "Відміть готовий етап явно — викресли, постав галочку — мозку потрібно бачити завершення.", en: "Mark the finished stage explicitly — cross it out, check it off — the brain needs to see closure." },
    ]},
  ]},
  pause: { easy: [
    { id: "pr1", title: { ru: "Ритуал чайной паузы", uk: "Ритуал чайної паузи", en: "Tea-break ritual" }, steps: [
      { ru: "Завари чай или воду, без спешки.", uk: "Завари чай або воду, без поспіху.", en: "Brew tea or water, no rushing." },
      { ru: "Убери телефон подальше на 10 минут.", uk: "Прибери телефон подалі на 10 хвилин.", en: "Put your phone out of reach for 10 minutes." },
      { ru: "Пей маленькими глотками, ничего не решая.", uk: "Пий маленькими ковтками, нічого не вирішуючи.", en: "Sip slowly, without solving anything." },
    ]},
    { id: "pr2", title: { ru: "Ритуал тишины", uk: "Ритуал тиші", en: "Silence ritual" }, steps: [
      { ru: "Найди тихое место на 5 минут.", uk: "Знайди тихе місце на 5 хвилин.", en: "Find a quiet spot for 5 minutes." },
      { ru: "Закрой глаза, просто слушай, что вокруг.", uk: "Закрий очі, просто слухай, що навколо.", en: "Close your eyes, just listen to what's around." },
      { ru: "Не пытайся ни о чём думать — если мысль пришла, отпусти её.", uk: "Не намагайся ні про що думати — якщо думка прийшла, відпусти її.", en: "Don't try to think about anything — if a thought comes, let it go." },
    ]},
    { id: "pr3", title: { ru: "Ритуал маленькой радости", uk: "Ритуал маленької радості", en: "Small-joy ritual" }, steps: [
      { ru: "Выбери что-то маленькое и приятное — без повода.", uk: "Обери щось маленьке й приємне — без приводу.", en: "Pick something small and nice — no reason needed." },
      { ru: "Сделай это не спеша, полностью присутствуя в моменте.", uk: "Зроби це не поспішаючи, повністю присутній(я) у моменті.", en: "Do it slowly, fully present in the moment." },
      { ru: "Отметь, что почувствовал(а).", uk: "Відміть, що відчув(ла).", en: "Notice what you felt." },
    ]},
  ], medium: [
    { id: "pm1", title: { ru: "Ритуал STOP", uk: "Ритуал STOP", en: "STOP ritual" }, steps: [
      { ru: "Когда чувствуешь, что несёшься по инерции — Остановись.", uk: "Коли відчуваєш, що несешся за інерцією — Зупинись.", en: "When you notice you're running on autopilot — Stop." },
      { ru: "Сделай один медленный вдох и выдох.", uk: "Зроби один повільний вдих і видих.", en: "Take one slow breath in and out." },
      { ru: "Заметь, что сейчас происходит внутри и снаружи, и только потом реши, что делать дальше.", uk: "Поміть, що зараз відбувається всередині й зовні, і лише потім вирішуй, що робити далі.", en: "Observe what's happening inside and around you, then decide what's next." },
    ]},
    { id: "pm2", title: { ru: "Ритуал осознанной прогулки", uk: "Ритуал усвідомленої прогулянки", en: "Mindful walking ritual" }, steps: [
      { ru: "Пройдись 10-15 минут без телефона и без цели куда-то успеть.", uk: "Пройдись 10-15 хвилин без телефону і без мети кудись встигнути.", en: "Walk 10–15 minutes with no phone and no destination to rush to." },
      { ru: "Замечай стопы, касающиеся земли, и то, что видишь вокруг, по очереди.", uk: "Помічай стопи, що торкаються землі, і те, що бачиш навколо, по черзі.", en: "Notice your feet touching the ground, then what's around you, in turn." },
      { ru: "Когда мысли уносят в дела, мягко возвращай внимание к шагам.", uk: "Коли думки несуть у справи, м'яко повертай увагу до кроків.", en: "When thoughts drift to your to-do list, gently bring attention back to your steps." },
    ]},
    { id: "pm3", title: { ru: "Ритуал осознанного приёма пищи", uk: "Ритуал усвідомленого прийому їжі", en: "Mindful eating ritual" }, steps: [
      { ru: "Один приём пищи сегодня — без экрана и без спешки.", uk: "Один прийом їжі сьогодні — без екрана і без поспіху.", en: "One meal today — no screen, no rushing." },
      { ru: "Первые 3 кусочка ешь медленно, замечая вкус, текстуру, температуру.", uk: "Перші 3 шматочки їж повільно, помічаючи смак, текстуру, температуру.", en: "Eat the first 3 bites slowly, noticing taste, texture, temperature." },
      { ru: "Заметь момент, когда наелся(ась) достаточно, а не «доел(а) до конца».", uk: "Поміть момент, коли наївся(лась) достатньо, а не «доїв(ла) до кінця».", en: "Notice the moment you're satisfied, not just when the plate is empty." },
    ]},
  ], advanced: [
    { id: "pa1", title: { ru: "Ритуал доброты к себе и другим", uk: "Ритуал доброти до себе й інших", en: "Loving-kindness ritual" }, steps: [
      { ru: "Сядь тихо на 5 минут, закрой глаза.", uk: "Сядь тихо на 5 хвилин, заплющ очі.", en: "Sit quietly for 5 minutes, close your eyes." },
      { ru: "Мысленно пожелай себе спокойствия и добра, своими словами.", uk: "Подумки побажай собі спокою і добра, своїми словами.", en: "Silently wish yourself calm and good, in your own words." },
      { ru: "Затем пожелай того же одному конкретному человеку, даже если отношения непростые.", uk: "Потім побажай того самого одній конкретній людині, навіть якщо стосунки непрості.", en: "Then extend the same wish to one specific person, even if things are complicated." },
    ]},
    { id: "pa2", title: { ru: "Ритуал расширенной благодарности", uk: "Ритуал розширеної вдячності", en: "Extended gratitude ritual" }, steps: [
      { ru: "Вспомни 3 момента за последнюю неделю, за которые благодарен(на), не общие, а конкретные.", uk: "Згадай 3 моменти за останній тиждень, за які вдячний(на), не загальні, а конкретні.", en: "Recall 3 specific moments from the past week you're grateful for — not generic ones." },
      { ru: "По каждому распиши, что именно в нём было ценно.", uk: "По кожному розпиши, що саме в ньому було цінне.", en: "For each one, spell out exactly what made it valuable." },
      { ru: "Запиши это, а не просто подумай — письмо закрепляет иначе, чем мысль.", uk: "Запиши це, а не просто подумай — письмо закріплює інакше, ніж думка.", en: "Write it down rather than just think it — writing anchors differently than thinking." },
    ]},
    { id: "pa3", title: { ru: "Ритуал одного чувства", uk: "Ритуал одного відчуття", en: "Single-sense ritual" }, steps: [
      { ru: "Выбери одно чувство — слух, зрение или осязание — на сегодняшние 10 минут практики.", uk: "Обери одне відчуття — слух, зір або дотик — на сьогоднішні 10 хвилин практики.", en: "Pick one sense — hearing, sight, or touch — for today's 10-minute practice." },
      { ru: "Направь всё внимание только на него, игнорируя остальные ощущения, насколько получится.", uk: "Спрямуй усю увагу лише на нього, ігноруючи решту відчуттів, наскільки вдасться.", en: "Direct all attention to just that sense, ignoring the others as much as you can." },
      { ru: "Замечай, как трудно удерживать одно чувство — это нормально, просто возвращайся к нему.", uk: "Помічай, як важко утримувати одне відчуття — це нормально, просто повертайся до нього.", en: "Notice how hard it is to hold one sense — that's normal, just keep returning to it." },
    ]},
  ]},
  meditationbreath: { easy: [
    { id: "mbe1", title: { ru: "Сессия «Осознанное дыхание» — база", uk: "Сесія «Усвідомлене дихання» — база", en: "'Mindful breathing' session — foundation" }, steps: [
      { ru: "Сядь ровно, руки на коленях, глаза прикрыты или полуоткрыты.", uk: "Сядь рівно, руки на колінах, очі прикриті або напіввідкриті.", en: "Sit upright, hands on your knees, eyes closed or half-open." },
      { ru: "Три медленных вдоха-выдоха — чтобы тело почувствовало паузу.", uk: "Три повільних вдихи-видихи — щоб тіло відчуло паузу.", en: "Three slow breaths — so the body feels the pause begin." },
      { ru: "5-8 минут дыши обычно, удерживая внимание на ощущении воздуха у кончика носа.", uk: "5-8 хвилин дихай звично, утримуючи увагу на відчутті повітря біля кінчика носа.", en: "Breathe normally for 5–8 minutes, holding attention on the air at the tip of the nose." },
      { ru: "Каждый раз, когда ум уходит в мысли, мягко возвращай его к дыханию — без раздражения на себя.", uk: "Щоразу, коли розум іде в думки, м'яко повертай його до дихання — без роздратування на себе.", en: "Each time the mind wanders, gently bring it back to the breath — without frustration." },
    ]},
    { id: "mbe2", title: { ru: "Счёт дыхания", uk: "Рахунок дихання", en: "Counting the breath" }, steps: [
      { ru: "Сядь так же, как обычно для практики, сделай три спокойных вдоха-выдоха.", uk: "Сядь так само, як зазвичай для практики, зроби три спокійних вдихи-видихи.", en: "Sit as usual for practice, take three calm breaths." },
      { ru: "Считай про себя каждый выдох от 1 до 10, затем начинай заново.", uk: "Рахуй про себе кожен видих від 1 до 10, потім починай знову.", en: "Silently count each exhale from 1 to 10, then start over." },
      { ru: "Если сбился со счёта или забыл, на чём остановился — это нормально, просто начни с 1.", uk: "Якщо збився з рахунку або забув, на чому зупинився — це нормально, просто почни з 1.", en: "If you lose count or forget where you were — that's normal, just start again at 1." },
      { ru: "Держи так 6-10 минут.", uk: "Тримай так 6-10 хвилин.", en: "Keep this up for 6–10 minutes." },
    ]},
    { id: "mbe3", title: { ru: "Дыхание животом", uk: "Дихання животом", en: "Belly breathing" }, steps: [
      { ru: "Сядь или ляг, одну руку положи на живот.", uk: "Сядь або ляж, одну руку поклади на живіт.", en: "Sit or lie down, place one hand on your belly." },
      { ru: "Дыши так, чтобы рука на вдохе поднималась, а на выдохе опускалась — без усилия, естественно.", uk: "Дихай так, щоб рука на вдиху підіймалась, а на видиху опускалась — без зусилля, природно.", en: "Breathe so the hand rises on the inhale and falls on the exhale — naturally, without forcing it." },
      { ru: "Удерживай внимание на этом движении 6-10 минут.", uk: "Утримуй увагу на цьому русі 6-10 хвилин.", en: "Hold attention on this movement for 6–10 minutes." },
    ]},
  ], medium: [
    { id: "mbm1", title: { ru: "Дыхание + тело", uk: "Дихання + тіло", en: "Breath + body" }, steps: [
      { ru: "Начни как обычно: три вдоха-выдоха, 5 минут на дыхании у носа.", uk: "Почни як зазвичай: три вдихи-видихи, 5 хвилин на диханні біля носа.", en: "Start as usual: three breaths, then 5 minutes on the breath at the nose." },
      { ru: "Дальше расширь внимание на всё тело целиком — как оно ощущается сидящим и дышащим.", uk: "Далі розшир увагу на все тіло цілком — як воно відчувається сидячим і дихаючим.", en: "Then widen attention to the whole body — how it feels sitting and breathing." },
      { ru: "Держи это более широкое внимание ещё 8-10 минут, возвращаясь к дыханию как к якорю.", uk: "Тримай цю ширшу увагу ще 8-10 хвилин, повертаючись до дихання як до якоря.", en: "Hold this wider attention for another 8–10 minutes, using the breath as an anchor." },
    ]},
    { id: "mbm2", title: { ru: "Дыхание + звуки", uk: "Дихання + звуки", en: "Breath + sounds" }, steps: [
      { ru: "5 минут обычной практики на дыхании.", uk: "5 хвилин звичної практики на диханні.", en: "5 minutes of the usual breath practice." },
      { ru: "Затем на 10 минут перенеси внимание на звуки вокруг — не называя их, просто слушая, как они приходят и уходят.", uk: "Потім на 10 хвилин перенеси увагу на звуки навколо — не називаючи їх, просто слухаючи, як вони приходять і йдуть.", en: "Then for 10 minutes shift attention to the sounds around you — not naming them, just hearing them arise and pass." },
      { ru: "Если ум цепляется за звук и начинает думать о нём — мягко возвращай к простому слушанию.", uk: "Якщо розум чіпляється за звук і починає думати про нього — м'яко повертай до простого слухання.", en: "If the mind grabs a sound and starts thinking about it, gently return to simple listening." },
    ]},
    { id: "mbm3", title: { ru: "Удлинённая сессия", uk: "Подовжена сесія", en: "Extended session" }, steps: [
      { ru: "Сядь на 15 минут без будильника, если получается, или с мягким таймером.", uk: "Сядь на 15 хвилин без будильника, якщо виходить, або з м'яким таймером.", en: "Sit for 15 minutes without an alarm if you can, or with a gentle timer." },
      { ru: "Первые 5 минут — дыхание у носа. Следующие 5 — всё тело. Последние 5 — просто открытое внимание, без выбора точки.", uk: "Перші 5 хвилин — дихання біля носа. Наступні 5 — все тіло. Останні 5 — просто відкрита увага, без вибору точки.", en: "First 5 minutes: breath at the nose. Next 5: the whole body. Last 5: just open awareness, no fixed point." },
    ]},
  ], advanced: [
    { id: "mba1", title: { ru: "Долгая сессия", uk: "Довга сесія", en: "Long sitting" }, steps: [
      { ru: "Сядь на 20-25 минут — телефон в другой комнате, таймер на негромкий сигнал.", uk: "Сядь на 20-25 хвилин — телефон в іншій кімнаті, таймер на негучний сигнал.", en: "Sit for 20–25 minutes — phone in another room, timer set to a quiet chime." },
      { ru: "Двигайся между дыханием, телом и открытым вниманием так, как чувствуешь сам(а), без жёсткой схемы.", uk: "Рухайся між диханням, тілом і відкритою увагою так, як відчуваєш сам(а), без жорсткої схеми.", en: "Move between breath, body, and open awareness however feels right — no rigid script." },
    ]},
    { id: "mba2", title: { ru: "Практика в движении", uk: "Практика в русі", en: "Walking practice" }, steps: [
      { ru: "10-15 минут медленной ходьбы, желательно без цели и без телефона.", uk: "10-15 хвилин повільної ходьби, бажано без мети і без телефону.", en: "10–15 minutes of slow walking, ideally with no destination and no phone." },
      { ru: "Перенеси то же качество внимания с сидячей практики на ощущение стоп и дыхания в движении.", uk: "Перенеси ту саму якість уваги з сидячої практики на відчуття стоп і дихання в русі.", en: "Bring the same quality of attention from the seated practice to the feet and the breath while moving." },
    ]},
    { id: "mba3", title: { ru: "Мини-паузы в течение дня", uk: "Міні-паузи протягом дня", en: "Mini-pauses through the day" }, steps: [
      { ru: "Помимо основной сессии, сделай сегодня 3 мини-паузы по 1 минуте — между делами, без повода.", uk: "Окрім основної сесії, зроби сьогодні 3 міні-паузи по 1 хвилині — між справами, без приводу.", en: "Besides the main session, take 3 one-minute pauses today — between tasks, no special reason." },
      { ru: "В каждой — просто 5-6 осознанных вдохов-выдохов, и обратно к делам.", uk: "У кожній — просто 5-6 усвідомлених вдихів-видихів, і назад до справ.", en: "In each one, just 5–6 mindful breaths, then back to what you were doing." },
    ]},
  ]},
};

function findRitual(group, ritualId) {
  const tiers = CHALLENGE_RITUALS[group] || CHALLENGE_RITUALS.pause;
  return tiers.easy.find(r => r.id === ritualId) || tiers.medium.find(r => r.id === ritualId) || tiers.advanced.find(r => r.id === ritualId) || null;
}

const CHALLENGE_TIER_META = {
  easy: { ru: "Базовый уровень", uk: "Базовий рівень", en: "Foundation level" },
  medium: { ru: "Следующий уровень", uk: "Наступний рівень", en: "Next level" },
  advanced: { ru: "Продвинутый уровень", uk: "Просунутий рівень", en: "Advanced level" },
};


function suggestChallengeLength(patternCount) {
  if (patternCount >= 10) return 30;
  if (patternCount >= 6) return 20;
  return 10;
}

// Ярус дня: 1-10 = easy (база), 11-20 = medium (следующий уровень), 21-30 = advanced (продвинутый).
// Длина челленджа (10/20/30) — это просто "докуда" в этом едином пути человек сегодня идёт.
function tierForDay(dayNum) {
  if (dayNum > 20) return "advanced";
  if (dayNum > 10) return "medium";
  return "easy";
}
const TIER_START = { easy: 0, medium: 10, advanced: 20 };

function buildChallengeDays(group, lengthDays) {
  const pool = DAILYCHECK_ACTIONS[group] || DAILYCHECK_ACTIONS.pause;
  const ritualTiers = CHALLENGE_RITUALS[group] || CHALLENGE_RITUALS.pause;
  const days = [];
  for (let i = 0; i < lengthDays; i++) {
    const dayNum = i + 1;
    const tier = tierForDay(dayNum);
    const ritualPool = ritualTiers[tier];
    const ritual = ritualPool[(dayNum - 1 - TIER_START[tier]) % ritualPool.length];
    const action = pool[i % pool.length];
    const reflection = CHALLENGE_REFLECTIONS[i % CHALLENGE_REFLECTIONS.length];
    const tierStarts = dayNum === 1 || dayNum === 11 || dayNum === 21;
    days.push({ dayIndex: dayNum, tier, tierStarts, action_id: action.id, ritual_id: ritual.id, reflection_id: reflection.id, done: false, doneAt: null });
  }
  return days;
}

const HORMONE_TO_DAILYCHECK_GROUP = {
  cortisol: "anxiety", dopamine: "lowEnergy", serotonin: "recovery",
  gaba: "anxiety", oxytocin: "anxiety", testosterone: "focus", acetylcholine: "focus",
};
// Прямое соответствие показателя своей группе — для случая, когда пограничный чек-ин
// решаем по накопленной за всё время личной истории, а не по гормонам.
const INDICATOR_TO_DAILYCHECK_GROUP = {
  energy: "lowEnergy", mood: "recovery", tension: "overload", anxiety: "anxiety",
  fatigue: "recovery", sleep: "recovery", focus: "focus", social: "anxiety",
  motivation: "lowEnergy", calm: "anxiety",
};

// Развёрнутые пояснения по каждому показателю (4 градации — как в тестах на выгорание/гормоны),
// а не короткая фраза из варианта ответа.
const DAILYCHECK_INDICATOR_INSIGHTS = {
  energy: [
    { ru: "Сил почти нет — тело сигналит, что пора беречь ресурс, а не выжимать из себя больше.", uk: "Сил майже немає — тіло сигналить, що час берегти ресурс, а не вичавлювати з себе більше.", en: "Almost no strength left — the body is signaling it's time to conserve, not push harder." },
    { ru: "Энергии хватает через силу — можно двигаться, но легко скатиться в перерасход.", uk: "Енергії вистачає через силу — можна рухатися, але легко скотитися в перевитрату.", en: "There's just enough energy to push through — but it's easy to overspend it." },
    { ru: "Сил в целом достаточно для повседневных дел, без явного запаса.", uk: "Сил загалом достатньо для повсякденних справ, без явного запасу.", en: "Enough energy for everyday things, without much reserve." },
    { ru: "Энергии много — хороший момент, чтобы довести дела до конца, не сжигая её впустую.", uk: "Енергії багато — гарний момент, щоб довести справи до кінця, не спалюючи її даремно.", en: "Plenty of energy — a good moment to finish things, without burning it needlessly." },
  ],
  mood: [
    { ru: "Настроение сейчас тяжёлое — это не значит, что с тобой что-то не так, просто день такой.", uk: "Настрій зараз важкий — це не означає, що з тобою щось не так, просто день такий.", en: "Mood is heavy right now — that doesn't mean something's wrong with you, some days are just like this." },
    { ru: "Настроение неровное — ни хорошее, ни плохое, промежуточное состояние.", uk: "Настрій нерівний — ні хороший, ні поганий, проміжний стан.", en: "Mood is mixed — not great, not bad, somewhere in between." },
    { ru: "Настроение скорее ровное и спокойное, без резких перепадов.", uk: "Настрій скоріше рівний і спокійний, без різких перепадів.", en: "Mood is fairly steady and calm, no sharp swings." },
    { ru: "Настроение светлое — хорошая база, чтобы делать что-то важное или приятное.", uk: "Настрій світлий — гарна база, щоб робити щось важливе чи приємне.", en: "Mood is light — a good base for doing something meaningful or enjoyable." },
  ],
  tension: [
    { ru: "Тело сильно напряжено — стоит буквально остановиться и расслабить плечи прямо сейчас.", uk: "Тіло сильно напружене — варто буквально зупинитися і розслабити плечі просто зараз.", en: "The body is quite tense — worth literally stopping and dropping your shoulders right now." },
    { ru: "Есть заметное напряжение, но оно ещё управляемое.", uk: "Є помітна напруга, але вона ще керована.", en: "There's noticeable tension, but it's still manageable." },
    { ru: "Тело в целом расслаблено, лёгкое напряжение — это нормально.", uk: "Тіло загалом розслаблене, легка напруга — це нормально.", en: "The body is fairly relaxed, a bit of tension is normal." },
    { ru: "Тело расслаблено — редкое и ценное состояние, стоит его заметить.", uk: "Тіло розслаблене — рідкісний і цінний стан, варто його помітити.", en: "The body is relaxed — a rare and valuable state, worth noticing." },
  ],
  anxiety: [
    { ru: "Тревога сейчас высокая — организм в режиме тревоги, и это забирает много ресурса.", uk: "Тривога зараз висока — організм у режимі тривоги, і це забирає багато ресурсу.", en: "Anxiety is high right now — the body is in alarm mode, and that drains a lot of resources." },
    { ru: "Тревожность заметна, но не захлёстывает.", uk: "Тривожність помітна, але не захльостує.", en: "Anxiety is noticeable but not overwhelming." },
    { ru: "Тревоги почти нет — фон спокойный.", uk: "Тривоги майже немає — фон спокійний.", en: "Almost no anxiety — the background is calm." },
    { ru: "Полное спокойствие — тревога сейчас совсем не мешает.", uk: "Повний спокій — тривога зараз зовсім не заважає.", en: "Complete calm — anxiety isn't getting in the way at all right now." },
  ],
  fatigue: [
    { ru: "Усталость накопилась сильно — организм явно просит паузу.", uk: "Втома накопичилась сильно — організм явно просить паузу.", en: "Fatigue has built up a lot — the body is clearly asking for a pause." },
    { ru: "Усталость ощутима, но ещё не критична.", uk: "Втома відчутна, але ще не критична.", en: "Fatigue is noticeable but not critical yet." },
    { ru: "Усталости немного, в целом бодрое состояние.", uk: "Втоми небагато, загалом бадьорий стан.", en: "Only a little fatigue, mostly an alert state." },
    { ru: "Усталости почти нет — хороший запас сил.", uk: "Втоми майже немає — гарний запас сил.", en: "Almost no fatigue — a good reserve of energy." },
  ],
  sleep: [
    { ru: "Сон сейчас страдает сильнее всего — это часто тянет за собой остальные показатели.", uk: "Сон зараз страждає найсильніше — це часто тягне за собою решту показників.", en: "Sleep is suffering the most right now — that often drags the other indicators down with it." },
    { ru: "Сон нестабильный, качество среднее.", uk: "Сон нестабільний, якість середня.", en: "Sleep is unstable, average quality." },
    { ru: "Сон в целом достаточный, без серьёзных нареканий.", uk: "Сон загалом достатній, без серйозних нарікань.", en: "Sleep is generally adequate, no major complaints." },
    { ru: "Сон восстанавливает хорошо — отличная основа для остального дня.", uk: "Сон відновлює добре — відмінна основа для решти дня.", en: "Sleep is restorative — a great foundation for the rest of the day." },
  ],
  focus: [
    { ru: "Концентрация сейчас низкая — в голове туман, сложные задачи лучше отложить.", uk: "Концентрація зараз низька — у голові туман, складні задачі краще відкласти.", en: "Focus is low right now — foggy-headed, better to postpone complex tasks." },
    { ru: "Сосредоточиться получается, но с усилием.", uk: "Зосередитися виходить, але з зусиллям.", en: "You can focus, but it takes effort." },
    { ru: "Концентрация в целом рабочая, голова достаточно ясная.", uk: "Концентрація загалом робоча, голова досить ясна.", en: "Focus is workable, head is reasonably clear." },
    { ru: "Голова ясная — хороший момент для сложных задач.", uk: "Голова ясна — гарний момент для складних задач.", en: "Clear-headed — a good moment for complex tasks." },
  ],
  social: [
    { ru: "Сейчас явно хочется побыть одному/одной — нормальный сигнал, не обязательно тревожный.", uk: "Зараз явно хочеться побути на самоті — нормальний сигнал, не обов'язково тривожний.", en: "Right now you clearly want to be alone — a normal signal, not necessarily a worrying one." },
    { ru: "Желание общаться слабое, но не нулевое.", uk: "Бажання спілкуватися слабке, але не нульове.", en: "The urge to connect is weak, but not zero." },
    { ru: "Скорее хочется контакта с людьми, чем одиночества.", uk: "Скоріше хочеться контакту з людьми, ніж самотності.", en: "You lean more toward wanting company than solitude." },
    { ru: "Сильное желание быть с людьми — хороший момент для встреч и разговоров.", uk: "Сильне бажання бути з людьми — гарний момент для зустрічей і розмов.", en: "A strong pull toward people — a good moment for meeting up and talking." },
  ],
  motivation: [
    { ru: "Мотивации почти нет — это не лень, а признак, что ресурс истощён.", uk: "Мотивації майже немає — це не лінь, а ознака, що ресурс вичерпано.", en: "Almost no motivation — that's not laziness, it's a sign resources are depleted." },
    { ru: "Делать что-то получается через силу.", uk: "Робити щось виходить через силу.", en: "You can get things done, but it takes pushing." },
    { ru: "Мотивация в целом присутствует, без явного подъёма.", uk: "Мотивація загалом присутня, без явного підйому.", en: "Motivation is present, without a clear boost." },
    { ru: "Мотивация высокая — хороший момент для действий.", uk: "Мотивація висока — гарний момент для дій.", en: "Motivation is high — a good moment to act." },
  ],
  calm: [
    { ru: "Внутреннего спокойствия сейчас почти нет — состояние близко к перегрузке.", uk: "Внутрішнього спокою зараз майже немає — стан близький до перевантаження.", en: "Almost no inner calm right now — close to an overloaded state." },
    { ru: "Спокойствие неустойчивое, легко сбивается.", uk: "Спокій нестійкий, легко збивається.", en: "Calm is fragile, easily thrown off." },
    { ru: "Внутри в целом спокойно, без сильных потрясений.", uk: "Всередині загалом спокійно, без сильних потрясінь.", en: "Fairly calm inside, no major upheaval." },
    { ru: "Полный внутренний покой — редкое и ценное состояние.", uk: "Повний внутрішній спокій — рідкісний і цінний стан.", en: "Complete inner peace — a rare and valuable state." },
  ],
};

// Переиспользуемая строка одного показателя: шкала с делениями на 25/50/75%,
// 4-словная градация (как в остальных тестах) и развёрнутое пояснение состояния.
function IndicatorBarRow({ q, pct, avgScore }) {
  const { tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const hiIndex = pct <= 25 ? 0 : pct <= 50 ? 1 : pct <= 75 ? 2 : 3;
  const scaleWords = [
    { ru: "ТЯЖЕЛО", uk: "ВАЖКО", en: "HEAVY" },
    { ru: "СРЕДНЕ", uk: "СЕРЕДНЬО", en: "MID" },
    { ru: "РОВНО", uk: "РІВНО", en: "STEADY" },
    { ru: "НА ПОДЪЁМЕ", uk: "НА ПІДЙОМІ", en: "ON THE RISE" },
  ];
  const insight = (DAILYCHECK_INDICATOR_INSIGHTS[q.key] || [])[hiIndex];
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", color: c.inkMuted }}>{tx(q.label)}</span>
        <span style={{ fontSize: "13px", color: c.accent, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ ...S.metricTrack, background: "rgba(128,110,90,0.28)", border: `1px solid ${c.line}`, boxSizing: "border-box" }}>
          <div style={{ ...S.metricFill, width: `${pct}%`, background: "linear-gradient(90deg, #241D14, #C8A97E)" }}>
            <span style={{ ...S.metricFillDot, background: "#C8A97E" }} />
          </div>
        </div>
        {[25, 50, 75].map(tick => (
          <div key={tick} style={{ position: "absolute", left: `${tick}%`, top: "1px", bottom: "1px", width: "1px", background: "rgba(0,0,0,0.3)", pointerEvents: "none" }} />
        ))}
      </div>
      <div style={{ ...S.scaleLabels, marginTop: "6px" }}>
        {scaleWords.map((w, i) => (
          <span key={i} style={i === hiIndex ? { ...S.scaleLabelHi, fontSize: "9px" } : { ...S.scaleLabel, fontSize: "9px" }}>
            {tx(w)}{i === hiIndex ? " ◉" : ""}
          </span>
        ))}
      </div>
      {insight && (
        <div style={{ ...S.metricQuote, marginTop: "10px" }}>
          <p style={S.metricQuoteText}>«{tx(insight)}»</p>
        </div>
      )}
    </div>
  );
}

// Короткая помощь читать сочетания показателей вместе (все 10 выровнены так, что
// БОЛЬШЕ = ЛУЧШЕ по каждому — это правило одно на все показатели без исключений).
function interpretIndicatorCombo(scores) {
  const entries = Object.entries(scores);
  const low = entries.filter(([, v]) => v <= 2).map(([k]) => k);
  const high = entries.filter(([, v]) => v >= 4).map(([k]) => k);
  const labelOf = k => DAILYCHECK_QUESTIONS.find(q => q.key === k)?.label;
  if (low.length === 0 && high.length >= 6) {
    return { ru: "Почти всё в зелёной зоне — сейчас скорее ресурсное состояние в целом.", uk: "Майже все в зеленій зоні — зараз скоріше ресурсний стан загалом.", en: "Almost everything is in the green zone — this looks like a resourced state overall." };
  }
  if (low.length >= 3) {
    return { ru: "Просело сразу несколько показателей — это и есть тот самый сигнал, который выбрал сегодняшний совет.", uk: "Просіло одразу кілька показників — це і є той самий сигнал, який обрав сьогоднішню пораду.", en: "Several indicators dropped at once — that's exactly the signal behind today's advice." };
  }
  if (low.length === 1 || low.length === 2) {
    const names = low.map(k => tx0(labelOf(k))).join(", ");
    return { ru: `Просело точечно: ${names}. Остальное держится — это скорее локальная просадка, чем общий спад.`, uk: `Просіло точково: ${names}. Решта тримається — це скоріше локальна просадка, ніж загальний спад.`, en: `A specific dip: ${names}. Everything else is holding — this looks local rather than a broad decline.` };
  }
  return { ru: "Показатели умеренные без явных перекосов — это нормальный рабочий диапазон.", uk: "Показники помірні без явних перекосів — це нормальний робочий діапазон.", en: "Indicators are moderate without a clear skew — a normal working range." };
}
function tx0(v) { if (!v) return ""; if (typeof v === "string") return v; return v.ru || v.uk || v.en || ""; }

function pickDailyCheckGroup(scores, ctx = {}) {
  const { hormoneWeakestKey, burnoutPct, moodHeavy, recentActionIds = [], allTimeWeakestKey, allTimeCount = 0 } = ctx;
  let group;
  if (scores.anxiety <= 2 || scores.calm <= 2) group = "anxiety";
  else if (scores.fatigue <= 2 || scores.sleep <= 2) group = "recovery";
  else if (scores.tension <= 2 && scores.focus <= 3) group = "overload";
  else if (scores.energy <= 2) group = "lowEnergy";
  else if (scores.focus <= 2) group = "focus";
  else if (scores.social <= 2 && scores.mood <= 3) group = "anxiety"; // общение — берём action a5 через ротацию
  else group = "pause";

  let reason = { type: "checkin" };

  // фон: сильное выгорание или тяжёлый 90-дневный тренд смещают к мягким группам
  const softBias = (burnoutPct != null && burnoutPct >= 41) || moodHeavy;
  if (softBias && (group === "focus" || group === "lowEnergy")) {
    group = "recovery";
    reason = { type: "background", burnoutPct, moodHeavy };
  }

  const allFine = Object.values(scores).every(v => v >= 3);

  // накопленная личная история (10+ тестов) — приоритетнее гормонов, если чек-ин пограничный
  if (allFine && allTimeCount >= 5 && allTimeWeakestKey && INDICATOR_TO_DAILYCHECK_GROUP[allTimeWeakestKey]) {
    group = INDICATOR_TO_DAILYCHECK_GROUP[allTimeWeakestKey];
    reason = { type: "pattern", key: allTimeWeakestKey };
  } else if (allFine && hormoneWeakestKey && HORMONE_TO_DAILYCHECK_GROUP[hormoneWeakestKey]) {
    // слабое звено гормонов — если чек-ин пограничный (нет явной проблемы), задаёт группу
    group = HORMONE_TO_DAILYCHECK_GROUP[hormoneWeakestKey];
    reason = { type: "hormone", key: hormoneWeakestKey };
  } else if (!allFine && hormoneWeakestKey && HORMONE_TO_DAILYCHECK_GROUP[hormoneWeakestKey] === group) {
    // чек-ин сам указал на проблему, и она совпадает со слабым звеном — не меняем группу, но отмечаем совпадение
    reason = { type: "aligned", key: hormoneWeakestKey };
  }

  const pool = DAILYCHECK_ACTIONS[group] || DAILYCHECK_ACTIONS.pause;
  const fresh = pool.filter(a => !recentActionIds.includes(a.id));
  const chosen = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh.length : pool.length))];
  return { group, action: chosen, reason };
}

function dailyCheckReasonText(reason) {
  if (!reason) return null;
  if (reason.type === "background") {
    return reason.burnoutPct != null && reason.burnoutPct >= 41
      ? { ru: "Учли и общий фон последнего времени — по твоему уровню выгорания сейчас лучше мягче.", uk: "Врахували і загальний фон останнього часу — за рівнем вигорання зараз краще м'якше.", en: "Also factored in your recent burnout level — better to go gentle right now." }
      : { ru: "Учли и то, каким было твоё настроение в последние недели — сейчас лучше мягче.", uk: "Врахували і те, яким був твій настрій останні тижні — зараз краще м'якше.", en: "Also factored in your mood over the last few weeks — better to go gentle right now." };
  }
  if (reason.type === "hormone" || reason.type === "aligned") {
    const hName = HORMONE_META[reason.key]?.name || { ru: "", uk: "", en: "" };
    if (reason.type === "aligned") {
      return {
        ru: `Заметно совпадает с твоим слабым звеном по гормональному тесту — ${hName.ru || ""}.`,
        uk: `Помітно збігається з твоєю слабкою ланкою за гормональним тестом — ${hName.uk || ""}.`,
        en: `This also lines up with the weak link from your hormone test — ${hName.en || ""}.`,
      };
    }
    return {
      ru: `Твои ответы сегодня пограничные, поэтому учли слабое звено твоего гормонального теста — ${hName.ru || ""}.`,
      uk: `Твої відповіді сьогодні пограничні, тому врахували слабку ланку твого гормонального тесту — ${hName.uk || ""}.`,
      en: `Today's answers were borderline, so we factored in the weak link from your hormone test — ${hName.en || ""}.`,
    };
  }
  if (reason.type === "pattern") {
    const qLabel = DAILYCHECK_QUESTIONS.find(q => q.key === reason.key)?.label || { ru: "", uk: "", en: "" };
    return {
      ru: `Твои ответы сегодня пограничные, а по твоей накопленной истории чаще всего слабое место — «${qLabel.ru || ""}», это и учли.`,
      uk: `Твої відповіді сьогодні пограничні, а за твоєю накопиченою історією найчастіше слабке місце — «${qLabel.uk || ""}», це і врахували.`,
      en: `Today's answers were borderline, and your own history most often points to "${qLabel.en || ""}" — so that's what we factored in.`,
    };
  }
  return null;
}

const DAILYCHECK_GROUP_LABEL = {
  recovery: { ru: "Похоже, тебе сейчас нужно восстановиться", uk: "Схоже, тобі зараз треба відновитися", en: "Looks like you need to recover" },
  overload: { ru: "Похоже, тебя сейчас перегружает", uk: "Схоже, тебе зараз перевантажує", en: "Looks like you're overloaded" },
  anxiety: { ru: "Похоже, сейчас важнее всего успокоиться", uk: "Схоже, зараз найважливіше заспокоїтися", en: "Looks like calming down matters most right now" },
  lowEnergy: { ru: "Похоже, энергии сейчас маловато", uk: "Схоже, енергії зараз малувато", en: "Looks like your energy is running low" },
  focus: { ru: "Похоже, не хватает концентрации", uk: "Схоже, бракує концентрації", en: "Looks like focus is what's missing" },
  pause: { ru: "В целом всё ровно — но небольшая пауза не помешает", uk: "Загалом усе рівно — але невелика пауза не завадить", en: "Things look steady — but a small pause won't hurt" },
};

function DailyCheckScreen({ onBack }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("intro"); // intro | questions | advice | followup | done
  const [followUpChoice, setFollowUpChoice] = useState(null);
  const [introHist, setIntroHist] = useState(null); // null = ещё грузится
  const [showNotes, setShowNotes] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengePresetGroup, setChallengePresetGroup] = useState(null);

  useEffect(() => {
    getHistory("dailycheck_history").then(setIntroHist).catch(() => setIntroHist([]));
  }, []);

  const startTest = () => { statEvent("dailycheck"); setStep("questions"); };

  if (showNotes) return <QuietNotes onBack={() => setShowNotes(false)} />;
  if (showChallenge) return <ChallengeScreen onBack={() => setShowChallenge(false)} presetGroup={challengePresetGroup} />;

  const q = DAILYCHECK_QUESTIONS[current];

  const handleNext = () => {
    if (selected === null || animating) return;
    setAnimating(true);
    const na = [...answers, { key: q.key, score: selected }];
    setTimeout(() => {
      setAnswers(na); setSelected(null);
      if (current + 1 >= DAILYCHECK_QUESTIONS.length) {
        finish(na);
      } else {
        setCurrent(c => c + 1);
      }
      setAnimating(false);
    }, 300);
  };

  const finish = async (na) => {
    const scores = {};
    na.forEach(a => { scores[a.key] = a.score; });

    const [hormoneHistRaw, burnoutHistRaw, dcHistRaw] = await Promise.all([
      getHistory("hormones_history"),
      getHistory("quiz_history"),
      getHistory("dailycheck_history"),
    ]);

    let hormoneWeakestKey = null;
    if (hormoneHistRaw.length) {
      const last = hormoneHistRaw[hormoneHistRaw.length - 1];
      const finalScores = computeHormoneScores(last.main || {}, last.cross || {});
      const entries = Object.entries(finalScores);
      if (entries.length) hormoneWeakestKey = entries.reduce((min, e) => (e[1] < min[1] ? e : min), entries[0])[0];
    }
    // burnout_history хранит уже готовый % (см. QuizScreen: burnout = Math.round((bt/75)*100))
    const burnoutAvg = calcQuizAverage(burnoutHistRaw, 3);
    const burnoutPct = burnoutAvg ? Math.round(burnoutAvg.avgBurnout) : null;

    // 90-дневный тренд настроения: тот же источник, что и "Куда ты движешься" в профиле —
    // ежедневные записи "mood_" + dateKey, а не отдельная история.
    let moodHeavy = false;
    try {
      const moodKeys90 = [];
      for (let i = 0; i < 90; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        moodKeys90.push("mood_" + getDateKey(d));
      }
      const moodValues90 = await CS.getMultiple(moodKeys90);
      const scoresLast90 = moodKeys90
        .map(k => moodValues90[k])
        .filter(Boolean)
        .map(r => JSON.parse(r))
        .map(e => e.score)
        .filter(v => typeof v === "number");
      if (scoresLast90.length >= 5) {
        const avg = scoresLast90.reduce((s, v) => s + v, 0) / scoresLast90.length;
        moodHeavy = avg < 5;
      }
    } catch {}

    const recentActionIds = dcHistRaw.slice(-2).map(h => h.action_id).filter(Boolean);

    // накопленная за всё время статистика — какой показатель слабее всего в среднем (от 10 тестов)
    let allTimeWeakestKey = null;
    if (dcHistRaw.length >= 10) {
      const sums = {}; const counts = {};
      dcHistRaw.forEach(h => {
        if (!h.indicators) return;
        Object.entries(h.indicators).forEach(([k, v]) => { sums[k] = (sums[k] || 0) + v; counts[k] = (counts[k] || 0) + 1; });
      });
      const avgs = Object.keys(sums).map(k => [k, sums[k] / counts[k]]);
      if (avgs.length) allTimeWeakestKey = avgs.reduce((min, e) => (e[1] < min[1] ? e : min), avgs[0])[0];
    }

    const { group, action, reason } = pickDailyCheckGroup(scores, { hormoneWeakestKey, burnoutPct, moodHeavy, recentActionIds, allTimeWeakestKey, allTimeCount: dcHistRaw.length });

    const problemKeys = Object.entries(scores).filter(([, v]) => v <= 2).map(([k]) => k);
    const followUpKeys = (problemKeys.length ? problemKeys : Object.entries(scores).sort((a, b) => a[1] - b[1]).slice(0, 2).map(([k]) => k)).slice(0, 3);

    // % по чек-ину (1-5 → 0-100%) для отображения в профиле, как у гормонов/выгорания
    const avgScore = Object.values(scores).reduce((s, v) => s + v, 0) / Object.values(scores).length;
    const pct = Math.round(((avgScore - 1) / 4) * 100);
    const weakestKey = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];

    // Более точный подсчёт для отображения (как в «Гормональном коде»): среднее по каждому
    // показателю за последние до 3 прохождений (включая сегодняшнее), а не одно сырое значение.
    // Совет и группа выше уже выбраны по сегодняшним сырым ответам — здесь только для витрины.
    const last2 = dcHistRaw.slice(-2);
    const avgScores = {};
    DAILYCHECK_QUESTIONS.forEach(qq => {
      const vals = [scores[qq.key], ...last2.map(h => h.indicators?.[qq.key]).filter(v => typeof v === "number")];
      avgScores[qq.key] = vals.reduce((s, v) => s + v, 0) / vals.length;
    });
    const avgCount = 1 + last2.filter(h => h.indicators).length;
    const overallAvg = Object.values(avgScores).reduce((s, v) => s + v, 0) / Object.values(avgScores).length;
    const avgPct = Math.round(((overallAvg - 1) / 4) * 100);
    const avgWeakestKey = Object.entries(avgScores).sort((a, b) => a[1] - b[1])[0][0];

    // сколько раз эта же группа встречалась в последних отметках — сигнал для подсказки о челлендже
    const recentForGroup = dcHistRaw.slice(-6);
    const groupRecentCount = 1 + recentForGroup.filter(h => h.group === group).length;

    setResult({ scores, group, action, followUpKeys, reason, pct, weakestKey, avgScores, avgCount, avgPct, avgWeakestKey, groupRecentCount });
    setFinished(true);
    setStep("advice");
  };

  const handleDone = () => setStep("followup");

  const saveFollowUp = async (choice) => {
    setFollowUpChoice(choice);
    const delta = choice === "better" ? 1 : choice === "worse" ? -1 : 0;
    await pushHistory("dailycheck_history", {
      indicators: result.scores,
      group: result.group,
      action_id: result.action.id,
      pct: result.pct,
      weakestKey: result.weakestKey,
      followUp: { improved: choice, checkedIndicators: result.followUpKeys, delta },
    });
    setStep("done");
  };

  if (step === "intro") {
    const hasHist = introHist && introHist.length > 0;
    let introPct = null, introWeakestQ = null, introBreakdown = [];
    if (hasHist) {
      const last3 = introHist.slice(-3);
      const pctOf = (h) => {
        if (typeof h.pct === "number") return h.pct;
        if (!h.indicators) return null;
        const vals = Object.values(h.indicators);
        if (!vals.length) return null;
        const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
        return Math.round(((avg - 1) / 4) * 100);
      };
      const pcts = last3.map(pctOf).filter(v => v != null);
      introPct = pcts.length ? Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length) : null;
      const dcLastRec = introHist[introHist.length - 1];
      const weakestKey = dcLastRec.weakestKey || (dcLastRec.indicators ? Object.entries(dcLastRec.indicators).sort((a, b) => a[1] - b[1])[0][0] : null);
      introWeakestQ = weakestKey ? DAILYCHECK_QUESTIONS.find(qq => qq.key === weakestKey) : null;
      introBreakdown = DAILYCHECK_QUESTIONS.map(qq => {
        const vals = last3.map(h => h.indicators?.[qq.key]).filter(v => typeof v === "number");
        if (!vals.length) return null;
        const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
        return { key: qq.key, q: qq, avgScore: avg, pct: Math.round(((avg - 1) / 4) * 100) };
      }).filter(Boolean);
    }
    const introScaleLabels = [tx({ru:"ТЯЖЕЛО",uk:"ВАЖКО",en:"HEAVY"}), tx({ru:"СРЕДНЕ",uk:"СЕРЕДНЬО",en:"MID"}), tx({ru:"РОВНО",uk:"РІВНО",en:"STEADY"}), tx({ru:"НА ПОДЪЁМЕ",uk:"НА ПІДЙОМІ",en:"ON THE RISE"})];
    const introHi = introPct == null ? 0 : introPct <= 25 ? 0 : introPct <= 50 ? 1 : introPct <= 75 ? 2 : 3;
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ ...S.resultContainer, alignItems: "stretch", width: "100%" }}>
          {introHist === null ? (
            <p style={{ color: c.inkSoft, fontStyle: "italic", textAlign: "center" }}>{t.openingNotes}</p>
          ) : hasHist ? (
            <>
              <div style={{ width: "100%" }}>
                <MetricBlock
                  value={introPct}
                  rightName={introWeakestQ ? `${tx({ru:"Слабее всего",uk:"Найслабше",en:"Weakest"})}: ${tx(introWeakestQ.label)}` : tx({ru:"Компас состояния",uk:"Компас стану",en:"State compass"})}
                  rightSub={`${tx({ru:"последние отметки",uk:"останні відмітки",en:"recent check-ins"})} · ${introHist.length}`}
                  fillFrom="#241D14"
                  fillTo="#C8A97E"
                  scaleLabels={introScaleLabels}
                  hiIndex={introHi}
                  quote={tx({ ru: "Вот как ты был(а) в последний раз", uk: "Ось яким(ою) ти був(ла) минулого разу", en: "Here's how you were last time" })}
                  animKey={`dc-intro-${introPct}`}
                />
              </div>
              {introBreakdown.length > 0 && (
                <div style={{ ...S.metricBlock, width: "100%", marginTop: "16px", paddingTop: "18px", paddingBottom: "6px", boxSizing: "border-box" }}>
                  <p style={{ margin: "0 0 18px", fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft }}>
                    {tx({ ru: "ВСЕ 10 ПОКАЗАТЕЛЕЙ", uk: "УСІ 10 ПОКАЗНИКІВ", en: "ALL 10 INDICATORS" })}
                  </p>
                  {introBreakdown.map(item => (
                    <IndicatorBarRow key={item.key} q={item.q} pct={item.pct} avgScore={item.avgScore} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyMetric text={tx({ ru: "Здесь появится твоя статистика после первого прохождения.", uk: "Тут з'явиться твоя статистика після першого проходження.", en: "Your stats will show up here after your first check-in." })} />
          )}
          <button onClick={startTest} style={{ ...S.primaryBtn, marginTop: "20px" }}>
            {tx(hasHist
              ? { ru: "Пройти тест сегодня", uk: "Пройти тест сьогодні", en: "Take today's check-in" }
              : { ru: "Пройти тест", uk: "Пройти тест", en: "Take the check-in" })}
          </button>
          <button onClick={() => setShowChallenge(true)} style={{ width: "100%", padding: "14px", background: "transparent", border: `1px solid ${c.line}`, borderRadius: "12px", color: c.inkMuted, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>🧭</span><span>{tx({ ru: "Челленджи", uk: "Челенджі", en: "Challenges" })}</span><span style={{ color: c.inkSoft, fontSize: "16px" }}>→</span>
          </button>
          <button onClick={() => setShowNotes(true)} style={{ width: "100%", padding: "14px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>🌙</span><span>{t.notebook}</span><span style={{ color: c.inkSoft, fontSize: "16px" }}>→</span>
          </button>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  if (step === "advice" && result) {
    const shareMsg = `Компас состояния 🧭\n${tx(DAILYCHECK_GROUP_LABEL[result.group])}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
    const dcScaleLabels = [tx({ru:"ТЯЖЕЛО",uk:"ВАЖКО",en:"HEAVY"}), tx({ru:"СРЕДНЕ",uk:"СЕРЕДНЬО",en:"MID"}), tx({ru:"РОВНО",uk:"РІВНО",en:"STEADY"}), tx({ru:"НА ПОДЪЁМЕ",uk:"НА ПІДЙОМІ",en:"ON THE RISE"})];
    const dcHiIndex = result.avgPct <= 25 ? 0 : result.avgPct <= 50 ? 1 : result.avgPct <= 75 ? 2 : 3;
    const weakestQ = DAILYCHECK_QUESTIONS.find(q => q.key === result.avgWeakestKey);
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ ...S.resultContainer, alignItems: "stretch", width: "100%" }}>
          <div style={{ width: "100%" }}>
            <MetricBlock
              value={result.avgPct}
              rightName={weakestQ ? `${tx({ru:"Слабее всего",uk:"Найслабше",en:"Weakest"})}: ${tx(weakestQ.label)}` : tx({ru:"Компас состояния",uk:"Компас стану",en:"State compass"})}
              rightSub={`${tx({ru:"среднее по",uk:"середнє за",en:"average of"})} ${result.avgCount} ${tx({ ru: result.avgCount === 1 ? "отметке" : "отметкам", uk: result.avgCount === 1 ? "відмітці" : "відміткам", en: result.avgCount === 1 ? "check-in" : "check-ins" })}`}
              fillFrom="#241D14"
              fillTo="#C8A97E"
              scaleLabels={dcScaleLabels}
              hiIndex={dcHiIndex}
              quote={`«${tx(DAILYCHECK_GROUP_LABEL[result.group] || {})}»`}
              animKey={`dc-advice-${result.avgPct}`}
            />
          </div>
          <div style={{ ...S.metricBlock, width: "100%", marginTop: "16px", paddingTop: "18px", paddingBottom: "6px", marginBottom: "16px", boxSizing: "border-box" }}>
            <p style={{ margin: "0 0 18px", fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft }}>
              {tx({ ru: "ВСЕ 10 ПОКАЗАТЕЛЕЙ", uk: "УСІ 10 ПОКАЗНИКІВ", en: "ALL 10 INDICATORS" })}
            </p>
            {DAILYCHECK_QUESTIONS.map(q => {
              const avgScore = result.avgScores[q.key];
              const pct = Math.round(((avgScore - 1) / 4) * 100);
              return <IndicatorBarRow key={q.key} q={q} pct={pct} avgScore={avgScore} />;
            })}
            <p style={{ margin: "4px 0 14px", fontSize: "12px", color: c.inkMuted, lineHeight: 1.5, borderTop: `1px solid ${c.line}`, paddingTop: "14px" }}>
              {tx(interpretIndicatorCombo(result.scores))}
            </p>
          </div>
          <p style={S.resultSubtitle}>{tx({ ru: "Сегодня попробуй только одно", uk: "Сьогодні спробуй лише одне", en: "Just try one thing today" })}</p>
          {dailyCheckReasonText(result.reason) && (
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: c.inkSoft, fontStyle: "italic", lineHeight: 1.5 }}>
              {tx(dailyCheckReasonText(result.reason))}
            </p>
          )}
          <div style={S.stepsBlock}>
            <p style={{ margin: 0, fontSize: "16px", color: c.ink, lineHeight: 1.6 }}>{tx(result.action.text)}</p>
            <p style={{ margin: "10px 0 0", fontSize: "12px", color: c.inkSoft, fontStyle: "italic" }}>
              {tx({ ru: "Зачем: ", uk: "Навіщо: ", en: "Why: " })}{tx(CHALLENGE_GROUP_DESC[result.group] || {})}
            </p>
          </div>
          <button onClick={() => { setChallengePresetGroup(result.group); setShowChallenge(true); }} style={{ width: "100%", padding: "10px", background: "transparent", border: `1px solid ${c.line}`, borderRadius: "12px", color: c.inkMuted, fontSize: "12px", cursor: "pointer", fontFamily: "'Georgia',serif", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span>🧭</span><span>{tx({ ru: "Пройти челлендж по этому направлению", uk: "Пройти челендж за цим напрямком", en: "Try a challenge for this direction" })}</span>
          </button>
          {result.groupRecentCount >= 3 && (
            <div style={{ ...S.metricBlock, width: "100%", marginTop: "12px", boxSizing: "border-box", border: "1px solid rgba(200,169,126,0.35)" }}>
              <p style={{ margin: "0 0 10px", fontSize: "13px", color: c.inkMuted, lineHeight: 1.5 }}>
                {tx({ ru: `Это направление повторяется у тебя уже ${result.groupRecentCount}-й раз подряд. Может, попробовать структурированный челлендж вместо разовых советов?`, uk: `Цей напрямок повторюється в тебе вже ${result.groupRecentCount}-й раз поспіль. Може, спробувати структурований челендж замість разових порад?`, en: `This direction has come up ${result.groupRecentCount} times in a row now. Want to try a structured challenge instead of one-off advice?` })}
              </p>
              <button onClick={() => { setChallengePresetGroup(result.group); setShowChallenge(true); }} style={{ width: "100%", padding: "12px", background: "rgba(200,169,126,0.08)", border: "1px solid rgba(200,169,126,0.3)", borderRadius: "12px", color: c.accent, fontSize: "13px", cursor: "pointer", fontFamily: "'Georgia',serif" }}>
                🧭 {tx({ ru: "Посмотреть челленджи", uk: "Подивитись челенджі", en: "See challenges" })}
              </button>
            </div>
          )}
          <button onClick={handleDone} style={{ ...S.primaryBtn, marginTop: "18px" }}>
            {tx({ ru: "Я сделал(а)", uk: "Я зробив(ла)", en: "I did it" })}
          </button>
          <p style={{ margin: "14px 0 0", fontSize: "10.5px", color: c.inkSoft, lineHeight: 1.6, fontStyle: "italic" }}>{tx(RESPONSIBILITY_DISCLAIMER)}</p>
          <ShareButton text={shareMsg} />
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  if (step === "followup" && result) {
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={S.resultContainer}>
          <h2 style={S.resultTitle}>{tx({ ru: "Как ты сейчас?", uk: "Як ти зараз?", en: "How are you now?" })}</h2>
          <p style={S.resultSubtitle}>{tx({ ru: "Что изменилось после этого действия?", uk: "Що змінилося після цієї дії?", en: "What changed after doing it?" })}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "8px" }}>
            <button onClick={() => saveFollowUp("better")} style={S.optionBtn}><span style={S.optionText}>{tx({ ru: "Стало лучше", uk: "Стало краще", en: "Better" })}</span></button>
            <button onClick={() => saveFollowUp("same")} style={S.optionBtn}><span style={S.optionText}>{tx({ ru: "Без изменений", uk: "Без змін", en: "No change" })}</span></button>
            <button onClick={() => saveFollowUp("worse")} style={S.optionBtn}><span style={S.optionText}>{tx({ ru: "Стало хуже", uk: "Стало гірше", en: "Worse" })}</span></button>
          </div>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  if (step === "done" && result) {
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ ...S.resultContainer, width: "100%" }}>
          <h2 style={S.resultTitle}>{tx({ ru: "Записал(а). Спасибо, что отметил(а).", uk: "Записав(ла). Дякую, що відмітив(ла).", en: "Saved. Thanks for checking in." })}</h2>
          <p style={{ ...S.resultSubtitle, marginBottom: "18px" }}>
            {tx({ ru: "Хочешь коротко записать, что сейчас на душе?", uk: "Хочеш коротко записати, що зараз на душі?", en: "Want to jot down what's on your mind?" })}
          </p>
          <button onClick={() => setShowNotes(true)} style={{ width: "100%", padding: "14px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>🌙</span><span>{t.notebook}</span><span style={{ color: c.inkSoft, fontSize: "16px" }}>→</span>
          </button>
          <button onClick={onBack} style={{ ...S.primaryBtn, marginTop: "2px" }}>{t.back}</button>
        </div>
      </div>
    );
  }

  // экран вопроса
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <div style={S.quizProgress}><span style={S.quizCategory}>{tx(q.label).toUpperCase()}</span><span style={S.quizCounter}>{current + 1} / {DAILYCHECK_QUESTIONS.length}</span></div>
      <div style={S.progressTrack}>{DAILYCHECK_QUESTIONS.map((_, i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />)}</div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition: "opacity 0.3s" }}>{tx(q.text)}</p>
      <div style={S.optionsList}>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => setSelected(opt.score)} style={{ ...S.optionBtn, borderColor: selected === opt.score ? "#C8A97E" : "#2A2520", backgroundColor: selected === opt.score ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={S.optionRadio}>{selected === opt.score ? "◉" : "○"}</span>
            <span style={S.optionText}>{tx(opt.text)}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selected === null} style={{ ...S.primaryBtn, opacity: selected === null ? 0.3 : 1 }}>{t.next}</button>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ЧЕЛЛЕНДЖИ
// ─────────────────────────────────────────────
function ChallengeScreen({ onBack, presetGroup, hormoneMode, presetHormone }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // {group, hormoneKey, lengthDays, pace, startedAt, days: [...]}
  const [pastChallenges, setPastChallenges] = useState([]);
  const [pickHormone, setPickHormone] = useState(hormoneMode ? (presetHormone || "dopamine") : null);
  const [pickGroup, setPickGroup] = useState(hormoneMode ? (HORMONE_TO_DAILYCHECK_GROUP[presetHormone] || HORMONE_TO_DAILYCHECK_GROUP.dopamine) : (presetGroup || "recovery"));
  const [pickLength, setPickLength] = useState(10);
  const [recommendedLength, setRecommendedLength] = useState(10);
  const [justFinished, setJustFinished] = useState(null); // {group, lengthDays, elapsedDays} после оценки
  const [pendingCompletion, setPendingCompletion] = useState(null); // готов, ждёт оценки
  const [showNotes, setShowNotes] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const pickHormoneAndGroup = (hKey) => {
    setPickHormone(hKey);
    setPickGroup(HORMONE_TO_DAILYCHECK_GROUP[hKey] || "recovery");
  };

  const directionLabel = (group, hKey) => hKey ? tx(HORMONE_META[hKey]?.name || {}) : tx(CHALLENGE_GROUP_META[group] || {});

  useEffect(() => {
    (async () => {
      const [raw, hist, pastRaw] = await Promise.all([CS.get("active_challenge"), getHistory("dailycheck_history"), getHistory("challenge_history")]);
      setPastChallenges(pastRaw.slice().reverse());
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setActive(parsed);
          if (parsed.hormoneKey) setPickHormone(parsed.hormoneKey);
        } catch { setActive(null); }
      }
      if (hormoneMode) {
        const rec = suggestChallengeLength(0);
        setPickLength(rec);
        setRecommendedLength(rec);
      } else {
        const recent = hist.slice(-20);
        const counts = {};
        recent.forEach(h => { if (h.group) counts[h.group] = (counts[h.group] || 0) + 1; });
        const targetGroup = presetGroup || Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "recovery";
        const rec = suggestChallengeLength(counts[targetGroup] || 0);
        setPickGroup(targetGroup);
        setPickLength(rec);
        setRecommendedLength(rec);
      }
      setLoading(false);
    })();
  }, []);

  if (showNotes) return <QuietNotes onBack={() => setShowNotes(false)} />;

  const saveActive = async (obj) => {
    setActive(obj);
    await CS.set("active_challenge", JSON.stringify(obj));
  };

  const startChallenge = async () => {
    const obj = { group: pickGroup, hormoneKey: hormoneMode ? pickHormone : null, lengthDays: pickLength, startedAt: new Date().toISOString(), days: buildChallengeDays(pickGroup, pickLength) };
    statEvent("challenge_start");
    await saveActive(obj);
  };

  const markDay = async () => {
    if (!active) return;
    const notDone = active.days.filter(d => !d.done);
    if (!notDone.length) return;
    const toMark = notDone.slice(0, 1).map(d => d.dayIndex);
    const nowIso = new Date().toISOString();
    const days = active.days.map(d => toMark.includes(d.dayIndex) ? { ...d, done: true, doneAt: nowIso } : d);
    const allDone = days.every(d => d.done);
    if (allDone) {
      const elapsedDays = Math.max(1, Math.round((new Date(nowIso) - new Date(active.startedAt)) / 86400000) + 1);
      setPendingCompletion({ group: active.group, hormoneKey: active.hormoneKey || null, lengthDays: active.lengthDays, startedAt: active.startedAt, completedAt: nowIso, elapsedDays, abandoned: false, days });
      await CS.set("active_challenge", "");
      setActive(null);
    } else {
      await saveActive({ ...active, days });
    }
  };

  const finalizeCompletion = async (rating) => {
    if (!pendingCompletion) return;
    const { days, ...rest } = pendingCompletion;
    await pushHistory("challenge_history", { ...rest, rating });
    setJustFinished(pendingCompletion);
    setPendingCompletion(null);
  };

  const abandonChallenge = async () => {
    if (!active) return;
    const elapsedDays = Math.max(1, Math.round((new Date() - new Date(active.startedAt)) / 86400000) + 1);
    await pushHistory("challenge_history", { group: active.group, hormoneKey: active.hormoneKey || null, lengthDays: active.lengthDays, startedAt: active.startedAt, completedAt: new Date().toISOString(), abandoned: true, elapsedDays, daysCompleted: active.days.filter(d => d.done).length });
    await CS.set("active_challenge", "");
    setActive(null);
  };

  if (loading) {
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <p style={{ color: c.inkSoft, fontStyle: "italic", textAlign: "center" }}>{t.openingNotes}</p>
      </div>
    );
  }

  if (pendingCompletion) {
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ ...S.resultContainer, width: "100%" }}>
          <h2 style={S.resultTitle}>{tx({ ru: "Все дни отмечены 🌱", uk: "Усі дні відмічено 🌱", en: "All days marked 🌱" })}</h2>
          <p style={S.resultSubtitle}>{tx({ ru: "Как прошёл челлендж в целом?", uk: "Як пройшов челендж загалом?", en: "How did the challenge go overall?" })}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "10px" }}>
            {[
              { v: 5, label: { ru: "Реально помогло", uk: "Реально допомогло", en: "Really helped" } },
              { v: 4, label: { ru: "Скорее помогло", uk: "Скоріше допомогло", en: "Mostly helped" } },
              { v: 3, label: { ru: "Средне, не то чтобы заметно", uk: "Середньо, не те щоб помітно", en: "So-so, not very noticeable" } },
              { v: 2, label: { ru: "Скорее не помогло", uk: "Скоріше не допомогло", en: "Didn't really help" } },
              { v: 1, label: { ru: "Не помогло совсем", uk: "Не допомогло зовсім", en: "Didn't help at all" } },
            ].map(opt => (
              <button key={opt.v} onClick={() => finalizeCompletion(opt.v)} style={S.optionBtn}>
                <span style={S.optionText}>{tx(opt.label)}</span>
              </button>
            ))}
          </div>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  if (justFinished) {
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ ...S.resultContainer, width: "100%" }}>
          <h2 style={S.resultTitle}>{tx({ ru: "Челлендж завершён 🌱", uk: "Челендж завершено 🌱", en: "Challenge complete 🌱" })}</h2>
          <p style={S.resultSubtitle}>
            {tx({ ru: `«${directionLabel(justFinished.group, justFinished.hormoneKey)}», план ${justFinished.lengthDays} дней — прошёл(а) за ${justFinished.elapsedDays} ${justFinished.elapsedDays === 1 ? "день" : "дней"}.`, uk: `«${directionLabel(justFinished.group, justFinished.hormoneKey)}», план ${justFinished.lengthDays} днів — пройшов(ла) за ${justFinished.elapsedDays} ${justFinished.elapsedDays === 1 ? "день" : "днів"}.`, en: `"${directionLabel(justFinished.group, justFinished.hormoneKey)}", planned ${justFinished.lengthDays} days — done in ${justFinished.elapsedDays} day(s).` })}
          </p>
          <p style={{ ...S.resultSubtitle, marginTop: "10px" }}>
            {tx({ ru: "Это не значит, что стало привычкой навсегда — но ты дал(а) себе честную серию попыток подряд и увидел(а) настоящие данные о себе.", uk: "Це не означає, що стало звичкою назавжди — але ти дав(ла) собі чесну серію спроб поспіль і побачив(ла) справжні дані про себе.", en: "This doesn't mean it's now a lifelong habit — but you gave yourself an honest run of real attempts and saw real data about yourself." })}
          </p>
          <button onClick={onBack} style={{ ...S.primaryBtn, marginTop: "16px" }}>{t.back}</button>
        </div>
      </div>
    );
  }

  if (active) {
    if (showLog) {
      const doneDays = active.days.filter(d => d.done);
      return (
        <div style={S.screen}>
          <button onClick={() => setShowLog(false)} style={S.backBtn}>{t.back}</button>
          <div style={{ ...S.resultContainer, alignItems: "stretch", width: "100%" }}>
            <h2 style={{ ...S.resultTitle, textAlign: "center" }}>{tx({ ru: "Пройденные дни", uk: "Пройдені дні", en: "Completed days" })}</h2>
            {doneDays.length === 0 ? (
              <p style={{ ...S.resultSubtitle, textAlign: "center" }}>{tx({ ru: "Пока ни одного дня не отмечено.", uk: "Поки жодного дня не відмічено.", en: "No days marked yet." })}</p>
            ) : doneDays.map(d => {
              const ritual = findRitual(active.group, d.ritual_id);
              const dt = new Date(d.doneAt);
              const dateStr = `${String(dt.getDate()).padStart(2,"0")}.${String(dt.getMonth()+1).padStart(2,"0")}`;
              return (
                <div key={d.dayIndex} style={{ ...S.metricBlock, width: "100%", marginTop: "10px", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: c.accent }}>{tx({ ru: `День ${d.dayIndex}`, uk: `День ${d.dayIndex}`, en: `Day ${d.dayIndex}` })}</span>
                    <span style={{ fontSize: "11px", color: c.inkSoft }}>{dateStr}</span>
                  </div>
                  {ritual && <p style={{ margin: 0, fontSize: "13px", color: c.inkMuted }}>{tx(ritual.title)}</p>}
                  {d.tier && <p style={{ margin: "3px 0 0", fontSize: "10px", letterSpacing: "0.06em", color: c.inkSoft }}>{tx(CHALLENGE_TIER_META[d.tier] || {})}</p>}
                </div>
              );
            })}
            <button onClick={() => setShowLog(false)} style={S.backBtnBottom}>{t.back}</button>
          </div>
        </div>
      );
    }

    const doneCount = active.days.filter(d => d.done).length;
    const notDone = active.days.filter(d => !d.done);
    const currentBatch = notDone.slice(0, 1);
    const pct = Math.round((doneCount / active.lengthDays) * 100);
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ ...S.resultContainer, alignItems: "stretch", width: "100%" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft, textAlign: "center", marginBottom: "8px" }}>
            {directionLabel(active.group, active.hormoneKey)}
          </p>
          <h2 style={{ ...S.resultTitle, textAlign: "center" }}>
            {tx({ ru: `День ${currentBatch[0] ? currentBatch[0].dayIndex : active.lengthDays} из ${active.lengthDays}`, uk: `День ${currentBatch[0] ? currentBatch[0].dayIndex : active.lengthDays} з ${active.lengthDays}`, en: `Day ${currentBatch[0] ? currentBatch[0].dayIndex : active.lengthDays} of ${active.lengthDays}` })}
          </h2>
          <div style={{ ...S.metricTrack, background: "rgba(128,110,90,0.28)", border: `1px solid ${c.line}`, boxSizing: "border-box", marginTop: "8px" }}>
            <div style={{ ...S.metricFill, width: `${pct}%`, background: "linear-gradient(90deg, #241D14, #C8A97E)" }}>
              <span style={{ ...S.metricFillDot, background: "#C8A97E" }} />
            </div>
          </div>
          {currentBatch.map(day => {
            const ritual = findRitual(active.group, day.ritual_id);
            if (!ritual) return null;
            return (
              <div key={day.dayIndex} style={{ marginTop: "16px" }}>
                {day.tierStarts && (
                  <p style={{ fontSize: "12px", color: c.accent, fontStyle: "italic", marginBottom: "8px" }}>
                    {day.tier === "medium"
                      ? tx({ ru: "Новый уровень: эти практики требуют чуть больше времени и внимания к причине, а не только к симптому.", uk: "Новий рівень: ці практики потребують трохи більше часу й уваги до причини, а не лише до симптому.", en: "New level: these practices ask for a bit more time and attention to the cause, not just the symptom." })
                      : day.tier === "advanced"
                      ? tx({ ru: "Продвинутый уровень: ты прошёл(а) базу — эти практики длиннее и требуют больше самостоятельности.", uk: "Просунутий рівень: ти пройшов(ла) базу — ці практики довші і потребують більше самостійності.", en: "Advanced level: you've covered the basics — these practices are longer and more self-directed." })
                      : tx({ ru: "Базовый уровень: короткие, простые шаги на вход в тему.", uk: "Базовий рівень: короткі, прості кроки на вхід у тему.", en: "Foundation level: short, simple steps to ease in." })}
                  </p>
                )}
                <p style={{ fontSize: "10px", letterSpacing: "0.08em", color: c.inkSoft, marginBottom: "4px" }}>{tx(CHALLENGE_TIER_META[day.tier] || {})}</p>
                <div style={{ ...S.metricBlock, width: "100%", boxSizing: "border-box" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "15px", color: c.accent, fontWeight: 600 }}>{tx(ritual.title)}</p>
                  {ritual.steps.map((s, si) => (
                    <div key={si} style={{ display: "flex", gap: "8px", marginBottom: si < ritual.steps.length - 1 ? "8px" : "0" }}>
                      <span style={{ fontSize: "13px", color: c.inkSoft, flexShrink: 0 }}>{si + 1}.</span>
                      <p style={{ margin: 0, fontSize: "14px", color: c.ink, lineHeight: 1.5 }}>{tx(s)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <button onClick={markDay} style={{ ...S.primaryBtn, marginTop: "18px" }}>
            {tx({ ru: "Отметил(а) день", uk: "Відмітив(ла) день", en: "Mark day done" })}
          </button>
          <button onClick={() => setShowLog(true)} style={{ width: "100%", padding: "12px", background: "transparent", border: `1px solid ${c.line}`, borderRadius: "12px", color: c.inkMuted, fontSize: "13px", cursor: "pointer", fontFamily: "'Georgia',serif", marginTop: "10px" }}>
            {tx({ ru: `Пройденные дни (${doneCount})`, uk: `Пройдені дні (${doneCount})`, en: `Completed days (${doneCount})` })}
          </button>
          <button onClick={() => setShowNotes(true)} style={{ width: "100%", padding: "12px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "13px", cursor: "pointer", fontFamily: "'Georgia',serif", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>🌙</span><span>{t.notebook}</span>
          </button>
          <button onClick={abandonChallenge} style={{ width: "100%", padding: "14px", background: "transparent", border: `1px solid ${c.line}`, borderRadius: "12px", color: c.inkSoft, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", marginTop: "14px" }}>
            {tx({ ru: "Остановить челлендж", uk: "Зупинити челендж", en: "Stop challenge" })}
          </button>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  // экран выбора
  const groupKeys = Object.keys(CHALLENGE_GROUP_META);
  const hormoneKeysList = Object.keys(HORMONE_META);
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <div style={{ ...S.resultContainer, alignItems: "stretch", width: "100%" }}>
        <h2 style={{ ...S.resultTitle, textAlign: "center" }}>{hormoneMode ? tx({ ru: "Челлендж — Гормональный код", uk: "Челендж — Гормональний код", en: "Challenge — Hormonal code" }) : tx({ ru: "Челленджи", uk: "Челенджі", en: "Challenges" })}</h2>
        <p style={{ ...S.resultSubtitle, textAlign: "center" }}>
          {tx({ ru: "Не 3 действия по кругу, а полноценный путь на 10, 20 или 30 дней: с каждым новым уровнем практики становятся чуть глубже.", uk: "Не 3 дії по колу, а повноцінний шлях на 10, 20 або 30 днів: з кожним новим рівнем практики стають трохи глибшими.", en: "Not 3 actions on repeat — a full 10/20/30-day path where each new level goes a bit deeper." })}
        </p>

        <p style={{ fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft, marginTop: "20px", marginBottom: "10px" }}>
          {hormoneMode ? tx({ ru: "СЛАБОЕ ЗВЕНО", uk: "СЛАБКА ЛАНКА", en: "WEAK LINK" }) : tx({ ru: "НАПРАВЛЕНИЕ", uk: "НАПРЯМОК", en: "DIRECTION" })}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "10px", width: "100%", boxSizing: "border-box" }}>
          {hormoneMode ? hormoneKeysList.map(h => (
            <button key={h} onClick={() => pickHormoneAndGroup(h)} style={{ width: "100%", boxSizing: "border-box", padding: "10px 4px", borderRadius: "14px", border: `1px solid ${h === pickHormone ? (HORMONE_META[h].color) : c.line}`, background: h === pickHormone ? `${HORMONE_META[h].color}20` : "transparent", color: h === pickHormone ? HORMONE_META[h].color : c.inkMuted, fontSize: "12px", cursor: "pointer", fontFamily: "'Georgia',serif", textAlign: "center", lineHeight: 1.3 }}>
              {tx(HORMONE_META[h].name)}
            </button>
          )) : groupKeys.map(g => (
            <button key={g} onClick={() => setPickGroup(g)} style={{ width: "100%", boxSizing: "border-box", padding: "10px 4px", borderRadius: "14px", border: `1px solid ${g === pickGroup ? "#C8A97E" : c.line}`, background: g === pickGroup ? "rgba(200,169,126,0.12)" : "transparent", color: g === pickGroup ? c.accent : c.inkMuted, fontSize: "12px", cursor: "pointer", fontFamily: "'Georgia',serif", textAlign: "center", lineHeight: 1.3 }}>
              {tx(CHALLENGE_GROUP_META[g])}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: c.inkMuted, fontStyle: "italic", marginBottom: "20px" }}>
          {hormoneMode ? tx(HORMONE_INFO[pickHormone]?.role || {}) : tx(CHALLENGE_GROUP_DESC[pickGroup] || {})}
        </p>

        <p style={{ fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft, marginBottom: "10px" }}>
          {tx({ ru: "ДЛИТЕЛЬНОСТЬ", uk: "ТРИВАЛІСТЬ", en: "LENGTH" })}
        </p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
          {[10, 20, 30].map(len => (
            <button key={len} onClick={() => setPickLength(len)} style={{ flex: 1, padding: "12px 6px", borderRadius: "12px", border: `1px solid ${len === pickLength ? "#C8A97E" : c.line}`, background: len === pickLength ? "rgba(200,169,126,0.12)" : "transparent", color: len === pickLength ? c.accent : c.inkMuted, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif" }}>
              <div>{len} {tx({ ru: "дней", uk: "днів", en: "days" })}</div>
              <div style={{ fontSize: "10px", marginTop: "2px", color: len === pickLength ? c.accent : c.inkSoft }}>
                {tx(CHALLENGE_TIER_META[len === 10 ? "easy" : len === 20 ? "medium" : "advanced"])}
              </div>
              {len === recommendedLength && (
                <div style={{ fontSize: "9px", letterSpacing: "0.08em", marginTop: "3px", color: c.accent }}>
                  {tx({ ru: "РЕКОМЕНДОВАНО", uk: "РЕКОМЕНДОВАНО", en: "RECOMMENDED" })}
                </div>
              )}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: c.inkSoft, fontStyle: "italic", marginBottom: "20px" }}>
          {tx({ ru: "Это один путь: 10 дней — только база, 20 — база + следующий уровень, 30 — полный путь до продвинутых практик. Рекомендация подобрана по тому, как часто это направление повторялось в твоих последних отметках.", uk: "Це один шлях: 10 днів — лише база, 20 — база + наступний рівень, 30 — повний шлях до просунутих практик. Рекомендація підібрана за тим, як часто цей напрямок повторювався в твоїх останніх відмітках.", en: "It's one path: 10 days is just the foundation, 20 adds the next level, 30 is the full path to advanced practice. The suggested length is based on how often this direction has come up in your recent check-ins." })}
        </p>

        <button onClick={startChallenge} style={S.primaryBtn}>
          {tx({ ru: "Начать челлендж", uk: "Почати челендж", en: "Start challenge" })}
        </button>

        {pastChallenges.length > 0 && (
          <div style={{ ...S.metricBlock, width: "100%", marginTop: "24px", boxSizing: "border-box" }}>
            <p style={{ margin: "0 0 12px", fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft }}>
              {tx({ ru: "ПРОШЛЫЕ ЧЕЛЛЕНДЖИ", uk: "МИНУЛІ ЧЕЛЕНДЖІ", en: "PAST CHALLENGES" })}
            </p>
            {pastChallenges.map((ch, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: i > 0 ? `1px solid ${c.line}` : "none" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", color: c.inkMuted }}>{directionLabel(ch.group, ch.hormoneKey)} · {ch.lengthDays} {tx({ ru: "дней", uk: "днів", en: "d" })}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: c.inkSoft }}>
                    {ch.abandoned
                      ? tx({ ru: `остановлен, ${ch.daysCompleted || 0} из ${ch.lengthDays}`, uk: `зупинено, ${ch.daysCompleted || 0} з ${ch.lengthDays}`, en: `stopped, ${ch.daysCompleted || 0} of ${ch.lengthDays}` })
                      : tx({ ru: `завершён за ${ch.elapsedDays || "?"} дн.`, uk: `завершено за ${ch.elapsedDays || "?"} дн.`, en: `finished in ${ch.elapsedDays || "?"} d.` })}
                  </p>
                </div>
                {typeof ch.rating === "number" && (
                  <span style={{ fontSize: "13px", color: c.accent }}>{"★".repeat(ch.rating)}{"☆".repeat(5 - ch.rating)}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// ЭКРАН: СОВЕТ ДНЯ
// ─────────────────────────────────────────────
function WisdomScreen({ onBack, currentMood }) {
  const { lang, t, tx } = useLang();
  const [wisdoms, setWisdoms] = useState([]);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const todayKey = getTodayKey();
      const raw = await CS.get("wisdom_" + todayKey);
      let todayWisdoms = raw ? JSON.parse(raw) : null;
      if (!todayWisdoms) {
        const pool = currentMood && currentMood !== "general"
          ? WISDOMS.filter(w => w.mood === currentMood || w.mood === "general")
          : WISDOMS;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        todayWisdoms = shuffled.slice(0, 3).map(w => w.text);
        await CS.set("wisdom_" + todayKey, JSON.stringify(todayWisdoms));
      }
      setWisdoms(todayWisdoms);
      setLoaded(true);
    }
    load();
  }, [currentMood]);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(); midnight.setHours(24, 0, 0, 0);
    setSecondsLeft(Math.floor((midnight - now) / 1000));
    const t = setInterval(() => setSecondsLeft(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, "0");
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const sc = secondsLeft % 60;

  if (!loaded) return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ color:"#7A6E62", fontStyle:"italic" }}>{t.brewing}</p>
      </div>
    </div>
  );

  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "3 совета в день, подобранных под твое состояние. Обновляются в полночь.", uk: "3 поради на день, підібрані під твій стан. Оновлюються опівночі.", en: "3 tips a day, picked for your state. Refresh at midnight." })} />
      </div>
      <div style={S.wisdomContainer}>
        <div style={S.teaIcon}>🍵</div>
        <div style={{ display:"flex", gap:"6px", marginBottom:"20px" }}>
          {wisdoms.map((_,i) => (
            <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor: i === index ? "#C8A97E" : i < index ? "#6B5A48" : "#2A2520", transition:"background-color 0.3s" }} />
          ))}
        </div>
        <p style={{ ...S.wisdomText, opacity: fading ? 0 : 1, transition:"opacity 0.4s ease" }}>{tx(wisdoms[index])}</p>
        <div style={S.wisdomLine} />
        <p style={S.wisdomHint}>@TeaBroLife</p>
        <p style={{ fontSize:"12px", color:"#4A4036", marginTop:"16px" }}>Новые советы через {pad(h)}:{pad(m)}:{pad(sc)}</p>
      </div>
      <ShareButton text={`«${tx(wisdoms[index])}»\n\nTea Bro 🌱`} />
      {index + 1 < wisdoms.length && (
        <button onClick={() => { setFading(true); setTimeout(() => { setIndex(i => i+1); setFading(false); }, 400); }} style={S.primaryBtn}>{t.nextAdvice}</button>
      )}
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ОПРОСНИК
// ─────────────────────────────────────────────
function QuizScreen({ onBack, onGoCompass }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState([]);
  const [burnouts, setBurnouts] = useState([]);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  useEffect(() => { statEvent("quiz"); }, []);
  const q = QUESTIONS_QUIZ[current];
  const total = scores.reduce((a,b) => a+b, 0);
  const burnoutTotal = burnouts.reduce((a,b) => a+b, 0);
  const burnoutMax = 75;
  const burnoutPct = Math.round((burnoutTotal / burnoutMax) * 100);
  const result = finished ? QUIZ_RESULTS.find(r => total >= r.range[0] && total <= r.range[1]) : null;
  if (showNotes) return <QuietNotes onBack={() => setShowNotes(false)} />;

  const handleNext = () => {
    if (selected === null || animating) return;
    setAnimating(true);
    const ns = [...scores, selected.score];
    const nb = [...burnouts, selected.burnout];
    setTimeout(() => {
      setScores(ns); setBurnouts(nb); setSelected(null);
      if (current+1 >= QUESTIONS_QUIZ.length) {
        setFinished(true);
        const t = ns.reduce((a,b)=>a+b,0);
        const bt = nb.reduce((a,b)=>a+b,0);
        const maxScore = QUESTIONS_QUIZ.length * 3;
        pushHistory("quiz_history", {
          score: Math.round((t/maxScore)*100),
          burnout: Math.round((bt/75)*100),
        });
      } else { setCurrent(c => c+1); }
      setAnimating(false);
    }, 300);
  };

  if (finished && result) {
    const maxScore = QUESTIONS_QUIZ.length * 3;
    const pct = Math.round((total/maxScore)*100);
    const burnoutLevel = BURNOUT_LEVELS.find(b => burnoutTotal >= b.range[0] && burnoutTotal <= b.range[1]) || BURNOUT_LEVELS[0];
    const adviceKey = burnoutPct <= 26 ? "none" : burnoutPct <= 53 ? "mild" : burnoutPct <= 73 ? "medium" : "deep";
    const advice = BURNOUT_ADVICE[adviceKey];
    const quizScaleLabels = ["ДАЛЕКО", "НА ПОЛПУТИ", "ПОЧТИ", "ЗДЕСЬ"];
    const quizHiIndex = pct <= 25 ? 0 : pct <= 50 ? 1 : pct <= 75 ? 2 : 3;
    const shareMsg = `${result.emoji} ${tx(result.title)}\n«${tx(result.subtitle)}»\n\nВыгорание: ${tx(burnoutLevel.label)}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={S.resultContainer}>

          <div style={S.sectionHead}>
            <p style={S.sectionTitle}>{t.assemblyPoint}</p>
            <InfoButton text={tx({ ru: "«Насколько ты близко к себе настоящему. К внутреннему равновесию, где тихо и ясно.»", uk: "«Наскільки ти близько до себе справжнього. До внутрішньої рівноваги, де тихо і ясно.»", en: "«How close you are to your real self. To inner balance, where it is quiet and clear.»" })} />
          </div>
          <MetricBlock
            value={pct}
            rightName={tx(result.title)}
            rightSub={tx(result.subtitle)}
            fillFrom="#4A3020"
            fillTo="#C8A97E"
            scaleLabels={quizScaleLabels}
            hiIndex={quizHiIndex}
            quote={`«${tx(result.text)}»`}
          />

          <div style={S.sectionHead}>
            <p style={S.sectionTitle}>{t.burnoutLevel}</p>
            <InfoButton text={tx({ ru: "«Сколько внутреннего ресурса осталось. Считается по твоим ответам — чем ниже, тем лучше.»", uk: "«Скільки внутрішнього ресурсу залишилось. Рахується за твоїми відповідями — чим нижче, тим краще.»", en: "«How much inner resource is left. Based on your answers — the lower, the better.»" })} />
          </div>
          <BurnoutThermo
            value={burnoutPct}
            rightName={tx(burnoutLevel.label)}
            rightSub={t.byResults}
            quote={`«${tx(burnoutLevel.text)}»`}
          />

          {/* Блок советов — всегда открыт */}
          <div style={S.stepsBlock}>
            <p style={S.stepsTitle}>{t.doNow}</p>
            {advice.steps.map((step, i) => (
              <div key={i} style={{ display:"flex", gap:"10px", marginBottom: i < advice.steps.length-1 ? "12px" : "0" }}>
                <span style={{ fontSize:"11px", color:c.accent, flexShrink:0, marginTop:"2px", minWidth:"16px" }}>{i+1}.</span>
                <p style={{ margin:0, fontSize:"13px", color:c.inkMuted, lineHeight:1.7 }}>{tx(step)}</p>
              </div>
            ))}
            <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:`1px solid ${c.line}` }}>
              <p style={{ margin:0, fontSize:"11px", color:c.inkSoft }}>⏱ {tx(advice.duration)}</p>
            </div>
          </div>

          {onGoCompass && (
            <button onClick={onGoCompass} style={{ width: "100%", padding: "14px", background: "rgba(200,169,126,0.04)", border: "1px solid rgba(200,169,126,0.2)", borderRadius: "12px", color: c.accent, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span>🧭</span><span>{tx({ ru: "Узнать своё состояние подробнее в Компасе состояния", uk: "Дізнатись свій стан детальніше в Компасі стану", en: "Learn more about your state in the State compass" })}</span>
            </button>
          )}
          <button onClick={() => setShowNotes(true)} style={{ width: "100%", padding: "14px", background: "transparent", border: `1px solid ${c.line}`, borderRadius: "12px", color: c.inkMuted, fontSize: "14px", cursor: "pointer", fontFamily: "'Georgia',serif", letterSpacing: "0.05em", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>🌙</span><span>{t.notebook}</span><span style={{ color: c.inkSoft, fontSize: "16px" }}>→</span>
          </button>
          <p style={{ margin: "14px 0 0", fontSize: "10.5px", color: c.inkSoft, lineHeight: 1.6, fontStyle: "italic" }}>{tx(RESPONSIBILITY_DISCLAIMER)}</p>

          <ShareButton text={shareMsg} />
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center", marginTop:"18px" }}>{t.goChannel}</a>
          <button onClick={() => { setCurrent(0); setSelected(null); setScores([]); setBurnouts([]); setFinished(false); setShowAdvice(false); }} style={S.ghostBtn}>{t.again}</button>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }
  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "25 вопросов — насколько ты далеко от себя и есть ли выгорание.", uk: "25 питань — наскільки ти далеко від себе і чи є вигорання.", en: "25 questions — how far you are from yourself and whether there's burnout." })} />
      </div>
      <div style={S.quizProgress}><span style={S.quizCategory}>{tx(q.category)}</span><span style={S.quizCounter}>{current+1} / {QUESTIONS_QUIZ.length}</span></div>
      <div style={S.progressTrack}>{QUESTIONS_QUIZ.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />)}</div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>{tx(q.text)}</p>
      <div style={S.optionsList}>
        {q.options.map((opt,i) => (
          <button key={i} onClick={() => setSelected(opt)} style={{ ...S.optionBtn, borderColor: selected===opt ? "#C8A97E" : "#2A2520", backgroundColor: selected===opt ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={S.optionRadio}>{selected===opt ? "◉" : "○"}</span>
            <span style={S.optionText}>{tx(opt.text)}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selected===null} style={{ ...S.primaryBtn, opacity: selected===null ? 0.3 : 1 }}>{current+1===QUESTIONS_QUIZ.length ? t.resultBtn : t.next}</button>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: НАСКОЛЬКО ТЫ ЧЕСТЕН САМ С СОБОЙ
// ─────────────────────────────────────────────
const SH_SCALE = [
  { v: 1, label: { ru: "Совсем не про меня", uk: "Зовсім не про мене", en: "Not me at all" } },
  { v: 2, label: { ru: "Скорее не про меня", uk: "Скоріше не про мене", en: "Mostly not me" } },
  { v: 3, label: { ru: "И да, и нет", uk: "І так, і ні", en: "Both yes and no" } },
  { v: 4, label: { ru: "Скорее про меня", uk: "Скоріше про мене", en: "Mostly me" } },
  { v: 5, label: { ru: "Это точно про меня", uk: "Це точно про мене", en: "Definitely me" } },
];


function SelfHonestyScreen({ onBack }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  useEffect(() => { statEvent("selfhonesty"); }, []);
  const q = SELF_HONESTY_QUESTIONS[current];

  const rawTotal = answers.reduce((a,b) => a+b, 0);
  const minTotal = SELF_HONESTY_QUESTIONS.length * 1;
  const maxTotal = SELF_HONESTY_QUESTIONS.length * 5;
  const pct = Math.round(((rawTotal - minTotal) / (maxTotal - minTotal)) * 100);
  const result = finished ? (SELF_HONESTY_RESULTS.find(r => pct >= r.range[0] && pct <= r.range[1]) || SELF_HONESTY_RESULTS[0]) : null;

  const handleNext = () => {
    if (selected === null || animating) return;
    setAnimating(true);
    const scored = q.reverse ? (6 - selected) : selected;
    const na = [...answers, scored];
    setTimeout(() => {
      setAnswers(na); setSelected(null);
      if (current+1 >= SELF_HONESTY_QUESTIONS.length) {
        setFinished(true);
        const t = na.reduce((a,b)=>a+b,0);
        const finalScore = Math.round(((t - minTotal) / (maxTotal - minTotal)) * 100);
        pushHistory("selfhonesty_history", { score: finalScore });
        // Обезличенная отправка итогового балла — только число 0-100, без uid.
        // Нужно для будущей калибровки границ результатов по реальному распределению ответов.
        statEvent("selfhonesty_result", undefined, { score: finalScore });
      } else { setCurrent(c => c+1); }
      setAnimating(false);
    }, 300);
  };

  if (finished && result) {
    const scaleLabels = ["ЧЕСТНО", "ЕСТЬ ПЯТНА", "ПРИУКРАШЕНО", "СИЛЬНО"];
    const hiIndex = pct <= 25 ? 0 : pct <= 50 ? 1 : pct <= 75 ? 2 : 3;
    const adviceKey = pct <= 25 ? "low" : pct <= 50 ? "mild" : pct <= 75 ? "medium" : "high";
    const advice = SELF_HONESTY_ADVICE[adviceKey];
    const shareMsg = `${result.emoji} ${tx(result.title)}\n«${tx(result.subtitle)}»\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={S.resultContainer}>
          <div style={S.sectionHead}>
            <p style={S.sectionTitle}>{t.selfDeception}</p>
            <InfoButton text={tx({ ru: "«Насколько ты склонен(на) видеть себя лучше, чем есть на самом деле — неосознанно, не ради других, а для себя.»", uk: "«Наскільки ти схильний(а) бачити себе краще, ніж є насправді — несвідомо, не заради інших, а для себе.»", en: "«How inclined you are to see yourself better than you are — unconsciously, not for others, but for yourself.»" })} />
          </div>
          <MetricBlock
            value={pct}
            rightName={tx(result.title)}
            rightSub={tx(result.subtitle)}
            fillFrom="#4A3020"
            fillTo="#C8A97E"
            scaleLabels={scaleLabels}
            hiIndex={hiIndex}
            quote={`«${tx(result.text)}»`}
          />

          {/* Блок советов — всегда открыт */}
          <div style={S.stepsBlock}>
            <p style={S.stepsTitle}>{t.doNow}</p>
            {advice.steps.map((step, i) => (
              <div key={i} style={{ display:"flex", gap:"10px", marginBottom: i < advice.steps.length-1 ? "12px" : "0" }}>
                <span style={{ fontSize:"11px", color:c.accent, flexShrink:0, marginTop:"2px", minWidth:"16px" }}>{i+1}.</span>
                <p style={{ margin:0, fontSize:"13px", color:c.inkMuted, lineHeight:1.7 }}>{tx(step)}</p>
              </div>
            ))}
            <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:`1px solid ${c.line}` }}>
              <p style={{ margin:0, fontSize:"11px", color:c.inkSoft }}>⏱ {tx(advice.duration)}</p>
            </div>
          </div>

          <ShareButton text={shareMsg} />
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center", marginTop:"18px" }}>{t.goChannel}</a>
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false); }} style={S.ghostBtn}>{t.again}</button>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "14 утверждений — насколько ты видишь себя таким, какой ты есть, а не удобной версией.", uk: "14 тверджень — наскільки ти бачиш себе таким, який ти є, а не зручною версією.", en: "14 statements — how much you see yourself as you really are, not a convenient version." })} />
      </div>
      <div style={S.quizProgress}><span style={S.quizCategory}>{tx(q.category)}</span><span style={S.quizCounter}>{current+1} / {SELF_HONESTY_QUESTIONS.length}</span></div>
      <div style={S.progressTrack}>{SELF_HONESTY_QUESTIONS.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />)}</div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>{tx(q.text)}</p>
      <div style={S.optionsList}>
        {SH_SCALE.map((opt,i) => (
          <button key={i} onClick={() => setSelected(opt.v)} style={{ ...S.optionBtn, borderColor: selected===opt.v ? "#C8A97E" : "#2A2520", backgroundColor: selected===opt.v ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={S.optionRadio}>{selected===opt.v ? "◉" : "○"}</span>
            <span style={S.optionText}>{tx(opt.label)}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selected===null} style={{ ...S.primaryBtn, opacity: selected===null ? 0.3 : 1 }}>{current+1===SELF_HONESTY_QUESTIONS.length ? t.resultBtn : t.next}</button>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ТЕСТ МЕДИТАЦИЙ
// ─────────────────────────────────────────────
function MeditationQuizScreen({ onBack, onGoGuidance }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({ shamatha:0, vipassana:0, metta:0, tummo:0, nidra:0, tonglen:0, b478:0, box:0, coherent:0 });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const [sortedScores, setSortedScores] = useState(null);
  const [animating, setAnimating] = useState(false);
  useEffect(() => { statEvent("meditation"); }, []);
  const q = MEDITATION_QUESTIONS[current];

  const handleNext = () => {
    if (selectedIdx === null || animating) return;
    setAnimating(true);
    const ns = { ...scores };
    const pts = q.options[selectedIdx].p;
    Object.keys(pts).forEach(k => { ns[k] = (ns[k] || 0) + pts[k]; });
    setTimeout(() => {
      setScores(ns);
      setSelectedIdx(null);
      if (current + 1 >= MEDITATION_QUESTIONS.length) {
        const sorted = Object.entries(ns).sort((a,b) => b[1]-a[1]);
        const w = sorted[0][0];
        setWinner(w);
        setSortedScores(sorted);
        setFinished(true);
        const maxPossible = MEDITATION_QUESTIONS.length * 2;
        pushHistory("meditation_history", { winner: w, pct: Math.min(100, Math.round((sorted[0][1]/maxPossible)*100)) });
      } else {
        setCurrent(c => c+1);
      }
      setAnimating(false);
    }, 300);
  };

  if (finished && winner) {
    const r = MEDITATION_RESULTS[winner];
    const maxPossible = MEDITATION_QUESTIONS.length * 2;
    const pct = Math.min(100, Math.round((sortedScores[0][1]/maxPossible)*100));
    const medScaleLabels = ["СЛАБО", "ПОДХОДИТ", "ТОЧНО", "ИДЕАЛЬНО"];
    const medHiIndex = pct <= 25 ? 0 : pct <= 50 ? 1 : pct <= 75 ? 2 : 3;
    const others = sortedScores.slice(1, 4).filter(([,s]) => s > 0).map(([key], i) => ({
      emoji: MEDITATION_RESULTS[key].emoji,
      name: tx(MEDITATION_RESULTS[key].name),
      pct: `${i+2}-е место`,
    }));
    const shareMsg = `Моя практика — ${tx(r.name)} · ${tx(r.tag)}\n\n«${tx(r.why).slice(0,90)}...»\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={S.resultContainer}>
          <MetricBlock
            value={pct}
            rightName={`${r.emoji} ${tx(r.fullName)}`}
            rightSub={`${tx(r.tag)} · ${tx(r.tradition)}`}
            fillFrom="#1A2A30"
            fillTo="#7B9EB0"
            dotColor="#7B9EB0"
            numColor="#7B9EB0"
            borderColor="rgba(123,158,176,0.25)"
            scaleLabels={medScaleLabels}
            hiIndex={medHiIndex}
            quote={tx(r.why)}
            others={others}
          />
          <div style={{ ...S.stepsBlock, borderColor:"rgba(123,158,176,0.12)" }}>
            <p style={{ ...S.stepsTitle, color:"#4A6A78" }}>{t.howPractice}</p>
            {r.steps.map((step, i) => (
              <div key={i} style={{ display:"flex", gap:"10px", marginBottom: i < r.steps.length-1 ? "12px" : "0" }}>
                <span style={{ fontSize:"11px", color:"#7B9EB0", flexShrink:0, marginTop:"2px", minWidth:"16px" }}>{i+1}.</span>
                <p style={{ margin:0, fontSize:"13px", color:c.inkMuted, lineHeight:1.7, whiteSpace:"pre-line" }}>{tx(step)}</p>
              </div>
            ))}
            <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:`1px solid ${c.line}` }}>
              <p style={{ margin:"0 0 4px", fontSize:"11px", color:c.inkSoft }}>⏱ {tx(r.duration)}</p>
              <p style={{ margin:0, fontSize:"11px", color:c.inkSoft, fontStyle:"italic" }}>🔍 {r.source}</p>
            </div>
          </div>

          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tx(r.fullName) + " медитация")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...S.shareBtn, display:"block", textAlign:"center", textDecoration:"none", borderColor:"rgba(123,158,176,0.3)", color:"#7B9EB0", marginTop:"18px" }}
          >{t.findYoutube}</a>
          <ShareButton text={shareMsg} />
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center" }}>{t.goChannel}</a>
          {onGoGuidance && <button onClick={onGoGuidance} style={S.ghostBtn}>🧘 {tx({ ru: "Наставления по медитации", uk: "Настанови з медитації", en: "Meditation guidance" })}</button>}
          <button onClick={() => { setCurrent(0); setSelectedIdx(null); setScores({ shamatha:0, vipassana:0, metta:0, tummo:0, nidra:0, tonglen:0, b478:0, box:0, coherent:0 }); setFinished(false); setWinner(null); setSortedScores(null); }} style={S.ghostBtn}>{t.again}</button>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "20 вопросов — подберём медитацию или дыхательную практику под твоё состояние.", uk: "20 питань — підберемо медитацію або дихальну практику під твій стан.", en: "20 questions — we'll pick a meditation or breathing practice for your state." })} />
      </div>
      <div style={S.quizProgress}>
        <span style={S.quizCategory}>{tx(q.category)}</span>
        <span style={S.quizCounter}>{current+1} / {MEDITATION_QUESTIONS.length}</span>
      </div>
      <div style={S.progressTrack}>
        {MEDITATION_QUESTIONS.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#8B9EB0" : i === current ? "#B0C8D8" : "#2A2520" }} />)}
      </div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>{tx(q.text)}</p>
      <div style={S.optionsList}>
        {q.options.map((opt,i) => (
          <button key={i} onClick={() => setSelectedIdx(i)} style={{ ...S.optionBtn, borderColor: selectedIdx===i ? "#8B9EB0" : "#2A2520", backgroundColor: selectedIdx===i ? "rgba(139,158,176,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={{ ...S.optionRadio, color:"#8B9EB0" }}>{selectedIdx===i ? "◉" : "○"}</span>
            <span style={S.optionText}>{tx(opt.text)}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selectedIdx===null} style={{ ...S.primaryBtn, opacity: selectedIdx===null ? 0.3 : 1, backgroundColor:"#8B9EB0" }}>
        {current+1===MEDITATION_QUESTIONS.length ? "Узнать практику" : t.next}
      </button>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ТЕСТ ЧАЯ
// ─────────────────────────────────────────────
function TeaQuizScreen({ onBack, onTeaResult }) {
  const { lang, t, tx } = useLang();
  const [current, setCurrent] = useState(0);
  const [teaScores, setTeaScores] = useState({ shu:0, sheng:0, bai:0, dahong:0, tguan:0, gaba:0 });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const [sortedScores, setSortedScores] = useState(null);
  const [animating, setAnimating] = useState(false);
  useEffect(() => { statEvent("tea"); }, []);
  const q = TEA_QUESTIONS[current];
  const handleNext = () => {
    if (selectedIdx === null || animating) return;
    setAnimating(true);
    const ns = { ...teaScores };
    Object.keys(q.options[selectedIdx].teas).forEach(k => { ns[k] += q.options[selectedIdx].teas[k]; });
    setTimeout(() => {
      setTeaScores(ns);
      setSelectedIdx(null);
      if (current+1 >= TEA_QUESTIONS.length) {
        const sorted = Object.entries(ns).sort((a,b) => b[1]-a[1]);
        const w = sorted[0][0];
        setWinner(w); setSortedScores(sorted); setFinished(true); onTeaResult(w);
        const maxPossible = TEA_QUESTIONS.length * 2;
        pushHistory("tea_history", { winner: w, pct: Math.round((sorted[0][1]/maxPossible)*100) });
      } else { setCurrent(c => c+1); }
      setAnimating(false);
    }, 300);
  };
  if (finished && winner) {
    const result = TEA_RESULTS[winner];
    const maxPossible = TEA_QUESTIONS.length * 2;
    const pct = Math.min(100, Math.round((sortedScores[0][1]/maxPossible)*100));
    const teaScaleLabels = ["СЛАБО", "УМЕРЕННО", "СИЛЬНО", "ТОЧНО"];
    const teaHiIndex = pct <= 25 ? 0 : pct <= 50 ? 1 : pct <= 75 ? 2 : 3;
    const others = sortedScores.slice(1, 4).filter(([,s]) => s > 0).map(([key], i) => ({
      emoji: "✦",
      name: tx(TEA_RESULTS[key].name),
      pct: `${i+2}-е место`,
    }));
    const shareMsg = `Мой чай сегодня — ${tx(result.name)} ✦\n${tx(result.tag)}\n\n«${tx(result.text).slice(0,80)}...»\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={S.resultContainer}>
          <MetricBlock
            value={pct}
            rightName={`✦ ${tx(result.name)}`}
            rightSub={tx(result.tag)}
            fillFrom="#3A2E20"
            fillTo="#A89880"
            scaleLabels={teaScaleLabels}
            hiIndex={teaHiIndex}
            quote={tx(result.text)}
            others={others}
          />
          <div style={S.stepsBlock}>
            <p style={S.stepsTitle}>{t.howBrew}</p>
            <p style={{ margin:0, fontSize:"13px", color:"#C8A97E", fontStyle:"italic", lineHeight:1.7 }}>🍵 {tx(result.note)}</p>
          </div>
          <ShareButton text={shareMsg} />
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center", marginTop:"6px" }}>{t.goChannel}</a>
          <button onClick={() => { setCurrent(0); setSelectedIdx(null); setTeaScores({ shu:0,sheng:0,bai:0,dahong:0,tguan:0,gaba:0 }); setFinished(false); setWinner(null); setSortedScores(null); }} style={S.ghostBtn}>{t.again}</button>
          <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
        </div>
      </div>
    );
  }
  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "5 вопросов о твоем состоянии — подберем чай, который нужен именно сейчас.", uk: "5 питань про твій стан — підберемо чай, який потрібен саме зараз.", en: "5 questions about your state — we'll pick the tea you need right now." })} />
      </div>
      <div style={S.quizProgress}><span style={S.quizCategory}>{tx(q.category)}</span><span style={S.quizCounter}>{current+1} / {TEA_QUESTIONS.length}</span></div>
      <div style={S.progressTrack}>{TEA_QUESTIONS.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />)}</div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>{tx(q.text)}</p>
      <div style={S.optionsList}>
        {q.options.map((opt,i) => (
          <button key={i} onClick={() => setSelectedIdx(i)} style={{ ...S.optionBtn, borderColor: selectedIdx===i ? "#C8A97E" : "#2A2520", backgroundColor: selectedIdx===i ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={S.optionRadio}>{selectedIdx===i ? "◉" : "○"}</span>
            <span style={S.optionText}>{tx(opt.text)}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selectedIdx===null} style={{ ...S.primaryBtn, opacity: selectedIdx===null ? 0.3 : 1 }}>{current+1===TEA_QUESTIONS.length ? "Узнать свой чай" : t.next}</button>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: МОЯ ТРАЕКТОРИЯ
// ─────────────────────────────────────────────
function TrajectoryScreen({ onBack, weekData, monthData, allData }) {
  const { t, tx, lang, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  function calcStats(data) {
    const filled = data.filter(Boolean);
    const total = filled.length;
    if (total === 0) return null;
    const counts = {};
    EMOTIONS.forEach(e => { counts[e.id] = 0; });
    filled.forEach(e => { if (counts[e.id] !== undefined) counts[e.id]++; });
    const avgScore = filled.reduce((s, e) => s + (e.score || 5), 0) / total;
    return { total, counts, avgScore: avgScore.toFixed(1) };
  }

  const weekStats = calcStats(weekData.map(d => d.data));
  const monthStats = calcStats(monthData);
  const yearStats = calcStats(allData);
  const analysisStats = yearStats || monthStats || weekStats;
  const trajectory = getTrajectory(analysisStats);
  const trend = getTrend(weekStats, monthStats);
  const periodLabel = yearStats ? tx({ ru: "год", uk: "рік", en: "year" }) : monthStats ? tx({ ru: "месяц", uk: "місяць", en: "month" }) : tx({ ru: "неделю", uk: "тиждень", en: "week" });

  const scaleLabels = [
    { label: { ru: "Неделя", uk: "Тиждень", en: "Week" }, desc: { ru: "Слишком мало для выводов. Это ещё не ты — это погода.", uk: "Занадто мало для висновків. Це ще не ти — це погода.", en: "Too little to draw conclusions. This isn't you yet — it's weather." } },
    { label: { ru: "Месяц", uk: "Місяць", en: "Month" }, desc: { ru: "Уже виден паттерн. Тенденция начинает проясняться.", uk: "Вже видно патерн. Тенденція починає прояснюватися.", en: "A pattern is already visible. The trend starts to clarify." } },
    { label: { ru: "Квартал", uk: "Квартал", en: "Quarter" }, desc: { ru: "Это близко к правде. Здесь виден характер периода.", uk: "Це близько до правди. Тут видно характер періоду.", en: "This is close to the truth. The period's character shows here." } },
    { label: { ru: "Год", uk: "Рік", en: "Year" }, desc: { ru: "Это уже зеркало. Здесь видно кем ты становишься.", uk: "Це вже дзеркало. Тут видно ким ти стаєш.", en: "This is a mirror now. You can see who you're becoming." } },
  ];

  const totalEntries = yearStats?.total || monthStats?.total || weekStats?.total || 0;
  const scaleIdx = totalEntries >= 90 ? (totalEntries >= 300 ? 3 : 2) : totalEntries >= 30 ? 1 : 0;

  if (!trajectory) {
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"20px 0" }}>
          <div style={{ fontSize:"48px", marginBottom:"20px" }}>🌱</div>
          <p style={{ fontSize:"18px", color:c.accent, margin:"0 0 12px" }}>{t.littleData}</p>
          <p style={{ fontSize:"14px", color:c.inkSoft, lineHeight:1.7, fontStyle:"italic" }}>
            {tx({ ru: "Отметь хотя бы 7 дней —", uk: "Відміть хоча б 7 днів —", en: "Mark at least 7 days —" })}<br />{t.trajWillShow}
          </p>
        </div>
        <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
      </div>
    );
  }

  const verdictText = tx(trajectory.verdict(trajectory.topEmotions));

  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <div style={{ textAlign:"center", marginBottom:"24px" }}>
        <div style={{ fontSize:"40px", marginBottom:"10px" }}>{trajectory.emoji}</div>
        <p style={{ margin:"0 0 4px", fontSize:"20px", color:c.accent, letterSpacing:"0.05em" }}>{tx(trajectory.name)}</p>
        <p style={{ margin:0, fontSize:"11px", color:c.arrow, letterSpacing:"0.1em" }}>{tx({ ru: `на основе данных за ${periodLabel}`, uk: `на основі даних за ${periodLabel}`, en: `based on data for the ${periodLabel}` })}</p>
      </div>
      <div style={S.wisdomLine} />
      <div style={{ margin:"20px 0", padding:"18px", background:c.card, border:`1px solid ${c.cardBorder}`, borderRadius:"12px" }}>
        <p style={{ margin:"0 0 8px", fontSize:"10px", letterSpacing:"0.2em", color:c.accent }}>{t.whereLifeGoes}</p>
        <p style={{ margin:0, fontSize:"15px", color:c.ink, lineHeight:1.8, fontStyle:"italic" }}>{verdictText}</p>
      </div>
      {trend && (
        <div style={{ margin:"0 0 20px", padding:"14px 18px", background:c.card, border:`1px solid ${c.cardBorder}`, borderRadius:"12px", display:"flex", alignItems:"center", gap:"14px" }}>
          <span style={{ fontSize:"32px", color:trend.color, lineHeight:1 }}>{trend.arrow}</span>
          <div>
            <p style={{ margin:"0 0 2px", fontSize:"11px", letterSpacing:"0.15em", color:c.inkSoft }}>{tx({ru:'ДИНАМИКА',uk:'ДИНАМІКА',en:'DYNAMICS'})}</p>
            <p style={{ margin:0, fontSize:"14px", color:trend.color }}>{tx({ru:"Средний балл",uk:"Середній бал",en:"Average score"})} {trend.label}</p>
            <p style={{ margin:"2px 0 0", fontSize:"11px", color:c.arrow }}>{tx({ru:"Неделя",uk:"Тиждень",en:"Week"})}: {weekStats?.avgScore}/10 · {tx({ru:"Месяц",uk:"Місяць",en:"Month"})}: {monthStats?.avgScore || "—"}/10</p>
          </div>
        </div>
      )}
      <div style={{ margin:"0 0 24px", padding:"18px", background:c.card, border:`1px dashed ${c.cardBorder}`, borderRadius:"12px" }}>
        <p style={{ margin:"0 0 8px", fontSize:"10px", letterSpacing:"0.2em", color:c.inkSoft }}>{t.questionReflect}</p>
        <p style={{ margin:0, fontSize:"15px", color:c.inkMuted, lineHeight:1.8, fontStyle:"italic" }}>«{tx(trajectory.question)}»</p>
      </div>
      <div style={{ padding:"14px", background:c.card, border:`1px solid ${c.cardBorder}`, borderRadius:"10px", marginBottom:"20px" }}>
        <p style={{ margin:"0 0 10px", fontSize:"10px", letterSpacing:"0.15em", color:c.arrow }}>{t.truthScale}</p>
        {scaleLabels.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"8px", marginBottom:"6px" }}>
            <span style={{ fontSize:"10px", color: i === scaleIdx ? c.accent : c.line, flexShrink:0, marginTop:"2px" }}>{i === scaleIdx ? "◉" : "○"}</span>
            <div>
              <span style={{ fontSize:"11px", color: i === scaleIdx ? c.accent : c.arrow }}>{tx(s.label)}: </span>
              <span style={{ fontSize:"11px", color: i === scaleIdx ? c.inkSoft : c.line }}>{tx(s.desc)}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: НАСТАВЛЕНИЯ ПО МЕДИТАЦИИ
// Одна простая и наиболее действенная практика — осознанное дыхание.
// Изложена своими словами (по мотивам общеизвестных техник тибетской
// созерцательной традиции), без дословного цитирования какой-либо
// конкретной книги — авторские права на исходный текст не позволяют
// воспроизводить его напрямую.
// ─────────────────────────────────────────────
const MEDITATION_GUIDANCE_STEPS = [
  { ru: "Сядь ровно — на стуле или на полу, спина прямая, но не напряжённая. Руки свободно лежат на коленях. Глаза можно прикрыть или оставить чуть приоткрытыми.", uk: "Сядь рівно — на стільці або на підлозі, спина пряма, але не напружена. Руки вільно лежать на колінах. Очі можна прикрити або залишити трохи прочиненими.", en: "Sit upright — on a chair or on the floor, spine straight but not tense. Hands rest loosely on your knees. Eyes can be closed or half-open." },
  { ru: "Сделай три медленных вдоха и выдоха — просто чтобы тело почувствовало: сейчас пауза, отдельная от всего остального дня.", uk: "Зроби три повільних вдихи і видихи — просто щоб тіло відчуло: зараз пауза, окрема від усього іншого дня.", en: "Take three slow breaths in and out — just so the body feels: this is a pause, separate from the rest of the day." },
  { ru: "Дальше дыши как обычно, ничего не меняя. Просто замечай сам вдох и выдох — без попытки сделать дыхание «правильным».", uk: "Далі дихай як зазвичай, нічого не змінюючи. Просто помічай сам вдих і видих — без спроби зробити дихання «правильним».", en: "From here, breathe normally — don't change anything. Just notice the inhale and exhale, without trying to make the breathing 'correct'." },
  { ru: "Выбери одну точку внимания — прохладу воздуха у кончика носа, движение живота или ощущение дыхания во всём теле сразу — и мягко держись за неё.", uk: "Обери одну точку уваги — прохолоду повітря біля кінчика носа, рух живота або відчуття дихання в усьому тілі одразу — і м'яко тримайся за неї.", en: "Pick one point of attention — the cool air at the tip of the nose, the movement of the belly, or the sensation of breathing through the whole body — and gently hold to it." },
  { ru: "Ум будет уходить в мысли — это нормально и случится не раз. Как только заметил уход, без раздражения на себя мягко возвращай внимание обратно к дыханию. Само это возвращение и есть практика, а не помеха ей.", uk: "Розум буде йти в думки — це нормально і трапиться не раз. Щойно помітив відхід, без роздратування на себе м'яко повертай увагу назад до дихання. Саме це повернення і є практикою, а не завадою їй.", en: "The mind will wander into thoughts — that's normal and will happen more than once. The moment you notice it, gently bring attention back to the breath, without frustration. That returning is the practice itself, not a failure of it." },
  { ru: "Заверши: одна спокойная мысль о том, зачем ты сегодня это делал, и мягко открой глаза.", uk: "Заверши: одна спокійна думка про те, навіщо ти сьогодні це робив, і м'яко відкрий очі.", en: "Finish with one calm thought about why you did this today, and gently open your eyes." },
];
function MeditationGuidanceScreen({ onBack, onGoPractice }) {
  const { t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [showNotes, setShowNotes] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  if (showNotes) return <QuietNotes onBack={() => setShowNotes(false)} />;
  if (showChallenge) return <ChallengeScreen onBack={() => setShowChallenge(false)} presetGroup="meditationbreath" />;
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🧘</div>
        <p style={{ margin: "0 0 4px", fontSize: "11px", letterSpacing: "0.25em", color: c.accent }}>{tx({ ru: "НАСТАВЛЕНИЯ", uk: "НАСТАНОВИ", en: "GUIDANCE" })}</p>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "normal", color: c.ink, letterSpacing: "0.04em" }}>{tx({ ru: "Наставления по медитации", uk: "Настанови з медитації", en: "Meditation guidance" })}</h2>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: "13px", color: c.inkSoft, lineHeight: 1.7, fontStyle: "italic" }}>
        {tx({ ru: "Если выбирать всего одну практику — самую простую и при этом самую действенную — это осознанное дыхание. Она не требует условий, подходит новичку и лежит в основе большинства техник из раздела «Моя практика».", uk: "Якщо обирати лише одну практику — найпростішу і водночас найдієвішу — це усвідомлене дихання. Вона не потребує умов, підходить новачку і лежить в основі більшості технік з розділу «Моя практика».", en: "If you were to choose just one practice — the simplest and also the most effective — it's mindful breathing. It needs no special conditions, suits beginners, and underlies most techniques in the 'My practice' section." })}
      </p>
      <div style={S.stepsBlock}>
        <p style={S.stepsTitle}>{tx({ ru: "ОСОЗНАННОЕ ДЫХАНИЕ", uk: "УСВІДОМЛЕНЕ ДИХАННЯ", en: "MINDFUL BREATHING" })}</p>
        {MEDITATION_GUIDANCE_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < MEDITATION_GUIDANCE_STEPS.length - 1 ? "12px" : "0" }}>
            <span style={{ fontSize: "11px", color: c.accent, flexShrink: 0, marginTop: "2px", minWidth: "16px" }}>{i + 1}.</span>
            <p style={{ margin: 0, fontSize: "13px", color: c.inkMuted, lineHeight: 1.7 }}>{tx(step)}</p>
          </div>
        ))}
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${c.line}` }}>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: c.inkSoft }}>⏱ {tx({ ru: "8–15 минут в день, лучше в одно и то же время", uk: "8–15 хвилин на день, краще в один і той самий час", en: "8–15 minutes a day, ideally at the same time" })}</p>
          <p style={{ margin: 0, fontSize: "11px", color: c.inkSoft, fontStyle: "italic" }}>🔍 {tx({ ru: "по мотивам классических техник осознанного дыхания тибетской созерцательной традиции", uk: "за мотивами класичних технік усвідомленого дихання тибетської споглядальної традиції", en: "inspired by classic mindful-breathing techniques of the Tibetan contemplative tradition" })}</p>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowChallenge(true)} style={S.primaryBtn}>{tx({ ru: "🧭 Начать 10-дневный челлендж", uk: "🧭 Почати 10-денний челендж", en: "🧭 Start a 10-day challenge" })}</button>
        <button onClick={onGoPractice} style={{ ...S.ghostBtn, marginBottom: "10px" }}>{tx({ ru: "Подобрать практику под своё состояние", uk: "Підібрати практику під свій стан", en: "Match a practice to my state" })}</button>
        <button onClick={() => setShowNotes(true)} style={S.ghostBtn}>🌙 {t.notebook}</button>
      </div>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}


const NOTE_EMOTIONS = [
  { id: "calm", emoji: "🌙", label: { ru: "тихо", uk: "тихо", en: "quiet" } },
  { id: "tired", emoji: "🌫", label: { ru: "устало", uk: "втомлено", en: "tired" } },
  { id: "warm", emoji: "🌕", label: { ru: "тепло", uk: "тепло", en: "warm" } },
  { id: "anx", emoji: "🍃", label: { ru: "тревожно", uk: "тривожно", en: "anxious" } },
];
function getEntryDateLabel(iso, lang) { const locale = lang === "uk" ? "uk-UA" : lang === "en" ? "en-US" : "ru-RU"; return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long" }); }
function getEntryDaysLeft(iso) { return Math.max(0, Math.ceil((new Date(iso) - new Date()) / 86400000)); }
function calcNotesStreak(entries) {
  const days = new Set(entries.filter(e => !e.sealed).map(e => new Date(e.date).toDateString()));
  let s = 0, c = new Date();
  if (!days.has(c.toDateString())) c.setDate(c.getDate() - 1);
  while (days.has(c.toDateString())) { s++; c.setDate(c.getDate() - 1); }
  return s;
}
function QuietNotes({ onBack }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const isDark = theme === "dark";
  const [loaded, setLoaded] = useState(false);
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [seal, setSeal] = useState(false);
  const [sealDate, setSealDate] = useState(new Date(Date.now()+7*86400000).toISOString().split("T")[0]);
  const [justSaved, setJustSaved] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [tab, setTab] = useState("all");
  const [moodFilter, setMoodFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [memory, setMemory] = useState(null);
  useEffect(() => { CS.get("quiet_notes").then(r => { setEntries(r ? JSON.parse(r) : []); setLoaded(true); }); }, []);
  async function persist(next) { setEntries(next); await CS.set("quiet_notes", JSON.stringify(next)); }
  function handleSave() {
    if (!text.trim()) return;
    const now = new Date();
    const entry = { id: Date.now(), date: now.toISOString(), text: seal ? `Письмо себе — открыть ${sealDate}` : text.trim(), fullText: text.trim(), mood, sealed: seal, revealAt: seal ? new Date(new Date(sealDate).getTime()).toISOString() : null };
    persist([entry, ...entries]); setText(""); setMood(null); setSeal(false); setSealDate("");
    if (seal) {
      setSealing(true); setTimeout(() => setSealing(false), 2000);
      const { uid, chatId } = getUidChat();
      if (chatId) {
        const p = new URLSearchParams({ action: "schedule_letter", uid, chatId, letterId: String(entry.id), revealAt: entry.revealAt });
        fetch(`${STATS_URL}?${p}`, { keepalive: true, cache: "no-store" }).catch(() => {});
      }
    }
    else { setJustSaved(true); setTimeout(() => setJustSaved(false), 1800); }
  }
  if (!loaded) return (<div style={S.screen}><button onClick={onBack} style={S.backBtn}>{t.back}</button><div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:c.inkSoft, fontStyle:"italic" }}>{t.openingNotes}</p></div></div>);
  const streak = calcNotesStreak(entries);
  const visible = entries.filter(e => { if (tab === "letters") return e.sealed; if (e.sealed) return false; if (moodFilter && e.mood !== moodFilter) return false; if (search && !(e.fullText || e.text).toLowerCase().includes(search.toLowerCase())) return false; return true; });
  const card = { background:"rgba(255,255,255,0.03)", border:`1px solid ${c.cardBorder}`, borderRadius:"12px", padding:"16px", marginBottom:"12px" };
  const gb = { padding:"10px 14px", background:"transparent", color:c.inkSoft, border:`1px solid ${c.cardBorder}`, borderRadius:"10px", fontSize:"12px", cursor:"pointer", fontFamily:"'Georgia',serif" };
  const gba = { ...gb, background:"rgba(200,169,126,0.12)", color:c.accent, border:"1px solid rgba(200,169,126,0.3)" };
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <p style={{ fontSize:"20px", fontWeight:"normal", margin:"0 0 4px" }}>{t.notebook}</p>
      <p style={{ fontSize:"13px", color:c.inkSoft, margin:"0 0 16px" }}>{t.personalThoughts}</p>
      {streak > 1 && <p style={{ fontSize:"12px", color:c.accent, margin:"0 0 20px" }}>🌙 {tx({ ru: `${streak} дней подряд`, uk: `${streak} днів поспіль`, en: `${streak} days in a row` })}</p>}
      <div style={card}>
        <textarea style={{ width:"100%", minHeight:"100px", background:"transparent", border:`1px solid ${c.cardBorder}`, borderRadius:"10px", padding:"12px", color:c.ink, fontFamily:"'Georgia',serif", fontSize:"14px", lineHeight:1.6, resize:"none", boxSizing:"border-box", outline:"none" }} placeholder={tx({ ru: "О чём думаешь сегодня?", uk: "Про що думаєш сьогодні?", en: "What are you thinking about today?" })} value={text} onChange={e => setText(e.target.value)} />
        <div style={{ display:"flex", gap:"8px", marginTop:"12px", flexWrap:"wrap" }}>
          {NOTE_EMOTIONS.map(e => <button key={e.id} onClick={() => setMood(mood === e.id ? null : e.id)} style={mood === e.id ? gba : gb}>{e.emoji} {tx(e.label)}</button>)}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"14px" }}>
          <button onClick={() => setSeal(!seal)} style={seal ? gba : gb}>{seal ? "✓ " : ""}✉️ {tx({ru:'Письмо себе',uk:'Лист собі',en:'Letter to yourself'})}</button>
          {seal && <input type="date" value={sealDate} onChange={e => setSealDate(e.target.value)} min={new Date(Date.now()+86400000).toISOString().split("T")[0]} max={new Date(Date.now()+3*365*86400000).toISOString().split("T")[0]} style={{ background:c.softBg, color:c.accent, border:`1px solid ${c.cardBorder}`, borderRadius:"8px", padding:"9px 10px", fontFamily:"Georgia,serif", fontSize:"12px" }} />}
        </div>
        <button style={{ ...S.primaryBtn, marginTop:"12px" }} onClick={handleSave}>{tx(seal ? {ru:"ЗАПЕЧАТАТЬ",uk:"ЗАПЕЧАТАТИ",en:"SEAL"} : {ru:"СОХРАНИТЬ",uk:"ЗБЕРЕГТИ",en:"SAVE"})}</button>
        <p style={{ fontSize:"11px", color:c.inkSoft, textAlign:"center", marginTop:"10px", fontStyle:"italic" }}>{t.onlyYou}</p>
      </div>
      {sealing && <div style={{ ...card, background:"rgba(200,169,126,0.06)", border:"1px solid rgba(200,169,126,0.3)", textAlign:"center", padding:"24px" }}><div style={{ fontSize:"28px", marginBottom:"6px" }}>✉️</div><div style={{ color:c.accent, fontSize:"13px", letterSpacing:"0.05em" }}>{t.sealed}</div></div>}
      {justSaved && !sealing && <div style={{ ...card, background:"rgba(200,169,126,0.06)", border:"1px solid rgba(200,169,126,0.3)", textAlign:"center", color:c.accent, fontSize:"13px" }}>{t.saved}</div>}
      {!memory && entries.some(e => !e.sealed) && <button onClick={() => { const p = entries.filter(e => !e.sealed); setMemory(p[Math.floor(Math.random()*p.length)]); }} style={{ ...gb, width:"100%", marginBottom:"16px", boxSizing:"border-box", textAlign:"center" }}>🕯 {tx({ru:'вспомнить запись',uk:'згадати запис',en:'recall an entry'})}</button>}
      {memory && <div style={{ background:"rgba(200,169,126,0.04)", border:"1px solid rgba(200,169,126,0.2)", borderRadius:"12px", padding:"16px", marginBottom:"16px" }}><p style={{ fontSize:"11px", color:c.accent, margin:"0 0 8px" }}>{tx({ru:'ИЗ ПРОШЛОГО',uk:'З МИНУЛОГО',en:'FROM THE PAST'})} · {getEntryDateLabel(memory.date, lang)}</p><p style={{ fontSize:"14px", color:c.ink, lineHeight:1.6, margin:0 }}>{memory.fullText || memory.text}</p><button onClick={() => setMemory(null)} style={{ background:"none", border:"none", color:c.inkSoft, fontSize:"11px", cursor:"pointer", fontFamily:"'Georgia',serif", padding:0, marginTop:"12px" }}>{tx({ru:'закрыть',uk:'закрити',en:'close'})}</button></div>}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tx({ ru: "🔍 поиск по записям", uk: "🔍 пошук по записах", en: "🔍 search entries" })} style={{ width:"100%", background:"rgba(255,255,255,0.03)", border:`1px solid ${c.cardBorder}`, borderRadius:"10px", padding:"10px 12px", color:c.ink, fontFamily:"'Georgia',serif", fontSize:"13px", outline:"none", boxSizing:"border-box", marginBottom:"12px" }} />
      <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
        <button onClick={() => { setTab("all"); setMoodFilter(null); }} style={tab === "all" ? gba : gb}>{tx({ru:'записи',uk:'записи',en:'entries'})}</button>
        <button onClick={() => setTab("letters")} style={tab === "letters" ? gba : gb}>✉️ {tx({ru:'письма себе',uk:'листи собі',en:'letters to self'})}</button>
      </div>
      {tab === "all" && <div style={{ display:"flex", gap:"8px", marginBottom:"12px", flexWrap:"wrap" }}>{NOTE_EMOTIONS.map(e => <button key={e.id} onClick={() => setMoodFilter(moodFilter === e.id ? null : e.id)} style={moodFilter === e.id ? gba : gb}>{e.emoji} {tx(e.label)}</button>)}</div>}
      {visible.length === 0 && <p style={{ fontSize:"13px", color:c.inkSoft, textAlign:"center", padding:"20px 0" }}>{tab === "letters" ? tx({ru:'пока нет писем себе',uk:'поки немає листів собі',en:'no letters to yourself yet'}) : tx({ru:'пока ничего нет',uk:'поки нічого немає',en:'nothing here yet'})}</p>}
      {visible.map(e => { const mi = NOTE_EMOTIONS.find(m => m.id === e.mood); const revealed = !e.sealed || (e.revealAt && new Date(e.revealAt) <= new Date()); const moodColors = { calm:"#6B8CAE", tired:"#8A8A9A", warm:"#C8A97E", anx:"#7A9E7E" }; const stripe = e.mood ? moodColors[e.mood] : null; return (<div key={e.id} style={{ ...card, borderLeft: stripe ? `3px solid ${stripe}` : "1px solid #2A2520", paddingLeft: stripe ? "13px" : "16px" }}><p style={{ fontSize:"11px", color:c.inkSoft, margin:"0 0 6px" }}>{getEntryDateLabel(e.date, lang)}</p><p style={{ fontSize:"14px", color:c.ink, lineHeight:1.6, margin:0 }}>{revealed ? (e.fullText || e.text) : e.text}</p>{mi && !e.sealed && <p style={{ fontSize:"11px", color: stripe || "#C8A97E", margin:"8px 0 0" }}>{mi.emoji} {tx(mi.label)}</p>}{e.sealed && !revealed && <span style={{ display:"inline-block", fontSize:"11px", color:"#8B6E4E", border:`1px solid ${c.cardBorder}`, borderRadius:"6px", padding:"2px 8px", marginTop:"8px" }}>{getEntryDaysLeft(e.revealAt) === 0 ? tx({ru:"откроется сегодня",uk:"відкриється сьогодні",en:"unlocks today"}) : getEntryDaysLeft(e.revealAt) === 1 ? tx({ru:"осталось 1 день",uk:"залишився 1 день",en:"1 day left"}) : tx({ru:`осталось ${getEntryDaysLeft(e.revealAt)} дн.`,uk:`залишилося ${getEntryDaysLeft(e.revealAt)} дн.`,en:`${getEntryDaysLeft(e.revealAt)} days left`})}</span>}<div style={{ display:"flex", justifyContent:"flex-end", marginTop:"8px" }}><button onClick={() => { if (e.sealed && !revealed) { const { uid } = getUidChat(); const p = new URLSearchParams({ action:"cancel_letter", uid, letterId:String(e.id) }); fetch(`${STATS_URL}?${p}`, { keepalive:true, cache:"no-store" }).catch(()=>{}); } persist(entries.filter(x => x.id !== e.id)); }} style={{ background:"none", border:"none", color:c.inkSoft, fontSize:"11px", cursor:"pointer", fontFamily:"'Georgia',serif", padding:0 }}>{tx({ru:'удалить',uk:'видалити',en:'delete'})}</button></div></div>); })}
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: МОЁ СОСТОЯНИЕ
// ─────────────────────────────────────────────
function MoodScreen({ onBack }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const isDark = theme === "dark";
  const [todayEmotion, setTodayEmotion] = useState(null);
  const [streak, setStreak] = useState(0);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("today");
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    async function load() {
      const todayKey = getTodayKey();
      const raw = await CS.get("mood_" + todayKey);
      if (raw) setTodayEmotion(JSON.parse(raw));
      const s = await CS.get("streak");
      setStreak(parseInt(s || "0"));
      const week = [];
      const days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const r = await CS.get("mood_" + getDateKey(d));
        week.push({ day: days[d.getDay()], data: r ? JSON.parse(r) : null });
      }
      setWeekData(week);
      const month = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const r = await CS.get("mood_" + getDateKey(d));
        month.push(r ? JSON.parse(r) : null);
      }
      setMonthData(month);
      const all = [];
      for (let i = 364; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const r = await CS.get("mood_" + getDateKey(d));
        all.push(r ? JSON.parse(r) : null);
      }
      setAllData(all);
      setLoaded(false);
      setLoaded(true);
    }
    load();
  }, []);

  const handleSelectEmotion = async (emotion) => {
    const todayKey = getTodayKey();
    await CS.set("mood_" + todayKey, JSON.stringify(emotion));
    setTodayEmotion(emotion);
    statEvent("mood", undefined, { emotion: emotion.id });

    // ── Серия (streak) только растёт и никогда не откатывается. ──
    // Один прирост за календарный день, сколько бы дней ни было
    // пропущено до этого — старый результат и титул всегда сохраняются.
    const lastDateKey = await CS.get("streak_last_date");
    const alreadyToday = lastDateKey === todayKey;
    const newStreak = alreadyToday ? streak : streak + 1;

    await CS.set("streak", String(newStreak));
    await CS.set("streak_last_date", todayKey);
    setStreak(newStreak);
    setWeekData(prev => prev.map((d,i) => i === 6 ? { ...d, data: emotion } : d));
    setMonthData(prev => { const n=[...prev]; n[29]=emotion; return n; });
    setAllData(prev => { const n=[...prev]; n[364]=emotion; return n; });
  };

  function calcStats(data) {
    const filled = data.filter(Boolean);
    const total = filled.length;
    if (total === 0) return null;
    const counts = {};
    EMOTIONS.forEach(e => { counts[e.id] = 0; });
    filled.forEach(e => { if (counts[e.id] !== undefined) counts[e.id]++; });
    const avgScore = filled.reduce((s, e) => s + (e.score || 5), 0) / total;
    return { total, counts, avgScore: avgScore.toFixed(1) };
  }

  const title = getCurrentTitle(streak);
  const nextTitle = TITLES.find(t => t.days > streak);
  const shareTitle = `${title.emoji} ${tx({ru:"Мой титул",uk:"Мій титул",en:"My title"})} — «${tx(title.name)}»\n${tx(title.desc)}\n${streak} ${tx({ru:"дней практики",uk:"днів практики",en:"days of practice"})}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
  const allStats = calcStats(allData);
  const archetype = allStats ? getArchetype(allStats.counts, allStats.total) : null;

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ flex:1, padding:"8px 4px", background: tab===id ? "rgba(200,169,126,0.12)" : "transparent", border: tab===id ? "1px solid rgba(200,169,126,0.3)" : "1px solid #2A2520", borderRadius:"8px", color: tab===id ? "#C8A97E" : "#7A6E62", fontSize:"11px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" }}>
      {label}
    </button>
  );

  function StatBlock({ data, label }) {
    const stats = calcStats(data);
    if (!stats) return <p style={{ color:c.inkSoft, fontStyle:"italic", fontSize:"13px", textAlign:"center", marginTop:"20px" }}>Пока нет данных за {label}.</p>;
    const sorted = Object.entries(stats.counts).sort((a,b) => b[1]-a[1]).filter(([,v]) => v > 0);
    const daysInPeriod = data.length;
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
          <div style={S.statCard}><p style={S.statNum}>{stats.total}</p><p style={S.statLabel}>из {daysInPeriod} дней</p></div>
          <div style={S.statCard}><p style={S.statNum}>{stats.avgScore}</p><p style={S.statLabel}>{t.avgScore}</p></div>
        </div>
        <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:c.accent, marginBottom:"10px" }}>{tx({ru:'СОСТОЯНИЯ',uk:'СТАНОВИ',en:'STATES'})}</p>
        {sorted.map(([id, count]) => {
          const em = EMOTIONS.find(e => e.id === id);
          const pct = Math.round((count / stats.total) * 100);
          return (
            <div key={id} style={{ marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
                <span style={{ fontSize:"13px", color:c.ink }}>{em?.emoji} {em?.label}</span>
                <span style={{ fontSize:"12px", color:c.inkSoft }}>{pct}%</span>
              </div>
              <div style={{ height:"3px", backgroundColor:"#2A2520", borderRadius:"2px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, backgroundColor:"#C8A97E", borderRadius:"2px", transition:"width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!loaded) return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ color:c.inkSoft, fontStyle:"italic" }}>{t.loadingPath}</p>
      </div>
    </div>
  );

  if (showTrajectory) return (
    <TrajectoryScreen onBack={() => setShowTrajectory(false)} weekData={weekData} monthData={monthData} allData={allData} />
  );

  if (showNotes) return (
    <QuietNotes onBack={() => setShowNotes(false)} />
  );

  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "Отмечай эмоцию каждый день. Серии, титулы, архетип — твой путь к себе.", uk: "Відзначай емоцію щодня. Серії, титули, архетип — твій шлях до себе.", en: "Log your emotion every day. Streaks, titles, archetype — your path to yourself." })} />
      </div>
      <div style={{ textAlign:"center", marginBottom:"20px" }}>
        <div style={{ fontSize:"32px", marginBottom:"8px" }}>{title.emoji}</div>
        <p style={{ margin:0, fontSize:"18px", color:c.accent, letterSpacing:"0.05em" }}>{tx(title.name)}</p>
        <p style={{ margin:"4px 0 0", fontSize:"12px", color:c.inkSoft }}>{streak} {streak===1?"день":streak<5?"дня":"дней"} подряд</p>
        {nextTitle && <p style={{ margin:"4px 0 0", fontSize:"11px", color:c.inkSoft }}>до «{tx(nextTitle.name)}» — {nextTitle.days - streak} {nextTitle.days-streak===1?"день":"дней"}</p>}
        <div><ShareButton text={shareTitle} label={tx({ ru: "Поделиться титулом ↗", uk: "Поділитися титулом ↗", en: "Share title ↗" })} /></div>
      </div>
      <div style={S.wisdomLine} />
      {archetype && (
        <div style={{ ...S.teaNoteBox, margin:"16px 0", textAlign:"center" }}>
          <p style={{ margin:"0 0 4px", fontSize:"22px" }}>{archetype.emoji}</p>
          <p style={{ margin:"0 0 4px", fontSize:"15px", color:c.accent }}>{tx(archetype.name)}</p>
          <p style={{ margin:0, fontSize:"12px", color:c.inkSoft, fontStyle:"italic", lineHeight:1.6 }}>{tx(archetype.desc)}</p>
          <div>
            <ShareButton text={`${archetype.emoji} ${tx({ru:"Мой архетип",uk:"Мій архетип",en:"My archetype"})} — «${tx(archetype.name)}»\n${tx(archetype.desc)}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label={tx({ ru: "Поделиться архетипом ↗", uk: "Поділитися архетипом ↗", en: "Share archetype ↗" })} />
          </div>
        </div>
      )}
      <button onClick={() => setShowTrajectory(true)} style={{ width:"100%", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid rgba(200,169,126,0.2)", borderRadius:"12px", color:c.accent, fontSize:"14px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em", marginBottom:"4px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
        <span>🧭</span><span>{t.myTrajectory}</span><span style={{ color:c.inkSoft, fontSize:"16px" }}>→</span>
      </button>
      <p style={{ margin:"0 0 16px", fontSize:"11px", color:c.inkSoft, textAlign:"center", letterSpacing:"0.05em" }}>{t.whereLife}</p>

      <button onClick={() => setShowNotes(true)} style={{ width:"100%", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid rgba(200,169,126,0.2)", borderRadius:"12px", color:c.accent, fontSize:"14px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em", marginBottom:"4px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
        <span>🌙</span><span>{t.notebook}</span><span style={{ color:c.inkSoft, fontSize:"16px" }}>→</span>
      </button>
      <p style={{ margin:"0 0 16px", fontSize:"11px", color:c.inkSoft, textAlign:"center", letterSpacing:"0.05em" }}>{t.placeForThoughts}</p>
      <div style={{ margin:"16px 0" }}>
        <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:c.accent, marginBottom:"12px" }}>
          {todayEmotion ? "СЕГОДНЯ ТЫ ОТМЕТИЛ" : "КАК ТЫ СЕЙЧАС?"}
        </p>
        {todayEmotion ? (
          <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px", background:"rgba(200,169,126,0.06)", border:"1px solid rgba(200,169,126,0.15)", borderRadius:"12px" }}>
            <span style={{ fontSize:"28px" }}>{todayEmotion.emoji}</span>
            <span style={{ fontSize:"16px", color:c.ink }}>{todayEmotion.label}</span>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", gap:"6px" }}>
            {EMOTIONS.map(e => (
              <button key={e.id} onClick={() => handleSelectEmotion(e)} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${c.cardBorder}`, borderRadius:"10px", padding:"8px 2px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:"5px", minWidth:0 }}>
                <span style={{ fontSize:"19px" }}>{e.emoji}</span>
                <span style={{ fontSize:"9px", color:c.inkSoft, textAlign:"center", wordBreak:"break-word", lineHeight:"1.25" }}>{emotionLabel(e.id, lang) || e.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:"flex", gap:"6px", margin:"16px 0 14px" }}>
        <TabBtn id="today" label={tx({ ru: "Неделя", uk: "Тиждень", en: "Week" })} />
        <TabBtn id="month" label={tx({ ru: "Месяц", uk: "Місяць", en: "Month" })} />
        <TabBtn id="year"  label={tx({ ru: "Год", uk: "Рік", en: "Year" })} />
      </div>
      {tab === "today" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:c.accent, marginBottom:"12px" }}>{t.weekMap}</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"6px", marginBottom:"16px" }}>
            {weekData.map((d,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"8px", border:`1px solid ${c.cardBorder}`, background: d.data ? "rgba(200,169,126,0.08)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>{d.data ? d.data.emoji : ""}</div>
                <span style={{ fontSize:"10px", color:c.inkSoft }}>{d.day}</span>
              </div>
            ))}
          </div>
          <StatBlock data={weekData.map(d => d.data)} label="неделю" />
          {(() => { const ws = calcStats(weekData.map(d => d.data)); return ws ? (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:`1px solid ${c.cardBorder}`, borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:c.accent }}>{t.weekSummary}</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:c.ink }}>Отмечался {ws.total} из 7 дней</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:c.ink }}>Средний балл: {ws.avgScore}/10</p>
              {ws.total > 0 && (() => { const top = Object.entries(ws.counts).sort((a,b) => b[1]-a[1])[0]; const topEm = EMOTIONS.find(e => e.id === top[0]); return <p style={{ margin:0, fontSize:"13px", color:c.ink }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>; })()}
              <div><ShareButton text={`📊 Моя неделя в Tea Bro\n\nОтмечался ${ws.total} из 7 дней\nСредний балл: ${ws.avgScore}/10\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label={tx({ ru: "Поделиться итогом ↗", uk: "Поділитися підсумком ↗", en: "Share summary ↗" })} /></div>
            </div>
          ) : null; })()}
        </div>
      )}
      {tab === "month" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:c.accent, marginBottom:"12px" }}>{t.monthMap}</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"5px", marginBottom:"16px" }}>
            {monthData.map((d,i) => {
              const daysAgo = 29 - i;
              const date = new Date(); date.setDate(date.getDate() - daysAgo);
              return (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
                  <div style={{ width:"34px", height:"34px", borderRadius:"7px", border:`1px solid ${c.cardBorder}`, background: d ? "rgba(200,169,126,0.08)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>{d ? d.emoji : ""}</div>
                  <span style={{ fontSize:"9px", color:c.inkSoft }}>{date.getDate()}</span>
                </div>
              );
            })}
          </div>
          <StatBlock data={monthData} label="месяц" />
          {(() => { const ms = calcStats(monthData); return ms ? (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:`1px solid ${c.cardBorder}`, borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:c.accent }}>{t.monthSummary}</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:c.ink }}>Отмечался {ms.total} из 30 дней</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:c.ink }}>Средний балл: {ms.avgScore}/10</p>
              {ms.total > 0 && (() => { const top = Object.entries(ms.counts).sort((a,b) => b[1]-a[1])[0]; const topEm = EMOTIONS.find(e => e.id === top[0]); return <p style={{ margin:0, fontSize:"13px", color:c.ink }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>; })()}
              <div><ShareButton text={`📊 Мой месяц в Tea Bro\n\nОтмечался ${ms.total} из 30 дней\nСредний балл: ${ms.avgScore}/10\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label={tx({ ru: "Поделиться итогом ↗", uk: "Поділитися підсумком ↗", en: "Share summary ↗" })} /></div>
            </div>
          ) : null; })()}
        </div>
      )}
      {tab === "year" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:c.accent, marginBottom:"12px" }}>{t.yearMap}</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"6px", marginBottom:"16px" }}>
            {(() => {
              const months = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
              return Array.from({ length:12 }, (_,mi) => {
                const monthEntries = allData.filter((_,di) => {
                  const d = new Date(); d.setDate(d.getDate() - (364 - di));
                  return d.getMonth() === ((new Date().getMonth() - 11 + mi + 12) % 12);
                });
                const filled = monthEntries.filter(Boolean);
                const topEmoji = filled.length > 0 ? (() => {
                  const counts = {}; filled.forEach(e => { counts[e.id] = (counts[e.id]||0)+1; });
                  const topId = Object.entries(counts).sort((a,b) => b[1]-a[1])[0][0];
                  return EMOTIONS.find(e => e.id === topId)?.emoji || "";
                })() : "";
                const mIdx = (new Date().getMonth() - 11 + mi + 12) % 12;
                return (
                  <div key={mi} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                    <div style={{ width:"42px", height:"42px", borderRadius:"8px", border:`1px solid ${c.cardBorder}`, background: filled.length > 0 ? "rgba(200,169,126,0.08)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>{topEmoji}</div>
                    <span style={{ fontSize:"9px", color:c.inkSoft }}>{months[mIdx]}</span>
                    <span style={{ fontSize:"8px", color:c.inkSoft }}>{filled.length}д</span>
                  </div>
                );
              });
            })()}
          </div>
          <StatBlock data={allData} label="год" />
          {allStats && (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:`1px solid ${c.cardBorder}`, borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:c.accent }}>{t.yearSummary}</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:c.ink }}>Отмечался {allStats.total} из 365 дней</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:c.ink }}>Средний балл: {allStats.avgScore}/10</p>
              {allStats.total > 0 && (() => { const top = Object.entries(allStats.counts).sort((a,b) => b[1]-a[1])[0]; const topEm = EMOTIONS.find(e => e.id === top[0]); return <p style={{ margin:0, fontSize:"13px", color:c.ink }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>; })()}
              <div><ShareButton text={`📊 Мой год в Tea Bro\n\nОтмечался ${allStats.total} дней\nСредний балл: ${allStats.avgScore}/10\n${archetype ? `${tx({ru:"Архетип",uk:"Архетип",en:"Archetype"})}: ${archetype.emoji} ${tx(archetype.name)}` : ""}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label={tx({ ru: "Поделиться отчетом ↗", uk: "Поділитися звітом ↗", en: "Share report ↗" })} /></div>
            </div>
          )}
        </div>
      )}
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ЧАЙНАЯ ЛАВКА
// ─────────────────────────────────────────────
function ShopScreen({ onBack }) {
  const { theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <HintPopup text={tx({ ru: "Здесь скоро появятся чаи, которые мы выбираем сами.", uk: "Тут скоро з'являться чаї, які ми обираємо самі.", en: "Teas we choose ourselves will appear here soon." })} />
      </div>
      <div style={S.wisdomContainer}>
        <div style={{ fontSize:"48px", marginBottom:"20px" }}>🫖</div>
        <p style={{ ...S.wisdomText, fontSize:"22px", marginBottom:"12px" }}>{t.teaShop}</p>
        <div style={S.wisdomLine} />
        <p style={{ fontSize:"14px", color:c.inkSoft, fontStyle:"italic", marginTop:"16px", lineHeight:1.8, textAlign:"center" }}>
          Скоро здесь появятся чаи,<br />{tx({ru:'которые мы выбираем сами.',uk:'які ми обираємо самі.',en:'that we choose ourselves.'})}<br />{t.noExtra}
        </p>
        <p style={{ fontSize:"12px", color:c.inkSoft, marginTop:"24px", letterSpacing:"0.15em" }}>— скоро —</p>
      </div>
      <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center" }}>{t.followChannel}</a>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: АДМИНКА
// ─────────────────────────────────────────────
const ADMIN_ID = 5175467398;

function AdminScreen({ onBack }) {
  const { lang, t, tx, theme } = useLang();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const c = THEMES[theme] || THEMES.dark;
  const isDark = theme === "dark";

  async function loadStats(isRefresh) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`${STATS_URL}?action=get&t=${Date.now()}`, { cache: "no-store" });
      const serverStats = res.ok ? await res.json() : {};
      const emotionCounts = serverStats.emotionCounts || {};
      const topEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => {
          const em = EMOTIONS.find(e => e.id === id);
          return em && count > 0 ? { ...em, count } : null;
        })
        .filter(Boolean);
      const maxEmotion = topEmotions[0]?.count || 1;
      setStats({
        totalOpens: serverStats.totalOpens ?? 0,
        totalQuiz: serverStats.totalQuiz ?? 0,
        totalSelfHonesty: serverStats.totalSelfHonesty ?? 0,
        totalHormones: serverStats.totalHormones ?? 0,
        totalTea: serverStats.totalTea ?? 0,
        totalMood: serverStats.totalMood ?? 0,
        totalMeditation: serverStats.totalMeditation ?? 0,
        uniqueTotal: serverStats.uniqueTotal ?? 0,
        usersWithChatId: serverStats.usersWithChatId ?? 0,
        todayOpens: serverStats.todayOpens ?? 0,
        todayQuiz: serverStats.todayQuiz ?? 0,
        todayUnique: serverStats.todayUnique ?? 0,
        topEmotions,
        maxEmotion,
        selfHonestyHist: serverStats.selfHonestyHist || null,
      });
    } catch (e) {
      setStats({ error: true });
    }
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { loadStats(false); }, []);

  const card = {
    background: isDark ? "rgba(200,169,126,0.05)" : "rgba(176,132,84,0.06)",
    border: `1px solid ${c.cardBorder}`,
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "14px",
  };
  const sectionTitle = {
    margin: "0 0 14px",
    fontSize: "10px",
    letterSpacing: "0.22em",
    color: c.accent,
    fontFamily: "'Georgia',serif",
  };
  const metricBig = {
    flex: 1,
    minWidth: 0,
    textAlign: "center",
    padding: "14px 8px",
    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(58,53,43,0.03)",
    borderRadius: "12px",
    border: `1px solid ${c.cardBorder}`,
  };
  const metricVal = {
    margin: "0 0 4px",
    fontSize: "26px",
    color: c.accent,
    fontFamily: "'Georgia',serif",
    letterSpacing: "0.02em",
  };
  const metricLabel = {
    margin: 0,
    fontSize: "10px",
    color: c.inkSoft,
    letterSpacing: "0.08em",
    lineHeight: 1.3,
    overflowWrap: "normal",
    wordBreak: "keep-all",
    hyphens: "none",
  };
  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom: `1px solid ${isDark ? "#1A1713" : "rgba(58,53,43,0.08)"}`,
  };
  const rowLabel = { fontSize: "13px", color: c.inkSoft, display: "flex", alignItems: "center", gap: "8px" };
  const rowValue = { fontSize: "14px", color: c.accent, fontVariantNumeric: "tabular-nums" };

  const tests = stats && !stats.error ? [
    { icon: "🪞", label: "Опросник", value: stats.totalQuiz },
    { icon: "🎭", label: "Самообман", value: stats.totalSelfHonesty },
    { icon: "🧬", label: "Гормоны", value: stats.totalHormones },
    { icon: "🍵", label: "Чай", value: stats.totalTea },
    { icon: "🧘", label: "Медитации", value: stats.totalMeditation },
    { icon: "💭", label: "Эмоции", value: stats.totalMood },
  ] : [];

  return (
    <div style={S.screen}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <button
          onClick={() => loadStats(true)}
          disabled={loading || refreshing}
          style={{
            background: "none",
            border: `1px solid ${c.cardBorder}`,
            color: c.inkSoft,
            fontSize: "12px",
            cursor: loading || refreshing ? "default" : "pointer",
            padding: "6px 12px",
            borderRadius: "20px",
            fontFamily: "'Georgia',serif",
            opacity: refreshing ? 0.6 : 1,
          }}
        >
          {refreshing ? "обновляю…" : "↻ обновить"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>⚙️</div>
        <p style={{ margin: "0 0 4px", fontSize: "11px", letterSpacing: "0.25em", color: c.accent }}>TEA BRO</p>
        <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "normal", color: c.ink, letterSpacing: "0.06em" }}>{tx({ru:'Панель',uk:'Панель',en:'Panel'})}</h2>
        <p style={{ margin: "6px 0 0", fontSize: "12px", color: c.inkSoft, fontStyle: "italic" }}>{t.spaceStats}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: c.inkSoft, fontStyle: "italic", fontSize: "14px" }}>{t.brewingNums}</p>
        </div>
      ) : stats?.error ? (
        <div style={{ ...card, textAlign: "center" }}>
          <p style={{ margin: "0 0 8px", color: "#A85A5A", fontSize: "14px" }}>{t.loadFail}</p>
          <p style={{ margin: 0, color: c.inkSoft, fontSize: "12px" }}>{t.checkApi}</p>
          <button onClick={() => loadStats(true)} style={{ ...S.backBtn, marginTop: "12px", padding: 0 }}>{t.tryAgain}</button>
        </div>
      ) : (
        <>
          {/* СЕГОДНЯ — крупные метрики */}
          <div style={card}>
            <p style={sectionTitle}>{tx({ru:'СЕГОДНЯ',uk:'СЬОГОДНІ',en:'TODAY'})}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={metricBig}>
                <p style={metricVal}>{stats.todayOpens}</p>
                <p style={metricLabel}>{tx({ru:'открытий',uk:'відкриттів',en:'opens'})}</p>
              </div>
              <div style={metricBig}>
                <p style={metricVal}>{stats.todayUnique}</p>
                <p style={metricLabel}>{t.unique}</p>
              </div>
              <div style={metricBig}>
                <p style={metricVal}>{stats.todayQuiz}</p>
                <p style={metricLabel}>{tx({ru:'опросник',uk:'опитувальник',en:'quiz'})}</p>
              </div>
            </div>
          </div>

          {/* АУДИТОРИЯ */}
          <div style={card}>
            <p style={sectionTitle}>{tx({ru:'АУДИТОРИЯ',uk:'АУДИТОРІЯ',en:'AUDIENCE'})}</p>
            <div style={rowStyle}>
              <span style={rowLabel}>{t.totalOpens}</span>
              <span style={rowValue}>{stats.totalOpens}</span>
            </div>
            <div style={rowStyle}>
              <span style={rowLabel}>{t.uniquePeople}</span>
              <span style={rowValue}>{stats.uniqueTotal}</span>
            </div>
            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <span style={rowLabel}>{t.viaTelegram}</span>
              <span style={rowValue}>
                {stats.usersWithChatId}
                {stats.uniqueTotal > 0 && (
                  <span style={{ color: c.inkSoft, fontSize: "11px", marginLeft: "6px" }}>
                    ({Math.round((stats.usersWithChatId / stats.uniqueTotal) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* ТЕСТЫ — строки, как «Топ эмоций» */}
          <div style={card}>
            <p style={sectionTitle}>{t.testsAndPractices}</p>
            {tests.map((test, i) => {
              const maxTest = Math.max(...tests.map(x => x.value || 0), 1);
              const pct = Math.round(((test.value || 0) / maxTest) * 100);
              return (
                <div key={test.label} style={{ marginBottom: i === tests.length - 1 ? 0 : "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: c.ink }}>{test.icon} {test.label}</span>
                    <span style={{ fontSize: "12px", color: c.accent }}>{test.value}</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "3px", background: isDark ? "#1E1B18" : "rgba(58,53,43,0.1)", overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: "3px",
                      background: c.accent,
                      opacity: 0.85 - i * 0.08,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ТОП ЭМОЦИЙ с полосками */}
          {stats.topEmotions?.length > 0 && (
            <div style={card}>
              <p style={sectionTitle}>{tx({ru:'ТОП ЭМОЦИЙ',uk:'ТОП ЕМОЦІЙ',en:'TOP EMOTIONS'})}</p>
              {stats.topEmotions.map((e, i) => {
                const pct = Math.round((e.count / stats.maxEmotion) * 100);
                return (
                  <div key={e.id} style={{ marginBottom: i === stats.topEmotions.length - 1 ? 0 : "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "13px", color: c.ink }}>
                        {e.emoji} {emotionLabel(e.id, lang) || e.label}
                      </span>
                      <span style={{ fontSize: "12px", color: c.accent }}>{e.count}</span>
                    </div>
                    <div style={{ height: "6px", borderRadius: "3px", background: isDark ? "#1E1B18" : "rgba(58,53,43,0.1)", overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`,
                        height: "100%",
                        borderRadius: "3px",
                        background: c.accent,
                        opacity: 0.85 - i * 0.12,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Самообман — среднее, если есть */}
          {stats.selfHonestyHist?.count > 0 && (
            <div style={card}>
              <p style={sectionTitle}>{t.selfDeceptDist}</p>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={metricBig}>
                  <p style={metricVal}>{stats.selfHonestyHist.count}</p>
                  <p style={metricLabel}>{t.results}</p>
                </div>
                <div style={metricBig}>
                  <p style={metricVal}>{stats.selfHonestyHist.average ?? "—"}</p>
                  <p style={metricLabel}>{t.avgScore}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "48px" }}>
                {(stats.selfHonestyHist.buckets || []).map((b, i) => {
                  const maxB = Math.max(1, ...stats.selfHonestyHist.buckets.map(x => x.count));
                  const h = Math.max(4, Math.round((b.count / maxB) * 48));
                  return (
                    <div key={b.range} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{
                        width: "100%",
                        height: h,
                        borderRadius: "3px 3px 0 0",
                        background: c.accent,
                        opacity: 0.35 + (b.count / maxB) * 0.55,
                      }} title={`${b.range}: ${b.count}`} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ fontSize: "9px", color: c.inkSoft }}>0</span>
                <span style={{ fontSize: "9px", color: c.inkSoft }}>50</span>
                <span style={{ fontSize: "9px", color: c.inkSoft }}>99</span>
              </div>
            </div>
          )}
        </>
      )}

      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ПОПАП АНОНИМНОСТИ
// ─────────────────────────────────────────────
function AnonPopup() {
  const { theme, t, tx } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop:"20px", position:"relative", display:"flex", justifyContent:"center" }}>
      <button onClick={() => setOpen(o => !o)} style={{ background:"none", border:"none", color:c.inkSoft, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", fontFamily:"'Georgia',serif" }}>
        <span style={{ width:"18px", height:"18px", border:"1px solid #3A3028", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px" }}>ℹ</span>
        <span style={{ fontSize:"12px", color:c.inkSoft, letterSpacing:"0.05em" }}>{t.anonymity}</span>
      </button>
      {open && (
        <div style={{ position:"absolute", bottom:"30px", left:"50%", transform:"translateX(-50%)", width:"240px", background:c.softBg, border:`1px solid ${c.cardBorder}`, borderRadius:"10px", padding:"14px", zIndex:100 }}>
          <p style={{ margin:"0 0 10px", fontSize:"11px", letterSpacing:"0.15em", color:c.accent }}>{t.aboutData}</p>
          <p style={{ margin:0, fontSize:"12px", color:c.inkSoft, lineHeight:1.8, fontStyle:"italic" }}>
            {tx({ru:"Твой путь — только твой.",uk:"Твій шлях — тільки твій.",en:"Your path is yours alone."})}<br />
            {tx({ru:"Твои данные хранятся только у тебя.",uk:"Твої дані зберігаються тільки в тебе.",en:"Your data is stored only on your device."})}<br />
            {tx({ru:"Никто кроме тебя их не видит.",uk:"Ніхто, крім тебе, їх не бачить.",en:"No one but you can see it."})}<br />
            {tx({ru:"Бот полностью анонимный.",uk:"Бот повністю анонімний.",en:"The bot is fully anonymous."})}
          </p>
          <button onClick={() => setOpen(false)} style={{ display:"block", marginTop:"10px", background:"none", border:"none", color:c.inkSoft, cursor:"pointer", fontSize:"11px", fontFamily:"'Georgia',serif" }}>{tx({ru:'закрыть',uk:'закрити',en:'close'})}</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: МОЙ ПУТЬ
// ─────────────────────────────────────────────
function MyPathScreen({ onBack }) {
  const { lang, t, tx, theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  const isDark = theme === "dark";
  const [loaded, setLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [quizHist, setQuizHist] = useState([]);
  const [selfHonestyHist, setSelfHonestyHist] = useState([]);
  const [teaHist, setTeaHist] = useState([]);
  const [medHist, setMedHist] = useState([]);
  const [hormoneHist, setHormoneHist] = useState([]);
  const [dailyCheckHist, setDailyCheckHist] = useState([]);
  const [moodCounts, setMoodCounts] = useState(null);
  const [moodTotal, setMoodTotal] = useState(0);

  useEffect(() => {
    async function load() {
      const s = await CS.get("streak");
      setStreak(parseInt(s || "0"));

      setQuizHist(await getHistory("quiz_history"));
      setSelfHonestyHist(await getHistory("selfhonesty_history"));
      setHormoneHist(await getHistory("hormones_history"));
      setTeaHist(await getHistory("tea_history"));
      setMedHist(await getHistory("meditation_history"));
      setDailyCheckHist(await getHistory("dailycheck_history"));

      // настроение за последние 90 дней — один батч-запрос вместо 90
      // последовательных CS.get() (см. CS.getMultiple выше)
      const counts = {};
      EMOTIONS.forEach(e => { counts[e.id] = 0; });
      let total = 0;
      const moodKeys90 = [];
      for (let i = 0; i < 90; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        moodKeys90.push("mood_" + getDateKey(d));
      }
      const moodValues90 = await CS.getMultiple(moodKeys90);
      moodKeys90.forEach(k => {
        const r = moodValues90[k];
        if (r) {
          const e = JSON.parse(r);
          if (counts[e.id] !== undefined) { counts[e.id]++; total++; }
        }
      });
      setMoodCounts(counts);
      setMoodTotal(total);
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) {
    return (
      <div style={S.screen}>
        <button onClick={onBack} style={S.backBtn}>{t.back}</button>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <p style={{ color:c.inkSoft, fontStyle:"italic" }}>{t.collectingPath}</p>
        </div>
      </div>
    );
  }

  const title = getCurrentTitle(streak);
  const nextTitle = TITLES.find(t => t.days > streak);

  // ── ТОЧКА СБОРКИ / ВЫГОРАНИЕ — среднее по последним 3 ──
  const quizAvg = calcQuizAverage(quizHist, 3);
  const hasQuiz = quizAvg !== null;
  const assemblyPct = hasQuiz ? Math.round(quizAvg.avgScore) : 0;
  const burnoutPct = hasQuiz ? Math.round(quizAvg.avgBurnout) : 0;
  // QUIZ_RESULTS и BURNOUT_LEVELS заданы в диапазонах 0–75 (сырые баллы),
  // а assemblyPct/burnoutPct — это % (0–100). Переводим % обратно в шкалу 0–75 для поиска.
  const assemblyRaw = Math.round((assemblyPct / 100) * 75);
  const burnoutRaw = Math.round((burnoutPct / 100) * 75);
  const assemblyResult = QUIZ_RESULTS.find(r => assemblyRaw >= r.range[0] && assemblyRaw <= r.range[1]) || QUIZ_RESULTS[0];
  const burnoutLevel = BURNOUT_LEVELS.find(b => burnoutRaw >= b.range[0] && burnoutRaw <= b.range[1]) || BURNOUT_LEVELS[0];
  const assemblyScaleLabels = [tx({ru:"ДАЛЕКО",uk:"ДАЛЕКО",en:"FAR"}), tx({ru:"НА ПОЛПУТИ",uk:"НА ПІВДОРОЗІ",en:"HALFWAY"}), tx({ru:"ПОЧТИ",uk:"МАЙЖЕ",en:"ALMOST"}), tx({ru:"ЗДЕСЬ",uk:"ТУТ",en:"HERE"})];
  const assemblyHiIndex = assemblyPct <= 25 ? 0 : assemblyPct <= 50 ? 1 : assemblyPct <= 75 ? 2 : 3;

  // ── СКЛОННОСТЬ К САМООБМАНУ — среднее по последним 3 ──
  const shLast = selfHonestyHist.slice(-3);
  const hasSelfHonesty = shLast.length > 0;
  const selfHonestyPct = hasSelfHonesty ? Math.round(shLast.reduce((s,h) => s + (h.score||0), 0) / shLast.length) : 0;
  const selfHonestyResult = SELF_HONESTY_RESULTS.find(r => selfHonestyPct >= r.range[0] && selfHonestyPct <= r.range[1]) || SELF_HONESTY_RESULTS[0];
  const shScaleLabels = [tx({ru:"ЧЕСТНО",uk:"ЧЕСНО",en:"HONEST"}), tx({ru:"ЕСТЬ ПЯТНА",uk:"Є ПЛЯМИ",en:"SPOTS"}), tx({ru:"ПРИУКРАШЕНО",uk:"ПРИКРАШЕНО",en:"POLISHED"}), tx({ru:"СИЛЬНО",uk:"СИЛЬНО",en:"STRONG"})];
  const shHiIndex = selfHonestyPct <= 25 ? 0 : selfHonestyPct <= 50 ? 1 : selfHonestyPct <= 75 ? 2 : 3;

  // ── ГОРМОНАЛЬНЫЙ КОД — среднее по последним 3 прохождениям (с учётом доп. вопросов) ──
  const hormoneLast3 = hormoneHist.slice(-3);
  const hasHormone = hormoneLast3.length > 0;
  const hormoneAvgByKey = {};
  let hormonePct = 0;
  if (hasHormone) {
    const avgMain = {};
    const avgCross = {};
    HORMONE_QUESTIONS.forEach(({ key }) => {
      const vals = hormoneLast3.map(h => (h.main ? h.main[key] : h.scores?.[key])).filter(v => v !== undefined && v !== null);
      if (vals.length) avgMain[key] = vals.reduce((s, v) => s + v, 0) / vals.length;
    });
    Object.keys(HORMONE_CROSS_AFFECTS).forEach(key => {
      const vals = hormoneLast3.map(h => h.cross?.[key]).filter(v => v !== undefined && v !== null);
      if (vals.length) avgCross[key] = vals.reduce((s, v) => s + v, 0) / vals.length;
    });
    const finalAvg = Object.keys(avgMain).length ? computeHormoneScores(avgMain, avgCross) : {};
    Object.assign(hormoneAvgByKey, finalAvg);
    const pctList = Object.values(finalAvg).map(v => (v - 1) / 4 * 100);
    hormonePct = pctList.length ? Math.round(pctList.reduce((s, v) => s + v, 0) / pctList.length) : 0;
  }
  let hormoneWeakest = null;
  if (hasHormone && Object.keys(hormoneAvgByKey).length) {
    const entries = Object.entries(hormoneAvgByKey);
    const min = entries.reduce((m, e) => (e[1] < m[1] ? e : m), entries[0]);
    hormoneWeakest = HORMONE_META[min[0]];
  }
  const hormoneScaleLabels = [tx({ru:"ПРОСЕЛО",uk:"ПРОСІЛО",en:"LOW"}), tx({ru:"СРЕДНЕ",uk:"СЕРЕДНЬО",en:"MID"}), tx({ru:"СТАБИЛЬНО",uk:"СТАБІЛЬНО",en:"STABLE"}), tx({ru:"В РЕСУРСЕ",uk:"В РЕСУРСІ",en:"RESOURCE"})];
  const hormoneHiIndex = hormonePct <= 25 ? 0 : hormonePct <= 50 ? 1 : hormonePct <= 75 ? 2 : 3;

  // ── КОМПАС СОСТОЯНИЯ — последняя запись + паттерны по накопленной истории ──
  const hasDailyCheck = dailyCheckHist.length > 0;
  const dcLast = hasDailyCheck ? dailyCheckHist[dailyCheckHist.length - 1] : null;
  const dcPctOf = (h) => {
    if (typeof h.pct === "number") return h.pct;
    if (!h.indicators) return null;
    const vals = Object.values(h.indicators);
    if (!vals.length) return null;
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    return Math.round(((avg - 1) / 4) * 100);
  };
  const dcLast3 = dailyCheckHist.slice(-3);
  const dcPcts = dcLast3.map(dcPctOf).filter(v => v != null);
  const dcAvgPct = dcPcts.length ? Math.round(dcPcts.reduce((s, v) => s + v, 0) / dcPcts.length) : null;
  const dcWeakestKey = dcLast ? (dcLast.weakestKey || (dcLast.indicators ? Object.entries(dcLast.indicators).sort((a, b) => a[1] - b[1])[0][0] : null)) : null;
  const dcWeakestQ = dcWeakestKey ? DAILYCHECK_QUESTIONS.find(q => q.key === dcWeakestKey) : null;
  const dcScaleLabels = [tx({ru:"ТЯЖЕЛО",uk:"ВАЖКО",en:"HEAVY"}), tx({ru:"СРЕДНЕ",uk:"СЕРЕДНЬО",en:"MID"}), tx({ru:"РОВНО",uk:"РІВНО",en:"STEADY"}), tx({ru:"НА ПОДЪЁМЕ",uk:"НА ПІДЙОМІ",en:"ON THE RISE"})];
  const dcHiIndex = dcAvgPct == null ? 0 : dcAvgPct <= 25 ? 0 : dcAvgPct <= 50 ? 1 : dcAvgPct <= 75 ? 2 : 3;
  const dcEnoughForPatterns = dailyCheckHist.length >= 1;
  const dcEnoughForTopActions = dailyCheckHist.length >= 5; // топ-действия нужны хотя бы с несколькими повторами, иначе список из 1 пункта бессмысленный
  let dcTopActions = [];
  let dcAllTimePct = null;
  let dcAllTimeWeakestQ = null;
  let dcAllTimeBreakdown = [];
  if (dcEnoughForPatterns) {
    const byAction = {};
    const sums = {}; const counts = {};
    dailyCheckHist.forEach(h => {
      if (!h.action_id || !h.followUp || h.followUp.delta !== 1) return;
      byAction[h.action_id] = (byAction[h.action_id] || 0) + 1;
    });
    dailyCheckHist.forEach(h => {
      if (!h.indicators) return;
      Object.entries(h.indicators).forEach(([k, v]) => { sums[k] = (sums[k] || 0) + v; counts[k] = (counts[k] || 0) + 1; });
    });
    const avgs = Object.keys(sums).map(k => [k, sums[k] / counts[k]]);
    if (avgs.length) {
      const overallAvg = avgs.reduce((s, e) => s + e[1], 0) / avgs.length;
      dcAllTimePct = Math.round(((overallAvg - 1) / 4) * 100);
      const weakest = avgs.reduce((min, e) => (e[1] < min[1] ? e : min), avgs[0])[0];
      dcAllTimeWeakestQ = DAILYCHECK_QUESTIONS.find(q => q.key === weakest);
      dcAllTimeBreakdown = DAILYCHECK_QUESTIONS.map(q => {
        if (sums[q.key] == null) return null;
        const avg = sums[q.key] / counts[q.key];
        return { key: q.key, q, avgScore: avg, pct: Math.round(((avg - 1) / 4) * 100) };
      }).filter(Boolean);
    }
    dcTopActions = Object.entries(byAction).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id, count]) => {
      const found = Object.values(DAILYCHECK_ACTIONS).flat().find(a => a.id === id);
      return { id, count, text: found ? found.text : null };
    }).filter(a => a.text);
  }

  // ── ЧАЙ — распределение по истории ──
  const teaDist = calcDistribution(teaHist, "winner");
  const hasTea = teaDist.length > 0;
  const topTea = hasTea ? teaDist[0] : null;
  const topTeaInfo = topTea ? TEA_RESULTS[topTea.key] : null;
  const otherTeas = teaDist.slice(1, 4).map(d => ({
    emoji: "✦",
    name: tx(TEA_RESULTS[d.key]?.name) || d.key,
    pct: `${d.pct}%`,
  }));

  // ── ПРАКТИКА — распределение по истории ──
  const medDist = calcDistribution(medHist, "winner");
  const hasMed = medDist.length > 0;
  const topMed = hasMed ? medDist[0] : null;
  const topMedInfo = topMed ? MEDITATION_RESULTS[topMed.key] : null;
  const otherMeds = medDist.slice(1, 4).map(d => ({
    emoji: MEDITATION_RESULTS[d.key]?.emoji || "✦",
    name: tx(MEDITATION_RESULTS[d.key]?.name) || d.key,
    pct: `${d.pct}%`,
  }));

  // ── КУДА ДВИЖЕШЬСЯ — доминирующая эмоция ──
  const hasMood = moodTotal > 0;
  let moodSorted = [];
  let topMood = null;
  let moodPct = 0;
  let moodHiIndex = 1;
  let moodVerdict = "";
  if (hasMood) {
    moodSorted = Object.entries(moodCounts).sort((a,b) => b[1]-a[1]).filter(([,c]) => c > 0);
    const [topId, topCount] = moodSorted[0];
    topMood = EMOTIONS.find(e => e.id === topId);
    moodPct = Math.round((topCount/moodTotal)*100);
    const lightHiIds = ["joy","drive","excitement","inspired","inspiration"];
    const lightLoIds = ["calm","grateful","pride","love"];
    const isLight = lightHiIds.includes(topId) || lightLoIds.includes(topId);
    moodHiIndex = lightHiIds.includes(topId) ? 3 : (lightLoIds.includes(topId) ? 2 : 0);
    if (isLight) {
      moodVerdict = "Становишься мягче к себе. Светлые состояния — твой фон последнее время.";
    } else {
      moodVerdict = "Сейчас непросто — тяжёлые состояния чаще светлых. Будь к себе бережнее.";
    }
  }
  const moodScaleLabels = [tx({ru:"ТЯЖЕЛО",uk:"ВАЖКО",en:"HEAVY"}), tx({ru:"НЕЙТРАЛЬНО",uk:"НЕЙТРАЛЬНО",en:"NEUTRAL"}), tx({ru:"ПОКОЙ",uk:"СПОКІЙ",en:"CALM"}), tx({ru:"СВЕТЛО",uk:"СВІТЛО",en:"LIGHT"})];
  const otherMoods = moodSorted.slice(1, 4).map(([id, count]) => {
    const em = EMOTIONS.find(e => e.id === id);
    return { emoji: em?.emoji || "•", name: em?.label || id, pct: `${Math.round((count/moodTotal)*100)}%` };
  });

  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>{t.back}</button>
      <p style={{ fontSize:"10px", letterSpacing:"0.28em", color:c.inkSoft, margin:"4px 0 28px" }}>{t.mypathTitle}</p>

      {/* ГЕРОЙ */}
      <div style={{ textAlign:"center", marginBottom:"24px" }}>
        <div style={{ fontSize:"52px", marginBottom:"12px" }}>{title.emoji}</div>
        <p style={{ margin:"0 0 4px", fontSize:"24px", color:c.accent, letterSpacing:"0.06em" }}>{tx(title.name)}</p>
        <p style={{ margin:"0 0 6px", fontSize:"12px", color:c.inkSoft, letterSpacing:"0.14em" }}>
          {streak} {streak===1?"день":streak<5?"дня":"дней"} практики
        </p>
        {nextTitle && <p style={{ margin:0, fontSize:"11px", color:c.inkSoft, fontStyle:"italic" }}>до «{tx(nextTitle.name)}» — {nextTitle.days - streak} {nextTitle.days-streak===1?"день":"дней"}</p>}
      </div>
      <div style={{ width:"36px", height:"1px", background:c.line, margin:"0 auto 8px" }} />

      {/* ТОЧКА СБОРКИ */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{t.assemblyPoint}</p>
        <InfoButton text={tx({ ru: "«Насколько ты близко к себе настоящему. К внутреннему равновесию, где тихо и ясно.»", uk: "«Наскільки ти близько до себе справжнього. До внутрішньої рівноваги, де тихо і ясно.»", en: "«How close you are to your real self. To inner balance, where it is quiet and clear.»" })} />
      </div>
      {hasQuiz ? (
        <MetricBlock
          value={assemblyPct}
          rightName={tx(assemblyResult.title)}
          rightSub={tx(assemblyResult.subtitle)}
          fillFrom="#4A3020"
          fillTo="#C8A97E"
          scaleLabels={assemblyScaleLabels}
          hiIndex={assemblyHiIndex}
          quote={`«${tx(assemblyResult.text)}»`}
          animKey={`assembly-${assemblyPct}`}
        />
      ) : (
        <EmptyMetric text={t.emptyQuiz} />
      )}

      {/* ВЫГОРАНИЕ */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{t.burnoutLevel}</p>
        <InfoButton text={tx({ ru: "«Сколько внутреннего ресурса осталось. Считается по твоим ответам — чем ниже, тем лучше.»", uk: "«Скільки внутрішнього ресурсу залишилось. Рахується за твоїми відповідями — чим нижче, тим краще.»", en: "«How much inner resource is left. Based on your answers — the lower, the better.»" })} />
      </div>
      {hasQuiz ? (
        <BurnoutThermo
          value={burnoutPct}
          rightName={tx(burnoutLevel.label)}
          rightSub={tx({ ru: "среднее по последним прохождениям", uk: "середнє за останніми проходженнями", en: "average of recent runs" })}
          quote={`«${tx(burnoutLevel.text)}»`}
          animKey={`burnout-${burnoutPct}`}
        />
      ) : (
        <EmptyMetric text={tx({ ru: "Опросник покажет и уровень выгорания.", uk: "Опитувальник покаже і рівень вигорання.", en: "The quiz will also show burnout level." })} />
      )}

      {/* СКЛОННОСТЬ К САМООБМАНУ */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{t.selfDeception}</p>
        <InfoButton text={tx({ ru: "«Насколько ты склонен(на) видеть себя лучше, чем есть на самом деле — неосознанно, не ради других, а для себя.»", uk: "«Наскільки ти схильний(а) бачити себе краще, ніж є насправді — несвідомо, не заради інших, а для себе.»", en: "«How inclined you are to see yourself better than you are — unconsciously, not for others, but for yourself.»" })} />
      </div>
      {hasSelfHonesty ? (
        <MetricBlock
          value={selfHonestyPct}
          rightName={tx(selfHonestyResult.title)}
          rightSub={tx(selfHonestyResult.subtitle)}
          fillFrom="#4A3020"
          fillTo="#C8A97E"
          scaleLabels={shScaleLabels}
          hiIndex={shHiIndex}
          quote={`«${tx(selfHonestyResult.text)}»`}
          animKey={`selfhonesty-${selfHonestyPct}`}
        />
      ) : (
        <EmptyMetric text={tx({ ru: "Пройди тест «Склонность к самообману» — и здесь появится результат.", uk: "Пройди тест «Схильність до самообману» — і тут з'явиться результат.", en: "Take the self-deception test — and the result will appear here." })} />
      )}

      {/* ГОРМОНАЛЬНЫЙ КОД */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{t.hormoneCode}</p>
        <InfoButton text={tx({ ru: "«Средний результат по семи системам за последние прохождения теста. Слабое звено — система, которая просела сильнее остальных.»", uk: "«Середній результат по семи системах за останні проходження тесту. Слабка ланка — система, яка просіла найсильніше.»", en: "«Average of the seven systems over recent runs. Weakest link — the system that dipped most.»" })} />
      </div>
      {hasHormone ? (
        <>
          <MetricBlock
            value={hormonePct}
            rightName={hormoneWeakest ? `${tx({ru:"Слабое звено",uk:"Слабка ланка",en:"Weak link"})}: ${tx(hormoneWeakest.name)}` : t.hormoneCode}
            rightSub={`среднее по ${hormoneLast3.length === 1 ? "последнему прохождению" : `последним ${hormoneLast3.length} прохождениям`}`}
            fillFrom="#241D14"
            fillTo={hormoneWeakest ? hormoneWeakest.color : "#C8A97E"}
            dotColor={hormoneWeakest ? hormoneWeakest.color : "#C8A97E"}
            numColor={hormoneWeakest ? hormoneWeakest.color : "#C8A97E"}
            scaleLabels={hormoneScaleLabels}
            hiIndex={hormoneHiIndex}
            animKey={`hormone-${hormonePct}`}
          />
          <div style={{ ...S.metricBlock, marginTop:"-6px", paddingTop:"16px" }}>
            <p style={{ margin:"0 0 14px", fontSize:"10px", letterSpacing:"0.15em", color:c.inkSoft }}>{t.allSeven}</p>
            {HORMONE_QUESTIONS.map(({ key }) => {
              const avgScore = hormoneAvgByKey[key];
              if (avgScore === undefined) return null;
              const meta = HORMONE_META[key];
              const pct = Math.round((avgScore - 1) / 4 * 100);
              return (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                  <span style={{ fontSize:"12px", color:c.inkMuted, width:"98px", flexShrink:0 }}>{tx(meta.name)}</span>
                  <div style={{ flex:1, height:"4px", background:c.trackBg, borderRadius:"2px", overflow:"hidden" }}>
                    <div style={{ width:`${pct}%`, height:"100%", background:meta.color, borderRadius:"2px" }} />
                  </div>
                  <span style={{ fontSize:"12px", color:meta.color, width:"36px", textAlign:"right", flexShrink:0 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyMetric text={tx({ ru: "Пройди тест «Гормональный код» — и здесь появится разбор по семи системам.", uk: "Пройди тест «Гормональний код» — і тут з'явиться розбір по семи системах.", en: "Take the Hormonal code test — and a seven-system breakdown will appear here." })} />
      )}

      {/* КОМПАС СОСТОЯНИЯ */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{tx({ru:"КОМПАС СОСТОЯНИЯ",uk:"КОМПАС СТАНУ",en:"STATE COMPASS"})}</p>
        <InfoButton text={tx({ ru: "«Что показал последний чек-ин и какие действия чаще всего реально помогают именно тебе.»", uk: "«Що показав останній чек-ін і які дії найчастіше реально допомагають саме тобі.»", en: "«What your last check-in showed and which actions actually tend to help you.»" })} />
      </div>
      {hasDailyCheck ? (
        <>
          <div style={{ width: "100%" }}>
            <MetricBlock
              value={dcAvgPct}
              rightName={dcWeakestQ ? `${tx({ru:"Слабее всего",uk:"Найслабше",en:"Weakest"})}: ${tx(dcWeakestQ.label)}` : tx({ru:"Компас состояния",uk:"Компас стану",en:"State compass"})}
              rightSub={`${tx({ ru: "среднее по", uk: "середнє за", en: "average of" })} ${dcLast3.length} ${tx({ ru: dcLast3.length === 1 ? "отметке" : "отметкам", uk: dcLast3.length === 1 ? "відмітці" : "відміткам", en: dcLast3.length === 1 ? "check-in" : "check-ins" })}`}
              fillFrom="#241D14"
              fillTo="#C8A97E"
              scaleLabels={dcScaleLabels}
              hiIndex={dcHiIndex}
              quote={`«${tx(DAILYCHECK_GROUP_LABEL[dcLast.group] || {})}»`}
              animKey={`dailycheck-${dcAvgPct}`}
            />
          </div>
          <div style={{ ...S.metricBlock, width: "100%", marginTop: "16px", paddingTop: "16px", boxSizing: "border-box" }}>
            {dcEnoughForPatterns ? (
              <>
                {dcAllTimePct != null && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px", paddingBottom: "12px", borderBottom: `1px solid ${c.line}` }}>
                    <span style={{ fontSize: "13px", color: c.inkMuted }}>
                      {tx({ ru: `За всё время (${dailyCheckHist.length} тестов)`, uk: `За весь час (${dailyCheckHist.length} тестів)`, en: `All time (${dailyCheckHist.length} check-ins)` })}
                    </span>
                    <span style={{ fontSize: "13px", color: c.accent, fontWeight: 600 }}>
                      {dcAllTimePct}% {dcAllTimeWeakestQ ? `· ${tx({ru:"слабее всего",uk:"найслабше",en:"weakest"})}: ${tx(dcAllTimeWeakestQ.label)}` : ""}
                    </span>
                  </div>
                )}
                {dcAllTimeBreakdown.length > 0 && (
                  <div style={{ marginBottom: dcTopActions.length > 0 ? "16px" : "0" }}>
                    <p style={{ margin: "0 0 12px", fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft }}>
                      {tx({ ru: "ПОКАЗАТЕЛИ ЗА ВСЁ ВРЕМЯ", uk: "ПОКАЗНИКИ ЗА ВЕСЬ ЧАС", en: "INDICATORS OVER TIME" })}
                    </p>
                    {dcAllTimeBreakdown.map(item => (
                      <IndicatorBarRow key={item.key} q={item.q} pct={item.pct} avgScore={item.avgScore} />
                    ))}
                  </div>
                )}
                {dcTopActions.length > 0 && dcEnoughForTopActions && (
                  <>
                    <p style={{ margin: "0 0 10px", fontSize: "10px", letterSpacing: "0.15em", color: c.inkSoft }}>
                      {tx({ ru: "ЧТО ЧАЩЕ ВСЕГО ПОМОГАЕТ", uk: "ЩО НАЙЧАСТІШЕ ДОПОМАГАЄ", en: "WHAT HELPS MOST OFTEN" })}
                    </p>
                    {dcTopActions.map((a, i) => (
                      <div key={a.id} style={{ display: "flex", gap: "10px", marginBottom: i < dcTopActions.length - 1 ? "10px" : "0" }}>
                        <span style={{ fontSize: "11px", color: c.accent, flexShrink: 0, marginTop: "2px" }}>{i + 1}.</span>
                        <p style={{ margin: 0, fontSize: "13px", color: c.inkMuted, lineHeight: 1.6 }}>{tx(a.text)}</p>
                      </div>
                    ))}
                  </>
                )}
                {!dcEnoughForTopActions && (
                  <p style={{ margin: "10px 0 0", fontSize: "12px", color: c.inkSoft, fontStyle: "italic" }}>
                    {tx({ ru: `Что помогает чаще всего — появится через несколько отметок (сейчас ${dailyCheckHist.length}). Каждый тест уже уточняет цифры выше.`, uk: `Що допомагає найчастіше — з'явиться через кілька відміток (зараз ${dailyCheckHist.length}). Кожен тест вже уточнює цифри вище.`, en: `What helps most often will show up after a few more check-ins (currently ${dailyCheckHist.length}). Every test already refines the numbers above.` })}
                  </p>
                )}
              </>
            ) : (
              <EmptyMetric text={tx({ ru: "Пройди «Компас состояния» — и здесь появится твой результат.", uk: "Пройди «Компас стану» — і тут з'явиться твій результат.", en: "Take the State compass — and your result will appear here." })} />
            )}
          </div>
        </>
      ) : (
        <EmptyMetric text={tx({ ru: "Пройди «Компас состояния» — и здесь появится твой последний результат.", uk: "Пройди «Компас стану» — і тут з'явиться твій останній результат.", en: "Take the State compass — and your latest result will appear here." })} />
      )}

      {/* ЛЮБИМЫЙ ЧАЙ */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{t.favoriteTea}</p>
        <InfoButton text={tx({ ru: "«Какой чай выбирался тебе чаще всего по результатам теста. Отражает твоё преобладающее состояние.»", uk: "«Який чай обирався тобі найчастіше за результатами тесту. Відображає твій переважаючий стан.»", en: "«Which tea was chosen for you most often by the test. Reflects your prevailing state.»" })} />
      </div>
      {hasTea ? (
        <MetricBlock
          value={topTea.pct}
          rightName={`✦ ${tx(topTeaInfo.name)}`}
          rightSub={`${tx(topTeaInfo.tag)} · ${topTea.count} ${tx({ru:"раз",uk:"разів",en:"times"})}`}
          fillFrom="#3A2E20"
          fillTo="#A89880"
          scaleLabels={["0%", "25%", "50%", "75%+"]}
          hiIndex={topTea.pct <= 25 ? 0 : topTea.pct <= 50 ? 1 : topTea.pct <= 75 ? 2 : 3}
          others={otherTeas}
          animKey={`tea-${topTea.key}`}
        />
      ) : (
        <EmptyMetric text={t.emptyTea} />
      )}

      {/* ЛЮБИМАЯ ПРАКТИКА */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{t.favoritePractice}</p>
        <InfoButton text={tx({ ru: "«Какая медитация или дыхательная практика подходила тебе чаще всего. Твой личный инструмент возвращения к себе.»", uk: "«Яка медитація або дихальна практика підходила тобі найчастіше. Твій особистий інструмент повернення.»", en: "«Which meditation or breath practice suited you most often. Your personal tool for returning.»" })} />
      </div>
      {hasMed ? (
        <MetricBlock
          value={topMed.pct}
          rightName={`${topMedInfo.emoji} ${tx(topMedInfo.name)}`}
          rightSub={`${tx(topMedInfo.tag)} · ${topMed.count} ${tx({ru:"раз",uk:"разів",en:"times"})}`}
          fillFrom="#1A2A30"
          fillTo="#7B9EB0"
          dotColor="#7B9EB0"
          numColor="#7B9EB0"
          borderColor="rgba(123,158,176,0.25)"
          scaleLabels={["0%", "25%", "50%+", "75%"]}
          hiIndex={topMed.pct <= 25 ? 0 : topMed.pct <= 50 ? 1 : topMed.pct <= 75 ? 2 : 3}
          others={otherMeds}
          animKey={`med-${topMed.key}`}
        />
      ) : (
        <EmptyMetric text={tx({ ru: "Пройди тест медитаций — и здесь появится твоя практика.", uk: "Пройди тест медитацій — і тут з'явиться твоя практика.", en: "Take the meditation test — and your practice will appear here." })} />
      )}

      {/* ПРОГРЕСС */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{tx({ru:'ПРОГРЕСС',uk:'ПРОГРЕС',en:'PROGRESS'})}</p>
        <InfoButton text={tx({ ru: "«Сколько всего ты сделал(а) в Tea Bro. Каждое прохождение — шаг к себе.»", uk: "«Скільки всього ти зробив(ла) у Tea Bro. Кожне проходження — крок до себе.»", en: "«How much you have done in Tea Bro overall. Each run is a step toward yourself.»" })} />
      </div>
      <div style={{ width: "100%" }}>
        {[
          { pct: hasQuiz ? assemblyPct : null, label: t.assemblyStat, caption: { ru: "Насколько ты сейчас близко к себе — по последнему «Честному разговору с собой».", uk: "Наскільки ти зараз близько до себе — за останнім «Чесною розмовою з собою».", en: "How close you are to yourself right now — from your last 'Honest talk with yourself'." } },
          { pct: hasQuiz ? burnoutPct : null, label: t.burnoutStat, caption: { ru: "Накопленная усталость и опустошение — из того же теста.", uk: "Накопичена втома і спустошення — з того самого тесту.", en: "Accumulated fatigue and depletion — from the same test." } },
          { pct: hasSelfHonesty ? selfHonestyPct : null, label: t.selfDeceptStat, caption: { ru: "Насколько легко ты обманываешь сам(а) себя, а не видишь, как есть.", uk: "Наскільки легко ти обманюєш сам(а) себе, а не бачиш, як є.", en: "How easily you deceive yourself instead of seeing things as they are." } },
          { pct: hasTea ? topTea.pct : null, label: t.favTeaStat, caption: { ru: "Какой чай выбираешь чаще всего — и насколько сильно он перевешивает остальные.", uk: "Який чай обираєш найчастіше — і наскільки сильно він переважує решту.", en: "Which tea you pick most often — and how far ahead it is of the rest." } },
          { pct: hasMed ? topMed.pct : null, label: t.favPractStat, caption: { ru: "Какая медитативная практика откликается тебе больше других.", uk: "Яка медитативна практика відгукується тобі більше за інші.", en: "Which meditation practice resonates with you the most." } },
          { pct: hasMood ? moodPct : null, label: t.dominantMood, sub: "90 " + tx({ ru: "дней", uk: "днів", en: "days" }), caption: { ru: "Какое состояние преобладало за последние 90 отметок настроения.", uk: "Який стан переважав за останні 90 відміток настрою.", en: "Which state predominated over your last 90 mood check-ins." } },
        ].map((row, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: c.inkMuted }}>{row.label}{row.sub ? ` · ${row.sub}` : ""}</span>
              <span style={{ fontSize: "12px", color: c.accent, fontWeight: 600 }}>{row.pct != null ? `${row.pct}%` : "—"}</span>
            </div>
            <div style={{ ...S.metricTrack, background: "rgba(128,110,90,0.28)", border: `1px solid ${c.line}`, boxSizing: "border-box" }}>
              <div style={{ ...S.metricFill, width: `${row.pct || 0}%`, background: "linear-gradient(90deg, #241D14, #C8A97E)" }}>
                {row.pct != null && <span style={{ ...S.metricFillDot, background: "#C8A97E" }} />}
              </div>
            </div>
            {row.caption && <p style={{ margin: "6px 0 0", fontSize: "11px", color: c.inkSoft, fontStyle: "italic", lineHeight: 1.5 }}>{tx(row.caption)}</p>}
          </div>
        ))}
      </div>

      {/* КУДА ДВИЖЕШЬСЯ */}
      <div style={S.sectionHead}>
        <p style={S.sectionTitle}>{t.whereYouGo90}</p>
        <InfoButton text={tx({ ru: "«Анализ твоего настроения за последние 90 дней. Какое состояние преобладает — и куда смещается твой внутренний баланс.»", uk: "«Аналіз твого настрою за останні 90 днів. Який стан переважає — і куди зміщується твій внутрішній світ.»", en: "«Analysis of your mood over the last 90 days. Which state predominates — and where your inner world is shifting.»" })} />
      </div>
      {hasMood ? (
        <MetricBlock
          value={moodPct}
          rightName={`${topMood.emoji} ${topMood.label}`}
          rightSub={t.dominantState}
          fillFrom="#1A2A1A"
          fillTo="#5A8A5A"
          dotColor="#7A9E7E"
          numColor="#C8A97E"
          scaleLabels={moodScaleLabels}
          hiIndex={moodHiIndex}
          quote={`«${moodVerdict}»`}
          others={otherMoods}
          animKey={`mood-${topMood.id}`}
        />
      ) : (
        <EmptyMetric text={t.emptyMood} />
      )}

      {/* ВОПРОС ДНЯ */}
      <div style={{ border:`1px dashed ${c.cardBorder}`, borderRadius:"10px", padding:"14px 16px", marginTop:"28px" }}>
        <p style={{ margin:"0 0 8px", fontSize:"10px", letterSpacing:"0.2em", color:c.inkSoft }}>{t.dayQuestion}</p>
        <p style={{ margin:0, fontSize:"14px", color:c.inkSoft, fontStyle:"italic", lineHeight:1.8 }}>{tx({ ru: "«Что сейчас больше всего забирает твою тишину?»", uk: "«Що зараз найбільше забирає твою тишу?»", en: "«What is taking your quiet the most right now?»" })}</p>
      </div>
      <button onClick={onBack} style={S.backBtnBottom}>{t.back}</button>
    </div>
  );
}

function EmptyMetric({ text }) {
  const { theme } = useLang();
  const c = THEMES[theme] || THEMES.dark;
  return (
    <div style={{ ...S.metricBlock, textAlign:"center", padding:"24px 16px" }}>
      <p style={{ margin:0, fontSize:"13px", color:c.inkSoft, fontStyle:"italic", lineHeight:1.7 }}>{text}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// ГЛАВНЫЙ ЭКРАН
// ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentMood, setCurrentMood] = useState("general");
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("teabro-theme") || "dark"; } catch { return "dark"; } });
  const [lang, setLang] = useState(() => { try { const saved = localStorage.getItem("teabro-lang"); return (saved === "ru" || saved === "uk") ? saved : "ru"; } catch { return "ru"; } });
  S = buildStyles(theme);
  useEffect(() => { try { localStorage.setItem("teabro-theme", theme); } catch {} }, [theme]);
  useEffect(() => { try { localStorage.setItem("teabro-lang", lang); } catch {} }, [lang]);
  const t = UI[lang] || UI.ru;
  const styles = S;

  useEffect(() => {
    // Скрипт telegram-web-app.js грузится асинхронно — ждём его появления
    // (до 1.5с), иначе на медленном интернете код успевает решить, что это
    // не Telegram, и уходит в браузерный fallback (b_...), хотя человек
    // реально открыл бота.
    function waitForTelegram(maxWaitMs = 1500, stepMs = 50) {
      return new Promise(resolve => {
        const start = Date.now();
        (function check() {
          if (window.Telegram?.WebApp?.initDataUnsafe?.user) return resolve(true);
          if (Date.now() - start >= maxWaitMs) return resolve(false);
          setTimeout(check, stepMs);
        })();
      });
    }

    async function loadMood() {
      // Сначала пробуем взять uid синхронно из URL — не зависит от скорости
      // загрузки telegram-web-app.js (см. parseTelegramUserFromHash выше)
      let uid = parseTelegramUserFromHash();
      await waitForTelegram();
      if (window.Telegram?.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

      // ── uid + chat_id ──
      if (!uid) {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        uid = tgUser?.id ? String(tgUser.id) : null;
      }
      const chatId = uid; // в TG Mini App user.id === chat_id
      if (!uid) {
        try {
          let stored = localStorage.getItem("teabro_uid");
          if (!stored) { stored = "b_" + Math.random().toString(36).slice(2, 10); localStorage.setItem("teabro_uid", stored); }
          uid = stored;
        } catch {}
      }

      // Событие открытия с chat_id
      const openUrl = chatId
        ? `${STATS_URL}?action=open&uid=${encodeURIComponent(uid)}&chatId=${encodeURIComponent(chatId)}`
        : `${STATS_URL}?action=open&uid=${encodeURIComponent(uid)}`;
      loadQueuedFetch(openUrl);

      // ── Snapshot для пушей (фоново, не блокирует UI) ──
      (async () => {
        try {
          const EMOTION_EMOJIS = { joy:"😊", calm:"😌", inspired:"💪", unclear:"🤔", anxiety:"😟", angry:"😡", tired:"😴" };
          // Burnout из последнего квиза
          const quizRaw = await CS.get("quiz_history");
          const quizHist = quizRaw ? JSON.parse(quizRaw) : [];
          const lastQuiz = quizHist.length > 0 ? quizHist[quizHist.length - 1] : null;
          const burnoutPct = lastQuiz?.burnout ?? null;
          // Преобладающее настроение за неделю
          const counts = {};
          for (let i = 0; i < 7; i++) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const k = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
            const r = await CS.get("mood_" + k);
            if (r) { const e = JSON.parse(r); counts[e.id] = (counts[e.id]||0)+1; }
          }
          const topEmotion = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
          const moodEmoji = topEmotion ? (EMOTION_EMOJIS[topEmotion[0]] || "🤔") : null;
          // Записи в блокноте за неделю
          let notesCount = 0;
          for (let i = 0; i < 7; i++) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const k = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
            const r = await CS.get("note_" + k);
            if (r) notesCount++;
          }
          // Отправляем snapshot
          const p = new URLSearchParams({ action:"snapshot", uid, notesCount:String(notesCount) });
          if (burnoutPct !== null) p.set("burnout", String(burnoutPct));
          if (moodEmoji) p.set("mood", moodEmoji);
          loadQueuedFetch(`${STATS_URL}?${p}`);
        } catch {}
      })();

      // ── Настроение дня (без изменений) ──
      const todayKey = getTodayKey();
      const raw = await CS.get("mood_" + todayKey);
      if (raw) { const e = JSON.parse(raw); setCurrentMood(e.mood || "general"); return; }
      const teaRaw = await CS.get("tea_" + todayKey);
      if (teaRaw) setCurrentMood(teaRaw);
    }
    loadMood();
  }, []);

  const handleTeaResult = useCallback(async (winner) => {
    await CS.set("tea_" + getTodayKey(), winner);
    setCurrentMood(winner);
  }, []);

  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const urlParams = new URLSearchParams(window.location.search);
  // Раньше был запасной вход по ?admin=teabro_admin_2024 в URL — убран: такой
  // "пароль" в ссылке рано или поздно светится в истории, логах Vercel и
  // может попасть в индекс поисковиков. Теперь единственный способ попасть в
  // админку — реальный Telegram ID владельца из подписанной Telegram-сессии.
  // Раньше использовалось window.Telegram.WebApp.initDataUnsafe.user, но
  // оно оказалось ненадёжным (пусто в реальной сессии — см. debug ниже).
  // getUidChat() — тот же способ, что уже надёжно работает для uid/chatId
  // в остальном приложении: сперва парсит tgWebAppData из URL-хеша
  // (синхронно, без внешнего скрипта), и только потом initDataUnsafe как fallback.
  // isAdmin в state: на первом рендере Telegram.WebApp ещё может быть не готов,
  // а getUidChat() тогда даёт browser-fallback b_xxx ≠ ADMIN_ID. После ready
  // пересчитываем — кнопка админки появляется без перезагрузки.
  const [isAdmin, setIsAdmin] = useState(() => {
    const { uid } = getUidChat();
    return uid != null && String(uid) === String(ADMIN_ID) && !String(uid).startsWith("b_");
  });
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const start = Date.now();
      while (!cancelled && Date.now() - start < 2000) {
        const { uid } = getUidChat();
        if (uid && !String(uid).startsWith("b_") && String(uid) === String(ADMIN_ID)) {
          setIsAdmin(true);
          return;
        }
        if (uid && !String(uid).startsWith("b_")) {
          setIsAdmin(false);
          return;
        }
        await new Promise(r => setTimeout(r, 100));
      }
      if (!cancelled) {
        const { uid } = getUidChat();
        setIsAdmin(uid != null && String(uid) === String(ADMIN_ID) && !String(uid).startsWith("b_"));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const menuItems = [
    { id: "quiz", ...t.menu.quiz },
    { id: "selfhonesty", ...t.menu.selfhonesty },
    { id: "hormones", ...t.menu.hormones },
    { id: "teaquiz", ...t.menu.teaquiz },
    { id: "meditation", ...t.menu.meditation },
    { id: "meditationguidance", ...t.menu.meditationguidance },
    { id: "dailycheck", ...t.menu.dailycheck },
    { id: "mood", ...t.menu.mood },
    { id: "mypath", ...t.menu.mypath },
  ];

  let body = null;
  if (screen === "quiz") body = <QuizScreen onBack={() => setScreen("home")} onGoCompass={() => setScreen("dailycheck")} />;
  else if (screen === "selfhonesty") body = <SelfHonestyScreen onBack={() => setScreen("home")} />;
  else if (screen === "hormones") body = <HormoneScreen onBack={() => setScreen("home")} onGoCompass={() => setScreen("dailycheck")} onGoGuide={() => setScreen("hormoneguide")} />;
  else if (screen === "hormoneguide") body = <HormoneGuideScreen onBack={() => setScreen("home")} onGoTest={() => setScreen("hormones")} />;
  else if (screen === "meditation") body = <MeditationQuizScreen onBack={() => setScreen("home")} onGoGuidance={() => setScreen("meditationguidance")} />;
  else if (screen === "meditationguidance") body = <MeditationGuidanceScreen onBack={() => setScreen("home")} onGoPractice={() => setScreen("meditation")} />;
  else if (screen === "dailycheck") body = <DailyCheckScreen onBack={() => setScreen("home")} />;
  else if (screen === "wisdom") body = <WisdomScreen onBack={() => setScreen("home")} currentMood={currentMood} />;
  else if (screen === "teaquiz") body = <TeaQuizScreen onBack={() => setScreen("home")} onTeaResult={handleTeaResult} />;
  else if (screen === "mood") body = <MoodScreen onBack={() => setScreen("home")} />;
  else if (screen === "mypath") body = <MyPathScreen onBack={() => setScreen("home")} />;
  else if (screen === "shop") body = <ShopScreen onBack={() => setScreen("home")} />;
  else if (screen === "admin") body = <AdminScreen onBack={() => setScreen("home")} />;
  else body = (
    <div style={styles.screen}>
      <div style={styles.controls}>
        <button type="button" style={lang === "ru" ? styles.langBtnActive : styles.langBtn} onClick={() => setLang("ru")}>RU</button>
        <button type="button" style={lang === "uk" ? styles.langBtnActive : styles.langBtn} onClick={() => setLang("uk")}>UK</button>
        <button type="button" style={styles.themeBtn} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "☀️" : "🌙"}</button>
      </div>
      <div style={styles.homeHeader}>
        <div style={styles.moonIcon}>{theme === "dark" ? "🌕" : "☀️"}</div>
        <h1 style={styles.homeTitle}>Tea Bro</h1>
        <p style={styles.homeSubtitle}>{t.subtitle}</p>
      </div>
      <p style={styles.homeIntro}>{t.intro}</p>
      <div style={styles.menuList}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)} style={styles.menuCard}>
            <div style={styles.menuCardIcon}>✦</div>
            <div style={styles.menuCardContent}>
              <p style={styles.menuCardTitle}>{item.title}</p>
              <p style={styles.menuCardDesc}>{item.desc}</p>
            </div>
            <span style={styles.menuCardArrow}>→</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop:"16px", display:"flex", gap:"12px" }}>
        <a href="https://t.me/TeaBroLife" style={{ ...styles.shopBtn, textDecoration:"none", display:"block", textAlign:"center", boxSizing:"border-box", flex:1 }}>{t.diary}</a>
        <a href="https://teabro-site.vercel.app/index.html" style={{ ...styles.shopBtn, textDecoration:"none", display:"block", textAlign:"center", boxSizing:"border-box", flex:1 }}>{t.library}</a>
      </div>
      {isAdmin && (
        <div style={{ marginTop:"12px" }}>
          <button onClick={() => setScreen("admin")} style={{ ...styles.shopBtn, fontSize:"12px" }}>{t.admin}</button>
        </div>
      )}
      <AnonPopup />
    </div>
  );

  return (
    <LangCtx.Provider value={{ lang, theme, t, tx: (v) => tx(lang, v) }}>
      {body}
    </LangCtx.Provider>
  );
}


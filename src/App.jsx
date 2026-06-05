import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    category: "УТРО",
    text: "Как начинается твоё утро в последнее время?",
    options: [
      { text: "Просыпаюсь — и несколько минут просто лежу. Слушаю тишину. Только потом встаю.", score: 3 },
      { text: "Встаю нормально, но первое, что делаю — беру телефон. Привычка.", score: 2 },
      { text: "Будильник звенит несколько раз. Встаю уже на бегу, сразу в суету.", score: 1 },
      { text: "Утро ощущается как насилие. Каждый день начинается с ощущения, что я уже что-то должен.", score: 0 },
    ],
  },
  {
    id: 2,
    category: "ТИШИНА",
    text: "Когда ты последний раз был наедине с собой — без музыки, подкастов, экрана?",
    options: [
      { text: "Часто. Мне нужна тишина — я намеренно её ищу.", score: 3 },
      { text: "Иногда бывает, случайно. Но долго не выдерживаю — включаю что-нибудь.", score: 2 },
      { text: "Редко. Тишина стала некомфортной — что-то сразу начинает лезть в голову.", score: 1 },
      { text: "Не помню когда. Фоновый шум стал нормой, без него тревожно.", score: 0 },
    ],
  },
  {
    id: 3,
    category: "ТЕЛО",
    text: "Как ты ощущаешь своё тело прямо сейчас?",
    options: [
      { text: "В целом чувствую себя живым. Двигаюсь, дышу, замечаю ощущения.", score: 3 },
      { text: "Нормально, но устаю больше обычного. Иногда ловлю себя на зажатости.", score: 2 },
      { text: "Тело как будто чужое. Хожу, но не чувствую. Усталость стала фоном.", score: 1 },
      { text: "Тело меня раздражает или я его просто не замечаю. Связь потеряна.", score: 0 },
    ],
  },
  {
    id: 4,
    category: "СМЫСЛ",
    text: "Есть ли сейчас что-то, ради чего ты с удовольствием встаёшь?",
    options: [
      { text: "Да. Есть дело, человек, процесс — что-то тянет вперёд.", score: 3 },
      { text: "Скорее да, но это притупилось. Раньше горело сильнее.", score: 2 },
      { text: "Трудно ответить. Дни похожи, мотивация плавает.", score: 1 },
      { text: "Нет. Встаю по инерции. Ничего особо не ждёт.", score: 0 },
    ],
  },
  {
    id: 5,
    category: "НАСТОЯЩЕЕ",
    text: "Где ты находишься прямо сейчас — внутри?",
    options: [
      { text: "Здесь. Замечаю этот момент. Мне не нужно никуда бежать.", score: 3 },
      { text: "Скорее здесь, но мысли иногда утягивают — в прошлое или в тревогу о будущем.", score: 2 },
      { text: "Чаще где угодно, только не здесь. Постоянный внутренний шум.", score: 1 },
      { text: "Я не знаю где. Ощущение, что меня давно нет в собственной жизни.", score: 0 },
    ],
  },
];

const RESULTS = [
  { range: [0, 4], emoji: "🌫", title: "Очень далеко", subtitle: "Туман поглотил дорогу", text: "Ты бежишь уже давно. Так давно, что забыл от чего. Связь с собой — тонкая, почти оборванная. Это не катастрофа. Но это сигнал. Чай не спасёт мир — но он может вернуть тебя в эту минуту. Начни с одной чашки. Без телефона. Просто сиди.", color: "#6B7B8D" },
  { range: [5, 8], emoji: "🌿", title: "На полпути", subtitle: "Ты чувствуешь, что сбился", text: "Что-то внутри уже знает, что не так. Это важно — ты ещё слышишь себя. Суета взяла своё, но не всё. Есть ещё зазор между тобой и шумом. Вот в этот зазор и нужно войти — медленно, без усилий. Просто остановиться на минуту.", color: "#7A9E7E" },
  { range: [9, 11], emoji: "🍵", title: "Почти здесь", subtitle: "Ты возвращаешься", text: "Ты чувствуешь разницу между суетой и тишиной — и иногда выбираешь тишину. Это уже много. Осталось сделать это привычкой, а не исключением. Чайная практика — не ритуал ради ритуала. Это просто повод снова и снова возвращаться к себе.", color: "#C8A97E" },
  { range: [12, 15], emoji: "🌕", title: "Ты здесь", subtitle: "Чашка стынет — ты не торопишься", text: "Ты умеешь быть там, где ты есть. Это редкость. Не потому что ты особенный — а потому что ты это выбираешь. Снова и снова. Приходи сюда, когда захочешь тишины. Она тебя ждёт.", color: "#D4B896" },
];

const WISDOMS = [
  "Чай не торопит. Он просто есть.",
  "Суета — это когда ты занят, но не присутствуешь.",
  "Первый глоток — самый честный момент дня.",
  "Ты не можешь вернуться к себе бегом.",
  "Тишина — не отсутствие звука. Это присутствие себя.",
  "Пуэр учит одному: хорошее не торопится.",
  "Остановиться — это не слабость. Это выбор.",
  "Некоторые вещи понимаются только за чашкой.",
  "Твой день начинается не с будильника. С первого осознанного вдоха.",
  "Медленная жизнь — не значит пустая.",
  "Чай не решает проблемы. Он напоминает, что ты живой.",
  "Хаос снаружи — не повод для хаоса внутри.",
  "Самый важный момент — этот.",
  "Не каждую мысль нужно думать до конца.",
  "Тело знает, когда ты далеко от себя. Оно всегда знает.",
  "Привычка к тишине — лучшее, что ты можешь себе дать.",
  "Выдержанный пуэр не спешил стать собой. И ты не спеши.",
  "Иногда лучшее, что можно сделать — ничего не делать.",
  "Внутри всегда тише, чем снаружи. Нужно просто войти.",
  "Чай заваривают дважды: руками и вниманием.",
];

function WisdomScreen({ onBack }) {
  const [wisdom, setWisdom] = useState(() => WISDOMS[Math.floor(Math.random() * WISDOMS.length)]);
  const [fading, setFading] = useState(false);
  const getNew = () => {
    setFading(true);
    setTimeout(() => {
      let next;
      do { next = WISDOMS[Math.floor(Math.random() * WISDOMS.length)]; } while (next === wisdom);
      setWisdom(next);
      setFading(false);
    }, 400);
  };
  return (
    <div style={styles.screen}>
      <button onClick={onBack} style={styles.backBtn}>← назад</button>
      <div style={styles.wisdomContainer}>
        <div style={styles.teaIcon}>🍵</div>
        <p style={{ ...styles.wisdomText, opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}>{wisdom}</p>
        <div style={styles.wisdomLine} />
        <p style={styles.wisdomHint}>@TeaBroLife</p>
      </div>
      <button onClick={getNew} style={styles.primaryBtn}>Ещё одна мысль</button>
    </div>
  );
}

function QuizScreen({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState([]);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const q = QUESTIONS[current];
  const total = scores.reduce((a, b) => a + b, 0);
  const result = finished ? RESULTS.find(r => total >= r.range[0] && total <= r.range[1]) : null;
  const handleSelect = (score) => { if (animating) return; setSelected(score); };
  const handleNext = () => {
    if (selected === null) return;
    setAnimating(true);
    const newScores = [...scores, selected];
    setTimeout(() => {
      setScores(newScores);
      setSelected(null);
      if (current + 1 >= QUESTIONS.length) { setFinished(true); } else { setCurrent(current + 1); }
      setAnimating(false);
    }, 300);
  };
  const handleRestart = () => { setCurrent(0); setSelected(null); setScores([]); setFinished(false); };
  if (finished && result) {
    return (
      <div style={styles.screen}>
        <div style={styles.resultContainer}>
          <div style={styles.resultEmoji}>{result.emoji}</div>
          <p style={{ ...styles.resultTitle, color: result.color }}>{result.title}</p>
          <p style={styles.resultSubtitle}>{result.subtitle}</p>
          <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${(total / 15) * 100}%`, backgroundColor: result.color }} /></div>
          <p style={styles.progressLabel}>{total} / 15 · <span style={{ color: result.color }}>{Math.round((total / 15) * 100)}%</span></p>
          <p style={styles.resultText}>{result.text}</p>
          <a href="https://t.me/TeaBroLife" style={{ ...styles.primaryBtn, textDecoration: "none", display: "block", textAlign: "center" }}>Перейти в канал 🌕</a>
          <button onClick={handleRestart} style={styles.ghostBtn}>Пройти заново</button>
        </div>
      </div>
    );
  }
  return (
    <div style={styles.screen}>
      <button onClick={onBack} style={styles.backBtn}>← назад</button>
      <div style={styles.quizProgress}>
        <span style={styles.quizCategory}>{q.category}</span>
        <span style={styles.quizCounter}>{current + 1} / {QUESTIONS.length}</span>
      </div>
      <div style={styles.progressTrack}>
        {QUESTIONS.map((_, i) => (<div key={i} style={{ ...styles.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />))}
      </div>
      <p style={{ ...styles.questionText, opacity: animating ? 0 : 1, transition: "opacity 0.3s" }}>{q.text}</p>
      <div style={styles.optionsList}>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(opt.score)} style={{ ...styles.optionBtn, borderColor: selected === opt.score ? "#C8A97E" : "#2A2520", backgroundColor: selected === opt.score ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={styles.optionRadio}>{selected === opt.score ? "◉" : "○"}</span>
            <span style={styles.optionText}>{opt.text}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selected === null} style={{ ...styles.primaryBtn, opacity: selected === null ? 0.3 : 1 }}>
        {current + 1 === QUESTIONS.length ? "Узнать результат" : "Следующий вопрос"}
      </button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  useEffect(() => {
    if (window.Telegram?.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }
  }, []);
  if (screen === "quiz") return <QuizScreen onBack={() => setScreen("home")} />;
  if (screen === "wisdom") return <WisdomScreen onBack={() => setScreen("home")} />;
  return (
    <div style={styles.screen}>
      <div style={styles.homeHeader}>
        <div style={styles.moonIcon}>🌕</div>
        <h1 style={styles.homeTitle}>Tea Bro</h1>
        <p style={styles.homeSubtitle}>茶道 · твоё личное пространство</p>
      </div>
      <p style={styles.homeIntro}>Не о чае. О возвращении к себе.</p>
      <div style={styles.menuList}>
        <button onClick={() => setScreen("quiz")} style={styles.menuCard}>
          <div style={styles.menuCardIcon}>◇</div>
          <div style={styles.menuCardContent}><p style={styles.menuCardTitle}>Далеко ли ты от себя?</p><p style={styles.menuCardDesc}>5 вопросов · 3 минуты · честный ответ</p></div>
          <span style={styles.menuCardArrow}>→</span>
        </button>
        <button onClick={() => setScreen("wisdom")} style={styles.menuCard}>
          <div style={styles.menuCardIcon}>🍵</div>
          <div style={styles.menuCardContent}><p style={styles.menuCardTitle}>Получить мысль</p><p style={styles.menuCardDesc}>Случайная мудрость из канала</p></div>
          <span style={styles.menuCardArrow}>→</span>
        </button>
        <a href="https://t.me/TeaBroLife" style={{ ...styles.menuCard, textDecoration: "none" }}>
          <div style={styles.menuCardIcon}>✦</div>
          <div style={styles.menuCardContent}><p style={styles.menuCardTitle}>Канал @TeaBroLife</p><p style={styles.menuCardDesc}>Пуэр, медитация, медленная жизнь</p></div>
          <span style={styles.menuCardArrow}>→</span>
        </a>
      </div>
    </div>
  );
}

const styles = {
  screen: { minHeight: "100vh", backgroundColor: "#0F0D0B", color: "#E8E0D4", fontFamily: "'Georgia', 'Times New Roman', serif", padding: "24px 20px 40px", display: "flex", flexDirection: "column", boxSizing: "border-box" },
  backBtn: { background: "none", border: "none", color: "#7A6E62", fontSize: "14px", cursor: "pointer", padding: "0 0 20px 0", alignSelf: "flex-start", fontFamily: "'Georgia', serif", letterSpacing: "0.05em" },
  homeHeader: { textAlign: "center", paddingTop: "32px", paddingBottom: "8px" },
  moonIcon: { fontSize: "40px", marginBottom: "12px" },
  homeTitle: { fontSize: "32px", fontWeight: "normal", margin: "0 0 6px", letterSpacing: "0.1em", color: "#E8E0D4" },
  homeSubtitle: { fontSize: "13px", color: "#7A6E62", letterSpacing: "0.15em", margin: 0 },
  homeIntro: { textAlign: "center", fontSize: "15px", color: "#B0A090", fontStyle: "italic", margin: "28px 0 36px", lineHeight: 1.6 },
  menuList: { display: "flex", flexDirection: "column", gap: "12px", flex: 1 },
  menuCard: { background: "rgba(255,255,255,0.03)", border: "1px solid #2A2520", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", textAlign: "left", color: "#E8E0D4", transition: "border-color 0.2s" },
  menuCardIcon: { fontSize: "22px", width: "32px", textAlign: "center", color: "#C8A97E" },
  menuCardContent: { flex: 1 },
  menuCardTitle: { margin: "0 0 4px", fontSize: "15px", fontWeight: "normal", letterSpacing: "0.02em" },
  menuCardDesc: { margin: 0, fontSize: "12px", color: "#7A6E62", letterSpacing: "0.03em" },
  menuCardArrow: { color: "#4A4036", fontSize: "18px" },
  quizProgress: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  quizCategory: { fontSize: "11px", letterSpacing: "0.2em", color: "#C8A97E" },
  quizCounter: { fontSize: "12px", color: "#7A6E62" },
  progressTrack: { display: "flex", gap: "6px", marginBottom: "28px" },
  progressDot: { flex: 1, height: "2px", borderRadius: "1px", transition: "background-color 0.3s" },
  questionText: { fontSize: "20px", lineHeight: 1.5, marginBottom: "28px", color: "#E8E0D4", fontWeight: "normal" },
  optionsList: { display: "flex", flexDirection: "column", gap: "10px", flex: 1, marginBottom: "24px" },
  optionBtn: { background: "rgba(255,255,255,0.02)", border: "1px solid #2A2520", borderRadius: "10px", padding: "14px", display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", textAlign: "left", transition: "border-color 0.2s, background-color 0.2s" },
  optionRadio: { color: "#C8A97E", fontSize: "16px", lineHeight: 1.4, flexShrink: 0 },
  optionText: { fontSize: "14px", color: "#D0C8BC", lineHeight: 1.5, fontFamily: "'Georgia', serif" },
  resultContainer: { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20px", textAlign: "center", flex: 1 },
  resultEmoji: { fontSize: "52px", marginBottom: "16px" },
  resultTitle: { fontSize: "28px", fontWeight: "normal", margin: "0 0 6px", letterSpacing: "0.05em" },
  resultSubtitle: { fontSize: "14px", color: "#7A6E62", fontStyle: "italic", margin: "0 0 20px" },
  progressBar: { width: "100%", height: "3px", backgroundColor: "#2A2520", borderRadius: "2px", marginBottom: "8px", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: "2px", transition: "width 0.8s ease" },
  progressLabel: { fontSize: "12px", color: "#7A6E62", marginBottom: "24px" },
  resultText: { fontSize: "15px", lineHeight: 1.7, color: "#C0B8AC", fontStyle: "italic", marginBottom: "32px", textAlign: "left" },
  wisdomContainer: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", textAlign: "center" },
  teaIcon: { fontSize: "48px", marginBottom: "32px" },
  wisdomText: { fontSize: "20px", lineHeight: 1.7, color: "#E8E0D4", fontStyle: "italic", marginBottom: "28px", transition: "opacity 0.4s ease" },
  wisdomLine: { width: "40px", height: "1px", backgroundColor: "#4A4036", marginBottom: "12px" },
  wisdomHint: { fontSize: "12px", color: "#4A4036", letterSpacing: "0.1em", margin: 0 },
  primaryBtn: { width: "100%", padding: "16px", backgroundColor: "#C8A97E", color: "#0F0D0B", border: "none", borderRadius: "10px", fontSize: "14px", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "'Georgia', serif", transition: "opacity 0.2s", marginBottom: "12px" },
  ghostBtn: { width: "100%", padding: "14px", backgroundColor: "transparent", color: "#7A6E62", border: "1px solid #2A2520", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "'Georgia', serif" },
};
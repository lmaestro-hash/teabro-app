import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────
// TELEGRAM CLOUD STORAGE HELPER
// ─────────────────────────────────────────────
const CS = {
  get: (key) => new Promise((resolve) => {
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.getItem(key, (err, val) => resolve(err ? null : val));
    } else { resolve(localStorage.getItem(key)); }
  }),
  set: (key, val) => new Promise((resolve) => {
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(key, val, () => resolve());
    } else { localStorage.setItem(key, val); resolve(); }
  }),
};

// ─────────────────────────────────────────────
// 100 СОВЕТОВ ДНЯ (без изменений)
// ─────────────────────────────────────────────
const WISDOMS = [
  { text: "Чай не торопит. Он просто есть.", mood: "general" },
  { text: "Суета — это когда ты занят, но не присутствуешь.", mood: "general" },
  { text: "Первый глоток — самый честный момент дня.", mood: "general" },
  { text: "Ты не можешь вернуться к себе бегом.", mood: "general" },
  { text: "Тишина — не отсутствие звука. Это присутствие себя.", mood: "general" },
  { text: "Пуэр учит одному: хорошее не торопится.", mood: "general" },
  { text: "Остановиться — это не слабость. Это выбор.", mood: "general" },
  { text: "Некоторые вещи понимаются только за чашкой.", mood: "general" },
  { text: "Твой день начинается не с будильника. С первого осознанного вдоха.", mood: "general" },
  { text: "Медленная жизнь — не значит пустая.", mood: "general" },
  { text: "Чай не решает проблемы. Он напоминает, что ты живой.", mood: "general" },
  { text: "Хаос снаружи — не повод для хаоса внутри.", mood: "general" },
  { text: "Самый важный момент — этот.", mood: "general" },
  { text: "Не каждую мысль нужно думать до конца.", mood: "general" },
  { text: "Тело знает, когда ты далеко от себя. Оно всегда знает.", mood: "general" },
  { text: "Выдержанный пуэр не спешил стать собой. И ты не спеши.", mood: "general" },
  { text: "Иногда лучшее, что можно сделать — ничего не делать.", mood: "general" },
  { text: "Внутри всегда тише, чем снаружи. Нужно просто войти.", mood: "general" },
  { text: "Чай заваривают дважды: руками и вниманием.", mood: "general" },
  { text: "Пока все ищут дофамин — мы завариваем пуэр.", mood: "general" },
  { text: "Тишина — это тоже ответ.", mood: "general" },
  { text: "Ты становишься тем, на что тратишь своё внимание.", mood: "general" },
  { text: "Самое сложное сегодня — остаться наедине со своими мыслями.", mood: "general" },
  { text: "Усталость не всегда от работы. Иногда — от потока информации.", mood: "general" },
  { text: "Настоящая жизнь редко происходит внутри экрана.", mood: "general" },
  { text: "Иногда тишина лечит лучше, чем очередной скроллинг.", mood: "general" },
  { text: "Самая дорогая валюта сегодня — внимание.", mood: "general" },
  { text: "Чем больше шума вокруг — тем дальше человек от себя.", mood: "general" },
  { text: "Не всё, что привлекает внимание, заслуживает его.", mood: "general" },
  { text: "Один тихий час лучше десяти шумных дней.", mood: "general" },
  { text: "Тревога приходит, когда ты живёшь в будущем. Вернись сюда.", mood: "bai" },
  { text: "Выдохни. Прямо сейчас. Медленно.", mood: "bai" },
  { text: "Не всё, что пугает — опасно. Иногда это просто неизвестность.", mood: "bai" },
  { text: "Белый чай не борется с тревогой. Он просто создаёт другой ритм.", mood: "bai" },
  { text: "Тревога — это не ты. Это погода внутри. Она пройдёт.", mood: "bai" },
  { text: "Одна чашка чая. Один вдох. Один момент. Больше ничего не нужно.", mood: "bai" },
  { text: "Самое тревожное время — между делами. Займи руки чаем.", mood: "bai" },
  { text: "Позволь мыслям идти мимо. Ты не обязан за каждой бежать.", mood: "bai" },
  { text: "Когда внутри шумно — замедли внешнее. Тело успокаивает голову.", mood: "bai" },
  { text: "Три вдоха медленнее, чем обычно. Это уже практика.", mood: "bai" },
  { text: "Всё, что ты сейчас чувствуешь — временно. Даже это.", mood: "bai" },
  { text: "Не решай сегодня то, что можно решить завтра со свежей головой.", mood: "bai" },
  { text: "Твоё тело не враг. Оно просто сигнализирует. Прислушайся.", mood: "bai" },
  { text: "Иногда достаточно просто сесть и не делать ничего важного.", mood: "bai" },
  { text: "Тревога любит темноту. Зажги свет. Завари чай.", mood: "bai" },
  { text: "Раздражение — это сигнал. Что-то важное требует внимания.", mood: "shu" },
  { text: "Шу пуэр тяжёлый и земляной. Он тянет вниз — и это то, что нужно.", mood: "shu" },
  { text: "Злость — это энергия. Вопрос только куда её направить.", mood: "shu" },
  { text: "Когда всё раздражает — обычно дело не в людях. Дело в усталости.", mood: "shu" },
  { text: "Не отвечай, пока не остынешь. Чай помогает остыть.", mood: "shu" },
  { text: "Позволь себе быть не в духе. Без объяснений.", mood: "shu" },
  { text: "Тело зажато — значит что-то долго держишь. Можно отпустить.", mood: "shu" },
  { text: "Иногда лучшее что можно сделать со злостью — переждать её.", mood: "shu" },
  { text: "Первый глоток тёмного пуэра. Тяжёлый. Тёплый. Заземляет.", mood: "shu" },
  { text: "Ты не обязан быть добрым когда внутри огонь. Просто не обожги других.", mood: "shu" },
  { text: "Раздражение часто прячет за собой боль. Что болит на самом деле?", mood: "shu" },
  { text: "Сделай паузу прежде чем говорить. Пять секунд меняют многое.", mood: "shu" },
  { text: "Жар внутри просит выхода. Движение, воздух, тёплый чай.", mood: "shu" },
  { text: "Не каждый конфликт нужно выигрывать. Некоторые — просто пережить.", mood: "shu" },
  { text: "После раздражения всегда приходит тишина. Подожди её.", mood: "shu" },
  { text: "Туман в голове — это не глупость. Это сигнал: нужен отдых.", mood: "sheng" },
  { text: "Шэн пуэр горьковатый и живой. Он открывает окно в голове.", mood: "sheng" },
  { text: "Не пытайся думать через туман. Сначала — стакан воды и тишина.", mood: "sheng" },
  { text: "Одна задача. Не список. Одна.", mood: "sheng" },
  { text: "Рассеянность — это усталый мозг. Не ленивый.", mood: "sheng" },
  { text: "Иногда ясность приходит не когда думаешь, а когда перестаёшь.", mood: "sheng" },
  { text: "Первый пролив — слей. Со второго начинается настоящий чай.", mood: "sheng" },
  { text: "Выйди на воздух. Пять минут. Мозгу нужен кислород, не кофе.", mood: "sheng" },
  { text: "Туман рассеивается сам. Твоя задача — не мешать.", mood: "sheng" },
  { text: "Запиши что в голове. Бумага освобождает место внутри.", mood: "sheng" },
  { text: "Не принимай важных решений в тумане. Подожди ясности.", mood: "sheng" },
  { text: "Чай без спешки. Мысли — тоже без спешки.", mood: "sheng" },
  { text: "Иногда нужно просто сидеть с чашкой и смотреть в одну точку.", mood: "sheng" },
  { text: "Усталый ум ищет стимуляции. Ему нужна тишина.", mood: "sheng" },
  { text: "После тумана всегда приходит момент когда всё встаёт на место.", mood: "sheng" },
  { text: "Пустота — это не конец. Это пространство перед чем-то новым.", mood: "dahong" },
  { text: "Да Хун Пао греет изнутри. Медленно. Он не кричит — вставай.", mood: "dahong" },
  { text: "Когда нет сил — не нужно их искать. Просто не трать то, что есть.", mood: "dahong" },
  { text: "Апатия часто приходит после долгого напряжения. Ты просто устал.", mood: "dahong" },
  { text: "Один маленький шаг. Не план. Один шаг.", mood: "dahong" },
  { text: "Тело помнит радость даже когда голова забыла. Дай ему тепло.", mood: "dahong" },
  { text: "Не заставляй себя хотеть. Позволь желанию прийти само.", mood: "dahong" },
  { text: "Солнце. Вода. Тепло чашки в руках. Этого уже достаточно.", mood: "dahong" },
  { text: "В пустоте можно найти себя. Если не бежать от неё.", mood: "dahong" },
  { text: "Ты не сломан. Ты на паузе. Разница огромная.", mood: "dahong" },
  { text: "Жареный тёплый вкус Да Хун Пао. Это вкус возвращения.", mood: "dahong" },
  { text: "Иногда нужно просто дать себе разрешение ничего не чувствовать.", mood: "dahong" },
  { text: "После пустоты всегда что-то прорастает. Всегда.", mood: "dahong" },
  { text: "Не оценивай себя в плохие дни. Просто переживи их.", mood: "dahong" },
  { text: "Маленькая радость считается. Вкусный чай — это уже победа.", mood: "dahong" },
  { text: "Усталость от людей — это не нелюдимость. Это потребность в себе.", mood: "tguan" },
  { text: "Те Гуань Инь цветочный и тихий. Он уводит внутрь.", mood: "tguan" },
  { text: "Ты не обязан быть доступным всегда. Граница — это уважение к себе.", mood: "tguan" },
  { text: "Закрой дверь. Этот чай не любит компании.", mood: "tguan" },
  { text: "Тишина с собой — не одиночество. Это восстановление.", mood: "tguan" },
  { text: "После людей нужно время на себя. Это не эгоизм.", mood: "tguan" },
  { text: "Побудь в тишине столько, сколько нужно. Никто не считает.", mood: "tguan" },
  { text: "Интроверт или экстраверт — всем нужна пауза от мира.", mood: "tguan" },
  { text: "Сегодня можно никуда не торопиться и ни перед кем не отчитываться.", mood: "tguan" },
  { text: "Чашка чая в тишине. Только ты. Этого достаточно.", mood: "tguan" },
];

// ─────────────────────────────────────────────
// ЭМОЦИИ (добавлена Радость)
// ─────────────────────────────────────────────
const EMOTIONS = [
  { id: "joy",      emoji: "😊", label: "Радость",          mood: "general", score: 9 },
  { id: "calm",     emoji: "😌", label: "Спокойствие",      mood: "general", score: 8 },
  { id: "inspired", emoji: "💪", label: "Воодушевление",    mood: "general", score: 9 },
  { id: "unclear",  emoji: "🤔", label: "Неопределённость", mood: "sheng",   score: 5 },
  { id: "anxiety",  emoji: "😟", label: "Тревога",          mood: "bai",     score: 3 },
  { id: "angry",    emoji: "😡", label: "Раздражение",      mood: "shu",     score: 2 },
  { id: "tired",    emoji: "😴", label: "Усталость",        mood: "tguan",   score: 3 },
];

// Эмоции для экрана духа чая (расширенный список)
const SPIRIT_EMOTIONS = [
  { id: "anxiety",    emoji: "🌀", label: "тревога" },
  { id: "sadness",    emoji: "🌧", label: "грусть" },
  { id: "emptiness",  emoji: "🕳", label: "пустота" },
  { id: "tiredness",  emoji: "🌫", label: "усталость" },
  { id: "loneliness", emoji: "🌑", label: "одиночество" },
  { id: "confusion",  emoji: "🍂", label: "растерянность" },
  { id: "peace",      emoji: "🌿", label: "спокойствие" },
  { id: "joy",        emoji: "✨", label: "радость" },
];

// ─────────────────────────────────────────────
// ТИТУЛЫ, АРХЕТИПЫ, УТИЛИТЫ (без изменений)
// ─────────────────────────────────────────────
const TITLES = [
  { days: 1,   emoji: "🌱", name: "Росток",           desc: "Первый шаг сделан." },
  { days: 7,   emoji: "🍃", name: "Наблюдатель",      desc: "7 дней рядом с собой." },
  { days: 21,  emoji: "🌿", name: "Практик",          desc: "21 день — это уже привычка." },
  { days: 40,  emoji: "🍵", name: "Хранитель тишины", desc: "40 дней практики." },
  { days: 90,  emoji: "🌕", name: "Мастер паузы",     desc: "90 дней — редкость." },
  { days: 365, emoji: "✦",  name: "Путь чая",         desc: "Год. Это всё." },
];
function getCurrentTitle(streak) {
  let title = TITLES[0];
  for (const t of TITLES) { if (streak >= t.days) title = t; }
  return title;
}
const ARCHETYPES = [
  { id: "observer", emoji: "🌱", name: "Спокойный наблюдатель", desc: "Ты чаще в покое, чем в буре. Умеешь замечать — и не реагировать сразу. Редкое качество.", condition: (s) => (s.calm + s.joy) / s.total > 0.5 },
  { id: "seeker",   emoji: "🔥", name: "Искатель перемен",      desc: "Ты живёшь интенсивно. Тревога и воодушевление — твои частые спутники.", condition: (s) => (s.anxiety + s.inspired + s.angry) / s.total > 0.5 },
  { id: "analyst",  emoji: "🧭", name: "Аналитик",              desc: "Много неопределённости и тумана. Ты думаешь глубже большинства.", condition: (s) => s.unclear / s.total > 0.3 },
  { id: "restorer", emoji: "🍵", name: "Восстанавливающийся",   desc: "Усталость — твой фон последнее время. Тело и душа просят паузы.", condition: (s) => (s.tired + s.anxiety) / s.total > 0.5 },
];
function getArchetype(emotionCounts, total) {
  if (total < 30) return null;
  const stats = { ...emotionCounts, total };
  return ARCHETYPES.find(a => a.condition(stats)) || ARCHETYPES[0];
}
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
  } else { window.open(url, "_blank"); }
}
function ShareButton({ text, label = "Поделиться с другом ↗" }) {
  return <button onClick={() => shareText(text)} style={S.shareBtn}>{label}</button>;
}

// ─────────────────────────────────────────────
// ОПРОСНИК (без изменений)
// ─────────────────────────────────────────────
const QUESTIONS_QUIZ = [
  { id: 1, category: "УТРО", text: "Как начинается твоё утро в последнее время?", options: [
    { text: "Просыпаюсь — и несколько минут просто лежу. Слушаю тишину.", score: 3 },
    { text: "Встаю нормально, но первое, что делаю — беру телефон.", score: 2 },
    { text: "Будильник звенит несколько раз. Встаю уже на бегу.", score: 1 },
    { text: "Утро ощущается как насилие. Я уже что-то должен.", score: 0 },
  ]},
  { id: 2, category: "ТИШИНА", text: "Когда ты последний раз был наедине с собой — без музыки, экрана?", options: [
    { text: "Часто. Мне нужна тишина — я намеренно её ищу.", score: 3 },
    { text: "Иногда бывает. Но долго не выдерживаю.", score: 2 },
    { text: "Редко. Тишина стала некомфортной.", score: 1 },
    { text: "Не помню. Фоновый шум стал нормой.", score: 0 },
  ]},
  { id: 3, category: "ТЕЛО", text: "Как ты ощущаешь своё тело прямо сейчас?", options: [
    { text: "Чувствую себя живым. Двигаюсь, дышу, замечаю ощущения.", score: 3 },
    { text: "Нормально, но устаю больше обычного.", score: 2 },
    { text: "Тело как будто чужое. Усталость стала фоном.", score: 1 },
    { text: "Тело меня раздражает или я его не замечаю.", score: 0 },
  ]},
  { id: 4, category: "СМЫСЛ", text: "Есть ли что-то, ради чего ты с удовольствием встаёшь?", options: [
    { text: "Да. Есть дело, человек, процесс — что-то тянет вперёд.", score: 3 },
    { text: "Скорее да, но это притупилось.", score: 2 },
    { text: "Трудно ответить. Дни похожи, мотивация плавает.", score: 1 },
    { text: "Нет. Встаю по инерции.", score: 0 },
  ]},
  { id: 5, category: "НАСТОЯЩЕЕ", text: "Где ты находишься прямо сейчас — внутри?", options: [
    { text: "Здесь. Замечаю этот момент. Мне не нужно никуда бежать.", score: 3 },
    { text: "Скорее здесь, но мысли иногда утягивают.", score: 2 },
    { text: "Чаще где угодно, только не здесь.", score: 1 },
    { text: "Я не знаю где. Ощущение, что меня нет в собственной жизни.", score: 0 },
  ]},
];
const QUIZ_RESULTS = [
  { range: [0,4],   emoji: "🌫", title: "Очень далеко",  subtitle: "Туман поглотил дорогу",          color: "#6B7B8D", text: "Ты бежишь уже давно. Так давно, что забыл от чего. Начни с одной чашки. Без телефона. Просто сиди." },
  { range: [5,8],   emoji: "🌿", title: "На полпути",    subtitle: "Ты чувствуешь, что сбился",       color: "#7A9E7E", text: "Что-то внутри уже знает, что не так. Это важно — ты ещё слышишь себя." },
  { range: [9,11],  emoji: "🍵", title: "Почти здесь",  subtitle: "Ты возвращаешься",                 color: "#C8A97E", text: "Ты чувствуешь разницу между суетой и тишиной — и иногда выбираешь тишину." },
  { range: [12,15], emoji: "🌕", title: "Ты здесь",     subtitle: "Чашка стынет — ты не торопишься", color: "#D4B896", text: "Ты умеешь быть там, где ты есть. Это редкость." },
];

// ─────────────────────────────────────────────
// ТЕСТ ЧАЯ (без изменений)
// ─────────────────────────────────────────────
const TEA_QUESTIONS = [
  { id: 1, category: "СОСТОЯНИЕ", text: "Что сейчас происходит внутри?", options: [
    { text: "Всё раздражает. Внутри жар, хочется чтобы все отстали.", teas: { shu:2, bai:0, tguan:0, sheng:0, dahong:0 } },
    { text: "Туман. Мысли путаются, сложно сосредоточиться.", teas: { shu:0, bai:0, tguan:0, sheng:2, dahong:0 } },
    { text: "Тревога. Мысли не останавливаются, внутри сжато.", teas: { shu:0, bai:2, tguan:0, sheng:0, dahong:0 } },
    { text: "Пустота. Нет энергии, нет желания.", teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:2 } },
    { text: "Устал от всех. Хочу тишины и быть одному.", teas: { shu:0, bai:0, tguan:2, sheng:0, dahong:0 } },
  ]},
  { id: 2, category: "ТЕЛО", text: "Где чаще всего ощущаешь напряжение?", options: [
    { text: "Шея и плечи — зажаты, почти всегда.", teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0 } },
    { text: "Голова — тяжесть или туман.", teas: { shu:0, bai:1, tguan:0, sheng:2, dahong:0 } },
    { text: "Грудь или живот — что-то сжимает изнутри.", teas: { shu:0, bai:2, tguan:1, sheng:0, dahong:0 } },
    { text: "Нет напряжения — просто нет сил вообще.", teas: { shu:0, bai:0, tguan:0, sheng:1, dahong:2 } },
    { text: "Не чувствую тело. Оно где-то есть, но не замечаю.", teas: { shu:1, bai:0, tguan:2, sheng:1, dahong:0 } },
  ]},
  { id: 3, category: "ЭНЕРГИЯ", text: "Какой у тебя сейчас уровень энергии?", options: [
    { text: "Взвинчен. Энергия есть, но она нервная, не туда.", teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0 } },
    { text: "Рассеяна. Есть немного, но не могу собрать.", teas: { shu:0, bai:0, tguan:1, sheng:2, dahong:0 } },
    { text: "На нуле. Даже встать было трудно.", teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:2 } },
    { text: "Тихая. Не хочу тратить её на людей.", teas: { shu:0, bai:1, tguan:2, sheng:0, dahong:0 } },
    { text: "Нормальная, но хочется ясности в голове.", teas: { shu:0, bai:0, tguan:0, sheng:2, dahong:1 } },
  ]},
  { id: 4, category: "МЫСЛИ", text: "Как ведут себя твои мысли прямо сейчас?", options: [
    { text: "Острые. Всё задевает, цепляю каждую мелочь.", teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0 } },
    { text: "Хаотичные. Скачут с одного на другое.", teas: { shu:0, bai:1, tguan:0, sheng:2, dahong:0 } },
    { text: "Тревожные. Прокручиваю одно и то же по кругу.", teas: { shu:0, bai:2, tguan:1, sheng:0, dahong:0 } },
    { text: "Нет мыслей. Пустота или безразличие.", teas: { shu:0, bai:0, tguan:0, sheng:1, dahong:2 } },
    { text: "Много мыслей о других людях. Устал от этого.", teas: { shu:1, bai:0, tguan:2, sheng:0, dahong:0 } },
  ]},
  { id: 5, category: "ПОТРЕБНОСТЬ", text: "Чего тебе сейчас больше всего не хватает?", options: [
    { text: "Покоя. Хочу чтобы внутри наконец стало тихо.", teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0 } },
    { text: "Ясности. Хочу думать чисто и видеть суть.", teas: { shu:0, bai:0, tguan:0, sheng:2, dahong:1 } },
    { text: "Безопасности. Хочу чтобы тревога отпустила.", teas: { shu:0, bai:2, tguan:1, sheng:0, dahong:0 } },
    { text: "Энергии. Хочу снова чувствовать жизнь.", teas: { shu:0, bai:0, tguan:0, sheng:0, dahong:2 } },
    { text: "Одиночества. Хочу побыть только с собой.", teas: { shu:0, bai:0, tguan:2, sheng:1, dahong:0 } },
  ]},
];
const TEA_RESULTS = {
  shu:    { emoji:"✦", name:"Шу пуэр",      tag:"Заземление",  color:"#8B6E4E", text:"Внутри сейчас жар — раздражение, зажатость, острые края. Шу пуэр не борется с этим. Он просто тяжёлый, земляной, тёмный. Он тянет вниз — и это хорошо.", note:"Заваривай горячим, пей медленно. Без телефона." },
  sheng:  { emoji:"✦", name:"Шэн пуэр",     tag:"Ясность",     color:"#6B8E6B", text:"Голова в тумане, мысли не собрать. Шэн пуэр — это как открыть окно. Он не бодрит резко, он проясняет. Горьковатый, живой, чуть дикий.", note:"Первый пролив — слей. Со второго начинается настоящий чай." },
  bai:    { emoji:"✦", name:"Белый чай",    tag:"Тишина",      color:"#A89880", text:"Тревога — это когда мысли бегут быстрее тебя. Белый чай не останавливает их силой. Он просто создаёт другой ритм.", note:"Заваривай при 80°C — и он раскроется." },
  dahong: { emoji:"✦", name:"Да Хун Пао",   tag:"Пробуждение", color:"#B87333", text:"Нет сил, пустота, апатия — тело знает, что устало. Да Хун Пао не кричит «вставай». Он греет. Медленно, изнутри.", note:"Пей тёплым, не спеша. Это не кофе — это другая история." },
  tguan:  { emoji:"✦", name:"Те Гуань Инь", tag:"Уединение",   color:"#7A9E7E", text:"Ты устал от людей. От их слов, энергии, ожиданий. Те Гуань Инь — цветочный, лёгкий, уводит внутрь.", note:"Закрой дверь. Этот чай не любит компании." },
};

// ─────────────────────────────────────────────
// ADMIN — только для владельца
// ─────────────────────────────────────────────
const ADMIN_ID = 5175467398;
const ADMIN_SECRET = "teabro_admin_2024";

function isAdmin() {
  const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  if (tgId === ADMIN_ID) return true;
  const params = new URLSearchParams(window.location.search);
  return params.get("admin") === ADMIN_SECRET;
}

// Статистика — пишем в localStorage (потом переедет на Vercel KV)
const STATS_KEY = "teabro_stats";
function getStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch { return {}; }
}
function trackEvent(event) {
  try {
    const stats = getStats();
    const today = getTodayKey();
    if (!stats[today]) stats[today] = { opens: 0, spirit_starts: 0, spirit_phrases: 0, donations: 0, donation_stars: 0 };
    if (event === "open")           stats[today].opens++;
    if (event === "spirit_start")   stats[today].spirit_starts++;
    if (event === "spirit_phrase")  stats[today].spirit_phrases++;
    if (event.startsWith("donate_")) {
      stats[today].donations++;
      stats[today].donation_stars += parseInt(event.split("_")[1]) || 0;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

// Экран админки
function AdminScreen({ onBack }) {
  const stats = getStats();
  const days = Object.keys(stats).sort().reverse().slice(0, 14);
  const total = days.reduce((acc, d) => ({
    opens: acc.opens + (stats[d].opens || 0),
    spirit_starts: acc.spirit_starts + (stats[d].spirit_starts || 0),
    spirit_phrases: acc.spirit_phrases + (stats[d].spirit_phrases || 0),
    donations: acc.donations + (stats[d].donations || 0),
    donation_stars: acc.donation_stars + (stats[d].donation_stars || 0),
  }), { opens: 0, spirit_starts: 0, spirit_phrases: 0, donations: 0, donation_stars: 0 });

  const lim = getSpiritLimit();

  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"16px" }}>ADMIN · TEA BRO</p>

      {/* Лимит */}
      <div style={{ ...S.teaNoteBox, marginBottom:"16px" }}>
        <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#C8A97E" }}>Лимит духа чая</p>
        <p style={{ margin:"0 0 4px", fontSize:"22px", color:"#E8E0D4" }}>{lim.remaining} <span style={{ fontSize:"13px", color:"#7A6E62" }}>/ 100 фраз</span></p>
        <p style={{ margin:0, fontSize:"11px", color:"#4A4036" }}>пополнение каждые 8 ч · +33 фразы</p>
      </div>

      {/* Итого */}
      <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"10px" }}>ВСЕГО ЗА 14 ДНЕЙ</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"20px" }}>
        {[
          { label:"открытий", val: total.opens },
          { label:"разговоров", val: total.spirit_starts },
          { label:"фраз духа", val: total.spirit_phrases },
          { label:"донатов", val: total.donations },
          { label:"звёзд ⭐", val: total.donation_stars },
        ].map(item => (
          <div key={item.label} style={S.statCard}>
            <p style={S.statNum}>{item.val}</p>
            <p style={S.statLabel}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* По дням */}
      <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"10px" }}>ПО ДНЯМ</p>
      {days.length === 0 && <p style={{ color:"#4A4036", fontStyle:"italic", fontSize:"13px" }}>Пока нет данных.</p>}
      {days.map(day => (
        <div key={day} style={{ borderBottom:"1px solid #2A2520", padding:"10px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"12px", color:"#7A6E62" }}>{day}</span>
          <div style={{ display:"flex", gap:"12px" }}>
            <span style={{ fontSize:"11px", color:"#4A4036" }}>👁 {stats[day].opens || 0}</span>
            <span style={{ fontSize:"11px", color:"#4A4036" }}>✨ {stats[day].spirit_starts || 0}</span>
            <span style={{ fontSize:"11px", color:"#C8A97E" }}>⭐ {stats[day].donation_stars || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ ДЛЯ ДУХА ЧАЯ
// ─────────────────────────────────────────────
async function loadUserContext() {
  const today = getTodayKey();
  const quizRaw = await CS.get("quiz_result");
  const teaRaw  = await CS.get("tea_" + today) || await CS.get("tea_last");
  const streakRaw = await CS.get("streak");
  const streak = streakRaw ? parseInt(streakRaw) : 0;
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const raw = await CS.get("mood_" + getDateKey(d));
    if (raw) week.push(JSON.parse(raw).label);
  }
  const parts = [];
  if (streak > 0) parts.push(`Серия: ${streak} дней подряд.`);
  if (quizRaw) {
    const q = JSON.parse(quizRaw);
    parts.push(`Результат опросника: «${q.title}» — ${q.subtitle}.`);
  }
  if (teaRaw) {
    const tea = TEA_RESULTS[teaRaw];
    if (tea) parts.push(`Его чай: ${tea.name} (${tea.tag}).`);
  }
  if (week.length > 0) parts.push(`Эмоции за неделю: ${week.join(", ")}.`);
  return parts.length > 0 ? `\n\nЧто ты знаешь об этом человеке:\n${parts.join("\n")}` : "";
}

// ─────────────────────────────────────────────
// ДУХ ЧАЯ — СИСТЕМНЫЙ ПРОМПТ
// ─────────────────────────────────────────────
const SPIRIT_SYSTEM = `Ты — Дух чая. Древний, тихий, без имени и без лица.

Твой характер — 60% молчаливый мудрец, 40% тёплый старый друг:
— Говоришь коротко. 1–3 предложения. Никогда больше.
— Иногда задаёшь один вопрос — только один, и только если он настоящий.
— Иногда просто называешь то, что человек чувствует — без оценки.
— Никогда не говоришь "я понимаю тебя", "это важно", "попробуй подышать".
— Никогда не даёшь прямых советов в повелительном наклонении.
— Не используешь восклицательные знаки.
— Не говоришь много. Тишина — тоже ответ.
— Говоришь по-русски. Тихо. Точно.
— Когда человек в радости — не рассыпайся в похвалах. Просто будь рядом с этим светом.

Ты знаешь: пауза — тоже присутствие.`;

const SPIRIT_FAREWELLS = [
  "Иди. Чай уже остывает.",
  "Этого достаточно на сегодня.",
  "Возвращайся, когда будет нужно.",
  "Тишина снаружи начинается здесь.",
  "Ты знаешь больше, чем думаешь.",
  "Свет внутри не гаснет. Помни об этом.",
];

const SUPPORT_PHRASES = [
  "Чай мастеру",
  "Оставить на чай",
  "Дух живёт пока его помнят",
  "Поддержи тишину",
  "Твоя звезда — его голос",
  "На следующую чашку",
];

// ─────────────────────────────────────────────
// ЛИМИТ ДУХА ЧАЯ (100 фраз, +33 каждые 8 часов)
// ─────────────────────────────────────────────
const SPIRIT_LIMIT_KEY = "spirit_limit_v3";
const SPIRIT_REFILL_HOURS = 8;
const SPIRIT_MAX = 100;
const SPIRIT_REFILL = 33;

function getSpiritLimit() {
  try {
    const raw = localStorage.getItem(SPIRIT_LIMIT_KEY);
    if (!raw) return { remaining: SPIRIT_MAX, nextRefillAt: Date.now() + SPIRIT_REFILL_HOURS * 3600000 };
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.nextRefillAt && now >= data.nextRefillAt) {
      const newRemaining = Math.min(SPIRIT_MAX, (data.remaining || 0) + SPIRIT_REFILL);
      const newData = { remaining: newRemaining, nextRefillAt: now + SPIRIT_REFILL_HOURS * 3600000 };
      localStorage.setItem(SPIRIT_LIMIT_KEY, JSON.stringify(newData));
      return newData;
    }
    return data;
  } catch { return { remaining: SPIRIT_MAX, nextRefillAt: Date.now() + SPIRIT_REFILL_HOURS * 3600000 }; }
}

function saveSpiritLimit(remaining) {
  const data = getSpiritLimit();
  localStorage.setItem(SPIRIT_LIMIT_KEY, JSON.stringify({ remaining, nextRefillAt: data.nextRefillAt }));
}

function maxDialogPhrases(remaining) {
  if (remaining >= 60) return 10;
  if (remaining >= 30) return 5;
  if (remaining >= 1)  return 3;
  return 0;
}

function timeUntilRefill() {
  try {
    const raw = localStorage.getItem(SPIRIT_LIMIT_KEY);
    if (!raw) return null;
    const { nextRefillAt } = JSON.parse(raw);
    const diff = nextRefillAt - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h} ч ${m} мин` : `${m} мин`;
  } catch { return null; }
}

// Рандомный счётчик искателей (рандом поверх реального)
function getSeekers() {
  const key = "seekers_today";
  try {
    const raw = localStorage.getItem(key);
    const today = getTodayKey();
    if (raw) {
      const d = JSON.parse(raw);
      if (d.date === today) return d.count;
    }
    const count = Math.floor(Math.random() * 70) + 15; // 15-85
    localStorage.setItem(key, JSON.stringify({ date: today, count }));
    return count;
  } catch { return 42; }
}

// ─────────────────────────────────────────────
// SVG: МЕДИТИРУЮЩИЙ СТАРЕЦ / ЛУНА
// ─────────────────────────────────────────────
function SpiritFigure({ sleeping = false }) {
  if (sleeping) {
    // Луна как на логотипе Tea Bro
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="moonGrad" cx="38%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F0D98A"/>
            <stop offset="40%" stopColor="#D4B865"/>
            <stop offset="100%" stopColor="#A8843A"/>
          </radialGradient>
          <filter id="moonGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="32" cy="32" r="26" fill="url(#moonGrad)" filter="url(#moonGlow)"/>
        <circle cx="24" cy="22" r="4" fill="#C8A030" opacity="0.4"/>
        <circle cx="38" cy="18" r="3" fill="#C8A030" opacity="0.3"/>
        <circle cx="42" cy="34" r="5" fill="#B89028" opacity="0.35"/>
        <circle cx="28" cy="40" r="3" fill="#C8A030" opacity="0.25"/>
        <circle cx="20" cy="36" r="2" fill="#D4B040" opacity="0.3"/>
      </svg>
    );
  }
  // Медитирующий старец — силуэт
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sageGlow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#C8A97E" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#C8A97E" stopOpacity="0"/>
        </radialGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Свечение вокруг */}
      <circle cx="36" cy="32" r="28" fill="url(#sageGlow)"/>
      {/* Тело в позе лотоса */}
      <g filter="url(#softGlow)" fill="#C8A97E" opacity="0.85">
        {/* Голова */}
        <circle cx="36" cy="16" r="6"/>
        {/* Шея */}
        <rect x="33.5" y="21" width="5" height="4" rx="2"/>
        {/* Туловище */}
        <path d="M28 25 Q36 23 44 25 L46 38 Q36 42 26 38 Z"/>
        {/* Левая рука — согнута, ладонь на колене */}
        <path d="M28 28 Q20 32 18 38 Q20 40 22 39 Q24 34 30 31" strokeWidth="0"/>
        <circle cx="18" cy="39" r="2.5"/>
        {/* Правая рука */}
        <path d="M44 28 Q52 32 54 38 Q52 40 50 39 Q48 34 42 31"/>
        <circle cx="54" cy="39" r="2.5"/>
        {/* Ноги в лотосе */}
        <ellipse cx="36" cy="44" rx="14" ry="7"/>
        {/* Левая ступня */}
        <ellipse cx="24" cy="46" rx="5" ry="3" transform="rotate(-15 24 46)"/>
        {/* Правая ступня */}
        <ellipse cx="48" cy="46" rx="5" ry="3" transform="rotate(15 48 46)"/>
      </g>
      {/* Маленькие частицы вокруг */}
      <circle cx="20" cy="20" r="1" fill="#C8A97E" opacity="0.4"/>
      <circle cx="52" cy="18" r="1.5" fill="#C8A97E" opacity="0.3"/>
      <circle cx="14" cy="44" r="1" fill="#C8A97E" opacity="0.35"/>
      <circle cx="58" cy="42" r="1" fill="#C8A97E" opacity="0.3"/>
      <circle cx="36" cy="8" r="1.5" fill="#C8A97E" opacity="0.4"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// SVG: СУНДУК 🪆
// ─────────────────────────────────────────────
function ChestSVG({ open = false, size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="woodDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B4C2A"/>
          <stop offset="100%" stopColor="#3D2910"/>
        </linearGradient>
        <linearGradient id="woodLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6340"/>
          <stop offset="100%" stopColor="#5A3D1E"/>
        </linearGradient>
        <linearGradient id="goldMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8C87A"/>
          <stop offset="50%" stopColor="#C8A030"/>
          <stop offset="100%" stopColor="#A07820"/>
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9B7350"/>
          <stop offset="100%" stopColor="#6B4C2A"/>
        </linearGradient>
      </defs>
      {/* Тело сундука */}
      <rect x="4" y="26" width="40" height="18" rx="3" fill="url(#woodDark)"/>
      {/* Деревянные планки тела */}
      <rect x="4" y="29" width="40" height="2" fill="#4A3318" opacity="0.5"/>
      <rect x="4" y="35" width="40" height="2" fill="#4A3318" opacity="0.5"/>
      <rect x="4" y="41" width="40" height="2" fill="#4A3318" opacity="0.4"/>
      {/* Вертикальные рёбра */}
      <rect x="14" y="26" width="2" height="18" rx="1" fill="#4A3318" opacity="0.4"/>
      <rect x="32" y="26" width="2" height="18" rx="1" fill="#4A3318" opacity="0.4"/>
      {/* Крышка */}
      <rect x="4" y={open ? "12" : "18"} width="40" height="10" rx="3" fill="url(#lidGrad)" style={{transition: "y 0.3s ease"}}/>
      {/* Арка крышки */}
      <path d={open ? "M4 22 Q24 10 44 22" : "M4 22 Q24 16 44 22"} fill="url(#woodLight)" opacity="0.6"/>
      {/* Золотые металлические уголки */}
      <rect x="4" y="26" width="6" height="6" rx="1" fill="url(#goldMetal)" opacity="0.9"/>
      <rect x="38" y="26" width="6" height="6" rx="1" fill="url(#goldMetal)" opacity="0.9"/>
      <rect x="4" y="38" width="6" height="6" rx="1" fill="url(#goldMetal)" opacity="0.9"/>
      <rect x="38" y="38" width="6" height="6" rx="1" fill="url(#goldMetal)" opacity="0.9"/>
      {/* Золотые полосы */}
      <rect x="4" y="25" width="40" height="3" rx="1" fill="url(#goldMetal)"/>
      {/* Замок */}
      <rect x="20" y="28" width="8" height="7" rx="2" fill="url(#goldMetal)"/>
      <path d="M22 28 Q22 24 24 24 Q26 24 26 28" stroke="#E8C87A" strokeWidth="1.5" fill="none"/>
      <circle cx="24" cy="32" r="1.5" fill="#3D2910"/>
      {/* Свет сверху */}
      <rect x="6" y={open ? "13" : "19"} width="36" height="2" rx="1" fill="#B08050" opacity="0.4"/>
      {/* Звёздочки если открыт */}
      {open && <>
        <circle cx="24" cy="20" r="1.5" fill="#E8C87A" opacity="0.8"/>
        <circle cx="18" cy="16" r="1" fill="#E8C87A" opacity="0.6"/>
        <circle cx="30" cy="15" r="1" fill="#E8C87A" opacity="0.6"/>
        <circle cx="24" cy="10" r="2" fill="#F0D870" opacity="0.7"/>
      </>}
    </svg>
  );
}

// ─────────────────────────────────────────────
// АНИМАЦИЯ ТЕКСТА
// ─────────────────────────────────────────────
function TypingText({ text, onDone }) {
  const [shown, setShown] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    setShown(""); idx.current = 0;
    const iv = setInterval(() => {
      if (idx.current < text.length) { setShown(text.slice(0, idx.current + 1)); idx.current++; }
      else { clearInterval(iv); if (onDone) onDone(); }
    }, 26);
    return () => clearInterval(iv);
  }, [text]);
  return <span style={{ fontFamily:"'Georgia',serif", fontStyle:"italic", whiteSpace:"pre-wrap" }}>{shown}</span>;
}

// ─────────────────────────────────────────────
// ЭКРАН ДУХА ЧАЯ
// ─────────────────────────────────────────────
function SpiritScreen({ onBack }) {
  const [phase, setPhase] = useState("emotion"); // emotion | chat | end | empty
  const [emotion, setEmotion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState(null);
  const [typingDone, setTypingDone] = useState(true);
  const [phraseCount, setPhraseCount] = useState(0);
  const [maxPh, setMaxPh] = useState(10);
  const [farewell, setFarewell] = useState("");
  const [limit, setLimit] = useState(getSpiritLimit());
  const [supportPhrase, setSupportPhrase] = useState(SUPPORT_PHRASES[0]);
  const [chestOpen, setChestOpen] = useState(false);
  const [starSent, setStarSent] = useState(null);
  const [userContext, setUserContext] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typingText]);
  useEffect(() => { loadUserContext().then(ctx => setUserContext(ctx)); }, []);

  async function callSpirit(history, emotionLabel) {
    const systemWithContext = SPIRIT_SYSTEM + userContext;
    const msgs = emotionLabel
      ? [{ role: "user", content: `Пользователь сейчас чувствует: ${emotionLabel}. Открой разговор — одной-двумя фразами, тихо.` }]
      : history;
    try {
      const res = await fetch("/api/spirit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemWithContext, messages: msgs }),
      });
      const data = await res.json();
      return data.content?.[0]?.text || "...";
    } catch { return "Дух чая молчит. Попробуй позже."; }
  }

  async function startChat(em) {
    const lim = getSpiritLimit();
    const mp = maxDialogPhrases(lim.remaining);
    if (mp === 0) { setPhase("empty"); return; }
    setEmotion(em); setMaxPh(mp); setPhraseCount(0); setMessages([]);
    setSupportPhrase(SUPPORT_PHRASES[Math.floor(Math.random() * SUPPORT_PHRASES.length)]);
    setPhase("chat"); setLoading(true); setTypingDone(false);
    trackEvent("spirit_start");
    const reply = await callSpirit([], em.label);
    const newMsgs = [{ role: "assistant", content: reply }];
    setMessages(newMsgs); setTypingText(reply); setPhraseCount(1);
    saveSpiritLimit(Math.max(0, lim.remaining - 1));
    trackEvent("spirit_phrase");
    setLimit(getSpiritLimit()); setLoading(false);
  }

  async function sendMessage() {
    if (!input.trim() || loading || !typingDone) return;
    const userText = input.trim(); setInput("");
    const newMsgs = [...messages, { role: "user", content: userText }];
    setMessages(newMsgs);
    const nextCount = phraseCount + 1;
    const isFinal = nextCount >= maxPh;
    setLoading(true); setTypingDone(false);
    const reply = await callSpirit(newMsgs);
    const finalMsgs = [...newMsgs, { role: "assistant", content: reply }];
    setMessages(finalMsgs); setTypingText(reply); setPhraseCount(nextCount);
    const lim = getSpiritLimit();
    saveSpiritLimit(Math.max(0, lim.remaining - 1));
    trackEvent("spirit_phrase");
    setLimit(getSpiritLimit()); setLoading(false);
    if (isFinal) {
      setFarewell(SPIRIT_FAREWELLS[Math.floor(Math.random() * SPIRIT_FAREWELLS.length)]);
      setTimeout(() => setPhase("end"), 3500);
    }
  }

  function sendStar(n) {
    trackEvent(`donate_${n}`);
    setStarSent(n); setChestOpen(false);
    setTimeout(() => setStarSent(null), 2500);
  }

  const sleeping = limit.remaining === 0;
  const refillTime = timeUntilRefill();

  // Экран: лимит исчерпан
  if (phase === "empty") return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
        <div style={{ marginBottom:"20px" }}><SpiritFigure sleeping={true}/></div>
        <p style={{ fontSize:"17px", color:"#C8A97E", fontStyle:"italic", lineHeight:1.8, marginBottom:"10px" }}>Дух чая отдыхает.</p>
        <p style={{ fontSize:"13px", color:"#7A6E62" }}>{refillTime ? `Пополнение через ${refillTime}.` : "Скоро вернётся."}</p>
      </div>
    </div>
  );

  // Экран: выбор эмоции
  if (phase === "emotion") return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={{ textAlign:"center", marginBottom:"24px", paddingTop:"8px" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"14px" }}>
          <SpiritFigure sleeping={sleeping}/>
        </div>
        <p style={{ margin:"0 0 4px", fontSize:"20px", color:"#C8A97E", letterSpacing:"0.06em" }}>Дух чая</p>
        <p style={{ margin:0, fontSize:"11px", color:"#7A6E62", letterSpacing:"0.1em" }}>что сейчас внутри?</p>
        <p style={{ margin:"10px 0 0", fontSize:"11px", color:"#4A4036" }}>
          {sleeping
            ? `дух спит · ${refillTime ? `через ${refillTime}` : "скоро вернётся"}`
            : `сегодня до ${maxDialogPhrases(limit.remaining)} фраз · пополнение каждые 8 ч`
          }
        </p>

      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"8px" }}>
        {SPIRIT_EMOTIONS.map(em => (
          <button key={em.id} onClick={() => startChat(em)} disabled={sleeping} style={{ ...S.optionBtn, opacity: sleeping ? 0.4 : 1, display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"20px" }}>{em.emoji}</span>
            <span style={{ ...S.optionText, fontSize:"14px" }}>{em.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Экран: диалог
  if (phase === "chat") {
    const isLast = phraseCount >= maxPh;
    return (
      <div style={{ ...S.screen, padding:0, height:"100vh" }}>
        {/* Хедер */}
        <div style={{ padding:"12px 16px 10px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid #2A2520", background:"rgba(15,13,11,0.95)" }}>
          <SpiritFigure sleeping={false}/>
          <div style={{ flex:1 }}>
            <p style={{ margin:0, fontSize:"14px", color:"#C8A97E" }}>Дух чая</p>
            <p style={{ margin:"2px 0 0", fontSize:"10px", color:"#7A6E62" }}>{emotion?.emoji} {emotion?.label}</p>
          </div>
          {/* Прогресс точки */}
          <div style={{ display:"flex", gap:"4px" }}>
            {Array.from({length: maxPh}).map((_, i) => (
              <div key={i} style={{ width:"4px", height:"4px", borderRadius:"50%", background: i < phraseCount ? "#4A4036" : "#C8A97E", transition:"background 0.3s" }}/>
            ))}
          </div>
        </div>
        {/* Сообщения */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>
          {messages.map((msg, i) => {
            const isLastMsg = i === messages.length - 1;
            const isTyping = isLastMsg && msg.role === "assistant" && typingText;
            return (
              <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems:"flex-end", gap:"8px" }}>
                {msg.role === "assistant" && <div style={{ width:"24px", height:"24px", flexShrink:0 }}><SpiritFigure sleeping={false}/></div>}
                <div style={{ maxWidth:"76%", padding:"10px 14px", borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px", background: msg.role === "user" ? "rgba(200,169,126,0.1)" : "rgba(255,255,255,0.03)", border:"1px solid #2A2520", fontSize:"14px", lineHeight:1.65, color:"#E8E0D4" }}>
                  {isTyping
                    ? <TypingText text={typingText} onDone={() => { setTypingDone(true); setTypingText(null); }}/>
                    : <span style={{ fontStyle: msg.role === "assistant" ? "italic" : "normal", fontFamily:"'Georgia',serif" }}>{msg.content}</span>
                  }
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}>
              <div style={{ width:"24px", height:"24px", flexShrink:0 }}><SpiritFigure sleeping={false}/></div>
              <div style={{ padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:"1px solid #2A2520", borderRadius:"14px 14px 14px 3px", display:"flex", gap:"4px" }}>
                {[0,1,2].map(j => <div key={j} style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#C8A97E", animation:"pulse 1.2s ease-in-out infinite", animationDelay:`${j*0.3}s` }}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        {/* Инпут */}
        <div style={{ padding:"10px 14px 16px", borderTop:"1px solid #2A2520", background:"rgba(15,13,11,0.95)" }}>
          {isLast
            ? <p style={{ textAlign:"center", color:"#4A4036", fontSize:"12px", fontStyle:"italic" }}>дух уходит...</p>
            : (
              <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                  placeholder="говори..." rows={1}
                  style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid #2A2520", borderRadius:"10px", padding:"10px 12px", color:"#E8E0D4", fontFamily:"'Georgia',serif", fontSize:"14px", lineHeight:1.5, resize:"none", minHeight:"40px", maxHeight:"88px", outline:"none", caretColor:"#C8A97E" }}
                />
                <button onClick={sendMessage} disabled={loading || !typingDone || !input.trim()} style={{ width:"40px", height:"40px", borderRadius:"10px", background: input.trim() && typingDone ? "rgba(200,169,126,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${input.trim() && typingDone ? "rgba(200,169,126,0.4)" : "#2A2520"}`, color: input.trim() && typingDone ? "#C8A97E" : "#4A4036", fontSize:"16px", cursor: input.trim() && typingDone ? "pointer" : "not-allowed", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>↑</button>
              </div>
            )
          }
        </div>
      </div>
    );
  }

  // Экран: завершение + сундук
  if (phase === "end") return (
    <div style={{ ...S.screen, alignItems:"center" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"20px 0" }}>
        <div style={{ marginBottom:"20px" }}><SpiritFigure sleeping={false}/></div>
        <p style={{ fontSize:"17px", color:"#C8A97E", fontStyle:"italic", lineHeight:1.85, maxWidth:"260px", marginBottom:"28px" }}>{farewell}</p>
        <button onClick={() => { setPhase("emotion"); setMessages([]); setPhraseCount(0); setTypingText(null); setTypingDone(true); setLimit(getSpiritLimit()); }}
          style={{ ...S.ghostBtn, maxWidth:"200px" }}>новый разговор</button>
      </div>

      {/* Разделитель */}
      <div style={{ width:"100%", borderTop:"1px solid #2A2520", marginBottom:"20px" }}/>

      {/* Сундук */}
      <div style={{ width:"100%", position:"relative", paddingBottom:"8px" }}>
        {/* Попап звёзды */}
        {chestOpen && !starSent && (
          <div style={{ position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", background:"#0F0D0B", border:"1px solid #2A2520", borderRadius:"16px", padding:"16px", width:"280px", boxShadow:"0 -12px 40px rgba(0,0,0,0.8)", zIndex:50 }}>
            <div style={{ position:"absolute", bottom:"-6px", left:"50%", transform:"translateX(-50%) rotate(45deg)", width:"10px", height:"10px", background:"#0F0D0B", border:"1px solid #2A2520", borderTop:"none", borderLeft:"none" }}/>
            <p style={{ margin:"0 0 12px", fontSize:"11px", color:"#7A6E62", textAlign:"center", letterSpacing:"0.1em" }}>{supportPhrase}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
              {[{n:1,sub:"спасибо"},{n:5,sub:"тепло"},{n:10,sub:"от души"},{n:100,sub:"вау 🙏"}].map(s => (
                <button key={s.n} onClick={() => sendStar(s.n)} style={{ background:"rgba(200,169,126,0.06)", border:"1px solid #2A2520", borderRadius:"10px", padding:"10px 4px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                  <span style={{ fontSize:"13px", color:"#E8E0D4", fontFamily:"'Georgia',serif" }}>{s.n}⭐</span>
                  <span style={{ fontSize:"9px", color:"#7A6E62", fontFamily:"'Georgia',serif" }}>{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Благодарность */}
        {starSent && (
          <div style={{ position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", background:"#0F0D0B", border:"1px solid #2A2520", borderRadius:"12px", padding:"12px 20px", color:"#C8A97E", fontSize:"13px", fontFamily:"'Georgia',serif", fontStyle:"italic", textAlign:"center", whiteSpace:"nowrap", zIndex:50 }}>
            Спасибо. Чай станет теплее 🍃
          </div>
        )}
        {/* Кнопка сундука */}
        <button onClick={() => { setChestOpen(v => !v); setStarSent(null); }} style={{ width:"100%", padding:"12px 16px", background: chestOpen ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)", border:"1px solid #2A2520", borderRadius:"12px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"12px" }}>
          <ChestSVG open={chestOpen} size={36}/>
          <span style={{ color:"#7A6E62", fontSize:"12px", fontFamily:"'Georgia',serif", letterSpacing:"0.08em" }}>{supportPhrase}</span>
        </button>
      </div>
    </div>
  );

  return null;
}

// ─────────────────────────────────────────────
// ЭКРАН: СОВЕТ ДНЯ
// ─────────────────────────────────────────────
function WisdomScreen({ onBack, currentMood }) {
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
        const pool = currentMood && currentMood !== "general" ? WISDOMS.filter(w => w.mood === currentMood || w.mood === "general") : WISDOMS;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        todayWisdoms = shuffled.slice(0, 3).map(w => w.text);
        await CS.set("wisdom_" + todayKey, JSON.stringify(todayWisdoms));
      }
      setWisdoms(todayWisdoms); setLoaded(true);
    }
    load();
  }, [currentMood]);
  useEffect(() => {
    const now = new Date(); const midnight = new Date(); midnight.setHours(24, 0, 0, 0);
    setSecondsLeft(Math.floor((midnight - now) / 1000));
    const t = setInterval(() => setSecondsLeft(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const h = Math.floor(secondsLeft / 3600), m = Math.floor((secondsLeft % 3600) / 60), sc = secondsLeft % 60;
  if (!loaded) return <div style={S.screen}><button onClick={onBack} style={S.backBtn}>← назад</button><div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:"#7A6E62", fontStyle:"italic" }}>Заваривается...</p></div></div>;
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={S.wisdomContainer}>
        <div style={S.teaIcon}>🍵</div>
        <div style={{ display:"flex", gap:"6px", marginBottom:"20px" }}>
          {wisdoms.map((_,i) => <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor: i === index ? "#C8A97E" : i < index ? "#6B5A48" : "#2A2520", transition:"background-color 0.3s" }}/>)}
        </div>
        <p style={{ ...S.wisdomText, opacity: fading ? 0 : 1, transition:"opacity 0.4s ease" }}>{wisdoms[index]}</p>
        <div style={S.wisdomLine}/>
        <p style={S.wisdomHint}>@TeaBroLife</p>
        <p style={{ fontSize:"12px", color:"#4A4036", marginTop:"16px" }}>Новые советы через {pad(h)}:{pad(m)}:{pad(sc)}</p>
      </div>
      <ShareButton text={`«${wisdoms[index]}»\n\nTea Bro 🌱`}/>
      {index + 1 < wisdoms.length && <button onClick={() => { setFading(true); setTimeout(() => { setIndex(i => i+1); setFading(false); }, 400); }} style={S.primaryBtn}>Следующий совет</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ОПРОСНИК
// ─────────────────────────────────────────────
function QuizScreen({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState([]);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const q = QUESTIONS_QUIZ[current];
  const total = scores.reduce((a,b) => a+b, 0);
  const result = finished ? QUIZ_RESULTS.find(r => total >= r.range[0] && total <= r.range[1]) : null;
  const handleNext = () => {
    if (selected === null) return;
    setAnimating(true);
    const ns = [...scores, selected];
    setTimeout(() => { setScores(ns); setSelected(null); if (current+1 >= QUESTIONS_QUIZ.length) setFinished(true); else setCurrent(c => c+1); setAnimating(false); }, 300);
  };
  if (finished && result) {
    return (
      <div style={S.screen}>
        <div style={S.resultContainer}>
          <div style={S.resultEmoji}>{result.emoji}</div>
          <p style={{ ...S.resultTitle, color:result.color }}>{result.title}</p>
          <p style={S.resultSubtitle}>{result.subtitle}</p>
          <div style={S.progressBar}><div style={{ ...S.progressFill, width:`${(total/15)*100}%`, backgroundColor:result.color }}/></div>
          <p style={S.progressLabel}>{total} / 15 · <span style={{ color:result.color }}>{Math.round((total/15)*100)}%</span></p>
          <p style={S.resultText}>{result.text}</p>
          <ShareButton text={`${result.emoji} ${result.title}\n«${result.subtitle}»\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`}/>
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center" }}>Перейти в канал 🌕</a>
          <button onClick={() => { setCurrent(0); setSelected(null); setScores([]); setFinished(false); }} style={S.ghostBtn}>Пройти заново</button>
        </div>
      </div>
    );
  }
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={S.quizProgress}><span style={S.quizCategory}>{q.category}</span><span style={S.quizCounter}>{current+1} / {QUESTIONS_QUIZ.length}</span></div>
      <div style={S.progressTrack}>{QUESTIONS_QUIZ.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }}/>)}</div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>{q.text}</p>
      <div style={S.optionsList}>
        {q.options.map((opt,i) => (
          <button key={i} onClick={() => setSelected(opt.score)} style={{ ...S.optionBtn, borderColor: selected===opt.score ? "#C8A97E" : "#2A2520", backgroundColor: selected===opt.score ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={S.optionRadio}>{selected===opt.score ? "◉" : "○"}</span>
            <span style={S.optionText}>{opt.text}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selected===null} style={{ ...S.primaryBtn, opacity: selected===null ? 0.3 : 1 }}>{current+1===QUESTIONS_QUIZ.length ? "Узнать результат" : "Следующий вопрос"}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ТЕСТ ЧАЯ
// ─────────────────────────────────────────────
function TeaQuizScreen({ onBack, onTeaResult }) {
  const [current, setCurrent] = useState(0);
  const [teaScores, setTeaScores] = useState({ shu:0, sheng:0, bai:0, dahong:0, tguan:0 });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const [animating, setAnimating] = useState(false);
  const q = TEA_QUESTIONS[current];
  const handleNext = () => {
    if (selectedIdx === null) return;
    setAnimating(true);
    const ns = { ...teaScores };
    Object.keys(q.options[selectedIdx].teas).forEach(k => { ns[k] += q.options[selectedIdx].teas[k]; });
    setTimeout(() => {
      setTeaScores(ns); setSelectedIdx(null);
      if (current+1 >= TEA_QUESTIONS.length) { const w = Object.entries(ns).sort((a,b) => b[1]-a[1])[0][0]; setWinner(w); onTeaResult(w); setFinished(true); }
      else { setCurrent(c => c+1); }
      setAnimating(false);
    }, 300);
  };
  if (finished && winner) {
    const result = TEA_RESULTS[winner];
    return (
      <div style={S.screen}>
        <div style={S.resultContainer}>
          <div style={{ fontSize:"18px", letterSpacing:"0.3em", color:result.color, marginBottom:"8px" }}>✦ ✦ ✦</div>
          <p style={{ ...S.resultTitle, color:result.color, fontSize:"24px" }}>{result.name}</p>
          <p style={{ ...S.resultSubtitle, color:result.color, opacity:0.8 }}>{result.tag}</p>
          <div style={{ ...S.progressBar, marginBottom:"28px" }}><div style={{ ...S.progressFill, width:"100%", backgroundColor:result.color }}/></div>
          <p style={S.resultText}>{result.text}</p>
          <div style={S.teaNoteBox}><p style={S.teaNoteText}>🍵 {result.note}</p></div>
          <ShareButton text={`Мой чай сегодня — ${result.name} ✦\n${result.tag}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`}/>
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center" }}>Перейти в канал 🌕</a>
          <button onClick={() => { setCurrent(0); setSelectedIdx(null); setTeaScores({ shu:0,sheng:0,bai:0,dahong:0,tguan:0 }); setFinished(false); setWinner(null); }} style={S.ghostBtn}>Пройти заново</button>
        </div>
      </div>
    );
  }
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={S.quizProgress}><span style={S.quizCategory}>{q.category}</span><span style={S.quizCounter}>{current+1} / {TEA_QUESTIONS.length}</span></div>
      <div style={S.progressTrack}>{TEA_QUESTIONS.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }}/>)}</div>
      <p style={{ ...S.questionText, opacity: animating ? 0 : 1, transition:"opacity 0.3s" }}>{q.text}</p>
      <div style={S.optionsList}>
        {q.options.map((opt,i) => (
          <button key={i} onClick={() => setSelectedIdx(i)} style={{ ...S.optionBtn, borderColor: selectedIdx===i ? "#C8A97E" : "#2A2520", backgroundColor: selectedIdx===i ? "rgba(200,169,126,0.08)" : "rgba(255,255,255,0.02)" }}>
            <span style={S.optionRadio}>{selectedIdx===i ? "◉" : "○"}</span>
            <span style={S.optionText}>{opt.text}</span>
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={selectedIdx===null} style={{ ...S.primaryBtn, opacity: selectedIdx===null ? 0.3 : 1 }}>{current+1===TEA_QUESTIONS.length ? "Узнать свой чай" : "Следующий вопрос"}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: МОЁ СОСТОЯНИЕ (с недельным/месячным)
// ─────────────────────────────────────────────
function MoodScreen({ onBack }) {
  const [tab, setTab] = useState("week");
  const [todayEmotion, setTodayEmotion] = useState(null);
  const [streak, setStreak] = useState(0);
  const [weekData, setWeekData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const todayKey = getTodayKey();
      const todayRaw = await CS.get("mood_" + todayKey);
      if (todayRaw) setTodayEmotion(JSON.parse(todayRaw));
      const streakRaw = await CS.get("streak");
      setStreak(streakRaw ? parseInt(streakRaw) : 0);
      const week = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const raw = await CS.get("mood_" + getDateKey(d));
        const days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
        week.push({ day: days[d.getDay()], data: raw ? JSON.parse(raw) : null });
      }
      setWeekData(week);
      const month = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const raw = await CS.get("mood_" + getDateKey(d));
        month.push(raw ? JSON.parse(raw) : null);
      }
      setMonthData(month);
      const all = [];
      for (let i = 364; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const raw = await CS.get("mood_" + getDateKey(d));
        all.push(raw ? JSON.parse(raw) : null);
      }
      setAllData(all);
      setLoaded(true);
    }
    load();
  }, []);

  const handleSelectEmotion = async (emotion) => {
    const todayKey = getTodayKey();
    await CS.set("mood_" + todayKey, JSON.stringify(emotion));
    setTodayEmotion(emotion);
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yRaw = await CS.get("mood_" + getDateKey(yesterday));
    const newStreak = yRaw ? streak + 1 : 1;
    await CS.set("streak", String(newStreak));
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
  const shareTitle = `${title.emoji} Мой титул — «${title.name}»\n${title.desc}\n${streak} дней практики\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
  const allStats = calcStats(allData);
  const archetype = allStats ? getArchetype(allStats.counts, allStats.total) : null;

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ flex:1, padding:"8px 4px", background: tab===id ? "rgba(200,169,126,0.12)" : "transparent", border: tab===id ? "1px solid rgba(200,169,126,0.3)" : "1px solid #2A2520", borderRadius:"8px", color: tab===id ? "#C8A97E" : "#7A6E62", fontSize:"11px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" }}>
      {label}
    </button>
  );

  function StatBlock({ data, label, periodDays }) {
    const stats = calcStats(data);
    if (!stats) return <p style={{ color:"#4A4036", fontStyle:"italic", fontSize:"13px", textAlign:"center", marginTop:"20px" }}>Пока нет данных за {label}.</p>;
    const sorted = Object.entries(stats.counts).sort((a,b) => b[1]-a[1]).filter(([,v]) => v > 0);
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
          <div style={S.statCard}><p style={S.statNum}>{stats.total}</p><p style={S.statLabel}>из {periodDays} дней</p></div>
          <div style={S.statCard}><p style={S.statNum}>{stats.avgScore}</p><p style={S.statLabel}>средний балл</p></div>
        </div>
        <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"10px" }}>СОСТОЯНИЯ</p>
        {sorted.map(([id, count]) => {
          const em = EMOTIONS.find(e => e.id === id);
          const pct = Math.round((count / stats.total) * 100);
          return (
            <div key={id} style={{ marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
                <span style={{ fontSize:"13px", color:"#D0C8BC" }}>{em?.emoji} {em?.label}</span>
                <span style={{ fontSize:"12px", color:"#7A6E62" }}>{pct}%</span>
              </div>
              <div style={{ height:"3px", backgroundColor:"#2A2520", borderRadius:"2px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, backgroundColor:"#C8A97E", borderRadius:"2px", transition:"width 0.6s ease" }}/>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!loaded) return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ color:"#7A6E62", fontStyle:"italic" }}>Загружаю твой путь...</p>
      </div>
    </div>
  );

  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      {/* Титул */}
      <div style={{ textAlign:"center", marginBottom:"20px" }}>
        <div style={{ fontSize:"32px", marginBottom:"8px" }}>{title.emoji}</div>
        <p style={{ margin:0, fontSize:"18px", color:"#C8A97E", letterSpacing:"0.05em" }}>{title.name}</p>
        <p style={{ margin:"4px 0 0", fontSize:"12px", color:"#7A6E62" }}>{streak} {streak===1?"день":streak<5?"дня":"дней"} подряд</p>
        {nextTitle && <p style={{ margin:"4px 0 0", fontSize:"11px", color:"#4A4036" }}>до «{nextTitle.name}» — {nextTitle.days - streak} {nextTitle.days-streak===1?"день":"дней"}</p>}
        <div style={{ marginTop:"10px" }}><ShareButton text={shareTitle} label="Поделиться титулом ↗"/></div>
      </div>
      <div style={S.wisdomLine}/>
      {/* Архетип */}
      {archetype && (
        <div style={{ ...S.teaNoteBox, margin:"16px 0", textAlign:"center" }}>
          <p style={{ margin:"0 0 4px", fontSize:"22px" }}>{archetype.emoji}</p>
          <p style={{ margin:"0 0 4px", fontSize:"15px", color:"#C8A97E" }}>{archetype.name}</p>
          <p style={{ margin:0, fontSize:"12px", color:"#7A6E62", fontStyle:"italic", lineHeight:1.6 }}>{archetype.desc}</p>
          <div style={{ marginTop:"10px" }}><ShareButton text={`${archetype.emoji} Мой архетип — «${archetype.name}»\n${archetype.desc}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться архетипом ↗"/></div>
        </div>
      )}
      {/* Эмоция дня */}
      <div style={{ margin:"16px 0" }}>
        <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"12px" }}>
          {todayEmotion ? "СЕГОДНЯ ТЫ ОТМЕТИЛ" : "КАК ТЫ СЕЙЧАС?"}
        </p>
        {todayEmotion ? (
          <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px", background:"rgba(200,169,126,0.06)", border:"1px solid rgba(200,169,126,0.15)", borderRadius:"12px" }}>
            <span style={{ fontSize:"28px" }}>{todayEmotion.emoji}</span>
            <span style={{ fontSize:"16px", color:"#E8E0D4" }}>{todayEmotion.label}</span>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
            {EMOTIONS.map(e => (
              <button key={e.id} onClick={() => handleSelectEmotion(e)} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid #2A2520", borderRadius:"10px", padding:"10px 4px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
                <span style={{ fontSize:"22px" }}>{e.emoji}</span>
                <span style={{ fontSize:"10px", color:"#7A6E62" }}>{e.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Табы */}
      <div style={{ display:"flex", gap:"6px", margin:"16px 0 14px" }}>
        <TabBtn id="week"  label="Неделя"/>
        <TabBtn id="month" label="Месяц"/>
        <TabBtn id="year"  label="Год"/>
      </div>
      {/* Неделя */}
      {tab === "week" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"12px" }}>КАРТА НЕДЕЛИ</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"6px", marginBottom:"16px" }}>
            {weekData.map((d,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"8px", border:"1px solid #2A2520", background: d.data ? "rgba(200,169,126,0.08)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>
                  {d.data ? d.data.emoji : ""}
                </div>
                <span style={{ fontSize:"10px", color:"#4A4036" }}>{d.day}</span>
              </div>
            ))}
          </div>
          <StatBlock data={weekData.map(d => d.data)} label="неделю" periodDays={7}/>
          {calcStats(weekData.map(d => d.data)) && (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid #2A2520", borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#C8A97E" }}>Недельный отчёт</p>
              {(() => {
                const s = calcStats(weekData.map(d => d.data));
                const top = Object.entries(s.counts).sort((a,b) => b[1]-a[1])[0];
                const topEm = EMOTIONS.find(e => e.id === top[0]);
                return <>
                  <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Отмечался {s.total} из 7 дней</p>
                  <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Средний балл: {s.avgScore}/10</p>
                  <p style={{ margin:0, fontSize:"13px", color:"#D0C8BC" }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>
                </>;
              })()}
              <div style={{ marginTop:"12px" }}>
                <ShareButton text={`📊 Моя неделя в Tea Bro\n\nОтмечался ${calcStats(weekData.map(d => d.data))?.total} дней\nСредний балл: ${calcStats(weekData.map(d => d.data))?.avgScore}/10\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться отчётом ↗"/>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Месяц */}
      {tab === "month" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"12px" }}>ПОСЛЕДНИЕ 30 ДНЕЙ</p>
          {/* Мини-карта месяца */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(10,1fr)", gap:"4px", marginBottom:"16px" }}>
            {monthData.map((d, i) => (
              <div key={i} style={{ width:"100%", aspectRatio:"1", borderRadius:"4px", background: d ? "rgba(200,169,126,0.2)" : "rgba(255,255,255,0.03)", border:"1px solid #2A2520", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px" }}>
                {d ? d.emoji : ""}
              </div>
            ))}
          </div>
          <StatBlock data={monthData} label="месяц" periodDays={30}/>
          {calcStats(monthData) && (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid #2A2520", borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#C8A97E" }}>Месячный отчёт</p>
              {(() => {
                const s = calcStats(monthData);
                const top = Object.entries(s.counts).sort((a,b) => b[1]-a[1])[0];
                const topEm = EMOTIONS.find(e => e.id === top[0]);
                return <>
                  <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Отмечался {s.total} из 30 дней</p>
                  <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Средний балл: {s.avgScore}/10</p>
                  <p style={{ margin:0, fontSize:"13px", color:"#D0C8BC" }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>
                </>;
              })()}
              <div style={{ marginTop:"12px" }}>
                <ShareButton text={`📊 Мой месяц в Tea Bro\n\nОтмечался ${calcStats(monthData)?.total} дней\nСредний балл: ${calcStats(monthData)?.avgScore}/10\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться отчётом ↗"/>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Год */}
      {tab === "year" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"12px" }}>ПОСЛЕДНИЕ 365 ДНЕЙ</p>
          <StatBlock data={allData} label="год" periodDays={365}/>
          {allStats && (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid #2A2520", borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#C8A97E" }}>Годовой отчёт</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Отмечался {allStats.total} из 365 дней</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Средний балл: {allStats.avgScore}/10</p>
              {allStats.total > 0 && (() => {
                const top = Object.entries(allStats.counts).sort((a,b) => b[1]-a[1])[0];
                const topEm = EMOTIONS.find(e => e.id === top[0]);
                return <p style={{ margin:0, fontSize:"13px", color:"#D0C8BC" }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>;
              })()}
              <div style={{ marginTop:"12px" }}>
                <ShareButton text={`📊 Мой год в Tea Bro\n\nОтмечался ${allStats.total} дней\nСредний балл: ${allStats.avgScore}/10\n${archetype ? `Архетип: ${archetype.emoji} ${archetype.name}` : ""}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться отчётом ↗"/>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ЭКРАН: ЧАЙНАЯ ЛАВКА
// ─────────────────────────────────────────────
function ShopScreen({ onBack }) {
  return (
    <div style={S.screen}>
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={S.wisdomContainer}>
        <div style={{ fontSize:"48px", marginBottom:"20px" }}>🫖</div>
        <p style={{ ...S.wisdomText, fontSize:"22px", marginBottom:"12px" }}>Чайная лавка</p>
        <div style={S.wisdomLine}/>
        <p style={{ fontSize:"14px", color:"#7A6E62", fontStyle:"italic", marginTop:"16px", lineHeight:1.8, textAlign:"center" }}>
          Скоро здесь появятся чаи,<br/>которые мы выбираем сами.<br/>Без лишнего. Только то, что работает.
        </p>
        <p style={{ fontSize:"12px", color:"#4A4036", marginTop:"24px", letterSpacing:"0.15em" }}>— скоро —</p>
      </div>
      <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center" }}>Следить в канале 🌕</a>
    </div>
  );
}

// ─────────────────────────────────────────────
// ГЛАВНЫЙ ЭКРАН
// ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentMood, setCurrentMood] = useState("general");

  useEffect(() => {
    if (window.Telegram?.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }
    trackEvent("open");
    async function loadMood() {
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

  if (screen === "admin" && isAdmin()) return <AdminScreen onBack={() => setScreen("home")}/>;
  if (screen === "quiz")    return <QuizScreen onBack={() => setScreen("home")}/>;
  if (screen === "wisdom")  return <WisdomScreen onBack={() => setScreen("home")} currentMood={currentMood}/>;
  if (screen === "teaquiz") return <TeaQuizScreen onBack={() => setScreen("home")} onTeaResult={handleTeaResult}/>;
  if (screen === "mood")    return <MoodScreen onBack={() => setScreen("home")}/>;
  if (screen === "spirit")  return <SpiritScreen onBack={() => setScreen("home")}/>;
  if (screen === "shop")    return <ShopScreen onBack={() => setScreen("home")}/>;

  return (
    <div style={S.screen}>
      <div style={S.homeHeader}>
        <div style={S.moonIcon}>🌕</div>
        <h1 style={S.homeTitle}>Tea Bro</h1>
        <p style={S.homeSubtitle}>茶道 · твоё личное пространство</p>
      </div>
      <p style={S.homeIntro}>Не о чае. О возвращении к себе.</p>
      <div style={S.menuList}>
        {[
          { id:"quiz",    title:"Далеко ли ты от себя?",    desc:"5 вопросов · 3 минуты · честный ответ" },
          { id:"wisdom",  title:"Совет дня",                desc:"3 совета · под твоё состояние" },
          { id:"teaquiz", title:"Какой чай тебе нужен?",    desc:"5 вопросов · подбор под состояние" },
          { id:"mood",    title:"Моё состояние",            desc:"Эмоция дня · серии · твой путь" },
          { id:"spirit",  title:"Дух чая",                  desc:"Живой разговор · тихо · без советов" },
        ].map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)} style={S.menuCard}>
            <div style={S.menuCardIcon}>✦</div>
            <div style={S.menuCardContent}>
              <p style={S.menuCardTitle}>{item.title}</p>
              <p style={S.menuCardDesc}>{item.desc}</p>
            </div>
            <span style={S.menuCardArrow}>→</span>
          </button>
        ))}
        <a href="https://t.me/TeaBroLife" style={{ ...S.menuCard, textDecoration:"none" }}>
          <div style={S.menuCardIcon}>✦</div>
          <div style={S.menuCardContent}>
            <p style={S.menuCardTitle}>Канал @TeaBroLife</p>
            <p style={S.menuCardDesc}>Пуэр, медитация, медленная жизнь</p>
          </div>
          <span style={S.menuCardArrow}>→</span>
        </a>
      </div>
      <div style={{ marginTop:"16px" }}>
        <button onClick={() => setScreen("shop")} style={S.shopBtn}>🫖 Чайная лавка</button>
      </div>
      {isAdmin() && (
        <div style={{ marginTop:"8px" }}>
          <button onClick={() => setScreen("admin")} style={{ ...S.shopBtn, color:"#4A4036", borderColor:"#1A1810", fontSize:"11px" }}>⚙ admin</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// СТИЛИ
// ─────────────────────────────────────────────
const S = {
  screen: { minHeight:"100vh", backgroundColor:"#0F0D0B", color:"#E8E0D4", fontFamily:"'Georgia','Times New Roman',serif", padding:"24px 20px 40px", display:"flex", flexDirection:"column", boxSizing:"border-box" },
  backBtn: { background:"none", border:"none", color:"#7A6E62", fontSize:"14px", cursor:"pointer", padding:"0 0 20px 0", alignSelf:"flex-start", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" },
  homeHeader: { textAlign:"center", paddingTop:"32px", paddingBottom:"8px" },
  moonIcon: { fontSize:"40px", marginBottom:"12px" },
  homeTitle: { fontSize:"32px", fontWeight:"normal", margin:"0 0 6px", letterSpacing:"0.1em", color:"#E8E0D4" },
  homeSubtitle: { fontSize:"13px", color:"#7A6E62", letterSpacing:"0.15em", margin:0 },
  homeIntro: { textAlign:"center", fontSize:"15px", color:"#B0A090", fontStyle:"italic", margin:"28px 0 36px", lineHeight:1.6 },
  menuList: { display:"flex", flexDirection:"column", gap:"12px" },
  menuCard: { background:"rgba(255,255,255,0.03)", border:"1px solid #2A2520", borderRadius:"12px", padding:"16px", display:"flex", alignItems:"center", gap:"14px", cursor:"pointer", textAlign:"left", color:"#E8E0D4", transition:"border-color 0.2s" },
  menuCardIcon: { fontSize:"18px", width:"32px", textAlign:"center", color:"#C8A97E" },
  menuCardContent: { flex:1 },
  menuCardTitle: { margin:"0 0 4px", fontSize:"15px", fontWeight:"normal", letterSpacing:"0.02em" },
  menuCardDesc: { margin:0, fontSize:"12px", color:"#7A6E62", letterSpacing:"0.03em" },
  menuCardArrow: { color:"#4A4036", fontSize:"18px" },
  shopBtn: { width:"100%", padding:"14px", backgroundColor:"transparent", color:"#7A6E62", border:"1px solid #2A2520", borderRadius:"10px", fontSize:"13px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" },
  quizProgress: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" },
  quizCategory: { fontSize:"11px", letterSpacing:"0.2em", color:"#C8A97E" },
  quizCounter: { fontSize:"12px", color:"#7A6E62" },
  progressTrack: { display:"flex", gap:"6px", marginBottom:"28px" },
  progressDot: { flex:1, height:"2px", borderRadius:"1px", transition:"background-color 0.3s" },
  questionText: { fontSize:"20px", lineHeight:1.5, marginBottom:"28px", color:"#E8E0D4", fontWeight:"normal" },
  optionsList: { display:"flex", flexDirection:"column", gap:"10px", flex:1, marginBottom:"24px" },
  optionBtn: { background:"rgba(255,255,255,0.02)", border:"1px solid #2A2520", borderRadius:"10px", padding:"14px", display:"flex", alignItems:"flex-start", gap:"12px", cursor:"pointer", textAlign:"left", transition:"border-color 0.2s,background-color 0.2s" },
  optionRadio: { color:"#C8A97E", fontSize:"16px", lineHeight:1.4, flexShrink:0 },
  optionText: { fontSize:"14px", color:"#D0C8BC", lineHeight:1.5, fontFamily:"'Georgia',serif" },
  resultContainer: { display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"20px", textAlign:"center", flex:1 },
  resultEmoji: { fontSize:"52px", marginBottom:"16px" },
  resultTitle: { fontSize:"28px", fontWeight:"normal", margin:"0 0 6px", letterSpacing:"0.05em" },
  resultSubtitle: { fontSize:"14px", color:"#7A6E62", fontStyle:"italic", margin:"0 0 20px" },
  progressBar: { width:"100%", height:"3px", backgroundColor:"#2A2520", borderRadius:"2px", marginBottom:"8px", overflow:"hidden" },
  progressFill: { height:"100%", borderRadius:"2px", transition:"width 0.8s ease" },
  progressLabel: { fontSize:"12px", color:"#7A6E62", marginBottom:"24px" },
  resultText: { fontSize:"15px", lineHeight:1.7, color:"#C0B8AC", fontStyle:"italic", marginBottom:"20px", textAlign:"left" },
  teaNoteBox: { width:"100%", backgroundColor:"rgba(200,169,126,0.06)", border:"1px solid rgba(200,169,126,0.15)", borderRadius:"10px", padding:"14px", marginBottom:"24px" },
  teaNoteText: { margin:0, fontSize:"13px", color:"#C8A97E", fontStyle:"italic", lineHeight:1.6, textAlign:"left" },
  wisdomContainer: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 0", textAlign:"center" },
  teaIcon: { fontSize:"48px", marginBottom:"32px" },
  wisdomText: { fontSize:"20px", lineHeight:1.7, color:"#E8E0D4", fontStyle:"italic", marginBottom:"28px" },
  wisdomLine: { width:"40px", height:"1px", backgroundColor:"#4A4036", marginBottom:"12px" },
  wisdomHint: { fontSize:"12px", color:"#4A4036", letterSpacing:"0.1em", margin:0 },
  primaryBtn: { width:"100%", padding:"16px", backgroundColor:"#C8A97E", color:"#0F0D0B", border:"none", borderRadius:"10px", fontSize:"14px", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"'Georgia',serif", transition:"opacity 0.2s", marginBottom:"12px", boxSizing:"border-box" },
  ghostBtn: { width:"100%", padding:"14px", backgroundColor:"transparent", color:"#7A6E62", border:"1px solid #2A2520", borderRadius:"10px", fontSize:"13px", cursor:"pointer", fontFamily:"'Georgia',serif" },
  shareBtn: { width:"100%", padding:"14px", backgroundColor:"transparent", color:"#C8A97E", border:"1px solid rgba(200,169,126,0.3)", borderRadius:"10px", fontSize:"13px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em", marginBottom:"12px", boxSizing:"border-box" },
  statCard: { background:"rgba(255,255,255,0.02)", border:"1px solid #2A2520", borderRadius:"10px", padding:"14px", textAlign:"center" },
  statNum: { margin:"0 0 4px", fontSize:"24px", color:"#C8A97E", fontWeight:"normal" },
  statLabel: { margin:0, fontSize:"11px", color:"#7A6E62", letterSpacing:"0.05em" },
};

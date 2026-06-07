import { useState, useEffect, useCallback } from "react";

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
};

// ─────────────────────────────────────────────
// 100 СОВЕТОВ ДНЯ
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
  { text: "Ты становишься тем, на что тратишь свое внимание.", mood: "general" },
  { text: "Самое сложное сегодня — остаться наедине со своими мыслями.", mood: "general" },
  { text: "Усталость не всегда от работы. Иногда — от потока информации.", mood: "general" },
  { text: "Настоящая жизнь редко происходит внутри экрана.", mood: "general" },
  { text: "Иногда тишина лечит лучше, чем очередной скроллинг.", mood: "general" },
  { text: "Самая дорогая валюта сегодня — внимание.", mood: "general" },
  { text: "Чем больше шума вокруг — тем дальше человек от себя.", mood: "general" },
  { text: "Не все, что привлекает внимание, заслуживает его.", mood: "general" },
  { text: "Один тихий час лучше десяти шумных дней.", mood: "general" },
  { text: "Тревога приходит, когда ты живешь в будущем. Вернись сюда.", mood: "bai" },
  { text: "Выдохни. Прямо сейчас. Медленно.", mood: "bai" },
  { text: "Не все, что пугает — опасно. Иногда это просто неизвестность.", mood: "bai" },
  { text: "Белый чай не борется с тревогой. Он просто создает другой ритм.", mood: "bai" },
  { text: "Тревога — это не ты. Это погода внутри. Она пройдет.", mood: "bai" },
  { text: "Одна чашка чая. Один вдох. Один момент. Больше ничего не нужно.", mood: "bai" },
  { text: "Самое тревожное время — между делами. Займи руки чаем.", mood: "bai" },
  { text: "Позволь мыслям идти мимо. Ты не обязан за каждой бежать.", mood: "bai" },
  { text: "Когда внутри шумно — замедли внешнее. Тело успокаивает голову.", mood: "bai" },
  { text: "Три вдоха медленнее, чем обычно. Это уже практика.", mood: "bai" },
  { text: "Все, что ты сейчас чувствуешь — временно. Даже это.", mood: "bai" },
  { text: "Не решай сегодня то, что можно решить завтра со свежей головой.", mood: "bai" },
  { text: "Твое тело не враг. Оно просто сигнализирует. Прислушайся.", mood: "bai" },
  { text: "Иногда достаточно просто сесть и не делать ничего важного.", mood: "bai" },
  { text: "Тревога любит темноту. Зажги свет. Завари чай.", mood: "bai" },
  { text: "Раздражение — это сигнал. Что-то важное требует внимания.", mood: "shu" },
  { text: "Шу пуэр тяжелый и земляной. Он тянет вниз — и это то, что нужно.", mood: "shu" },
  { text: "Злость — это энергия. Вопрос только куда ее направить.", mood: "shu" },
  { text: "Когда все раздражает — обычно дело не в людях. Дело в усталости.", mood: "shu" },
  { text: "Не отвечай, пока не остынешь. Чай помогает остыть.", mood: "shu" },
  { text: "Позволь себе быть не в духе. Без объяснений.", mood: "shu" },
  { text: "Тело зажато — значит что-то долго держишь. Можно отпустить.", mood: "shu" },
  { text: "Иногда лучшее что можно сделать со злостью — переждать ее.", mood: "shu" },
  { text: "Первый глоток темного пуэра. Тяжелый. Теплый. Заземляет.", mood: "shu" },
  { text: "Ты не обязан быть добрым когда внутри огонь. Просто не обожги других.", mood: "shu" },
  { text: "Раздражение часто прячет за собой боль. Что болит на самом деле?", mood: "shu" },
  { text: "Сделай паузу прежде чем говорить. Пять секунд меняют многое.", mood: "shu" },
  { text: "Жар внутри просит выхода. Движение, воздух, теплый чай.", mood: "shu" },
  { text: "Не каждый конфликт нужно выигрывать. Некоторые — просто пережить.", mood: "shu" },
  { text: "После раздражения всегда приходит тишина. Подожди ее.", mood: "shu" },
  { text: "Туман в голове — это не глупость. Это сигнал: нужен отдых.", mood: "sheng" },
  { text: "Шэн пуэр горьковатый и живой. Он открывает окно в голове.", mood: "sheng" },
  { text: "Не пытайся думать через туман. Сначала — стакан воды и тишина.", mood: "sheng" },
  { text: "Одна задача. Не список. Одна.", mood: "sheng" },
  { text: "Рассеянность — это усталый мозг. Не ленивый.", mood: "sheng" },
  { text: "Иногда ясность приходит не когда думаешь, а когда перестаешь.", mood: "sheng" },
  { text: "Первый пролив — слей. Со второго начинается настоящий чай.", mood: "sheng" },
  { text: "Выйди на воздух. Пять минут. Мозгу нужен кислород, не кофе.", mood: "sheng" },
  { text: "Туман рассеивается сам. Твоя задача — не мешать.", mood: "sheng" },
  { text: "Запиши что в голове. Бумага освобождает место внутри.", mood: "sheng" },
  { text: "Не принимай важных решений в тумане. Подожди ясности.", mood: "sheng" },
  { text: "Чай без спешки. Мысли — тоже без спешки.", mood: "sheng" },
  { text: "Иногда нужно просто сидеть с чашкой и смотреть в одну точку.", mood: "sheng" },
  { text: "Усталый ум ищет стимуляции. Ему нужна тишина.", mood: "sheng" },
  { text: "После тумана всегда приходит момент когда все встает на место.", mood: "sheng" },
  { text: "Пустота — это не конец. Это пространство перед чем-то новым.", mood: "dahong" },
  { text: "Да Хун Пао греет изнутри. Медленно. Он не кричит — вставай.", mood: "dahong" },
  { text: "Когда нет сил — не нужно их искать. Просто не трать то, что есть.", mood: "dahong" },
  { text: "Апатия часто приходит после долгого напряжения. Ты просто устал.", mood: "dahong" },
  { text: "Один маленький шаг. Не план. Один шаг.", mood: "dahong" },
  { text: "Тело помнит радость даже когда голова забыла. Дай ему тепло.", mood: "dahong" },
  { text: "Не заставляй себя хотеть. Позволь желанию прийти само.", mood: "dahong" },
  { text: "Солнце. Вода. Тепло чашки в руках. Этого уже достаточно.", mood: "dahong" },
  { text: "В пустоте можно найти себя. Если не бежать от нее.", mood: "dahong" },
  { text: "Ты не сломан. Ты на паузе. Разница огромная.", mood: "dahong" },
  { text: "Жареный теплый вкус Да Хун Пао. Это вкус возвращения.", mood: "dahong" },
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
// ЭМОЦИИ
// ─────────────────────────────────────────────
const EMOTIONS = [
  { id: "joy",      emoji: "😊", label: "Радость",          mood: "general", score: 9 },
  { id: "calm",     emoji: "😌", label: "Спокойствие",      mood: "general", score: 8 },
  { id: "inspired", emoji: "💪", label: "Воодушевление",    mood: "general", score: 9 },
  { id: "unclear",  emoji: "🤔", label: "Неопределенность", mood: "sheng",   score: 5 },
  { id: "anxiety",  emoji: "😟", label: "Тревога",          mood: "bai",     score: 3 },
  { id: "angry",    emoji: "😡", label: "Раздражение",      mood: "shu",     score: 2 },
  { id: "tired",    emoji: "😴", label: "Усталость",        mood: "tguan",   score: 3 },
];

// ─────────────────────────────────────────────
// ТИТУЛЫ
// ─────────────────────────────────────────────
const TITLES = [
  { days: 1,   emoji: "🌱", name: "Росток",           desc: "Первый шаг сделан." },
  { days: 7,   emoji: "🍃", name: "Наблюдатель",      desc: "7 дней рядом с собой." },
  { days: 21,  emoji: "🌿", name: "Практик",          desc: "21 день — это уже привычка." },
  { days: 40,  emoji: "🍵", name: "Хранитель тишины", desc: "40 дней практики." },
  { days: 90,  emoji: "🌕", name: "Мастер паузы",     desc: "90 дней — редкость." },
  { days: 365, emoji: "✦",  name: "Путь чая",         desc: "Год. Это все." },
];

function getCurrentTitle(streak) {
  let title = TITLES[0];
  for (const t of TITLES) { if (streak >= t.days) title = t; }
  return title;
}

// ─────────────────────────────────────────────
// АРХЕТИПЫ (после 30+ записей)
// ─────────────────────────────────────────────
const ARCHETYPES = [
  {
    id: "observer",
    emoji: "🌱",
    name: "Спокойный наблюдатель",
    desc: "Ты чаще в покое, чем в буре. Умеешь замечать — и не реагировать сразу. Редкое качество.",
    condition: (stats) => (stats.calm + stats.joy) / stats.total > 0.5,
  },
  {
    id: "seeker",
    emoji: "🔥",
    name: "Искатель перемен",
    desc: "Ты живешь интенсивно. Тревога и воодушевление — твои частые спутники. Энергия есть — важно куда ее.",
    condition: (stats) => (stats.anxiety + stats.inspired + stats.angry) / stats.total > 0.5,
  },
  {
    id: "analyst",
    emoji: "🧭",
    name: "Аналитик",
    desc: "Много неопределенности и тумана. Ты думаешь глубже большинства — иногда слишком глубоко.",
    condition: (stats) => stats.unclear / stats.total > 0.3,
  },
  {
    id: "restorer",
    emoji: "🍵",
    name: "Восстанавливающийся",
    desc: "Усталость — твой фон последнее время. Тело и душа просят паузы. Ты уже делаешь правильные шаги.",
    condition: (stats) => (stats.tired + stats.anxiety) / stats.total > 0.5,
  },
];

function getArchetype(emotionCounts, total) {
  if (total < 30) return null;
  const stats = { ...emotionCounts, total };
  return ARCHETYPES.find(a => a.condition(stats)) || ARCHETYPES[0];
}

// ─────────────────────────────────────────────
// ОПРОСНИК
// ─────────────────────────────────────────────
const QUESTIONS_QUIZ = [
  { id: 1, category: "УТРО", text: "Как начинается твое утро в последнее время?", options: [
    { text: "Просыпаюсь — и несколько минут просто лежу. Слушаю тишину.", score: 3 },
    { text: "Встаю нормально, но первое, что делаю — беру телефон.", score: 2 },
    { text: "Будильник звенит несколько раз. Встаю уже на бегу.", score: 1 },
    { text: "Утро ощущается как насилие. Я уже что-то должен.", score: 0 },
  ]},
  { id: 2, category: "ТИШИНА", text: "Когда ты последний раз был наедине с собой — без музыки, экрана?", options: [
    { text: "Часто. Мне нужна тишина — я намеренно ее ищу.", score: 3 },
    { text: "Иногда бывает. Но долго не выдерживаю.", score: 2 },
    { text: "Редко. Тишина стала некомфортной.", score: 1 },
    { text: "Не помню. Фоновый шум стал нормой.", score: 0 },
  ]},
  { id: 3, category: "ТЕЛО", text: "Как ты ощущаешь свое тело прямо сейчас?", options: [
    { text: "Чувствую себя живым. Двигаюсь, дышу, замечаю ощущения.", score: 3 },
    { text: "Нормально, но устаю больше обычного.", score: 2 },
    { text: "Тело как будто чужое. Усталость стала фоном.", score: 1 },
    { text: "Тело меня раздражает или я его не замечаю.", score: 0 },
  ]},
  { id: 4, category: "СМЫСЛ", text: "Есть ли что-то, ради чего ты с удовольствием встаешь?", options: [
    { text: "Да. Есть дело, человек, процесс — что-то тянет вперед.", score: 3 },
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
  { range: [0,4],   emoji: "🌫", title: "Очень далеко",  subtitle: "Туман поглотил дорогу",          color: "#6B7B8D", text: "Ты бежишь уже давно. Так давно, что забыл от чего. Связь с собой — тонкая, почти оборванная. Начни с одной чашки. Без телефона. Просто сиди." },
  { range: [5,8],   emoji: "🌿", title: "На полпути",    subtitle: "Ты чувствуешь, что сбился",       color: "#7A9E7E", text: "Что-то внутри уже знает, что не так. Это важно — ты еще слышишь себя. Суета взяла свое, но не все. Войди в зазор — медленно." },
  { range: [9,11],  emoji: "🍵", title: "Почти здесь",  subtitle: "Ты возвращаешься",                 color: "#C8A97E", text: "Ты чувствуешь разницу между суетой и тишиной — и иногда выбираешь тишину. Это уже много. Осталось сделать это привычкой." },
  { range: [12,15], emoji: "🌕", title: "Ты здесь",     subtitle: "Чашка стынет — ты не торопишься", color: "#D4B896", text: "Ты умеешь быть там, где ты есть. Это редкость. Не потому что ты особенный — а потому что ты это выбираешь. Снова и снова." },
];

// ─────────────────────────────────────────────
// ТЕСТ ЧАЯ
// ─────────────────────────────────────────────
const TEA_QUESTIONS = [
  { id: 1, category: "СОСТОЯНИЕ", text: "Что сейчас происходит внутри?", options: [
    { text: "Все раздражает. Внутри жар, хочется чтобы все отстали.", teas: { shu:2, bai:0, tguan:0, sheng:0, dahong:0 } },
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
    { text: "Тихая. Не хочу тратить ее на людей.", teas: { shu:0, bai:1, tguan:2, sheng:0, dahong:0 } },
    { text: "Нормальная, но хочется ясности в голове.", teas: { shu:0, bai:0, tguan:0, sheng:2, dahong:1 } },
  ]},
  { id: 4, category: "МЫСЛИ", text: "Как ведут себя твои мысли прямо сейчас?", options: [
    { text: "Острые. Все задевает, цепляю каждую мелочь.", teas: { shu:2, bai:1, tguan:0, sheng:0, dahong:0 } },
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
  shu:    { emoji:"✦", name:"Шу пуэр",      tag:"Заземление",  color:"#8B6E4E", text:"Внутри сейчас жар — раздражение, зажатость, острые края. Шу пуэр не борется с этим. Он просто тяжелый, земляной, темный. Он тянет вниз — и это хорошо. Первый глоток немного притупляет края. К третьему начинаешь дышать.", note:"Заваривай горячим, пей медленно. Без телефона." },
  sheng:  { emoji:"✦", name:"Шэн пуэр",     tag:"Ясность",     color:"#6B8E6B", text:"Голова в тумане, мысли не собрать. Шэн пуэр — это как открыть окно. Он не бодрит резко, он проясняет. Горьковатый, живой, чуть дикий. После него думается иначе — чище, без лишнего.", note:"Первый пролив — слей. Со второго начинается настоящий чай." },
  bai:    { emoji:"✦", name:"Белый чай",    tag:"Тишина",      color:"#A89880", text:"Тревога — это когда мысли бегут быстрее тебя. Белый чай не останавливает их силой. Он просто создает другой ритм. Нежный, почти незаметный. Пьешь — и замечаешь, что немного выдохнул.", note:"Заваривай при 80°C — и он раскроется." },
  dahong: { emoji:"✦", name:"Да Хун Пао",   tag:"Пробуждение", color:"#B87333", text:"Нет сил, пустота, апатия — тело знает, что устало. Да Хун Пао не кричит «вставай». Он греет. Медленно, изнутри. Жареный, теплый, с глубиной. Он возвращает ощущение, что ты живой.", note:"Пей теплым, не спеша. Это не кофе — это другая история." },
  tguan:  { emoji:"✦", name:"Те Гуань Инь", tag:"Уединение",   color:"#7A9E7E", text:"Ты устал от людей. От их слов, энергии, ожиданий. Те Гуань Инь — цветочный, легкий, уводит внутрь. Он не требует ничего. Просто сиди с ним. Это чай для того, чтобы снова стать собой.", note:"Закрой дверь. Этот чай не любит компании." },
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

function ShareButton({ text, label = "Поделиться с другом ↗" }) {
  return <button onClick={() => shareText(text)} style={S.shareBtn}>{label}</button>;
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
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ color:"#7A6E62", fontStyle:"italic" }}>Заваривается...</p>
      </div>
    </div>
  );

  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>← назад</button>
        <div style={S.hintBtn} title="3 совета в день, подобранных под твое состояние. Обновляются в полночь.">ℹ</div>
      </div>
      <div style={S.wisdomContainer}>
        <div style={S.teaIcon}>🍵</div>
        <div style={{ display:"flex", gap:"6px", marginBottom:"20px" }}>
          {wisdoms.map((_,i) => (
            <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor: i === index ? "#C8A97E" : i < index ? "#6B5A48" : "#2A2520", transition:"background-color 0.3s" }} />
          ))}
        </div>
        <p style={{ ...S.wisdomText, opacity: fading ? 0 : 1, transition:"opacity 0.4s ease" }}>{wisdoms[index]}</p>
        <div style={S.wisdomLine} />
        <p style={S.wisdomHint}>@TeaBroLife</p>
        <p style={{ fontSize:"12px", color:"#4A4036", marginTop:"16px" }}>Новые советы через {pad(h)}:{pad(m)}:{pad(sc)}</p>
      </div>
      <ShareButton text={`«${wisdoms[index]}»\n\nTea Bro 🌱`} />
      {index + 1 < wisdoms.length && (
        <button onClick={() => { setFading(true); setTimeout(() => { setIndex(i => i+1); setFading(false); }, 400); }} style={S.primaryBtn}>Следующий совет</button>
      )}
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
    const shareMsg = `${result.emoji} ${result.title}\n«${result.subtitle}»\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
    return (
      <div style={S.screen}>
        <div style={S.resultContainer}>
          <div style={S.resultEmoji}>{result.emoji}</div>
          <p style={{ ...S.resultTitle, color:result.color }}>{result.title}</p>
          <p style={S.resultSubtitle}>{result.subtitle}</p>
          <div style={S.progressBar}><div style={{ ...S.progressFill, width:`${(total/15)*100}%`, backgroundColor:result.color }} /></div>
          <p style={S.progressLabel}>{total} / 15 · <span style={{ color:result.color }}>{Math.round((total/15)*100)}%</span></p>
          <p style={S.resultText}>{result.text}</p>
          <ShareButton text={shareMsg} />
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center" }}>Перейти в канал 🌕</a>
          <button onClick={() => { setCurrent(0); setSelected(null); setScores([]); setFinished(false); }} style={S.ghostBtn}>Пройти заново</button>
        </div>
      </div>
    );
  }
  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>← назад</button>
        <div style={S.hintBtn} title="5 вопросов — честный ответ о том, насколько ты далеко от себя.">ℹ</div>
      </div>
      <div style={S.quizProgress}><span style={S.quizCategory}>{q.category}</span><span style={S.quizCounter}>{current+1} / {QUESTIONS_QUIZ.length}</span></div>
      <div style={S.progressTrack}>{QUESTIONS_QUIZ.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />)}</div>
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
      setTeaScores(ns);
      setSelectedIdx(null);
      if (current+1 >= TEA_QUESTIONS.length) {
        const w = Object.entries(ns).sort((a,b) => b[1]-a[1])[0][0];
        setWinner(w); onTeaResult(w); setFinished(true);
      } else { setCurrent(c => c+1); }
      setAnimating(false);
    }, 300);
  };
  if (finished && winner) {
    const result = TEA_RESULTS[winner];
    const shareMsg = `Мой чай сегодня — ${result.name} ✦\n${result.tag}\n\n«${result.text.slice(0,80)}...»\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`;
    return (
      <div style={S.screen}>
        <div style={S.resultContainer}>
          <div style={{ fontSize:"18px", letterSpacing:"0.3em", color:result.color, marginBottom:"8px" }}>✦ ✦ ✦</div>
          <p style={{ ...S.resultTitle, color:result.color, fontSize:"24px" }}>{result.name}</p>
          <p style={{ ...S.resultSubtitle, color:result.color, opacity:0.8 }}>{result.tag}</p>
          <div style={{ ...S.progressBar, marginBottom:"28px" }}><div style={{ ...S.progressFill, width:"100%", backgroundColor:result.color }} /></div>
          <p style={S.resultText}>{result.text}</p>
          <div style={S.teaNoteBox}><p style={S.teaNoteText}>🍵 {result.note}</p></div>
          <ShareButton text={shareMsg} />
          <a href="https://t.me/TeaBroLife" style={{ ...S.primaryBtn, textDecoration:"none", display:"block", textAlign:"center" }}>Перейти в канал 🌕</a>
          <button onClick={() => { setCurrent(0); setSelectedIdx(null); setTeaScores({ shu:0,sheng:0,bai:0,dahong:0,tguan:0 }); setFinished(false); setWinner(null); }} style={S.ghostBtn}>Пройти заново</button>
        </div>
      </div>
    );
  }
  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>← назад</button>
        <div style={S.hintBtn} title="5 вопросов о твоем состоянии — подберем чай, который нужен именно сейчас.">ℹ</div>
      </div>
      <div style={S.quizProgress}><span style={S.quizCategory}>{q.category}</span><span style={S.quizCounter}>{current+1} / {TEA_QUESTIONS.length}</span></div>
      <div style={S.progressTrack}>{TEA_QUESTIONS.map((_,i) => <div key={i} style={{ ...S.progressDot, backgroundColor: i < current ? "#C8A97E" : i === current ? "#E8C99E" : "#2A2520" }} />)}</div>
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
// ЭКРАН: МОЁ СОСТОЯНИЕ
// ─────────────────────────────────────────────
function MoodScreen({ onBack }) {
  const [tab, setTab] = useState("today"); // today | week | month | year
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

      // Неделя
      const week = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const raw = await CS.get("mood_" + getDateKey(d));
        const days = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
        week.push({ day: days[d.getDay()], data: raw ? JSON.parse(raw) : null });
      }
      setWeekData(week);

      // Месяц (30 дней)
      const month = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const raw = await CS.get("mood_" + getDateKey(d));
        month.push(raw ? JSON.parse(raw) : null);
      }
      setMonthData(month);

      // Год (365 дней)
      const all = [];
      for (let i = 364; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const raw = await CS.get("mood_" + getDateKey(d));
        all.push(raw ? JSON.parse(raw) : null);
      }
      setAllData(all);
      setLoaded(false); // trick to re-render
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

  // Подсчет статистики
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

  // Архетип
  const allStats = calcStats(allData);
  const archetype = allStats ? getArchetype(allStats.counts, allStats.total) : null;

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{ flex:1, padding:"8px 4px", background: tab===id ? "rgba(200,169,126,0.12)" : "transparent", border: tab===id ? "1px solid rgba(200,169,126,0.3)" : "1px solid #2A2520", borderRadius:"8px", color: tab===id ? "#C8A97E" : "#7A6E62", fontSize:"11px", cursor:"pointer", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" }}>
      {label}
    </button>
  );

  function StatBlock({ data, label }) {
    const stats = calcStats(data);
    if (!stats) return <p style={{ color:"#4A4036", fontStyle:"italic", fontSize:"13px", textAlign:"center", marginTop:"20px" }}>Пока нет данных за {label}.</p>;
    const sorted = Object.entries(stats.counts).sort((a,b) => b[1]-a[1]).filter(([,v]) => v > 0);
    const daysInPeriod = data.length;
    return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
          <div style={S.statCard}>
            <p style={S.statNum}>{stats.total}</p>
            <p style={S.statLabel}>из {daysInPeriod} дней</p>
          </div>
          <div style={S.statCard}>
            <p style={S.statNum}>{stats.avgScore}</p>
            <p style={S.statLabel}>средний балл</p>
          </div>
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
      <button onClick={onBack} style={S.backBtn}>← назад</button>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ color:"#7A6E62", fontStyle:"italic" }}>Загружаю твой путь...</p>
      </div>
    </div>
  );

  return (
    <div style={S.screen}>
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>← назад</button>
        <div style={S.hintBtn} title="Отмечай эмоцию каждый день. Серии, титулы, архетип — твой путь к себе.">ℹ</div>
      </div>

      {/* Титул */}
      <div style={{ textAlign:"center", marginBottom:"20px" }}>
        <div style={{ fontSize:"32px", marginBottom:"8px" }}>{title.emoji}</div>
        <p style={{ margin:0, fontSize:"18px", color:"#C8A97E", letterSpacing:"0.05em" }}>{title.name}</p>
        <p style={{ margin:"4px 0 0", fontSize:"12px", color:"#7A6E62" }}>{streak} {streak===1?"день":streak<5?"дня":"дней"} подряд</p>
        {nextTitle && <p style={{ margin:"4px 0 0", fontSize:"11px", color:"#4A4036" }}>до «{nextTitle.name}» — {nextTitle.days - streak} {nextTitle.days-streak===1?"день":"дней"}</p>}
        <div style={{ marginTop:"10px" }}><ShareButton text={shareTitle} label="Поделиться титулом ↗" /></div>
      </div>

      <div style={S.wisdomLine} />

      {/* Архетип */}
      {archetype && (
        <div style={{ ...S.teaNoteBox, margin:"16px 0", textAlign:"center" }}>
          <p style={{ margin:"0 0 4px", fontSize:"22px" }}>{archetype.emoji}</p>
          <p style={{ margin:"0 0 4px", fontSize:"15px", color:"#C8A97E" }}>{archetype.name}</p>
          <p style={{ margin:0, fontSize:"12px", color:"#7A6E62", fontStyle:"italic", lineHeight:1.6 }}>{archetype.desc}</p>
          <div style={{ marginTop:"10px" }}>
            <ShareButton text={`${archetype.emoji} Мой архетип — «${archetype.name}»\n${archetype.desc}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться архетипом ↗" />
          </div>
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

      {/* Табы статистики */}
      <div style={{ display:"flex", gap:"6px", margin:"16px 0 14px" }}>
        <TabBtn id="today" label="Неделя" />
        <TabBtn id="month" label="Месяц" />
        <TabBtn id="year"  label="Год" />
      </div>

      {tab === "today" && (
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
          <StatBlock data={weekData.map(d => d.data)} label="неделю" />
          {(() => { const ws = calcStats(weekData.map(d => d.data)); return ws ? (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid #2A2520", borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#C8A97E" }}>Итог недели</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Отмечался {ws.total} из 7 дней</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Средний балл: {ws.avgScore}/10</p>
              {ws.total > 0 && (() => { const top = Object.entries(ws.counts).sort((a,b) => b[1]-a[1])[0]; const topEm = EMOTIONS.find(e => e.id === top[0]); return <p style={{ margin:0, fontSize:"13px", color:"#D0C8BC" }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>; })()}
              <div style={{ marginTop:"12px" }}>
                <ShareButton text={`📊 Моя неделя в Tea Bro\n\nОтмечался ${ws.total} из 7 дней\nСредний балл: ${ws.avgScore}/10\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться итогом ↗" />
              </div>
            </div>
          ) : null; })()}
        </div>
      )}

      {tab === "month" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"12px" }}>ПОСЛЕДНИЕ 30 ДНЕЙ</p>
          <StatBlock data={monthData} label="месяц" />
          {(() => { const ms = calcStats(monthData); return ms ? (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid #2A2520", borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#C8A97E" }}>Итог месяца</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Отмечался {ms.total} из 30 дней</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Средний балл: {ms.avgScore}/10</p>
              {ms.total > 0 && (() => { const top = Object.entries(ms.counts).sort((a,b) => b[1]-a[1])[0]; const topEm = EMOTIONS.find(e => e.id === top[0]); return <p style={{ margin:0, fontSize:"13px", color:"#D0C8BC" }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>; })()}
              <div style={{ marginTop:"12px" }}>
                <ShareButton text={`📊 Мой месяц в Tea Bro\n\nОтмечался ${ms.total} из 30 дней\nСредний балл: ${ms.avgScore}/10\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться итогом ↗" />
              </div>
            </div>
          ) : null; })()}
        </div>
      )}

      {tab === "year" && (
        <div>
          <p style={{ fontSize:"11px", letterSpacing:"0.15em", color:"#C8A97E", marginBottom:"12px" }}>ПОСЛЕДНИЕ 365 ДНЕЙ</p>
          <StatBlock data={allData} label="год" />
          {allStats && (
            <div style={{ marginTop:"16px", padding:"14px", background:"rgba(200,169,126,0.04)", border:"1px solid #2A2520", borderRadius:"10px" }}>
              <p style={{ margin:"0 0 8px", fontSize:"13px", color:"#C8A97E" }}>Годовой отчет</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Отмечался {allStats.total} из 365 дней</p>
              <p style={{ margin:"0 0 4px", fontSize:"13px", color:"#D0C8BC" }}>Средний балл: {allStats.avgScore}/10</p>
              {allStats.total > 0 && (() => {
                const top = Object.entries(allStats.counts).sort((a,b) => b[1]-a[1])[0];
                const topEm = EMOTIONS.find(e => e.id === top[0]);
                return <p style={{ margin:0, fontSize:"13px", color:"#D0C8BC" }}>Чаще всего: {topEm?.emoji} {topEm?.label}</p>;
              })()}
              <div style={{ marginTop:"12px" }}>
                <ShareButton text={`📊 Мой год в Tea Bro\n\nОтмечался ${allStats.total} дней\nСредний балл: ${allStats.avgScore}/10\n${archetype ? `Архетип: ${archetype.emoji} ${archetype.name}` : ""}\n\nTea Bro 🌱 t.me/TeaBroLifeBot/TeaBro`} label="Поделиться отчетом ↗" />
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
      <div style={S.screenHeader}>
        <button onClick={onBack} style={S.backBtn}>← назад</button>
        <div style={S.hintBtn} title="Здесь скоро появятся чаи, которые мы выбираем сами.">ℹ</div>
      </div>
      <div style={S.wisdomContainer}>
        <div style={{ fontSize:"48px", marginBottom:"20px" }}>🫖</div>
        <p style={{ ...S.wisdomText, fontSize:"22px", marginBottom:"12px" }}>Чайная лавка</p>
        <div style={S.wisdomLine} />
        <p style={{ fontSize:"14px", color:"#7A6E62", fontStyle:"italic", marginTop:"16px", lineHeight:1.8, textAlign:"center" }}>
          Скоро здесь появятся чаи,<br />которые мы выбираем сами.<br />Без лишнего. Только то, что работает.
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

  if (screen === "quiz")    return <QuizScreen onBack={() => setScreen("home")} />;
  if (screen === "wisdom")  return <WisdomScreen onBack={() => setScreen("home")} currentMood={currentMood} />;
  if (screen === "teaquiz") return <TeaQuizScreen onBack={() => setScreen("home")} onTeaResult={handleTeaResult} />;
  if (screen === "mood")    return <MoodScreen onBack={() => setScreen("home")} />;
  if (screen === "shop")    return <ShopScreen onBack={() => setScreen("home")} />;

  return (
    <div style={S.screen}>
      <div style={S.homeHeader}>
        <div style={S.moonIcon}>🌕</div>
        <h1 style={S.homeTitle}>Tea Bro</h1>
        <p style={S.homeSubtitle}>茶道 · твое личное пространство</p>
      </div>
      <p style={S.homeIntro}>Не о чае. О возвращении к себе.</p>
      <div style={S.menuList}>
        {[
          { id:"quiz",    title:"Далеко ли ты от себя?",    desc:"5 вопросов · 3 минуты · честный ответ" },
          { id:"wisdom",  title:"Совет дня",                desc:"3 совета · под твое состояние" },
          { id:"teaquiz", title:"Какой чай тебе нужен?",    desc:"5 вопросов · подбор под состояние" },
          { id:"mood",    title:"Мое состояние",            desc:"Эмоция дня · серии · твой путь" },
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
            <p style={S.menuCardTitle}>В чайную</p>
            <p style={S.menuCardDesc}>Пуэр, медитация, медленная жизнь</p>
          </div>
          <span style={S.menuCardArrow}>→</span>
        </a>
      </div>
      <div style={{ marginTop:"16px" }}>
        <button onClick={() => setScreen("shop")} style={S.shopBtn}>🫖 Чайная лавка</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// СТИЛИ
// ─────────────────────────────────────────────
const S = {
  screen: { minHeight:"100vh", backgroundColor:"#0F0D0B", color:"#E8E0D4", fontFamily:"'Georgia','Times New Roman',serif", padding:"24px 20px 40px", display:"flex", flexDirection:"column", boxSizing:"border-box" },
  screenHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" },
  backBtn: { background:"none", border:"none", color:"#7A6E62", fontSize:"14px", cursor:"pointer", padding:"0 0 20px 0", alignSelf:"flex-start", fontFamily:"'Georgia',serif", letterSpacing:"0.05em" },
  hintBtn: { background:"none", border:"1px solid #2A2520", color:"#4A4036", fontSize:"12px", cursor:"default", width:"22px", height:"22px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginBottom:"20px" },
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

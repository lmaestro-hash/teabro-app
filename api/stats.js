// api/stats.js — Tea Bro v3.6 (миграция с Vercel Blob на Vercel KV / Upstash Redis)
//
// ПОЧЕМУ ПЕРЕЕХАЛИ: раньше вся статистика лежала в одном JSON-файле в Blob,
// и каждая запись делала read-modify-write без блокировки. Если два запроса
// (например "open" от одного юзера и "tea" от другого, или просто быстрая
// навигация внутри одной сессии) попадали на сервер почти одновременно —
// они оба читали один и тот же "старый" файл, и кто дописывал вторым, тот
// перезаписывал чужой инкремент. Тесты страдали от этого сильнее входов,
// потому что "open" обычно улетает первым и успевает провалидироваться,
// а событие теста стреляет через несколько секунд — ровно в окно, когда
// ответ на "open"/"snapshot" ещё может быть в полёте.
//
// Теперь: счётчики — атомарный HINCRBY (Redis гарантирует, что оба
// конкурентных инкремента применятся), данные каждого юзера — свой ключ
// (гонка возможна только если один и тот же uid пишет из двух мест
// одновременно — на порядки реже, чем раньше).
import { kv } from "@vercel/kv";
import { verifyTelegramAuth } from "./verifyTelegramAuth.js";

// Проверка, что запрос на чтение чужих данных (get_users — Telegram ID +
// chatId + личные записи ВСЕХ юзеров) пришёл либо от собственного сервера
// (push.js), либо от владельца в настоящей Telegram-сессии. Раньше этот
// action не проверялся вообще — /api/stats?action=get_users отдавал полный
// дамп юзеров кому угодно без всякого пароля.
function isAuthorizedAdmin(req, params) {
  const internalSecret = req.headers["x-internal-secret"];
  if (internalSecret && process.env.INTERNAL_API_SECRET && internalSecret === process.env.INTERNAL_API_SECRET) {
    return true;
  }
  const auth = verifyTelegramAuth(params.initData, process.env.BOT_TOKEN);
  return auth.ok && String(auth.userId) === process.env.ADMIN_TELEGRAM_ID;
}

const COUNTERS_KEY = "counters";
const USERS_SET_KEY = "users";
const EMOTION_COUNTERS_KEY = "emotionCounts";
// Обезличенная гистограмма итоговых баллов теста "Склонность к самообману".
// Не привязана к uid — только распределение по бакетам 0-9/10-19/.../90-100,
// плюс sum/count для среднего. Нужно, чтобы позже пересчитать границы
// результатов (сейчас 0-25/26-50/51-75/76-100) по реальным ответам, а не вслепую.
const SELF_HONESTY_HIST_KEY = "selfHonestyHist";
// Держим в списке белым списком — не пишем в Redis произвольные поля,
// присланные с клиента (emotion=что-угодно), только известные id из EMOTIONS в App.jsx.
const VALID_EMOTION_IDS = ["joy", "inspired", "drive", "calm", "grateful", "pride", "love", "inspiration", "excitement", "anxiety", "lonely", "angry", "tired", "sad", "disappointed", "boredom"];

function defaultUser() {
  return {
    chatId: null,
    lastSeen: null,
    lastPushSent: null,
    lastPushOpened: null,
    pauseUntil: null,
    snapshots: [],
    letters: [],
  };
}

async function getUser(uid) {
  const raw = await kv.get(`user:${uid}`);
  if (!raw) return defaultUser();
  return {
    chatId: raw.chatId ?? null,
    lastSeen: raw.lastSeen ?? null,
    lastPushSent: raw.lastPushSent ?? null,
    lastPushOpened: raw.lastPushOpened ?? null,
    pauseUntil: raw.pauseUntil ?? null,
    snapshots: Array.isArray(raw.snapshots) ? raw.snapshots : [],
    letters: Array.isArray(raw.letters) ? raw.letters : [],
  };
}

async function saveUser(uid, user) {
  await kv.set(`user:${uid}`, user);
  await kv.sadd(USERS_SET_KEY, String(uid));
}

async function getAllUids() {
  const uids = await kv.smembers(USERS_SET_KEY);
  return uids || [];
}

async function getUsersMap() {
  const uids = await getAllUids();
  const users = {};
  if (!uids.length) return users;
  const records = await kv.mget(...uids.map(u => `user:${u}`));
  uids.forEach((uid, i) => { users[uid] = records[i] || defaultUser(); });
  return users;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getISOWeek() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil(((d - yearStart) / 86400000 + 1) / 7)}`;
}

async function incrCounter(field, by = 1) {
  return kv.hincrby(COUNTERS_KEY, field, by);
}

async function incrToday(field, by = 1) {
  return kv.hincrby(`day:${getTodayKey()}`, field, by);
}

async function addTodayUnique(uid) {
  return kv.sadd(`day:${getTodayKey()}:uids`, String(uid));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  if (req.method === "OPTIONS") return res.status(200).end();

  const params = req.method === "POST" ? req.body : req.query;
  const { action, uid, chatId, burnout, mood, notesCount, letterId, revealAt, emotion } = params;

  try {
    // ── Действия только на чтение ──
    if (action === "get") {
      const todayKey = getTodayKey();
      const [counters, todayStats, uniqueTotal, todayUniqueCount, uids, emotionCounters, selfHonestyHistRaw] = await Promise.all([
        kv.hgetall(COUNTERS_KEY),
        kv.hgetall(`day:${todayKey}`),
        kv.scard(USERS_SET_KEY),
        kv.scard(`day:${todayKey}:uids`),
        getAllUids(),
        kv.hgetall(EMOTION_COUNTERS_KEY),
        kv.hgetall(SELF_HONESTY_HIST_KEY),
      ]);
      const shCount = Number(selfHonestyHistRaw?.count) || 0;
      const shSum = Number(selfHonestyHistRaw?.sum) || 0;
      const selfHonestyHist = {
        count: shCount,
        average: shCount ? Math.round((shSum / shCount) * 10) / 10 : null,
        buckets: Array.from({ length: 10 }, (_, i) => {
          const floor = i * 10;
          return { range: `${floor}-${floor + 9}`, count: Number(selfHonestyHistRaw?.[String(floor)]) || 0 };
        }),
      };
      const emotionCounts = {};
      VALID_EMOTION_IDS.forEach(id => { emotionCounts[id] = Number(emotionCounters?.[id]) || 0; });
      let usersWithChatId = 0;
      if (uids.length) {
        const records = await kv.mget(...uids.map(u => `user:${u}`));
        usersWithChatId = records.filter(u => u && u.chatId).length;
      }
      return res.status(200).json({
        totalOpens: Number(counters?.totalOpens) || 0,
        totalQuiz: Number(counters?.totalQuiz) || 0,
        totalSelfHonesty: Number(counters?.totalSelfHonesty) || 0,
        totalHormones: Number(counters?.totalHormones) || 0,
        totalTea: Number(counters?.totalTea) || 0,
        totalMood: Number(counters?.totalMood) || 0,
        totalMeditation: Number(counters?.totalMeditation) || 0,
        uniqueTotal: uniqueTotal || 0,
        usersWithChatId,
        todayOpens: Number(todayStats?.opens) || 0,
        todayQuiz: Number(todayStats?.quiz) || 0,
        todayUnique: todayUniqueCount || 0,
        emotionCounts,
        selfHonestyHist,
      });
    }

    if (action === "get_users") {
      if (!isAuthorizedAdmin(req, params)) {
        return res.status(403).json({ error: "forbidden" });
      }
      const users = await getUsersMap();
      return res.status(200).json({ users });
    }

    // ── Действия с записью ──
    if (action === "open") {
      if (uid) {
        const user = await getUser(uid);
        user.lastSeen = Date.now();
        if (chatId) user.chatId = String(chatId);
        await saveUser(uid, user);
        await addTodayUnique(uid);
      }
      await incrCounter("totalOpens");
      await incrToday("opens");
      const usersCount = (await getAllUids()).length;
      return res.status(200).json({ ok: true, debug: { uid, chatId, usersCount } });
    }

    if (action === "snapshot") {
      if (!uid) return res.status(200).json({ ok: true });
      const user = await getUser(uid);
      const week = getISOWeek();
      const idx = user.snapshots.findIndex(s => s.week === week);
      const prev = idx >= 0 ? user.snapshots[idx] : null;
      const snap = {
        week,
        ts: Date.now(),
        burnout: burnout !== undefined ? Number(burnout) : (prev?.burnout ?? null),
        mood: mood || prev?.mood || null,
        notesCount: notesCount !== undefined ? Number(notesCount) : (prev?.notesCount ?? null),
        opens: (prev?.opens || 0) + 1,
      };
      if (burnout !== undefined && prev?.burnout != null) {
        snap.burnout = Math.round((prev.burnout + Number(burnout)) / 2);
      }
      if (idx >= 0) user.snapshots[idx] = snap;
      else {
        user.snapshots.push(snap);
        if (user.snapshots.length > 8) user.snapshots = user.snapshots.slice(-8);
      }
      user.lastSeen = Date.now();
      if (chatId) user.chatId = String(chatId);
      await saveUser(uid, user);
      return res.status(200).json({ ok: true });
    }

    if (action === "pause") {
      if (!uid) return res.status(200).json({ ok: true });
      const user = await getUser(uid);
      user.pauseUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
      await saveUser(uid, user);
      return res.status(200).json({ ok: true });
    }

    if (action === "schedule_letter") {
      if (!(uid && letterId && revealAt)) return res.status(200).json({ ok: true });
      const user = await getUser(uid);
      if (chatId) user.chatId = String(chatId);
      const idx = user.letters.findIndex(l => String(l.id) === String(letterId));
      const entry = { id: letterId, revealAt, notified: false };
      if (idx >= 0) user.letters[idx] = entry;
      else user.letters.push(entry);
      await saveUser(uid, user);
      return res.status(200).json({ ok: true });
    }

    if (action === "cancel_letter") {
      if (!(uid && letterId)) return res.status(200).json({ ok: true });
      const user = await getUser(uid);
      user.letters = user.letters.filter(l => String(l.id) !== String(letterId));
      await saveUser(uid, user);
      return res.status(200).json({ ok: true });
    }

    if (action === "push_opened") {
      if (!uid) return res.status(200).json({ ok: true });
      const user = await getUser(uid);
      user.lastPushOpened = Date.now();
      await saveUser(uid, user);
      return res.status(200).json({ ok: true });
    }

    if (action === "quiz") {
      await incrCounter("totalQuiz");
      await incrToday("quiz");
      return res.status(200).json({ ok: true });
    }

    if (action === "selfhonesty") {
      await incrCounter("totalSelfHonesty");
      return res.status(200).json({ ok: true });
    }

    if (action === "selfhonesty_result") {
      // Обезличенно: только итоговый балл 0-100, никакого uid.
      const score = Number(params.score);
      if (Number.isFinite(score) && score >= 0 && score <= 100) {
        const bucket = Math.min(90, Math.floor(score / 10) * 10);
        await Promise.all([
          kv.hincrby(SELF_HONESTY_HIST_KEY, String(bucket), 1),
          kv.hincrby(SELF_HONESTY_HIST_KEY, "count", 1),
          kv.hincrby(SELF_HONESTY_HIST_KEY, "sum", score),
        ]);
      }
      return res.status(200).json({ ok: true });
    }

    if (action === "hormones") {
      await incrCounter("totalHormones");
      return res.status(200).json({ ok: true });
    }

    if (action === "tea") {
      await incrCounter("totalTea");
      return res.status(200).json({ ok: true });
    }

    if (action === "meditation") {
      await incrCounter("totalMeditation");
      return res.status(200).json({ ok: true });
    }

    if (action === "mood") {
      await incrCounter("totalMood");
      // Только агрегированный счётчик по эмоции — не привязан к uid,
      // так что это не персональные данные, просто общая цифра "сколько раз выбрали X".
      if (emotion && VALID_EMOTION_IDS.includes(String(emotion))) {
        await kv.hincrby(EMOTION_COUNTERS_KEY, String(emotion), 1);
      }
      return res.status(200).json({ ok: true });
    }

    if (action === "update_user") {
      if (!uid) return res.status(200).json({ ok: true });
      const user = await getUser(uid);
      if (params.lastPushSent !== undefined) user.lastPushSent = Number(params.lastPushSent);
      if (params.lastSeen !== undefined) user.lastSeen = Number(params.lastSeen);
      await saveUser(uid, user);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });

  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

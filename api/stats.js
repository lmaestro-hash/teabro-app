// api/stats.js — Tea Bro v3.3 (fixed: list() with token auth)
import { put, list } from "@vercel/blob";

const STATS_KEY = "teabro-stats.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function readStats() {
  try {
    const { blobs } = await list({ prefix: "teabro-stats", token: TOKEN });
    const blob = blobs.find(b => b.pathname === STATS_KEY);
    if (!blob) return defaultStats();
    // Читаем через downloadUrl с токеном.
    // ВАЖНО: у Vercel Blob CDN своё кэширование на уровне edge, независимое
    // от writeStats(). Поскольку URL блоба не меняется (addRandomSuffix:false),
    // без cache-busting параметра CDN может отдавать устаревшую версию файла
    // сразу после записи. Добавляем ?t=timestamp, чтобы каждый запрос был
    // гарантированным cache miss.
    const base = blob.downloadUrl || blob.url;
    const url = `${base}${base.includes("?") ? "&" : "?"}t=${Date.now()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return defaultStats();
    const data = await res.json();
    return data || defaultStats();
  } catch (err) {
    console.error("readStats error:", err);
    return defaultStats();
  }
}

async function writeStats(data) {
  try {
    await put(STATS_KEY, JSON.stringify(data), {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      token: TOKEN,
    });
  } catch (err) {
    console.error("writeStats error:", err);
  }
}

function defaultStats() {
  return {
    totalOpens: 0,
    totalQuiz: 0,
    totalSelfHonesty: 0,
    totalHormones: 0,
    totalTea: 0,
    totalMood: 0,
    totalMeditation: 0,
    uniqueTotal: 0,
    byDay: {},
    users: {},
  };
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

function initUser(stats, uid) {
  if (!stats.users) stats.users = {};
  if (!stats.users[uid]) {
    stats.users[uid] = {
      chatId: null,
      lastSeen: null,
      lastPushSent: null,
      lastPushOpened: null,
      pauseUntil: null,
      snapshots: [],
      letters: [],
    };
  } else {
    const u = stats.users[uid];
    if (!u.snapshots) u.snapshots = [];
    if (!u.letters) u.letters = [];
    if (u.chatId === undefined) u.chatId = null;
    if (u.lastSeen === undefined) u.lastSeen = null;
    if (u.lastPushSent === undefined) u.lastPushSent = null;
    if (u.lastPushOpened === undefined) u.lastPushOpened = null;
    if (u.pauseUntil === undefined) u.pauseUntil = null;
  }
}

// Временная защита от гонки записи, пока храним всё в одном JSON-блобе
// (см. заметку в памяти про переход на Vercel KV). Читаем-мутируем-пишем,
// затем перепроверяем, что именно НАША запись долетела последней — если нет
// (кто-то записал почти одновременно и затёр нас), перечитываем свежие
// данные и пробуем снова. mutateFn обязан работать на любом свежем stats,
// который ему дадут — не хранить состояние снаружи.
async function withRetryWrite(mutateFn, maxAttempts = 5) {
  const todayKey = getTodayKey();
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const stats = await readStats();
    if (!stats.byDay) stats.byDay = {};
    if (!stats.users) stats.users = {};
    if (!stats.byDay[todayKey]) stats.byDay[todayKey] = { opens: 0, quiz: 0, uniqueIds: [] };
    if (!stats.byDay[todayKey].uniqueIds) stats.byDay[todayKey].uniqueIds = [];
    const today = stats.byDay[todayKey];

    const result = mutateFn(stats, today);

    const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    stats._writeStamp = stamp;
    await writeStats(stats);

    const verify = await readStats();
    if (verify._writeStamp === stamp) {
      return { stats, today, result };
    }
    await new Promise(r => setTimeout(r, 60 + Math.random() * 140));
  }
  return null; // не смогли записать за 5 попыток — при реальном трафике почти невозможно
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const params = req.method === "POST" ? req.body : req.query;
  const { action, uid, chatId, burnout, mood, notesCount, letterId, revealAt } = params;

  try {
    // ── Действия только на чтение — без retry-записи, читаем один раз ──
    if (action === "get") {
      const stats = await readStats();
      const todayKey = getTodayKey();
      const today = (stats.byDay && stats.byDay[todayKey]) || { opens: 0, quiz: 0, uniqueIds: [] };
      const usersObj = stats.users || {};
      const withChatId = Object.values(usersObj).filter(u => u.chatId).length;
      return res.status(200).json({
        totalOpens: stats.totalOpens || 0,
        totalQuiz: stats.totalQuiz || 0,
        totalSelfHonesty: stats.totalSelfHonesty || 0,
        totalHormones: stats.totalHormones || 0,
        totalTea: stats.totalTea || 0,
        totalMood: stats.totalMood || 0,
        totalMeditation: stats.totalMeditation || 0,
        uniqueTotal: stats.uniqueTotal || 0,
        usersWithChatId: withChatId,
        todayOpens: today.opens || 0,
        todayQuiz: today.quiz || 0,
        todayUnique: today.uniqueIds?.length || 0,
      });
    }

    if (action === "get_users") {
      const stats = await readStats();
      return res.status(200).json({ users: stats.users || {} });
    }

    // ── Действия с записью — все через withRetryWrite ──
    if (action === "open") {
      const out = await withRetryWrite((stats, today) => {
        if (uid) initUser(stats, uid);
        stats.totalOpens = (stats.totalOpens || 0) + 1;
        today.opens = (today.opens || 0) + 1;
        if (uid) {
          if (!today.uniqueIds.includes(String(uid))) {
            today.uniqueIds.push(String(uid));
            stats.uniqueTotal = (stats.uniqueTotal || 0) + 1;
          }
          stats.users[uid].lastSeen = Date.now();
          if (chatId) stats.users[uid].chatId = String(chatId);
        }
      });
      return res.status(200).json({ ok: true, debug: { uid, chatId, usersCount: out ? Object.keys(out.stats.users).length : null } });
    }

    if (action === "snapshot") {
      await withRetryWrite((stats) => {
        if (!uid) return;
        initUser(stats, uid);
        const week = getISOWeek();
        const user = stats.users[uid];
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
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "pause") {
      await withRetryWrite((stats) => {
        if (!uid) return;
        initUser(stats, uid);
        stats.users[uid].pauseUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "schedule_letter") {
      await withRetryWrite((stats) => {
        if (!(uid && letterId && revealAt)) return;
        initUser(stats, uid);
        const user = stats.users[uid];
        if (chatId) user.chatId = String(chatId);
        const idx = user.letters.findIndex(l => String(l.id) === String(letterId));
        const entry = { id: letterId, revealAt, notified: false };
        if (idx >= 0) user.letters[idx] = entry;
        else user.letters.push(entry);
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "cancel_letter") {
      await withRetryWrite((stats) => {
        if (!(uid && letterId)) return;
        initUser(stats, uid);
        const user = stats.users[uid];
        user.letters = (user.letters || []).filter(l => String(l.id) !== String(letterId));
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "push_opened") {
      await withRetryWrite((stats) => {
        if (!uid) return;
        initUser(stats, uid);
        stats.users[uid].lastPushOpened = Date.now();
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "quiz") {
      await withRetryWrite((stats, today) => {
        stats.totalQuiz = (stats.totalQuiz || 0) + 1;
        today.quiz = (today.quiz || 0) + 1;
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "selfhonesty") {
      await withRetryWrite((stats) => {
        stats.totalSelfHonesty = (stats.totalSelfHonesty || 0) + 1;
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "hormones") {
      await withRetryWrite((stats) => {
        stats.totalHormones = (stats.totalHormones || 0) + 1;
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "tea") {
      await withRetryWrite((stats) => {
        stats.totalTea = (stats.totalTea || 0) + 1;
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "meditation") {
      await withRetryWrite((stats) => {
        stats.totalMeditation = (stats.totalMeditation || 0) + 1;
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "mood") {
      await withRetryWrite((stats) => {
        stats.totalMood = (stats.totalMood || 0) + 1;
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "update_user") {
      await withRetryWrite((stats) => {
        if (!uid) return;
        initUser(stats, uid);
        if (params.lastPushSent !== undefined) stats.users[uid].lastPushSent = Number(params.lastPushSent);
        if (params.lastSeen !== undefined) stats.users[uid].lastSeen = Number(params.lastSeen);
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });

  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: String(err) });
  }
}

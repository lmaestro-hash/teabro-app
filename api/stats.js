// api/stats.js — Tea Bro v3.2
// Серверная статистика + snapshot для push-уведомлений

import { put, head } from "@vercel/blob";

const STATS_KEY = "teabro-stats.json";

async function readStats() {
  try {
    const info = await head(STATS_KEY);
    if (!info) return defaultStats();
    const res = await fetch(info.downloadUrl, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return defaultStats();
    return await res.json();
  } catch (err) {
    console.error("readStats error:", err);
    return defaultStats();
  }
}

async function writeStats(data) {
  await put(STATS_KEY, JSON.stringify(data), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

function defaultStats() {
  return {
    totalOpens: 0,
    totalQuiz: 0,
    totalTea: 0,
    totalMood: 0,
    totalMeditation: 0,
    uniqueTotal: 0,
    byDay: {},
    users: {}, // uid → { chatId, lastSeen, lastPushSent, lastPushOpened, pauseUntil, snapshots[] }
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { action, uid, chatId, burnout, mood, notesCount } =
    req.method === "POST" ? req.body : req.query;

  const todayKey = getTodayKey();

  try {
    const stats = await readStats();

    if (!stats.byDay[todayKey]) {
      stats.byDay[todayKey] = { opens: 0, quiz: 0, tea: 0, uniqueIds: [] };
    }
    const today = stats.byDay[todayKey];

    // ── Инициализация / докладка записи пользователя ──
    // Создаём с нуля, если пользователя ещё нет, ИЛИ докладываем
    // недостающие поля, если запись создана старой версией схемы.
    if (uid) {
      if (!stats.users[uid]) {
        stats.users[uid] = {
          chatId: null,
          lastSeen: null,
          lastPushSent: null,
          lastPushOpened: null,
          pauseUntil: null,
          snapshots: [],
        };
      } else {
        const u = stats.users[uid];
        if (u.chatId === undefined) u.chatId = null;
        if (u.lastSeen === undefined) u.lastSeen = null;
        if (u.lastPushSent === undefined) u.lastPushSent = null;
        if (u.lastPushOpened === undefined) u.lastPushOpened = null;
        if (u.pauseUntil === undefined) u.pauseUntil = null;
        if (!Array.isArray(u.snapshots)) u.snapshots = [];
      }
    }

    // ── open ──
    if (action === "open") {
      stats.totalOpens = (stats.totalOpens || 0) + 1;
      today.opens = (today.opens || 0) + 1;
      if (uid) {
        if (!today.uniqueIds.includes(String(uid))) {
          today.uniqueIds.push(String(uid));
          stats.uniqueTotal = (stats.uniqueTotal || 0) + 1;
        }
        stats.users[uid].lastSeen = Date.now();
        // chat_id из параметра (передаётся при открытии Mini App)
        if (chatId) stats.users[uid].chatId = String(chatId);
      }
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    // ── register — сохранить chat_id ──
    if (action === "register") {
      if (uid && chatId) {
        stats.users[uid].chatId = String(chatId);
        await writeStats(stats);
      }
      return res.status(200).json({ ok: true });
    }

    // ── snapshot — сохранить состояние пользователя ──
    if (action === "snapshot") {
      if (uid) {
        const week = getISOWeek();
        const user = stats.users[uid];
        // Обновляем или добавляем снэпшот текущей недели
        const idx = user.snapshots.findIndex(s => s.week === week);
        const snap = {
          week,
          ts: Date.now(),
          burnout: burnout !== undefined ? Number(burnout) : null,
          mood: mood || null,
          notesCount: notesCount !== undefined ? Number(notesCount) : null,
          opens: (user.snapshots.find(s => s.week === week)?.opens || 0) + 1,
        };
        if (idx >= 0) {
          // Обновляем снэпшот недели, накапливаем opens
          snap.opens = user.snapshots[idx].opens + 1;
          // Среднее выгорание за неделю
          if (burnout !== undefined && user.snapshots[idx].burnout !== null) {
            snap.burnout = Math.round((user.snapshots[idx].burnout + Number(burnout)) / 2);
          }
          user.snapshots[idx] = snap;
        } else {
          user.snapshots.push(snap);
          // Храним только последние 8 недель
          if (user.snapshots.length > 8) user.snapshots = user.snapshots.slice(-8);
        }
        user.lastSeen = Date.now();
        await writeStats(stats);
      }
      return res.status(200).json({ ok: true });
    }

    // ── push_opened — пользователь открыл пуш ──
    if (action === "push_opened") {
      if (uid) {
        stats.users[uid].lastPushOpened = Date.now();
        await writeStats(stats);
      }
      return res.status(200).json({ ok: true });
    }

    // ── pause — поставить паузу на месяц ──
    if (action === "pause") {
      if (uid) {
        const pauseUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
        stats.users[uid].pauseUntil = pauseUntil;
        await writeStats(stats);
      }
      return res.status(200).json({ ok: true });
    }

    // ── quiz ──
    if (action === "quiz") {
      stats.totalQuiz = (stats.totalQuiz || 0) + 1;
      today.quiz = (today.quiz || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    // ── tea ──
    if (action === "tea") {
      stats.totalTea = (stats.totalTea || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    // ── meditation ──
    if (action === "meditation") {
      stats.totalMeditation = (stats.totalMeditation || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    // ── mood ──
    if (action === "mood") {
      stats.totalMood = (stats.totalMood || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    // ── get ──
    if (action === "get") {
      return res.status(200).json({
        totalOpens: stats.totalOpens || 0,
        totalQuiz: stats.totalQuiz || 0,
        totalTea: stats.totalTea || 0,
        totalMood: stats.totalMood || 0,
        totalMeditation: stats.totalMeditation || 0,
        uniqueTotal: stats.uniqueTotal || 0,
        todayOpens: today.opens || 0,
        todayQuiz: today.quiz || 0,
        todayUnique: today.uniqueIds?.length || 0,
      });
    }

    // ── get_users (для push endpoint) ──
    if (action === "get_users") {
      return res.status(200).json({ users: stats.users });
    }

    // ── update_user (после отправки пуша) ──
    if (action === "update_user") {
      if (uid && req.method === "POST") {
        const body = req.body;
        if (body.lastPushSent !== undefined) stats.users[uid].lastPushSent = body.lastPushSent;
        await writeStats(stats);
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown action" });

  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}

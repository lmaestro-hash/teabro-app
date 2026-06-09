// api/stats.js — Tea Bro v2.4
// Серверная статистика через Vercel Blob
// Единый источник данных для ТГ и браузера

import { put, head } from "@vercel/blob";

const STATS_KEY = "teabro-stats.json";

async function readStats() {
  try {
    const info = await head(STATS_KEY);
    if (!info) return defaultStats();
    // Для private store читаем через fetch с токеном
    const res = await fetch(info.downloadUrl, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return defaultStats();
    return await res.json();
  } catch {
    return defaultStats();
  }
}

async function writeStats(data) {
  await put(STATS_KEY, JSON.stringify(data), {
    access: "private",
    allowOverwrite: true,
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
  };
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { action, uid } = req.method === "POST"
    ? req.body
    : req.query;

  const todayKey = getTodayKey();

  try {
    const stats = await readStats();

    if (!stats.byDay[todayKey]) {
      stats.byDay[todayKey] = { opens: 0, quiz: 0, tea: 0, uniqueIds: [] };
    }
    const today = stats.byDay[todayKey];

    if (action === "open") {
      stats.totalOpens = (stats.totalOpens || 0) + 1;
      today.opens = (today.opens || 0) + 1;
      if (uid && !today.uniqueIds.includes(String(uid))) {
        today.uniqueIds.push(String(uid));
        stats.uniqueTotal = (stats.uniqueTotal || 0) + 1;
      }
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    if (action === "quiz") {
      stats.totalQuiz = (stats.totalQuiz || 0) + 1;
      today.quiz = (today.quiz || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    if (action === "tea") {
      stats.totalTea = (stats.totalTea || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    if (action === "mood") {
      stats.totalMood = (stats.totalMood || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

    if (action === "meditation") {
      stats.totalMeditation = (stats.totalMeditation || 0) + 1;
      await writeStats(stats);
      return res.status(200).json({ ok: true });
    }

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

    return res.status(400).json({ error: "Unknown action" });

  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}

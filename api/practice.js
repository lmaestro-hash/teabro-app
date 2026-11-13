// api/practice.js — Tea Bro · Дневник практик (бег / качалка / йога / медитация)
//
// Хранение: Vercel KV (Upstash Redis). Одна запись практики = одно поле в HASH
// `practice:{uid}` (поле = id записи). Поэтому нет read-modify-write всего файла
// и нет лимита 4096 символов, как у Telegram CloudStorage.
// Конфиг пользователя (свои теги, упражнения, шаблоны) — отдельный ключ `practice:cfg:{uid}`.
//
// Безопасность: uid берётся ТОЛЬКО из подписанного initData (verifyTelegramAuth),
// а не из параметров запроса — чужие записи прочитать/изменить нельзя.
// Админка и статистика этих данных не видят: текст заметок остаётся личным.
import { kv } from "@vercel/kv";
import { verifyTelegramAuth } from "./verifyTelegramAuth.js";

const DIRS = ["gym", "run", "yoga", "med"];
const MAX_ENTRIES = 5000;
const MAX_BATCH = 50;
const MAX_X_CHARS = 6000;
const MAX_CFG_CHARS = 30000;

const str = (v, n) => (typeof v === "string" ? v.slice(0, n) : "");
const num = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};
const strList = (a, maxItems, maxLen) =>
  Array.isArray(a) ? a.filter((s) => typeof s === "string" && s.trim()).slice(0, maxItems).map((s) => s.slice(0, maxLen)) : [];

function cleanState(s) {
  if (!s || typeof s !== "object") return {};
  const out = {};
  for (const k of ["e", "m", "t"]) {
    const n = num(s[k], 1, 5);
    if (n != null) out[k] = Math.round(n);
  }
  return out;
}

function cleanEntry(e) {
  if (!e || typeof e !== "object") return null;
  const id = str(e.id, 40);
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(id)) return null;
  if (!DIRS.includes(e.dir)) return null;
  if (typeof e.d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e.d)) return null;
  let x = {};
  if (e.x && typeof e.x === "object") {
    const s = JSON.stringify(e.x);
    if (s.length <= MAX_X_CHARS) x = e.x;
  }
  return {
    id,
    d: e.d,
    dir: e.dir,
    sub: str(e.sub, 30),
    dur: Math.round(num(e.dur, 0, 600) ?? 0),
    int: Math.round(num(e.int, 0, 5) ?? 0),
    pre: cleanState(e.pre),
    post: cleanState(e.post),
    zb: strList(e.zb, 12, 20),
    za: strList(e.za, 12, 20),
    tags: strList(e.tags, 12, 30),
    note: str(e.note, 2000),
    x,
    ts: Math.round(num(e.ts, 0, 4e12) ?? Date.now()),
  };
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const p = req.body || {};
  const auth = verifyTelegramAuth(p.initData, process.env.BOT_TOKEN);
  if (!auth.ok) return res.status(401).json({ error: "unauthorized" });

  const uid = String(auth.userId);
  const key = `practice:${uid}`;
  const cfgKey = `practice:cfg:${uid}`;

  try {
    switch (p.action) {
      case "list": {
        const all = (await kv.hgetall(key)) || {};
        const entries = Object.values(all).map((v) => (typeof v === "string" ? JSON.parse(v) : v));
        const cfg = (await kv.get(cfgKey)) || null;
        return res.status(200).json({ entries, cfg });
      }
      case "save": {
        const list = Array.isArray(p.entries) ? p.entries.slice(0, MAX_BATCH) : [];
        const clean = list.map(cleanEntry).filter(Boolean);
        if (!clean.length) return res.status(400).json({ error: "no_valid_entries" });
        const count = await kv.hlen(key);
        if (count + clean.length > MAX_ENTRIES) return res.status(413).json({ error: "limit" });
        const obj = {};
        clean.forEach((e) => { obj[e.id] = e; });
        await kv.hset(key, obj);
        return res.status(200).json({ ok: true, saved: clean.length });
      }
      case "delete": {
        const id = str(p.id, 40);
        if (!id) return res.status(400).json({ error: "bad_id" });
        await kv.hdel(key, id);
        return res.status(200).json({ ok: true });
      }
      case "cfg": {
        if (!p.cfg || typeof p.cfg !== "object") return res.status(400).json({ error: "bad_cfg" });
        if (JSON.stringify(p.cfg).length > MAX_CFG_CHARS) return res.status(413).json({ error: "limit" });
        await kv.set(cfgKey, p.cfg);
        return res.status(200).json({ ok: true });
      }
      case "wipe": {
        await kv.del(key);
        await kv.del(cfgKey);
        return res.status(200).json({ ok: true });
      }
      default:
        return res.status(400).json({ error: "unknown_action" });
    }
  } catch (err) {
    return res.status(500).json({ error: "server_error" });
  }
}

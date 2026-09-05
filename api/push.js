// api/push.js — Tea Bro v3.5
// Запускается каждый час через Vercel Cron
// Дайджест — не по календарю, а индивидуально: раз в 15 дней, только если юзер неактивен 5+ дней
// Письма себе — проверяются на каждый тик, независимо от дайджеста

const STATS_URL = "https://teabro-app.vercel.app/api/stats";
const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = "https://teabro-app.vercel.app";

function getISOWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return `${d.getFullYear()}-W${Math.ceil(((d - yearStart) / 86400000 + 1) / 7)}`;
}

function getPrevISOWeek() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return getISOWeek(d);
}

function selectTemplate(user) {
  const snaps = user.snapshots || [];
  const cur = snaps.find(s => s.week === getISOWeek()) || null;
  const prev = snaps.find(s => s.week === getPrevISOWeek()) || null;

  const daysSince = user.lastSeen
    ? Math.floor((Date.now() - user.lastSeen) / 86400000)
    : 999;

  if (daysSince >= 14) {
    const d = daysSince === 1 ? "день" : daysSince < 5 ? "дня" : "дней";
    return `🌕 Давно не виделись — ${daysSince} ${d}.\n\nКак ты сейчас?`;
  }
  if (cur?.burnout != null && prev?.burnout != null && cur.burnout - prev.burnout >= 10) {
    return `🌕 Эта неделя была тяжелее.\n\nВыгорание: ${prev.burnout}% → ${cur.burnout}%\nНастроение: ${cur.mood || "🤔"}\n\nЗайди — там есть кое-что для тебя.`;
  }
  if (cur?.burnout >= 55 && cur?.mood && ["😴","😟","😡"].includes(cur.mood)) {
    return `🌕 Эта неделя была про усталость.\n\nВыгорание: ${cur.burnout}%\nНастроение чаще: ${cur.mood}\n\nЗайди — побудь с собой пять минут.`;
  }
  if (cur?.mood && ["😌","😊","💪"].includes(cur.mood)) {
    if (prev?.burnout != null && cur.burnout < prev.burnout) {
      return `🌕 Тихая неделя.\n\nВыгорание: ${cur.burnout}% — ниже обычного.\nНастроение: ${cur.mood}\n\nИногда ровно — это и есть хорошо.`;
    }
    return `🌕 Спокойная неделя.\n\nВыгорание: ${cur?.burnout != null ? cur.burnout + "%" : "—"}\nНастроение: ${cur.mood}\n\nТакие недели стоит замечать — они редкие.`;
  }
  if (cur && cur.opens >= 3 && cur.burnout != null) {
    return `🌕 Смешанная неделя.\n\nВыгорание: ${cur.burnout}%\nНастроение скакало: ${cur.mood || "🤔"}\n\nТак бывает. Ты не обязан быть ровным.`;
  }
  if (cur?.notesCount === 0 && (prev?.notesCount === 0 || !prev)) {
    return `🌕 Прошла неделя без записей.\n\nТы давно не писал себе.\nМожет есть что сказать — только себе?`;
  }
  const weeks = snaps.length;
  if (weeks > 0 && weeks % 4 === 0) {
    return `🌕 ${weeks} ${weeks < 5 ? "недели" : "недель"} подряд.\n\nТы наблюдаешь за собой уже месяц.\nЭто не случайность.`;
  }
  if (cur?.burnout != null) {
    return `🌕 Срез недели.\n\nВыгорание: ${cur.burnout}%\nНастроение: ${cur.mood || "🤔"}\n\nЗайди — посмотри на себя.`;
  }
  return `🌕 Новая неделя.\n\nЗайди — отметь как ты сейчас.`;
}

function shouldSend(user) {
  const now = Date.now();
  if (!user.chatId) return false;
  if (user.pauseUntil && now < user.pauseUntil) return false;
  const daysSince = user.lastSeen
    ? Math.floor((now - user.lastSeen) / 86400000)
    : 999;
  if (daysSince < 5) return false; // ещё не считается неактивным — не трогаем
  if (user.lastPushSent && now - user.lastPushSent < 15 * 24 * 60 * 60 * 1000) return false; // не чаще раза в 15 дней
  return true;
}

function letterText() {
  return `🌕 Ты просил напомнить о письме именно сегодня.\n\nЗайди — время пришло.`;
}

async function checkLetters(users) {
  let sent = 0;
  for (const [uid, user] of Object.entries(users || {})) {
    if (!user.chatId || !user.letters?.length) continue;
    const due = user.letters.filter(l => !l.notified && new Date(l.revealAt) <= new Date());
    if (!due.length) continue;
    // Сначала помечаем письмо как обработанное (быстрая запись в свою же Blob),
    // и только потом шлём в Telegram — так конкурентный вызов /api/push
    // (двойной тап, пересечение с кроном) видит письмо уже снятым с очереди
    // и не дублирует отправку. Окно гонки не нулевое, но на порядки меньше.
    for (const l of due) {
      await fetch(`${STATS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel_letter", uid, letterId: l.id }),
      });
    }
    const ok = await sendPush(user.chatId, letterText(), { withPause: false });
    if (ok) sent++;
    await new Promise(r => setTimeout(r, 50));
  }
  return sent;
}

async function sendPush(chatId, text, { withPause = true } = {}) {
  const buttons = withPause
    ? [{ text: "⏸ Пауза на месяц", callback_data: "pause_pushes" }, { text: "Открыть 🌕", web_app: { url: APP_URL } }]
    : [{ text: "Открыть 🌕", web_app: { url: APP_URL } }];
  const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [buttons] },
    }),
  });
  return resp.ok;
}

// То же самое, но возвращает точный ответ Telegram при ошибке — для диагностики рассылки
async function sendPushDebug(chatId, text) {
  const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [{ text: "Открыть 🌕", web_app: { url: APP_URL } }] },
    }),
  });
  let body = null;
  try { body = await resp.json(); } catch (e) { body = null; }
  return { ok: resp.ok, status: resp.status, description: body?.description || null };
}

export default async function handler(req, res) {
  try {
    const statsRes = await fetch(`${STATS_URL}?action=get_users`);
    const { users } = await statsRes.json();

    // Ручная разовая рассылка всем — вызывается по секретной ссылке, обходит
    // обычные ограничения (5 дней неактивности / раз в 15 дней). Для анонсов.
    if (req.query?.broadcast === "teabro_admin_2024") {
      const text = `🌕 Новая неделя.\n\nПоявился новый тест — «Гормональный код». Загляни, узнай своё слабое звено из семи систем.\n\nЗайди — отметь как ты сейчас.`;
      let sent = 0, skipped = 0;
      const details = [];
      for (const [uid, user] of Object.entries(users || {})) {
        if (!user.chatId) { skipped++; details.push({ uid, reason: "нет chatId" }); continue; }
        const r = await sendPushDebug(user.chatId, text);
        if (r.ok) { sent++; } else { skipped++; details.push({ uid, chatId: user.chatId, status: r.status, reason: r.description }); }
        await new Promise(res => setTimeout(res, 50));
      }
      return res.status(200).json({ ok: true, broadcast: true, sent, skipped, details });
    }

    // Проверка писем себе — на каждый тик крона
    const lettersSent = await checkLetters(users);

    // Дайджест — индивидуально по каждому юзеру (см. shouldSend), тоже на каждый тик
    let sent = 0;
    let skipped = 0;

    for (const [uid, user] of Object.entries(users || {})) {
      if (!shouldSend(user)) { skipped++; continue; }
      const text = selectTemplate(user);
      await fetch(`${STATS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_user", uid, lastPushSent: Date.now() }),
      });
      const ok = await sendPush(user.chatId, text);
      if (ok) sent++; else skipped++;
      await new Promise(r => setTimeout(r, 50));
    }

    return res.status(200).json({ ok: true, sent, skipped, lettersSent });
  } catch (err) {
    console.error("Push error:", err);
    return res.status(500).json({ error: String(err) });
  }
}

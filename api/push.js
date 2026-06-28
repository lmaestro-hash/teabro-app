// api/push.js — Tea Bro v3.2
// Запускается каждый час через Vercel Cron (Hobby план)
// Реально рассылает только в пн 07:00 UTC (10:00 Киев) и чт 15:00 UTC (18:00 Киев)

const STATS_URL = "https://teabro-app.vercel.app/api/stats";
const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = "https://teabro-app.vercel.app";
const CRON_SECRET = process.env.CRON_SECRET;

// ── Утилиты дат ──
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

// ── 9 шаблонов пушей ──
function selectTemplate(user) {
  const snaps = user.snapshots || [];
  const week = getISOWeek();
  const prevWeek = getPrevISOWeek();
  const cur = snaps.find(s => s.week === week) || null;
  const prev = snaps.find(s => s.week === prevWeek) || null;

  const daysSince = user.lastSeen
    ? Math.floor((Date.now() - user.lastSeen) / 86400000)
    : 999;

  // 1. Пропал 3+ дней
  if (daysSince >= 3) {
    const days = daysSince;
    const d = days === 1 ? "день" : days < 5 ? "дня" : "дней";
    return `🌕 Давно не виделись — ${days} ${d}.\n\nКак ты сейчас?`;
  }

  // 2. Выгорание выросло на 10%+
  if (cur?.burnout != null && prev?.burnout != null) {
    if (cur.burnout - prev.burnout >= 10) {
      return `🌕 Эта неделя была тяжелее.\n\nВыгорание: ${prev.burnout}% → ${cur.burnout}%\nНастроение: ${cur.mood || "🤔"}\n\nЗайди — там есть кое-что для тебя.`;
    }
  }

  // 3. Усталость/тревога (burnout > 55)
  if (cur?.burnout >= 55 && cur?.mood && ["😴","😟","😡"].includes(cur.mood)) {
    return `🌕 Эта неделя была про усталость.\n\nВыгорание: ${cur.burnout}%\nНастроение чаще: ${cur.mood}\n\nЗайди — побудь с собой пять минут.`;
  }

  // 4. Спокойный (хороший мод + burnout упал)
  if (cur?.mood && ["😌","😊","💪"].includes(cur.mood)) {
    if (prev?.burnout != null && cur.burnout < prev.burnout) {
      return `🌕 Тихая неделя.\n\nВыгорание: ${cur.burnout}% — ниже обычного.\nНастроение: ${cur.mood}\n\nИногда ровно — это и есть хорошо.`;
    }
    return `🌕 Спокойная неделя.\n\nВыгорание: ${cur?.burnout != null ? cur.burnout + "%" : "—"}\nНастроение: ${cur.mood}\n\nТакие недели стоит замечать — они редкие.`;
  }

  // 5. Смешанная (много заходов, нет паттерна)
  if (cur && cur.opens >= 3 && cur.burnout != null) {
    return `🌕 Смешанная неделя.\n\nВыгорание: ${cur.burnout}%\nНастроение скакало: ${cur.mood || "🤔"}\n\nТак бывает. Ты не обязан быть ровным.`;
  }

  // 6. Не писал в блокнот 7+ дней
  if (cur?.notesCount === 0 && (prev?.notesCount === 0 || !prev)) {
    return `🌕 Прошла неделя без записей.\n\nТы давно не писал себе.\nМожет есть что сказать — только себе?`;
  }

  // 7. Streak кратен 4 неделям
  const weeks = snaps.length;
  if (weeks > 0 && weeks % 4 === 0) {
    return `🌕 ${weeks} ${weeks < 5 ? "недели" : "недель"} подряд.\n\nТы наблюдаешь за собой уже месяц.\nЭто не случайность.`;
  }

  // 8. Есть данные — дефолт со статистикой
  if (cur?.burnout != null) {
    return `🌕 Срез недели.\n\nВыгорание: ${cur.burnout}%\nНастроение: ${cur.mood || "🤔"}\n\nЗайди — посмотри на себя.`;
  }

  // 9. Нет данных — дефолт без цифр
  return `🌕 Новая неделя.\n\nЗайди — отметь как ты сейчас.`;
}

// ── Проверка: отправлять ли пуш ──
function shouldSend(user) {
  const now = Date.now();
  if (!user.chatId) return false;
  if (user.pauseUntil && now < user.pauseUntil) return false;

  const daysSince = user.lastSeen
    ? Math.floor((now - user.lastSeen) / 86400000)
    : 999;
  if (daysSince >= 7) return false;

  // Предыдущий пуш проигнорирован — пропускаем
  if (user.lastPushSent && !user.lastPushOpened) {
    if (now - user.lastPushSent < 6 * 24 * 60 * 60 * 1000) return false;
  }

  return true;
}

// ── Отправка сообщения ──
async function sendPush(chatId, text) {
  const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[
          { text: "⏸ Пауза на месяц", callback_data: "pause_pushes" },
          { text: "Открыть 🌕", web_app: { url: APP_URL } },
        ]],
      },
    }),
  });
  return resp.ok;
}

export default async function handler(req, res) {
  // Защита от случайных вызовов
  const auth = req.headers["authorization"];
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Проверяем время — только пн 07:00 UTC и чт 15:00 UTC
  const now = new Date();
  const day = now.getUTCDay();   // 1=пн, 4=чт
  const hour = now.getUTCHours();
  const isPushTime = (day === 1 && hour === 7) || (day === 4 && hour === 15);

  if (!isPushTime) {
    return res.status(200).json({ ok: true, skipped: "not push time" });
  }

  try {
    const statsRes = await fetch(`${STATS_URL}?action=get_users`);
    const { users } = await statsRes.json();

    let sent = 0;
    let skipped = 0;

    for (const [uid, user] of Object.entries(users || {})) {
      if (!shouldSend(user)) { skipped++; continue; }

      const text = selectTemplate(user);
      const ok = await sendPush(user.chatId, text);

      if (ok) {
        // Обновляем lastPushSent
        await fetch(`${STATS_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_user", uid, lastPushSent: Date.now() }),
        });
        sent++;
      } else {
        skipped++;
      }

      await new Promise(r => setTimeout(r, 50));
    }

    return res.status(200).json({ ok: true, sent, skipped });
  } catch (err) {
    console.error("Push error:", err);
    return res.status(500).json({ error: String(err) });
  }
}

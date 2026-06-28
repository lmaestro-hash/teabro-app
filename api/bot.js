export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).json({ ok: true });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_ID = 5175467398;
  const APP_URL = "https://teabro-app.vercel.app";
  const STATS_URL = "https://teabro-app.vercel.app/api/stats";

  const body = req.body;
  const message = body?.message;
  const callbackQuery = body?.callback_query;

  async function sendMessage(chat_id, text, extra = {}) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text, parse_mode: "HTML", ...extra }),
    });
  }

  async function answerCallback(callback_query_id, text = "") {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id, text, show_alert: false }),
    });
  }

  // ── Обработка кнопки паузы из пуша ──
  if (callbackQuery) {
    const cbId = callbackQuery.id;
    const data = callbackQuery.data;
    const chatId = callbackQuery.message?.chat?.id;

    if (data === "pause_pushes" && chatId) {
      // uid для реальных TG пользователей = их tg id
      const uid = String(chatId);
      await fetch(`${STATS_URL}?action=pause&uid=${encodeURIComponent(uid)}`);
      await answerCallback(cbId, "Пауза на месяц. Отдыхай 🌕");
    } else {
      await answerCallback(cbId);
    }

    return res.status(200).json({ ok: true });
  }

  // ── Обработка сообщений ──
  if (message) {
    const chat_id = message.chat.id;
    const text = message.text || "";
    const user = message.from;

    if (text === "/start") {
      await sendMessage(chat_id,
        `Привет, ${user.first_name || "друг"} 🌕\n\n<i>Не о чае. О возвращении к себе.</i>\n\nНажми кнопку ниже — войди в своё пространство.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Открыть Tea Bro 🌕", web_app: { url: APP_URL } }
            ]]
          }
        }
      );
    }

    if (text === "/admin" && chat_id === ADMIN_ID) {
      await sendMessage(chat_id,
        `<b>Админ панель Tea Bro</b>\n\nАдминка доступна внутри приложения.\n\nОткрой Mini App и перейди в раздел админки.`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: "Открыть Tea Bro 🌕", web_app: { url: APP_URL } }
            ]]
          }
        }
      );
    }
  }

  return res.status(200).json({ ok: true });
}

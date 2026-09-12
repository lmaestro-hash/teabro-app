// verifyTelegramAuth.js
// Проверяет initData, которую присылает Telegram Mini App, и подтверждает,
// что запрос реально пришёл из Telegram-сессии владельца (админа).
//
// Использование в api/stats.js (или отдельном api/admin.js):
//
//   import { verifyTelegramAuth } from './verifyTelegramAuth.js';
//
//   export default async function handler(req, res) {
//     const { initData, action } = req.method === 'POST' ? req.body : req.query;
//
//     if (action === 'get_users' || action === 'admin_something') {
//       const auth = verifyTelegramAuth(initData, process.env.BOT_TOKEN);
//       if (!auth.ok) return res.status(403).json({ error: auth.reason });
//       if (String(auth.userId) !== process.env.ADMIN_TELEGRAM_ID) {
//         return res.status(403).json({ error: 'not_admin' });
//       }
//       // дальше — обычная логика get_users
//     }
//   }

import crypto from 'crypto';

/**
 * @param {string} initData - строка window.Telegram.WebApp.initData
 * @param {string} botToken - токен бота (process.env.BOT_TOKEN)
 * @param {number} maxAgeSeconds - сколько секунд считать initData свежей (по умолчанию 1 час)
 * @returns {{ ok: boolean, userId?: string, reason?: string }}
 */
export function verifyTelegramAuth(initData, botToken, maxAgeSeconds = 3600) {
  if (!initData || !botToken) {
    return { ok: false, reason: 'missing_initdata_or_token' };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return { ok: false, reason: 'no_hash' };

  params.delete('hash');

  // data_check_string: все пары key=value кроме hash, отсортированные по ключу, через \n
  const dataCheckArr = [];
  for (const [key, value] of params.entries()) {
    dataCheckArr.push(`${key}=${value}`);
  }
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');

  // secret_key = HMAC_SHA256(bot_token, "WebAppData")
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) {
    return { ok: false, reason: 'bad_signature' };
  }

  // Проверка свежести (защита от replay старых initData)
  const authDate = Number(params.get('auth_date'));
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSeconds) {
    return { ok: false, reason: 'expired' };
  }

  let userId;
  try {
    const userJson = params.get('user');
    userId = userJson ? JSON.parse(userJson).id : undefined;
  } catch {
    return { ok: false, reason: 'bad_user_field' };
  }

  if (!userId) return { ok: false, reason: 'no_user_id' };

  return { ok: true, userId: String(userId) };
}

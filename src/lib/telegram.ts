/**
 * Telegram Bot API helper for ops alerts (new orders).
 * Credentials: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (never hardcode).
 */

let missingEnvLogged = false

export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token || !chatId) {
    if (!missingEnvLogged) {
      missingEnvLogged = true
      console.warn(
        '[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping message'
      )
    }
    return
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Telegram sendMessage failed (${res.status}): ${body}`)
  }
}

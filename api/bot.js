export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).send("VOLIXMini Bot is running");
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const update = req.body;
    const token = process.env.BOT_TOKEN;

    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "BOT_TOKEN is not configured"
      });
    }

    const message = update?.message;

    if (!message) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text || "";

    if (text.startsWith("/start")) {
      const firstName = message.from?.first_name || "صديقي";

      await sendMessage(
        token,
        chatId,
        `👋 أهلاً ${firstName}!

⚡ مرحبًا بك في VOLIXMini

⛏️ ابدأ التعدين
🎬 شاهد الإعلانات واربح VOLIX
🎯 أكمل المهام
👑 طور مستوى VIP
💳 تابع رصيدك

اضغط الزر بالأسفل لفتح التطبيق 👇`,
        {
          inline_keyboard: [
            [
              {
                text: "🚀 فتح VOLIXMini",
                web_app: {
                  url: "https://volxmini.vercel.app/"
                }
              }
            ]
          ]
        }
      );

      return res.status(200).json({ ok: true });
    }

    await sendMessage(
      token,
      chatId,
      "🚀 اضغط الزر لفتح VOLIXMini.",
      {
        inline_keyboard: [
          [
            {
              text: "🚀 فتح VOLIXMini",
              web_app: {
                url: "https://volxmini.vercel.app/"
              }
            }
          ]
        ]
      }
    );

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("BOT ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error"
    });
  }
}


async function sendMessage(
  token,
  chatId,
  text,
  replyMarkup
) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        reply_markup: replyMarkup
      })
    }
  );

  const data = await response.json();

  if (!data.ok) {
    console.error("Telegram API error:", data);
  }

  return data;
        }

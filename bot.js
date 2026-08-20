export default async function handler(req, res) {

  // Telegram بيبعت تحديثات البوت عن طريق POST
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

    if (!update) {
      return res.status(400).json({
        ok: false,
        error: "No update received"
      });
    }

    const token = process.env.BOT_TOKEN;

    if (!token) {
      console.error("BOT_TOKEN is missing");

      return res.status(500).json({
        ok: false,
        error: "BOT_TOKEN is not configured"
      });
    }

    const message = update.message;

    // لو التحديث مش رسالة عادية
    if (!message) {
      return res.status(200).json({
        ok: true
      });
    }

    const chatId = message.chat.id;

    const text = message.text || "";

    /*
      /start
    */

    if (text.startsWith("/start")) {

      const firstName =
        message.from?.first_name || "صديقي";

      const keyboard = {
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
      };

      await sendTelegramMessage(
        token,
        chatId,

        `👋 أهلاً ${firstName}!

⚡ مرحبًا بك في VOLIXMini

⛏️ ابدأ التعدين
🎬 شاهد الإعلانات واربح VOLIX
🎯 أكمل المهام
👑 طور مستوى VIP
💳 وتابع رصيدك

اضغط الزر بالأسفل لفتح التطبيق 👇`,

        keyboard
      );

      return res.status(200).json({
        ok: true
      });
    }

    /*
      أي رسالة أخرى
    */

    await sendTelegramMessage(
      token,
      chatId,

      "🚀 استخدم زر فتح VOLIXMini للدخول إلى التطبيق.",

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

    return res.status(200).json({
      ok: true
    });

  } catch (error) {

    console.error("BOT ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error"
    });

  }

}


/*
  إرسال رسالة إلى Telegram
*/

async function sendTelegramMessage(
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
    console.error(
      "Telegram API error:",
      data
    );
  }

  return data;
        }

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Setup a simple Express server so Render is happy with port binding
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive and running! 🤖✨');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Telegram Bot Setup
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store active intervals for each chat ID
const activeSpams = {};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text ? msg.text.trim() : '';

  if (text === '/start') {
    if (activeSpams[chatId]) return;

    bot.sendMessage(chatId, "Starting the lee train! 🚂💨 Type /stop to make it stop.").catch(err => console.log(err));

    activeSpams[chatId] = setInterval(() => {
      bot.sendMessage(chatId, "lee").catch(err => {
        console.log("Spam error:", err.message);
      });
    }, 1000);

  } else if (text === '/stop') {
    if (activeSpams[chatId]) {
      clearInterval(activeSpams[chatId]);
      delete activeSpams[chatId];
      bot.sendMessage(chatId, "Stopped the spam! 🛑").catch(err => console.log(err));
    } else {
      bot.sendMessage(chatId, "There's no active spam running right now! 🤷‍♂️").catch(err => console.log(err));
    }
  }
});

// Catch polling errors gracefully so it doesn't crash
bot.on('polling_error', (error) => {
  console.log("Polling error code:", error.code);
});

console.log("Bot is running and ready to spam! 🚀");

const TelegramBot = require('node-telegram-bot-api');

// Uses the token securely from Render's Environment Variables
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Store active intervals for each chat ID
const activeSpams = {};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text ? msg.text.trim() : '';

  if (text === '/start') {
    // If already spamming in this chat, don't start another loop
    if (activeSpams[chatId]) return;

    bot.sendMessage(chatId, "Starting the lee train! 🚂💨 Type /stop to make it stop.");

    // Send "lee" every 1 second
    activeSpams[chatId] = setInterval(() => {
      bot.sendMessage(chatId, "lee");
    }, 1000);

  } else if (text === '/stop') {
    // Clear the interval if it exists for this chat
    if (activeSpams[chatId]) {
      clearInterval(activeSpams[chatId]);
      delete activeSpams[chatId];
      bot.sendMessage(chatId, "Stopped the spam! 🛑");
    } else {
      bot.sendMessage(chatId, "There's no active spam running right now! 🤷‍♂️");
    }
  }
});

console.log("Bot is running and ready to spam! 🚀");

const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "1879025809:AAFrrEijboynVTHrTkk3saPCY7MZnAofiwQ";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас загадаю цифру от - до 9, а ты попробуй отгадай`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/info", description: "Получить информацию" },
]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  console.log(msg);
  if (text === "/start") {
    await bot.sendSticker(
      chatId,
      "https://cdn.tlgrm.ru/stickers/b48/7e2/b487e222-21cd-4741-b567-74b25f44b21a/192/1.webp"
    );
    await bot.sendMessage(chatId, "Ну ты и урод");
  }
  if (text === "/info") {
    await bot.sendMessage(
      chatId,
      `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
    );
  }
});

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию" },
    { command: "/game", description: "Сыграть в игру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg);
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.ru/stickers/b48/7e2/b487e222-21cd-4741-b567-74b25f44b21a/192/1.webp"
      );
      return bot.sendMessage(chatId, "Ну ты и урод");
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Донт андерстенд");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Ты выйграл, это цифра ${chats[chatId]}`,
        againOptions
      );
    } else {
      bot.sendMessage(
        chatId,
        `Сори, не угадал. ${chats[chatId]}`,
        againOptions
      );
      /*  if (retryData === "Yes") {
        return bot.sendMessage(chatId, "Отгадывай", gameOptions);
      } */
    }
  });
};

start();

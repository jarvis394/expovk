const utils = require("../utils.js");
var ballResponses = [
  "ДА БЛЯТЬ",
  "Моё категорическое да",
  "Хз",
  "Без сомнений",
  "ТОЧНО НЕТ",
  "Бля хз",
  "Наверное",
  "Определённо да",
  "Да",
  "Мой член говорит 'да'",
  "An$w3r 1s V3r^ $tr@ng3!",
  "@$k 1@t3r",
  "Эмм, я думаю тебе этого знать не стоит...",
  "Ну незнаю",
  "НЕТ БЛЯТЬ",
  "Что? Нет!",
  "НЕТ",
  "Сомневаюсь"
];

exports.run = (bot, message, args) => {
  
  var text = "";

  if (args.length !== 0) {
    text = "\"" + args.join(" ") + "\"";
  }
  bot.send(`${text}\n` + utils.randomArray(ballResponses), message.peer_id);
   
}
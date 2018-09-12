var utils = require("../utils.js");

exports.run = (bot, message, args) => {
  var num;
  if (args.length !== 0) {
    num = args[0];
  } else {
    num = 1;
  }
  bot.send("Бог рандома говорит " + utils.random(0, num), message.peer_id);
}
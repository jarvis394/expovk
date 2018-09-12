const math = require('mathjs');

exports.run = (bot, message, args) => {
  
  var resp;
  var calc = args.join(' ');
  
  try {
    resp = math.eval(calc);
  } catch (e) {
    return bot.send("Похоже, я ещё слишком тупой для таких примеров", message.peer_id);
  }
  
  bot.send(`Ввод: ${calc}\nВывод: ${resp}`, message.peer_id);

}
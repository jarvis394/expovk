exports.run = (bot, message, args) => {
  if (message.from_id !== 437920818) return bot.send("Низя.", message.peer_id);
  
  try { //Trying to delete cache of the command
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    bot.send("👌", message.peer_id);
  } catch (e) {
    bot.send("Не могу перезагрузить команду \"" + args[0] + "\"\n" + e, message.peer_id);
  }
}
exports.run = (bot, message, args) => {  
  bot.api("messages.removeChatUser", {
    "chat_id": parseInt(message.peer_id) - 2000000000,
    "user_id": message.text.match(/[0-9]/gi).join('')
  }).catch(error => {
    return bot.send("Не могу исключить этого пользователя!", message.peer_id);
  });
}
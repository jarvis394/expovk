exports.run = (bot, message, args) => {  
  if (args.length == 0) return bot.send('Упомяни кого-нибудь чтобы \nз а б а н и т ь', message.peer_id)
  var member = args.join().slice(1,-1).split('|')[0]
  
  if (member.startsWith('club')) member = -parseInt(member.slice(4))
  else member = member.slice(2);
  
  if (member == -process.env.ID) return bot.send('👺', message.peer_id);
  
  bot.api("messages.removeChatUser", {
    "chat_id": parseInt(message.peer_id) - 2000000000,
    "member_id": member
  }).catch(error => {
    console.log(error, message);
    return bot.send("Не могу исключить этого пользователя!", message.peer_id);
  });
}
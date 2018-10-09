exports.run = (bot, message, args, votes) => {
  
  if (args.length === 0) return bot.send('Упомяни пользователя', message.peer_id);
  
  bot.api('messages.getConversationMembers', {peer_id: message.peer_id, group_id: process.env.ID}).then(c => {
  
    var member = args.join().slice(1,-1).split('|')[0];
    var userCount = c.count;
    var required = Math.ceil(userCount / 2);
    
    if (member.startsWith('club')) member = -parseInt(member.slice(4))
    else member = member.slice(2);
    if (member == -process.env.ID) return bot.send('👺', message.peer_id);
  
    if (votes[member] === undefined) votes[member] = [];
    if (votes[member].includes(message.from_id)) return bot.send('Ты уже проголосовал! Осталось: ' + Math.ceil(votes[member].length / required), message.peer_id);
    
    if (votes[member].length >= required) {
      bot.api("messages.removeChatUser", {
        "chat_id": parseInt(message.peer_id) - 2000000000,
        "member_id": member
      }).catch(error => {
        console.log(error, message);
        return bot.send("Не могу исключить этого пользователя!", message.peer_id);
      });
      votes[member] = null;
      return bot.send('Пользователь ' + args.join().slice(1,-1).split('|')[1] + " был исключён путём голосования.", message.peer_id);
    }
    
    votes[member].push(message.from_id);
    bot.send("Ты проголосовал! Осталось: " + Math.ceil(votes[member].length / required), message.peer_id);
  
  });
}
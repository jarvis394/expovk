exports.run = (bot, message, args) => {
  
  var help = [
    "+help - это меню",
    "+ping - понг",
    "+random (num) - рандомное число от 0 до 'num'",
    "+8ball - спроси ответ у магического шара",
    "+voice (text) - озвучить текст",
    "+ban (user) - заБАНить кого-нибудь",
    "+calc (math) - посчитать 'math'",
    "+about - информация о боте",
    "+neko - поймать некочана",
    "+lewd - ухх, бака!",
    "+ahegao - из той же серии",
    "+graffiti - превращает картинку в стикер"
  ]

  bot.send("Помощь:\n\n" + help.join('\n'), message.peer_id);
  
}
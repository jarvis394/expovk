const fs = require('fs');

try {
  var words = JSON.parse(fs.readFileSync("./words.json", "utf8"));
} catch (e) {
  console.log("> [ERROR] Words overwrited");
  console.error("> [ERROR] " + e);
  var res = {}
  fs.writeFile("./words.json", JSON.stringify(res), (err) => console.error);
}

const reset = {
  "chatWarn": false, 
  "dmWarn": false, 
  "ban": false, 
  "words": []
};

exports.run = (bot, message, args) => {
  
  const peer = parseInt(message.peer_id) - 2000000000;
  
  // IF IN DM //
  if (peer < 0 ) return bot.send("- Работает только в чатах!", message.peer_id);
  
  // IF NO DATA //
  if (words[peer] === undefined) {
    words[peer] = reset;
    fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
      if (err) return console.error('> [ERROR] Error on writing reset data in warn.js: \n', err)
    });
  }
    
  var chatWarn = words[peer].chatWarn;
  var dmWarn   = words[peer].dmWarn;
  var ban      = words[peer].ban;
  var wordsL   = (!words[peer].words) ? "Нет слов. Добавить: +filter add (word)" : words[peer].words.join(", ");
  
  // SEND SETTINGS FOR CHAT IF NO ARGS //
  var settings = [
    '/ Настройки контроля сообщений /', 
    '• Предупреждать автора в чате?\n(chatwarn): ' + chatWarn,
    '• Предупреждать автора в ЛС?\n(dmwarn): ' + dmWarn,
    '• Банить после сообщения?\n(ban): ' + ban,
    '\n- Чёрный список слов: \n' + wordsL
  ].join('\n');
  
  if (args.length == 0) return bot.send(settings, message.peer_id);
  
  if (args[0] === 'add') return add();
  if (args[0] === 'remove') return remove();
  if (args[0] === 'chatwarn') return chatwarn();
  if (args[0] === 'dmwarn') return dmwarn();
  if (args[0] === 'ban') return ban();
  
  function add() {
    if (args[1] == undefined) return bot.send('• Введите слово', message.peer_id)
    words[peer].words.push(args[1])
    fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
      if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
    });
    bot.send('• Теперь чёрный список слов:\n' + words[peer].words.join(', '), message.peer_id);
  }
  
  function remove() {
    var el =  words[peer].words.every(find);
    if (el === undefined) return bot.send('• Элемент не найден', message.peer_id)
    fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
      if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
    });
    bot.send('• Теперь чёрный список слов:\n' + words[peer].words.join(', '), message.peer_id);
  }
  
  function chatwarn() {
    if (chatWarn == false) {
      words[peer].chatWarn = true;
      fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
        if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
      });
      bot.send('• Теперь параметр:\n' + words[peer].chatWarn, message.peer_id);
    } else {
      words[peer].chatWarn = false;
      fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
        if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
      });
      bot.send('• Теперь параметр:\n' + words[peer].chatWarn, message.peer_id);
    }
  }
  
  function dmwarn() {
    if (dmWarn == false) {
      words[peer].dmWarn = true;
      fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
        if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
      });
      bot.send('• Теперь параметр:\n' + words[peer].dmWarn, message.peer_id);
    } else {
      words[peer].dmWarn = false;
      fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
        if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
      });
      bot.send('• Теперь параметр:\n' + words[peer].dmWarn, message.peer_id);
    }
  }
  
  function ban() {
    if (ban === false) {
      words[peer].ban = true;
      fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
        if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
      });
      bot.send('• Теперь параметр:\n' + words[peer].ban, message.peer_id);
    } else {
      words[peer].ban = false;
      fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
        if (err) return console.error('> [ERROR] Error on writing data in warn.js: \n', err)
      });
      bot.send('• Теперь параметр:\n' + words[peer].ban, message.peer_id);
    }
  }
  
}
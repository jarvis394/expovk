// EXPRESS //

var express = require('express');
var app = express();

app.get("/", (req, res) => {
  res.status(200).send();
});

var listener = app.listen(process.env.PORT, function() {
  console.log('> [LOG] Started on port ' + listener.address().port);
});

// SERVER //

const { Bot } = require('node-vk-bot');
const utils = require("./utils.js");
const { prefix } = require("./constants.js");
const apiai = require('apiai');
const fs = require('fs');

const reset = {
  "chatWarn": false, 
  "dmWarn": false, 
  "ban": false, 
  "words": []
};

var votes = new Set();
 
var appAi = apiai(process.env.APIAI);

const bot = new Bot({
  token: process.env.TOKEN,
  group_id: process.env.ID,
  api: {
    v: 5.85,
    lang: 'ru'
  }
}).start();

console.log('> [LOG] Started polling ');

bot.on('update', async update => {  
  if (update.object.action !== undefined) {
    if (update.object.action.member_id === -172270721 && update.object.action.type === 'chat_invite_user') {
    bot.api("messages.removeChatUser", {
      "chat_id": parseInt(update.object.peer_id) - 2000000000,
      "member_id": -172270721
    }).catch(error => {
      console.log(error);
      return bot.send("Не могу исключить этого пользователя!", update.object.peer_id);
    });
    }
  }
  
  if (update.object.text == null) return;
  if (update.object.text.length == 0 || update.object.text.length == undefined || update.object.text.length >= 75) return;
  var res = "> [LOG] Message: " + update.object.text + ' '.repeat(75 - update.object.text.length);
  res += " | ID: " + update.object.from_id + " | PEER: " + update.object.peer_id;
  console.log(res);
  
  try {
    var words = JSON.parse(fs.readFileSync("./words.json", "utf8"));
  } catch (e) {
    console.log("> [ERROR] Words overwrited");
    console.error("> [ERROR] " + e);
    var res = {}
    fs.writeFile("./words.json", JSON.stringify(res), (err) => console.error);
  }
  
  var message = update.object.text;                                     // Message text
  var chatWords = words[parseInt(update.object.peer_id) - 2000000000];
  
  if (chatWords === undefined) {
    chatWords = reset;
    fs.writeFile("./words.json", JSON.stringify(words, null, 2), (err) => {
      if (err) return console.error('> [ERROR] Error on writing reset data in warn.js: \n', err)
    });
  }
  
  if (chatWords.words.some(word => message.split(' ').includes(word))) {
    if (chatWords.chatWarn === true) {
      await bot.send('Атата! Нельзя здесь такое писать!\n\n"' + update.object.text + '"', update.object.peer_id).catch(e => console.error(e));
    }
    
    if (chatWords.dmWarn === true) {
      await bot.send('В беседе запрещено это слово. Пожалуйста, постарайся избегать его употребления. \n\n"' + update.object.text + '"', update.object.from_id).catch(e => console.error(e));
    }
    
    if (chatWords.ban === true) {
      await bot.api("messages.removeChatUser", {
        "chat_id": parseInt(update.object.peer_id) - 2000000000,
        "member_id": update.object.from_id
      }).catch(async error => {
        await bot.send("В беседе запрещено это слово, а также включён автобан за него.\nЯ не могу банить людей без привелегий администратора, так что живи пока.", update.object.peer_id);
      });
    }
  }
  
  var args = message.slice(prefix.length).trim().split(' '); // Setting-up arguments of command
  let cmd = args.shift().toLowerCase();                      // LowerCase command 
  
  if (!message.startsWith(prefix) && (
       update.object.peer_id === update.object.from_id || 
      (message.startsWith("[club168670365") || 
       message.toLowerCase().startsWith("expobot")))) {
    
    var text = args.join(" ");
    
    if (update.object.peer_id === update.object.from_id || 
      !(message.startsWith("[club168670365") || 
        message.toLowerCase().startsWith("expobot"))) {text = message}
    
    if (text === "") return;
    
    var request = appAi.textRequest(text, {                  // If starts with @mention
      sessionId: utils.random(100000, 999999)                // rnd id
    });

    request.on('response', function(response) {              // On response
      var resp = response.result.fulfillment.speech;
      bot.send(resp, update.object.peer_id)                  // Send it
    });
    request.on('error', function(error) {                    // On error
      console.error("> [ERROR] DIALOGFLOW", error);          // console.log() it
    });
    request.end();                                           // End request
    
    return;                                                  // Break;
  }
  
  if (!message.startsWith(prefix)) return;                   // If no prefix
  if (message == "") return;
  if (cmd === "") return;
  
  try {
    let commandFile = require(`./commands/${cmd}.js`);       // Require command from folder
    commandFile.run(bot, update.object, args, votes);        // Pass four args into 'command'.js and run it
    /*bot.api("messages.setActivity", {
      "type": "typing", 
      "peer_id": update.object.peer_id
    }).catch(e => {console.error('> [ERROR]', e)})*/
  } catch (e) {}                                             // Catch errors like a god
});
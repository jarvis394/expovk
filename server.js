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
let apiai = require('apiai');
 
var appAi = apiai(process.env.APIAI);

const bot = new Bot({
  token: process.env.TOKEN,
  group_id: process.env.ID,
  api: {
    v: 5.84,
    lang: 'ru'
  }
}).start();

console.log('> [LOG] Started polling ');

bot.on('update', update => {
  console.log("> [LOG] Message: " + update.object.text + " | ID: " + update.object.from_id);
  
  var message = update.object.text;                          // Message text
  
  var prefix = utils.getPrefix();                            // Get prefix
  var args = message.slice(prefix.length).trim().split(' '); // Setting-up arguments of command
  let cmd = args.shift().toLowerCase();                      // LowerCase command 
  
  if (!message.startsWith("+") && (
       update.object.peer_id === update.object.from_id || 
      (message.startsWith("[club168670365") || 
       message.toLowerCase().startsWith("expobot")))) {
    
    var text = args.join(" ");
    
    if (update.object.peer_id === update.object.from_id || 
      !(message.startsWith("[club168670365") || 
        message.toLowerCase().startsWith("expobot"))) {text = message}
    
    if (text === "") return bot.send("Эй, введи текст!", update.object.peer_id);
    
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
  
  try {
    let commandFile = require(`./commands/${cmd}.js`);       // Require command from folder
    commandFile.run(bot, update.object, args);               // Pass four args into 'command'.js and run it
  } catch (e) {}                                             // Catch errors 
});

// ERROR HANDLER //

bot.on('poll-error', error => {
  console.error('> [ERROR]', error);
})
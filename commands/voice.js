const path = require('path');
const tts = require('google-tts-api');
var FormData = require('form-data');
var request = require('request');
var fs = require('fs');

exports.run = (bot, message, args) => {
  var form = new FormData();
  var text = message.text.split(" ");
  var shifted = text.shift();

  var serverLink = bot.api("docs.getMessagesUploadServer", {
    "type": "audio_message",
    "peer_id": message.peer_id
  });

  tts(text.join(), `ru`, 1).then((url) => {
    var date = Date.now();
    request(url).pipe(fs.createWriteStream(date + '.mp3'));

    serverLink.then(link => {
      request.post(
        link.upload_url, {
          formData: {
            file: fs.createReadStream(date + '.mp3')
          }
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            bot.api("docs.save", {"file": JSON.parse(body).file}).then(doc => {
              bot.send("", message.peer_id, {attachment: "doc" + doc[0].owner_id + "_" + doc[0].id});
              fs.unlink(date + ".mp3", () => {});
            }).catch(e => {console.log("> [ERROR]", e); fs.unlink(date + ".mp3", () => {});});
          }
        }
      );
    });
  });
}
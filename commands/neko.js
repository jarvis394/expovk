const { get } = require('request-promise-native');
const fs = require("fs");
var FormData = require('form-data');
var request = require("request");

exports.run = (bot, message, args) => {

  const options = {
    url: 'https://nekos.life/api/neko',
    json: true
  }
  
  var form = new FormData();
  var text = message.text.split(" ");
  var shifted = text.shift();

  var serverLink = bot.api("photos.getMessagesUploadServer", {
    "peer_id": message.peer_id
  });

  get(options).then(body => {
    var date = Date.now();
    request(body.neko).pipe(fs.createWriteStream("neko" +  date + '.png'));

    serverLink.then(async link => {
      setTimeout(async () => {
      await request.post(
        link.upload_url, {
          formData: {
            photo: fs.createReadStream("neko" +  date + '.png')
          }
        },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            
            bot.api("photos.saveMessagesPhoto", {"photo": body.photo, "server": body.server, "hash": body.hash}).then(doc => {
              bot.send("", message.peer_id, {
                "attachment": "photo" + doc[0].owner_id + "_" + doc[0].id, 
                "keyboard": JSON.stringify(
                  {
                    "one_time": true, 
                    "buttons": [
                      [ 
                        { 
                          "action": 
                          { 
                            "type": "text", 
                            "payload": "{\"command\": \"neko\"}",
                            "label": "more!" 
                          }, 
                          "color": "default" 
                        }
                      ]
                    ] 
                  })
              })
          .catch(e => console.log(e));
              fs.unlink("neko" + date + ".png", () => {});
            }).catch(e => {bot.send("Не удалось поймать некочана 😿", message.peer_id); console.log("> [WARN] Neko error:\n", e); fs.unlink("neko" + date + ".png", () => {});});
          }
        }
      );
    }, 2500);
    });
  });

}
var {
  get
} = require("request-promise-native");
const fs = require("fs");
var jimp = require('jimp');
var p = require('path');
var request = require("request");

const ENDPOINT = "https://api.vk.com/method/";

exports.run = (bot, message, args) => {

  // If no photo
  if (message.attachments.length == 0 ||
    message.attachments[0].photo == undefined)
    return bot.send("Скинь мне фотографию вместе с командой и я превращу её в стикер!", message.peer_id);

  var date = Date.now();
  var path = p.resolve('graffiti' + date + '.png');
  var url = message.attachments[0].photo.sizes[message.attachments[0].photo.sizes.length - 1].url;
  
  function method(method, params) {
    return ENDPOINT + method + '?' + params + `&access_token=${process.env.TOKEN}&v=5.85`
  }

  // Getting server
  var server = get({
    url: method("docs.getWallUploadServer", `type=graffiti&group_id=${process.env.ID}`),
    json: true
  });

  // Writing img
  jimp.read(url).then(img => {
    return img
      .clone()
      .write(path, () => {

        // Then...
        server.then(async link => {

          await request.post(
            link.response.upload_url, {
              formData: {
                file: fs.createReadStream(path)
              }
            },
            function(error, response, body) {
              if (!error && response.statusCode == 200) {
                body = JSON.parse(body);

                // Save doc
                get({
                  url: method("docs.save", `file=${body.file}&title=graffiti`),
                  json: true
                }).then(doc => {

                  bot.api("utils.getShortLink", {
                    url: `https://vk.com/dev/docs.add?params[owner_id]=${doc.response[0].owner_id}&params[doc_id]=${doc.response[0].id}&params[v]=5.85`
                  }).then(linkAdd => {
                    bot.api("utils.getShortLink", {
                      url: doc.response[0].url
                    }).then(linkDl => {
                      linkAdd = linkAdd.short_url;
                      linkDl = linkDl.short_url;

                      // Send
                      bot.send(`Вот твоя ссылка на добавление стикера в документы: \n` + linkAdd + "\nID: " + doc.response[0].id + "\nСкачать: \n" + linkDl, message.peer_id)
                      bot.send('', message.peer_id, {
                        "attachment": "doc" + doc.response[0].owner_id + "_" + doc.response[0].id
                      }).catch(e => {
                        console.error("> [ERROR] In graffiti.js on message.send:\n", e)
                      });

                      // Delete file
                      fs.unlink("graffiti" + date + ".jpg", () => {});
                    }).catch(e => {
                      bot.send("Не удалось сделать граффити! Попробуйте ещё раз.", message.peer_id);
                      console.error("> [WARN] Graffiti error", e);
                      fs.unlink(path, () => {});
                    });
                  });
                });
              }
            }
          );
        });
      });
  }).catch(e => {
    console.error("> [ERROR] JIMP in 'graffiti'", e);
  });
}
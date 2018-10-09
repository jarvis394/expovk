const ENDPOINT = "https://api.vk.com/method/";
function method(method, params) {
  return ENDPOINT + method + '?' + params + `&access_token=${process.env.TOKEN}&v=5.85`
}

var {
  get
} = require("request-promise-native");

exports.run = (bot, message, args) => {
  get({
    url: method('messages.getHistory', `peer_id=2000000058&count=200&extended=1&fields=last_name`),
    json: true
  }).then(info => {
    
    console.log(info)
    
  }).catch(e => {console.error('> [ERROR] In stats.js: \n', e)})
}
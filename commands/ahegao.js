var {get} = require('request-promise-native');
exports.run = async (bot, message, args) => {  
  get({url: "https://api.vk.com/method/wall.get?domain=qerrrrr&filter=owner&extended=1&access_token="+process.env.ACCESS_TOKEN+"&v=5.85", json: true})
    .then(it => {
    it = it.response.items;
    
    it = it.filter(obj => !obj.marked_as_ads && obj.text == '' && obj.attachments != undefined && obj.attachments[0].type == 'photo');
    let item  = it[Math.floor(Math.random() * it.length)];
    
    var photo = item.attachments[0].photo;
    bot.send('Из паблика @qerrrrr (с ахегао)', message.peer_id, {attachment: 'photo' + photo.owner_id + '_' + photo.id});
});}
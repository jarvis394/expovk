exports.run = (bot, message, args) => {
  
  bot.api('messages.search', {
    q: args.join(), 
    peer_id: message.peer_id, 
    count: 5/*, 
    extended: 1, 
    fields: 'last_name'*/
  }).then(messages => {
    
    console.log(messages);
    
  }).catch(e => {
    console.error('> [ERROR] In search.js: \n', e)
  });
  
}
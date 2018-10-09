exports.run = (bot, message, args) => {
  var attachment = message.fwd_messages;
  
  if (!attachment) return bot.send("Перешли мне пожалуйста сообщение.", message.peer_id);
  
  function to_rus(str_lat_err) {
		var lat_str = "Q-W-E-R-T-Y-U-I-O-P-A-S-D-F-G-H-J-K-L-Z-X-C-V-B-N-M";
		var rus_str = "Й-Ц-У-К-Е-Н-Г-Ш-Щ-З-Ф-Ы-В-А-П-Р-О-Л-Д-Я-Ч-С-М-И-Т-Ь";
		var lat_str_exp_1 = (lat_str + "-" + lat_str.toLowerCase()+"-:-\\^-~-`-\\{-\\[-\\}-\\]-\"-'-<-,->-\\.-;-\\?-\\/-&-@-#-\\$").split("-");
		var rus_str_exp_1 = (rus_str + "-" + rus_str.toLowerCase()+"-Ж-:-Ё-ё-Х-х-Ъ-ъ-Э-э-Б-б-Ю-ю-ж-,-.-?-\"-№-;").split("-");
		var lat_str_exp_1_len = lat_str_exp_1.length;
		for(let i = 0; i < lat_str_exp_1_len; i++) {
			str_lat_err = str_lat_err.replace(new RegExp(lat_str_exp_1[i],'g'), rus_str_exp_1[i]);
		}
		return str_lat_err;
	}
  
  bot.send("📃 " + to_rus(attachment[0].text), message.peer_id);
}
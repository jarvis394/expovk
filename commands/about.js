const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms")

exports.run = (bot, message, args) => {
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
    
    var stats = [];
    
      stats.push("• Память: " + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`)
      stats.push("• Node: " + `${process.version}`)
      stats.push("• CPU: " + os.cpus().map(i => `${i.model}`)[0])
      stats.push("• Нагрузка CPU: " + `${percent.toFixed(2)}%`)
      stats.push("• Архитектура: " + os.arch())
      stats.push("• Платформа: " + `${os.platform()}`)
    
    bot.send(stats.join("\n"), message.peer_id);
  });
};
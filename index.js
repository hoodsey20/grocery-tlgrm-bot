require('dotenv').config();

const Telegraf = require('telegraf')
const HttpsProxyAgent = require('https-proxy-agent')

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: { agent: new HttpsProxyAgent(`http://${process.env.PROXY_IP}:${process.env.PROXY_PORT}`) }
}); 

bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply(''))
bot.hears('hi', (ctx) => {
	console.log("TCL: ctx", ctx)
    ctx.reply('Hey there')
})

bot.launch();  
 
console.log('ok'); 
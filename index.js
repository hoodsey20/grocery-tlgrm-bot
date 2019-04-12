require('dotenv').config();

const Telegraf = require('telegraf')
const HttpsProxyAgent = require('https-proxy-agent')

let bot;

if (process.env.NODE_ENV === 'development') {
    bot = new Telegraf(process.env.BOT_TOKEN, {
        telegram: { agent: new HttpsProxyAgent(`http://${process.env.PROXY_IP}:${process.env.PROXY_PORT}`) }
    }); 
} else {
    bot = new Telegraf(process.env.BOT_TOKEN)
}


// console.log("TCL: bot", bot)

bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => {
    // console.log('ctx.update.message', ctx.update.message);
    // ctx.reply(`I've got your sticker!`);
    console.log('ctx.update.message.sticker.file_id', ctx.update.message.sticker.file_id);
    ctx.replyWithSticker('CAADAgADEgADuDxkCPvWERlPuuDMAg'); 

})
bot.hears('hi', (ctx) => {
	console.log("TCL: ctx", ctx.update.message.from)
    ctx.reply('Кряк')
})

bot.launch();   
 
bot.catch((err) => {
    console.log('Ooops', err)
})

console.log('ok'); 
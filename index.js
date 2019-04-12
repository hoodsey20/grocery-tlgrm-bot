require('dotenv').config();

const Telegraf = require('telegraf')
const HttpsProxyAgent = require('https-proxy-agent')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const { enter, leave } = Stage;

let bot;

if (process.env.NODE_ENV === 'development') {
    bot = new Telegraf(process.env.BOT_TOKEN, {
        telegram: { agent: new HttpsProxyAgent(`http://${process.env.PROXY_IP}:${process.env.PROXY_PORT}`) }
    }); 
} else {
    bot = new Telegraf(process.env.BOT_TOKEN)
}


// console.log("TCL: bot", bot)

// bot.start((ctx) => ctx.reply('Welcome!'))
// bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.on('sticker', (ctx) => {
    console.log('ctx.update.message.sticker.file_id', ctx.update.message.sticker.file_id);
    ctx.replyWithSticker('CAADAgADEgADuDxkCPvWERlPuuDMAg'); 
})
// bot.hears('hi', (ctx) => {
// 	console.log("TCL: ctx", ctx.update.message.from)
//     ctx.reply('Кряк')
// })

const stepHandler = new Composer()
stepHandler.action('next', (ctx) => {
    return ctx.wizard.steps[ctx.wizard.cursor+1](ctx)
})
stepHandler.action('abort', (ctx) => {
    ctx.replyWithMarkdown('ну ты даёшь!...я ушёл, если нужен то пиши /kupil')
    return ctx.scene.leave()
})
stepHandler.use((ctx) => {
    ctx.replyWithMarkdown('Ну и шо ты мне пишешь? Тыкони на кнопку')
    return ctx.wizard.next()
})

const buyWizard = new WizardScene('kupil-wizard',
  (ctx) => {
    ctx.reply('Ну и шо купил?')
    return ctx.wizard.next()
  },
  (ctx) => {
    const purchasedItems = ctx.update.message.text;
    ctx.scene.session.basketContent = purchasedItems; 
    ctx.reply(`...ага, значит ${purchasedItems} купил. ну и шо, почём?`)
    return ctx.wizard.next()
  },
  (ctx) => {
    const price = ctx.update.message.text;
    if (isNaN(Number(price)) || Number(price) < 1) {
        ctx.replyWithMarkdown('погоди, это невалидная сумма...я ушёл, если нужен то пиши /kupil')
        return ctx.scene.leave()
    } 
    ctx.reply(`ага, ну короч: ${ctx.scene.session.basketContent} за ${price}?`, Markup.inlineKeyboard([
      Markup.callbackButton('👍 Ага', 'next'),
      Markup.callbackButton('👎 Нит', 'abort')
    ]).extra())
    return ctx.wizard.next()
  },
  stepHandler,
  (ctx) => {
    console.log('last last last')
    ctx.replyWithSticker('CAADAgADDAADuDxkCAACqyG7tH6DAg'); 
    return ctx.scene.leave()
  }
)
const stage = new Stage([buyWizard], { default: 'super-wizard' })
bot.use(session())
bot.use(stage.middleware())

bot.command('kupil', enter('kupil-wizard'))

bot.catch((err) => {
    console.log('Ooops', err)
})
bot.launch();   

const { Telegraf, Format } = require('telegraf');
const {Agent} = require('https');

// const {
//     TELEGRAM_BOT_TOKEN,
//     TELEGRAM_CHAT_ID
// } = process.env;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

class TelegramLogger {
    constructor() {
        try {
            this.bot = new Telegraf(TELEGRAM_BOT_TOKEN, {
                telegram: {
                    agent: new Agent({
                        keepAlive: false,
                        family: 4
                    })
                }
            
            });
            this.chatId = TELEGRAM_CHAT_ID;
    
            this.bot.start((ctx) => {
                ctx.reply('Welcome');
            });
        } catch (error) {
            console.log(error);
        }
    }

    log(message) {
        const escapeMarkdown = (text) => {
            return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
        };

        const escapedMessage = escapeMarkdown(message);
        const formattedMessage = `***${escapedMessage}***`;

        this.bot.telegram.sendMessage(this.chatId, formattedMessage, {
            parse_mode: 'MarkdownV2'
        });
    }

    logCode({ message, code }) {
        // Hàm để thoát các ký tự đặc biệt trong MarkdownV2
        const escapeMarkdown = (text) => {
            return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
        };
        const checkEmpty = (obj) => {
            return Object.keys(obj).length !== 0;
        }
    
        // Thoát các ký tự đặc biệt trong message và thêm định dạng in đậm và in nghiêng
        const escapedMessage = escapeMarkdown(message);
        const formattedMessage = `***${escapedMessage}***`; // In đậm và in nghiêng
    
        // Chuyển đổi code thành chuỗi JSON và thoát các ký tự đặc biệt
        let codeString = '';
        if (checkEmpty(code.body) || checkEmpty(code.query) || checkEmpty(code.params)) {
            codeString = code ? '```json\n' + escapeMarkdown(JSON.stringify(code, null, 2)) + '\n```' : '';
        }
        // Kết hợp formattedMessage và codeString thành thông báo cuối cùng
        const res = formattedMessage + (code ? '\n' + codeString : '');
    
        // Gửi tin nhắn với parse_mode là 'MarkdownV2'
        this.bot.telegram.sendMessage(this.chatId, res, {
            parse_mode: 'MarkdownV2'
        });
    }
}

module.exports = new TelegramLogger();


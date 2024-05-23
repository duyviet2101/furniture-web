const loggerTele = require('../log/telegram.logger.js');

const pushLogToTelegram = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    loggerTele.logCode({
        message: `Web: Furniture-web\nMethod: ${req.method} - URL: ${req.originalUrl}\nIP: ${ip}`,
        code: {
            body: req.body,
            query: req.query,
            params: req.params
        }
    });
    next();
}

const pushLogMorganToTelegram = (message) => {
    let res = 'Web: Furniture-web\n';

    const [messageLog, jsonLog] = message.split('\n\n');

    res += messageLog;

    loggerTele.logCode({
        message: res,
        code: JSON.parse(jsonLog)
    });
}

module.exports = {
    pushLogToTelegram,
    pushLogMorganToTelegram
}
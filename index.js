require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const configSystem = require('./config/system.config.js')
const path = require('path');
const { pushLogMorganToTelegram } = require('./middlewares/index.js');

const app = express();
const port = process.env.PORT || 3000;

//! middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));


// Tạo một token tùy chỉnh cho morgan để log địa chỉ IP
morgan.token('client-ip', (req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // return ip === '::1' ? '127.0.0.1' : ip;
    return ip;
});

morgan.token('JSON', (req) => {
    const res = {
        query: req.query,
        params: req.params,
        body: req.body
    };
    return JSON.stringify(res);
})

// Tạo một format tùy chỉnh cho morgan
const format = 'IP::client-ip \n:method :url :status - :response-time ms\n\n:JSON\n';
app.use(morgan(format, {
    skip: (req, res) => {
        if (req.url.includes('/img') || req.url.includes('/css') || req.url.includes('/js') || req.url.includes('/bootstrap')) {
            return true;
        }
        return req.statusCode == 304;
    },
    stream: {
        write: pushLogMorganToTelegram,
        // write: (message) => {
        //     console.log(message);
        // }
    }
}))
//! end middlewares

//! databases
const mongoDatabase = require('./databases/database.js');
//! end databases

//! view, static
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
//! end view, static

//!config tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//!end config tinymce

//! locals
app.locals.prefixAdmin = configSystem.prefixAdmin;
app.locals.moment = moment;
//! end locals

//! method override
app.use(methodOverride('_method'));
//! end method override

//! flash
app.use(cookieParser((process.env.SECRET_KEY_COOKIE)));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// });
//! end flash

//! routes
app.use(`/${configSystem.prefixAdmin}`, require('./routes/admin/index.route.js'));
app.use(require('./routes/client/index.route.js'));
//! end routes

//!handle error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    return res.render('error', { message: error.message});
});
//!end handle error

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const configSystem = require('./config/system.config.js')
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//! middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
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
//! end locals

//! method override
app.use(methodOverride('_method'));
//! end method override

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
    return res.render('error', { message: error.message });
});
//!end handle error

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
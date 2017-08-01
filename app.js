/**
 * Created by Administrator on 2016/11/16.
 */

var express = require('express');
var fs = require('fs')
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');

//var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 8001;
var app = express();

var dbUrl = 'mongodb://127.0.0.1:27017/mcMarket'
mongoose.connect(dbUrl)

if ('development' === app.get('env')) {
    app.set('showStackError', true)
    // app.use(express.logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}

var handlebars = require('express3-handlebars').create(
    {
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: {
            section: function (name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
            compare: function(v1, v2, options) {
                if (v1 < v2) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
        },
        layoutsDir: 'app/views/layouts',
        partialsDir: 'app/views/partials'
    });

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.set('views', './app/views');

//app.use(serveStatic('bower_components'))
app.use(cookieParser())
app.use(session({
    secret: 'xkFTP',
    store: new MongoStore({
        url: dbUrl,
        collection: 'session'
    }),
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(express.static(path.join(__dirname, 'bower_components')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use('/font', express.static(path.join(__dirname, 'public/font')));
app.use('/plugins', express.static(path.join(__dirname, 'public/plugins')))
app.use('/poster', express.static(path.join(__dirname, 'public/uploadPoster')));

require('./app/router/routers')(app)

app.locals.moment = require('moment')

app.listen(port);

console.log('xkFTP started on port ' + port);


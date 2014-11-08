var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    router = express.Router(),
    mongoStore = mongoStore = require('connect-mongo')({
        session: session
    });

module.exports = function(app,config){
    app.set('views', config.rootPath + '/server/views');

    app.set('view engine','jade');

    app.use(express.static(config.rootPath + '/public'));
    app.use(router);
    app.use(logger('dev'));

    app.use(cookieParser());

    /*{
        saveUninitialized: true,
            resave: true,
        secret: config.sessionSecret,
        store: new mongoStore({
        db: config.db,
        collection: config.sessionCollection
    })
    }*/
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({secret:"sdfsdfsdfsdfsdf",
        saveUninitialized: true,
        resave: true}));
    app.use(passport.initialize());
    app.use(passport.session());
}


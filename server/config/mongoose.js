var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    article = require('../models/article')

module.exports = function (config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;

    db.on('error',console.error.bind(console,'connection error'));

    db.once('open',function callback(){
        console.log('MultiVision db is opened');
        userModel.createDefaultUsers();
    });

};
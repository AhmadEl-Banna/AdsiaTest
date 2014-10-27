var auth = require('./auth'),
    User = require('mongoose').model('User');

module.exports = function(app){

    app.get('/api/users',auth.requiresApiLogin,auth.requiresRole('admin'), function (req, res) {
        User.find({}).exec(function(err,users)
        {
            res.send(users);
        });
    });

    app.get('/partials/*', function(req, res) {
        res.render('../../public/app/' + req.params[0]);
    });

    app.get('/',function(req,res){
        res.render('index', {
            bootstrappedUser: req.user
        });
    });

    app.post('/login',auth.authenticate);

    app.post('/logout',function(req,res){
        req.logout();
        res.end();
    })
};
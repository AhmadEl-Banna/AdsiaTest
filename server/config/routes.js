var auth = require('./auth'),
    users = require('../controllers/users'),
    User = require('mongoose').model('User'),
    articles = require('../controllers/article');

module.exports = function(app) {

    app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
    app.post('/api/users', users.createUser);

    app.get('/partials/*', function(req, res) {
        res.render('../../public/app/' + req.params[0]);
    });

    app.post('/login', auth.authenticate);

    app.post('/logout', function(req, res) {
        req.logout();
        res.end();
    });

    app.get('/articles',articles.list);
    app.post('/articles',users.requiresLogin, articles.create);

    app.get('/articles/:articleId',articles.read)
    app.put('/articles/:articleId', articles.hasAuthorization, articles.update)
    app.delete('/articles/:articleId', articles.hasAuthorization, articles.delete);

    // Finish by binding the article middleware
    app.param('articleId', articles.articleByID);

    app.get('/' , function(req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
}
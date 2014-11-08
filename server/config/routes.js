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

    app.route('/articles')
        .get(articles.list)
        .post(auth.requiresApiLogin, articles.create);

    app.route('/articles/:articleId')
        .get(articles.read)
        .put(articles.hasAuthorization, articles.update)
        .delete(auth.requiresApiLogin, articles.hasAuthorization, articles.delete);

    // Finish by binding the article middleware
    app.param('articleId', articles.articleByID);

    app.get('/tags',articles.getAllTags)
    app.get('/' , function(req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
};
var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
    var article = new Article(req.body);
    article.user = req.user;

    article.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.send(article);
        }
    });
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
    res.send(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.send(article);
        }
    });
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
    Article.find().sort('-created').populate('user').exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.send(articles);
        }
    });
};

exports.articleByID = function(req, res, next, id) {
    Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.article.user._id !== req.user._id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
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
           return res.status(200).send(article);
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
    search(Article.find(),req).sort('-created').populate('user','_id userName firstName lastName').exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.send(articles);
        }
    });
};

var search = function(query,req){
    if(req.query.search){
        var re = new RegExp(req.query.search, 'i');

       return query.or([{ 'title': { $regex: re }},
           { 'content': { $regex: re }},
           { 'user.userName': { $regex: re }},
           { 'tags': { $regex: re }}])
    }

   return query;
};

exports.articleByID = function(req, res, next, id) {
    Article.findById(id).populate('user', '_id userName firstName lastName').exec(function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

exports.getAllTags = function(req,res){
  Article.find().distinct('tags',function(err,tags){
      res.send(tags);
  })
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.article.user.userName !== req.user.userName) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
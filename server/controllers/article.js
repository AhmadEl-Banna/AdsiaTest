var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    User = mongoose.model('User'),
    async = require('async'),
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
   var article = _.extend(req.article, req.body);

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
    if(req.query.search && req.query.search !=="" && req.query.search !==" "){
        var re = new RegExp(req.query.search, 'i');
        async.parallel([
            function(callback){
                User.find().or([
                    { 'userName': { $regex: re }},
                    { 'firstName': { $regex: re }},
                    { 'lastName': { $regex: re }}
                ]).select('_id')
                    .exec(function (err, result) {
                        if(err){
                            callback(err,null);
                        }
                        else{
                            Article.find().where('user').in(result)
                                .populate('user','_id userName firstName lastName')
                                .exec(function(err,data){
                                    if(err){
                                        callback(err,null);
                                    }
                                    else{
                                        callback(null,data);
                                    }
                                });
                        }
                    })
            },
            function(callback){
                Article.find().or([
                    { 'title': { $regex: re }},
                    { 'content': { $regex: re }},
                    { 'tags.text': { $regex: re }}
                ]).populate('user','_id userName firstName lastName').sort('-created')
                    .exec(function(err, articles) {
                        if (err) {
                            callback(err,null);
                        } else {
                            callback(null,articles);
                        }
                    });
            }
        ],function(err,results){
            if(err){
                return res.status(400).send({
                    message: err
                });
            }
            res.send(results[0].concat(results[1]))
        });
    }
    else
    {
        Article.find()
            .populate('user','_id userName firstName lastName')
            .sort('-created')
            .exec(function(err, articles) {
                if (err) {
                    return res.status(400).send({
                        message: err
                    });
                } else {
                    res.send(articles);
                }
            });
    }

};

exports.articleByID = function(req, res, next, id) {
    Article.findById(id).populate('user', '_id userName firstName lastName').exec(function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};

exports.articlesByTag = function(req,res,next,tag){
    Article.find({'tags.text':tag})
        .populate('user', '_id userName firstName lastName')
        .exec(function(err, articles) {
            if (err) {
                return next(err);
            } else {
                res.send(articles);
                next();
            }

        });
};

exports.getusersArticles  = function(req,res){
    var reg = new RegExp(req.query.search, 'i');
    Article.find().populate('user', 'userName').where('user.userName').regex(reg)
        .exec(function(err,articles){
            res.send(articles);
        });
};
exports.getAllTags = function(req,res){
  Article.find().distinct('tags.text',function(err,tags){
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

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    tags:[{text:String}],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

var Article = mongoose.model('Article', ArticleSchema);
var user = mongoose.model('User');

function createSampleArticles(){
    user.findOne({userName:'banna'}).exec(function(err,user){
        Article.find().exec(function (err, collection) {
            if(collection.length ==0){
                var article = new Article({
                    created:Date.now(),
                    title:'lowdash',
                    content:'Tested in Chrome 5~31, Firefox 2~25, IE 6-11, Opera 9.25~17, Safari 3-7, Node.js 0.6.21~0.10.22, Narwhal 0.3.2, PhantomJS 1.9.2, RingoJS 0.9, & Rhino 1.7RC5',
                    tags:['Node.js','lowdash'],
                    user:user
                });
                article.save(function(err) {
                    if (err) {

                    }
                })
            }
        })
    })
   };
exports.createSampleArticles = createSampleArticles

var mongoose = require('mongoose'),
    crypto  = require('crypto');


module.exports = function (config) {
    mongoose.connect(config.db);

    var db = mongoose.connection;

    db.on('error',console.error.bind(console,'connection error'));

    db.once('open',function callback(){
        console.log('MultiVision db is opened');
    });

    var userSchema = mongoose.Schema({
        firstName:String,
        lastName:String,
        userName:String,
        salt:String,
        hashedPassword:String,
        roles:[String]
    });

    userSchema.methods = {
        authenticate :function(passwordToMatch){
            return hashPassword(this.salt,passwordToMatch) === this.hashedPassword;
        }
    };

    var User = mongoose.model('User',userSchema);

    User.find().exec(function (err, collection) {
        if(collection.length == 0){
            var salt = createSalt();
            var hash = hashPassword(salt,'banna');
            User.create({firstName:'Ahmed',lastName:'El-Banna',userName:'banna',salt:salt,hashedPassword:hash,roles:['admin']});
            var salt1 = createSalt();
            var hash1 = hashPassword(salt,'batman');
            User.create({firstName:'bat',lastName:'man',userName:'batman',salt:salt1,hashedPassword:hash1,roles:[]});
            var salt2 = createSalt();
            var hash2 = hashPassword(salt,'spider');
            User.create({firstName:'spider',lastName:'man',userName:'spider',salt:salt2,hashedPassword:hash2,roles:[]});
        }
    });

    function createSalt(){
        return crypto.randomBytes(128).toString('base64');
    }

    function hashPassword(salt,password){
        var hmac = crypto.createHmac('sha1',salt);
        return hmac.update(password).digest('hex');
    }
};
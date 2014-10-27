var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  firstName: {type:String, required:'{PATH} is required!'},
  lastName: {type:String, required:'{PATH} is required!'},
  userName: {
    type: String,
    required: '{PATH} is required!',
    unique:true
  },
  salt: {type:String, required:'{PATH} is required!'},
  hashedPassword: {type:String, required:'{PATH} is required!'},
  roles: [String]
});

userSchema.methods = {
  authenticate :function(passwordToMatch){
    return encrypt.hashPassword(this.salt,passwordToMatch) === this.hashedPassword;
  }
};

var User = mongoose.model('User', userSchema);

function createDefaultUsers() {
  User.find().exec(function (err, collection) {
    if(collection.length == 0){
      var salt = encrypt.createSalt();
      var hash = encrypt.hashPassword(salt,'banna');
      User.create({firstName:'Ahmed',lastName:'El-Banna',userName:'banna',salt:salt,hashedPassword:hash,roles:['admin']});
      var salt1 = encrypt.createSalt();
      var hash1 = encrypt.hashPassword(salt,'batman');
      User.create({firstName:'bat',lastName:'man',userName:'batman',salt:salt1,hashedPassword:hash1,roles:[]});
      var salt2 = encrypt.createSalt();
      var hash2 = encrypt.hashPassword(salt,'spider');
      User.create({firstName:'spider',lastName:'man',userName:'spider',salt:salt2,hashedPassword:hash2,roles:[]});
    }
  });
}

exports.createDefaultUsers = createDefaultUsers;
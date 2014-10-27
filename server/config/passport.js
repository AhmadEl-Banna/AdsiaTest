var passport = require('passport'),
    LocalStratigy = require('passport-local').Strategy,
    User = require('mongoose').model('User');
module.exports=function(){
    passport.use(new LocalStratigy({
            usernameField: 'userName',
            passwordField: 'password'
        },
        function(userName,password,done){
            User.findOne({userName:userName}).exec(function(err,user){
                if(user && user.authenticate(password)){
                    return done(null,user);
                }
                else{
                    return done(null,false);
                }
            })
        }
    ));



    passport.serializeUser(function (user, done) {
        if(user){
            done(null,user._id);
        }
    });

    passport.deserializeUser(function(id,done){
        User.findOne({_id:id}).exec(function(err,user){
            if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    });

}
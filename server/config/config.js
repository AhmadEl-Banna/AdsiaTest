var path = require("path");

var rootPath = path.normalize(__dirname + '/../../');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports= function(){
    if(env ==='development') {
       return {
                rootPath:rootPath,
                db:'mongodb://localhost/MEANBlog',
                port:process.env.PORT || 3030,
                sessionSecret : "lksajdlskjdaskdjaslkdjasldjasldjakasd",
                sessionCollection:"sessions"
        };
    }
    else {
       return{
            rootPath:rootPath,
            db:'mongodb://banna:123456@ds047800.mongolab.com:47800/MEANBlog',
            port:process.env.PORT || 80,
           sessionSecret : "lksajdlskjdaskdjaslkdjasldjasldjakasd",
           sessionCollection:"sessions"
            }
    }
};

;;var express = require('express');

var app = express();

var config = require('./server/config/config')();

require('./server/config/express')(app,config);

require('./server/config/mongoose')(config);

require('./server/config/routes')(app);

require('./server/config/passport')();

app.listen(config.port);

console.log('Listing on port ' + config.port + '.....');

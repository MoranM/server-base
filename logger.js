var config = require('./config');
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
    ]
});

if(process.env.NODE_ENV === 'production'){
    /**
     * Requiring `winston-mongodb` will expose
     * `winston.transports.MongoDB`
     */
    require('winston-mongodb').MongoDB;

    var mongoOptions = {db: config.dbLog, capped: true};
    logger.add(winston.transports.MongoDB, mongoOptions);

}

module.exports = logger;










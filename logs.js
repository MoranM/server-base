var config = require('./config');

var winston = require('winston');

/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
require('winston-mongodb').MongoDB;


var mongoOptions = { db: config.dbLog, capped: true };
winston.add(winston.transports.MongoDB, mongoOptions);
module.exports=winston;










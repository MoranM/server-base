var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = exports.mongoose = require("mongoose");
var routesPath = './routes/';
var db = mongoose.connection;
var app = exports.app = express();
var morgan = require("morgan")
var config = require("./config.js");
var port = config.port;
var fs = require("fs");

require('./logs');
var logger = require('winston'); // this retrieves default logger which was configured in log.js

db.on('connecting', function () {
    console.log('connecting to MongoDB...');
});

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
db.on('connected', function () {
    console.log('MongoDB connected!');
});
db.once('open', function () {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', function () {
    console.log('MongoDB disconnected!');
    mongoose.connect(config.db, {server: {auto_reconnect: true}});
});

// Connect to DB
mongoose.connect(config.db, {server: {auto_reconnect: true}});

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: ["application/json", "text/*", "json"]}));
app.use(cookieParser());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

fs.readdirSync(routesPath).forEach(function (file) {
    var route = routesPath + file;
    require(route)(app);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: true
    });
});

// Start Server
app.listen(port, function () {
    logger.info("Express server listening on port " + port);
});

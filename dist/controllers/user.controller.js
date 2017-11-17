"use strict";

var registrationFlow = require('../flows/registrationFlow');
var logger = require("./logger");

exports.register = function register(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    registrationFlow.register(name, email, password).then(function (user) {
        res.status(200).json(user);
    }, function (err) {
        res.status(err.status).send(req.lang_map[err.msgKey]);
    }).catch(function (err) {
        logger.error(err);
        res.status(500).send();
    });
};
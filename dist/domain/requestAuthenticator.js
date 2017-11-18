"use strict";

var jwt = require("jsonwebtoken");
var logger = require('winston'); // this retrieves default logger which was configured in log.js
var config = require("../config/config.js");
var User = require('../domain/model/schema').User;

function extractTokenFromRequest(req, res) {
    return new Promise(function (reslove, reject) {
        var bearerToken = void 0;
        var bearerHeader = req.headers["authorization"];

        if (typeof bearerHeader == 'undefined') {
            logger.info("no authentication header");
            reject(null);
        } else {
            var bearer = bearerHeader.split(' ');
            bearerToken = bearer[1];
            jwt.verify(bearerToken, config.secret, function (err, decodedObject) {
                if (err != undefined) {
                    logger.error(err);
                    reject(null);
                } else {
                    reslove(bearerToken);
                }
            });
        }
    });
}

async function authUser(req, res) {
    var token = await extractTokenFromRequest(req);
    if (!token) {
        return new Promise().reject(new Error("Token is missing or invalid"));
    }

    return new Promise(function (resolve, reject) {
        User.findOne({ token: token }, function (err, user) {
            if (err) {
                reject("unable to find user");
            } else {
                resolve(user);
            }
        });
    });
}

exports.authenticateUser = function (req, res, next) {
    authUser(req, res).then(function (result) {
        req.user = result;
        next();
    }, function (err) {
        res.status(403).send(err);
    });
};
'use strict';

var User = require('../domain/model/schema').User;
var mailChecker = require('mailchecker');
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
var config = require("../config/config");
var nextWeek = 60 * 60 * 24 * 7;
var logger = require("../config/logger");

exports.register = register;
exports.login = login;

//------------ implementation ----------------
function login(email, password) {
    return new Promise(function (resolve, reject) {
        if (!email || !password) {
            reject({
                status: 401,
                msgKey: "missingMandatoryFields"
            });
            return;
        }

        User.findOne({ email: email }).then(function (user) {
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) {
                    reject({
                        status: 404,
                        msgKey: "invalidCredentials"
                    });
                } else {
                    resolve(user);
                }
            });
        }, function (err) {
            reject({
                status: 401,
                msgKey: "userNotFound"
            });
        });
    });
}

async function register(name, email, password) {
    return new Promise(function (resolve, reject) {
        if (!email || !name || !password) {
            reject({
                status: 401,
                msgKey: "missingMandatoryFields"
            });
            return;
        }

        User.findOne({ email: email }, async function (err, user) {
            if (user) {
                reject({
                    status: 404,
                    msgKey: "emailExist"
                });
            } else {
                if (!mailChecker.isValid(email)) {
                    reject({
                        status: 400,
                        msgKey: "invalidEmail"
                    });

                    return;
                }

                if (password.length < 5) {
                    reject({
                        status: 400,
                        msgKey: "invalidPassword"
                    });
                    return;
                }

                try {
                    var _saveResult = await saveUser(name, email, password);
                    resolve(_saveResult.user);
                } catch (e) {
                    logger.error(e);
                    reject({
                        status: 400,
                        msgKey: saveResult.msgKey
                    });
                }
            }
        });
    });
}

async function saveUser(name, email, password) {
    return new Promise(function (reslove, reject) {
        bcrypt.hash(password, null, null, function (err, hash) {
            if (err) {
                reject({ err: true });
                return;
            }

            var user = new User();
            user.name = name;
            user.email = email;
            user.password = hash;
            user.creationDate = user.lastLoginDate = new Date().getTime();
            user.token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + nextWeek,
                data: user
            }, config.secret);

            user.save().then(function (doc) {
                reslove({ err: false, user: doc });
            }, function (err) {
                logger.error(err);
                reject({ err: true, msgKey: "error" });
            });
        });
    });
}
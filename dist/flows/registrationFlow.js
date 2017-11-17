'use strict';

var User = require('../domain/model/schema').User;
var mailChecker = require('mailchecker');
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");
var config = require("../../config");
var nextWeek = 60 * 60 * 24 * 7;

exports.register = register;

async function register(name, email, password) {
    if (!email || !name || !password) {
        return {
            status: 401,
            msg: lang_map["missingMandatoryFields"]
        };
    }
    return new Promise(function (reslove, reject) {
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
                }

                if (password.length < 5) {
                    reject({
                        status: 400,
                        msgKey: "invalidPassword"
                    });
                }

                var saveResult = await saveUser(name, email, password);
                if (saveResult.err) {
                    reject({
                        status: 400,
                        msgKey: saveResult.msgKey
                    });
                }

                reslove(user);
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

            user.save(function (err, user) {
                if (err) {
                    reject({ err: true, msgKey: "error" });
                    return;
                }

                resolve({ err: false, user: user });
            });
        });
    });
}
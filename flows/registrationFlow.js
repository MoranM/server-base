let User = require('../domain/model/schema').User;
let mailChecker = require('mailchecker');
let bcrypt = require("bcrypt-nodejs");
let jwt = require("jsonwebtoken");
let config = require("../config/config");
let nextWeek = 60 * 60 * 24 * 7;
let logger = require("../config/logger");

exports.register = register;
exports.login = login;

//------------ implementation ----------------
function login(email, password) {
    return new Promise((resolve, reject) => {
        if (!email || !password) {
            reject({
                status: 401,
                msgKey: "missingMandatoryFields"
            });
            return;
        }

        User.findOne({email: email})
            .then(
                (user) => {
                    bcrypt.compare(password, user.password, (err, success) =>{
                        if(err || !success){
                            reject({
                                status: 404,
                                msgKey: "invalidCredentials"
                            });
                        }
                        else {
                            resolve(user);
                        }
                    });
                }, (err) => {
                    reject({
                        status: 401,
                        msgKey: "userNotFound"
                    });
                })
    });
}

async function register(name, email, password) {
    return new Promise((resolve, reject) => {
        if (!email || !name || !password) {
            reject({
                status: 401,
                msgKey: "missingMandatoryFields"
            });
            return;
        }

        User.findOne({email: email}, async (err, user) => {
            if (user) {
                reject({
                    status: 404,
                    msgKey: "emailExist"
                });
            }
            else {
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
                    let saveResult = await saveUser(name, email, password);
                    resolve(saveResult.user);

                } catch (e) {
                    logger.error(e);
                    reject({
                        status: 400,
                        msgKey: saveResult.msgKey
                    });
                }
            }
        })
    });
}

async function saveUser(name, email, password) {
    return new Promise((reslove, reject) => {
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) {
                reject({err: true});
                return;
            }

            let user = new User();
            user.name = name;
            user.email = email;
            user.password = hash;
            user.creationDate = user.lastLoginDate = new Date().getTime();
            user.token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (nextWeek),
                    data: user
                }, config.secret);

            user.save().then(
                (doc) => {
                    reslove({err: false, user: doc});
                },
                (err) => {
                    logger.error(err);
                    reject({err: true, msgKey: "error"});
                })
        })
    });
}
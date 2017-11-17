var jwt = require("jsonwebtoken");
var logger = require('winston'); // this retrieves default logger which was configured in log.js
var config = require("../config.js");
var User = require('../domain/model/schema').User;

function extractTokenFromRequest(req, res) {
    return new Promise((reslove, reject) => {
        let bearerToken;
        let bearerHeader = req.headers["authorization"];

        if (typeof bearerHeader == 'undefined') {
            logger.info("no authentication header");
            reject(null);
        }
        else {
            let bearer = bearerHeader.split(' ');
            bearerToken = bearer[1];
            jwt.verify(bearerToken, config.secret, (err, decodedObject) => {
                if (err != undefined) {
                    logger.error(err);
                    reject(null);
                }
                else {
                    reslove(bearerToken);
                }
            });
        }
    })
}

async function authUser(req, res) {
    let token = await extractTokenFromRequest(req);
    if (!token) {
        return new Promise().reject(new Error("Token is missing or invalid"));
    }

    return new Promise((resolve, reject) => {
        User.findOne({token: token}, (err, user) => {
            if (err) {
                reject("unable to find user");
            }
            else {
                resolve(user);
            }
        })
    });
}

exports.authenticateUser = function (req, res, next) {
    authUser(req, res).then(
        (result) => {
            req.user = result;
            next();
        }, (err) => {
            res.status(403).send(err);
        }
    );
}
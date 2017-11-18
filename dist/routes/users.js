"use strict";

var authenticator = require('../domain/requestAuthenticator');
var userController = require("../controllers/user.controller");

module.exports = function (app) {
    app.get("/", authenticator.authenticateUser, function (req, res) {
        res.json({
            test: "success"
        });
    });

    app.post("/register", userController.register);
    // app.post("login", userController.login);
};
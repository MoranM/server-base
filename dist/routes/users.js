"use strict";

var authenticator = require('../domain/requestAuthenticator');
var registrationFlow = require("../flows/registrationFlow");

module.exports = function (app) {
    app.get("/", authenticator.authenticateUser, function (req, res) {
        res.json({
            test: "success"
        });
    });

    app.post("/register", registrationFlow.register);
};
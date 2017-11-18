let authenticator = require('../domain/requestAuthenticator');
let userController = require("../controllers/user.controller");

module.exports = (app) => {
    app.get("/", authenticator.authenticateUser, (req, res) => {
        res.json({
            test: "success"
        })
    });

    app.post("/register", userController.register);
    app.post("/login", userController.login);

};
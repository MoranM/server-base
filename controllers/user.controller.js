let registrationFlow = require('../flows/registrationFlow');
let logger = require("../config/logger");

exports.register = (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    registrationFlow.register(name, email, password)
        .then(
            (user) => {
                res.status(200).json(user);
            },
            (err) => {
                res.status(err.status).send(req.lang_map[err.msgKey]);
            }
        )
        .catch((err) => {
            logger.error(err);
            res.status(500).send();
        })
};

exports.login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    registrationFlow.login(email, password)
        .then(
            (user) => {
                res.status(200).json(user);
            },
            (err) => {
                res.status(err.status).send(req.lang_map[err.msgKey]);
            })
        .catch((err) => {
            logger.error(err);
            res.status(500).send();
        });
}
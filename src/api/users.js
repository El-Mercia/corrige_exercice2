const mysql     = require("mysql");
const uuid      = require("uuid").v4;
const sqlConfig = require("../../settings.json").sqlConfig;
const app       = require("../app.js");

app.route("/api/login")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        if (typeof req.body.email !=="string" || req.body.email === "") {
            res.status(503).send({ status: "error", extra: "Email is required"});
            return;   
        }
        if (typeof req.body.password !=="string" || req.body.password === "") {
            res.status(503).send({ status: "error", extra: "Password is required"});
            return;   
        }

        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "SELECT id, firstname, lastname, email FROM node_users WHERE EMAIL = ? AND password = ? LIMIT 1;",
            [ req.body.email, req.body.password],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    if (!result.length) {
                        res.status(503).send({ status:"ERROR", extra: "Email or password is wrong" });
                        return;
                    }

                    // USER GOOD !
                    const userToken = uuid();
                    const user = result[0];

                    sqlConnection.query(
                        "UPDATE node_users SET token= ? WHERE id = ?;",
                        [ userToken, user.id ],
                        (error) => {
                            if (error) {
                                console.log(error);
                                res.status(503).send({status: "ERROR"});
                            } else {
                                res.send({status: "OK", infos: {
                                    user,
                                    userToken,
                                }});
                            }
                        }
                    );
                }
                sqlConnection.end();
            }
        );
    });
const express   = require("express");
const mysql     = require("mysql");
const sqlConfig = require("../settings.json").sqlConfig;

const app = express();

app.listen(3001, () => {
    console.log("SERVER STARTED");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");
    next();
});

app.use((req,res, next) => {
    const sqlConnection = mysql.createConnection(sqlConfig);

    sqlConnection.query(
        "SELECT id, email, firstname, lastname"
        + " FROM node_users"
        + " WHERE token = ? AND token IS NOT NULL"
        + " LIMIT 1;",
        [ req.headers["x-auth-token"] ],
        (error, result) => {
            if (error) {
                console.log(error.code);
                res.status(503).send({ status: "ERROR" });
                return;
            } else {
                req.user = result[0] || {};
            }
            sqlConnection.end();
            next();
        }
    );
});

app.use(express.static("./public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
const express = require("express");
const mysql = require("mysql");
const settings = require("./settings.json");

const sqlConfig = settings.sqlConfig;

const app = express();

app.listen(3000, () => {
    console.log("SERVER STARTED...");
});

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true}));

app.route("/api/articles2/create")
    .get((req, res) => res.status(503).send({status: "ERROR"}))
    .post((req, res) => {
        console.log(req.body);

        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "INSERT INTO node_articles2 VALUES (NULL, ?, ?, ?, NULL)", 
            [ req.body.title, req.body.content, req.body.author ],
            (error, result) => {
                if (error) {
                    console.log("ERROR :", error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK"});
                }
                sqlConnection.end();
            });	
    });

app.route("/api/articles/delete")
    .get((req, res) => res.status(503).send({status: "ERROR"}))
    .post((req, res) => {

        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "DELETE FROM node_articles WHERE id = ?",
            [ req.body.articlesId ],
            (error, result) => {
                if (error) {
                    console.log("ERROR :", error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK"});
                }
                sqlConnection.end();
            });
    });	
app.get("/api/articles", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    
    sqlConnection.query("SELECT id, title, content, users AS authorFirstname, users.lastname AS authorLastname, created_at FROM node_articles LIMIT 5 ORDER BY created_at DESC", (error, result) => {
        if (error) {
            console.log("ERROR :", error.code);
        } else {
            res.send(result [0]);     
        }
        sqlConnection.end();
    });
});   
    
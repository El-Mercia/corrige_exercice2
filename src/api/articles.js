const mysql     = require("mysql");
const sqlConfig = require("../../settings.json").sqlConfig;
const app       = require("../app.js");

app.route("/api/articles/create")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        if (typeof req.body.title !== "string" || req.body.title === "") {
            res.status(503).send({ status: "ERROR", extra: "Title is required" });
            return;
        }
        if (typeof req.body.content !== "string" || req.body.content === "") {
            res.status(503).send({ status: "ERROR", extra: "Content is empty" });
            return;
        }
        if (typeof req.body.author !== "string" || req.body.author === "") {
            res.status(503).send({ status: "ERROR", extra: "Author is not registered" });
            return;
        }

        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "INSERT INTO node_articles(title, content, author) VALUES (?, ?, ?);",
            [ req.body.title, req.body.content, req.body.author ],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            }
        );
    });

app.route("/api/articles/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        if (typeof req.body.id !== "string" || req.body.id === "")  {
            res.status(503).send({ status: "ERROR", extra: "Article id is required" });
            return;
        } 
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "DELETE FROM node_articles WHERE id = ?;",
            [ req.body.id ],
            (error, result) => {
                if (error) {
                    console.log(error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    if (result.affectedRows === 0) {
                        res.status(503).send({ status: "ERROR", extra: "Article doesn't exist" });
                        return;
                    } else {
                        res.send({ status: "OK" });
                    }
                }
                sqlConnection.end();
            }
        );
    });

app.get("/api/articles", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    sqlConnection.query(
        "SELECT node_articles.id, title, content, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_articles"
        + "  LEFT JOIN node_users"
        + "  ON node_articles.author = node_users.id"
        + "  ORDER BY created_at DESC"
        + "  LIMIT 5;",
        (error, result) => {
            if (error) {
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({
                    status: "OK",
                    articles: result,
                });
            }
            sqlConnection.end();
        }
    );
});

app.get("/api/article", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    sqlConnection.query(
        "SELECT node_articles.id, title, content, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_articles"
        + "  LEFT JOIN node_users"
        + "  ON node_articles.author = node_users.id"
        + "  WHERE node_articles.id = ?"
        + "  LIMIT 1;",
        [ req.query.id ],
        (error, result) => {
            if (error) {
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({
                    status: "OK",
                    article: result[0],
                });
            }
            sqlConnection.end();
        }
    );
});


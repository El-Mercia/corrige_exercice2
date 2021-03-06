const mysql     = require("mysql");
const sqlConfig = require("../../settings.json").sqlConfig;
const app       = require("../app.js");

app.route("/api/comments/create")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        if (!req.user || !req.user.id) {
            res.status(503).send({status: "ERROR", extra: "Log in please !"});
            return;
        }
        if (typeof req.body.article_id !== "string" || req.body.article_id === "") {
            res.status(503).send({ status: "ERROR", extra: "Id of article is required" });
            return;
        }
        if (typeof req.body.author !== "number" || req.body.author <= 0 ) {
            res.status(503).send({ status: "ERROR", extra: "Author is not registered" });
            return;
        }
        if (typeof req.body.content !== "string" || req.body.content === "") {
            res.status(503).send({ status: "ERROR", extra: "Content is empty" });
            return;
        }
       
        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "INSERT INTO node_comments(article_id, author, content) VALUES (?,?,?);",
            [req.body.article_id, req.user.id, req.body.content],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK", result: {
                        commentId: result.insertId
                    } });
                }
                sqlConnection.end();
            }
        );
    });

app.route("/api/comments/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        if (!req.user || !req.user.id) {
            res.status(503).send({status: "ERROR", extra: "Log in please !"});
            return;
        }
        if (typeof req.body.id !== "number" || req.body.id <= 0)  {
            res.status(503).send({ status: "ERROR", extra: "Comment id is required" });
            return;
        } 

        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "DELETE FROM node_comments WHERE id = ?",
            [req.body.id],
            (error, result) => {
                if (error) {
                    console.log(error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    if (result.affectedRows === 0) {
                        res.status(503).send({ status: "ERROR", extra: "you cannot delete this comment" });
                        return;
                    } else {
                        res.send({ status: "OK" });
                    }
                }
                sqlConnection.end();
            }
        );
    });

app.get("/api/comments", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);

    sqlConnection.query(
        "SELECT node_comments.id, article_id, content, node_users.id AS authorId, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_comments"
        + "  LEFT JOIN node_users"
        + "  ON node_comments.author = node_users.id"
        + "  WHERE article_id = ?"
        + "  ORDER BY created_at DESC"
        + "  LIMIT 5;",
        [ req.query.article_id ],
        (error, result) => {
            if (error) {
                console.log(error.code);
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({
                    status: "OK",
                    comments: result,
                });
            }
            sqlConnection.end();
        }
    );
});



const express = require("express");

const app = express();

app.listen(3001, () => {
    console.log("SERVER STARTED");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static("./public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    pg = require("pg");

app.use(express.static(__dirname + "/Static"));
app.use(bodyParser.json());

app.get("/frank", function (req, res) {
    res.sendFile(__dirname + "/Static/index.html");
});

function addUser(mail, user, password, res, req) {
    var client = new pg.Client("postgres://spiced:spiced1@localhost:5432/Frank");
    client.connect(function (err) {
        if (err) {
            console.log("connection error");
            throw err;
        }
        var input = 'INSERT INTO franks (email, "user", password) VALUES ($1, $2, $3) RETURNING id;'

        client.query(input, [mail, user, password], function (error, results) {
            if (error) {
                console.log("query error");
                console.log(error);
                return res.json(error);
            }
            var id = results.rows[0].id;
            console.log(id);
            res.json("query complete");
        })

    })

}

app.post("/register", function(req, res) {
    var user = {
        email: req.body.email,
        name: req.body.usename,
        pass: req.body.pass
    };
    console.log(user);
    addUser(user.email, user.name, user.pass, res, req);
});

app.get("/homepage", function(req, res) {
    console.log(req.body);
});

function checkThisPassOut(req, res, usename, pass) {
    var client = new pg.Client("postgres://spiced:spiced1@localhost:5432/Frank");
    client.connect(function(error) {
        if (error) {
            console.log("can't connect to base, boss");
            throw error;
        }
        var input= 'SELECT password FROM franks WHERE "user" = ($1);'
        client.query(input, [usename], function(error, results){
            if (error) {
                console.log(error);
            }
            var pass = results.rows[0];
            console.log(pass);

            res.json("alldone!");

        });
    });
};

app.post("/login", function(req, res) {
    var user = {
        name: req.body.usename,
        pass: req.body.pass
    };
    console.log(user);
    checkThisPassOut(req, res, user.name, user.pass);
});

app.listen(9001);

console.log("let us be FRANK");

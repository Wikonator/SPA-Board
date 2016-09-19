var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    crypt = require("bcrypt"),
    redis = require("redis"),
    cache = redis.createClient({
        host: "localhost",
        port: 6379
    }),
    session = require('express-session'),
    Store = require('connect-redis')(session),
    csurf = require("csurf"),
    pg = require("pg");

app.use(express.static(__dirname + "/Static"));
app.use(bodyParser.json());
app.use(session({
    store: new Store({
        ttl: 3000,
        host: 'localhost',
        port: 6379
    }),
    resave: false,
    saveUninitialized: true,
    secret: "XSM0018hubris765"
}));
app.use(function (req, res, next) {
    if (req.session.usename === undefined) {
        return res.json({

        })
    }
    next();
})


app.get("/frank", function (req, res) {
    res.sendFile(__dirname + "/Static/index.html");
});

function addUser(mail, user, password, res) {
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
            req.session.usename = user;
            console.log(id);
            res.json("query complete");
        })

    })

}


function hashPass(user, res) {
    crypt.genSalt(function(err,salt) {
        if (err) {
            return err;
        }
        console.log(salt);
        crypt.hash(user.pass, salt, function(err, hash) {
            if (err) {
                return err;
            }
            console.log(hash);
            addUser(user.email, user.name, hash, res);
        });
    });
};

app.post("/register", function(req, res) {
    var user = {
        email: req.body.email,
        name: req.body.usename,
        pass: req.body.pass
    };
    hashPass(user, res);
    console.log(user);
});

app.get("/homepage", function(req, res) {
    console.log(req.body);
});

function checkThisPassOut(req, res, usename, plainPass) {
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
                res.json("query failed")
            }
            var hashedPass = results.rows[0];
            client.end();
            console.log(hashedPass);
            function comparePasses(plainPass, hashedPass, res) {
                // console.log("comparing passwords");
                crypt.compare(plainPass, hashedPass, function(err, doesMatch) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            error: "not habenning"
                        });
                    }
                    res.json("good to go");
                    req.session.username = usename;
                    console.log(req.session.usename);
                })
            }
            comparePasses(plainPass, hashedPass.password, res);
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

app.post("/logout", function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        }
            console.log("session destroyed, returning to base" + req.session.usename);
            res.json("session whacked")
    });
});

app.listen(9001);

console.log("let us be FRANK");

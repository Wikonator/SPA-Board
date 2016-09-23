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
        ttl: 50000,
        host: 'localhost',
        port: 6379
    }),
    resave: false,
    saveUninitialized: true,
    secret: "XSM0018hubris765"
}));

app.get("/frank", function (req, res) {
    res.sendFile(__dirname + "/Static/index.html");
});

app.get("/isLoggedIn", function (req, res) {
    console.log(req.session.usename);
    if (req.session.usename === undefined) {
            console.log("no user");
            res.json({
                "user": false
            })
    } else if (req.session.usename !== undefined){
        console.log("yes user!");
        res.json({
            "user": true
        })
    }

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
            req.session.usename = user;
            console.log(id);
            res.json("query complete");
        })

    })

}


function hashPass(user, res, req) {
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
            addUser(user.email, user.name, hash, res, req);
        });
    });
};

app.post("/register", function(req, res) {
    var user = {
        email: req.body.email,
        name: req.body.usename,
        pass: req.body.pass
    };
    hashPass(user, res, req);
    console.log(user);
});

function writeNewMessage(req, res, message, user) {
    var client = new pg.Client("postgres://spiced:spiced1@localhost:5432/Frank");
    client.connect(function(error) {
        if (error) {
            console.log("can't make it to pgsl, boss");
            throw error;
        }
        var input = 'INSERT INTO messages (username, msg) VALUES ($1, $2);'
        client.query(input, [user, message], function (error, results) {
            if (error) {
                console.log("query error");
                console.log(error);
                return res.json(error);
            }
            res.json("query complete");
        })

    });
};

app.post("/messages", function(req, res) {
    var message = {
        msg: req.body.message,
        user: req.session.usename
    };
    writeNewMessage(req, res, message.msg, message.user);
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
                    req.session.usename = usename;
                    // console.log(req.session.usename);
                    res.json("good to go");
                })
            }
            comparePasses(plainPass, hashedPass.password, res);
        });
    });
};

function getMePosts(req, res, messageBoard) {
    var client = new pg.Client("postgres://spiced:spiced1@localhost:5432/Frank");
    client.connect(function(error) {
        if (error) {
            console.log("can't connect to base, boss");
            throw error;
        }
        var input= 'SELECT * FROM messages;'
        client.query(input, function(error, results){
            if (error) {
                console.log(error);
                res.json("query failed")
            }
            var whatWeGot = results.rows;
            client.end();
            console.log(whatWeGot);
            res.json({
                messages: whatWeGot
            });
        })
    });
}

app.get("/messages", function(req, res) {
    var messageBoard = {
        user: "lol",
        content: "kek"
    };
    getMePosts(req, res, messageBoard)
})

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

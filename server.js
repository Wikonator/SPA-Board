var express = require("express"),
    bodyParser = require("body-parser"),
    app = express();

app.use(express.static(__dirname + "/Static"));
app.use(bodyParser.json());

app.get("/frank", function (req, res) {
    res.sendFile(__dirname + "/Static/index.html");
});


app.post("/register", function(req, res) {
    console.log(req.body);
});

app.get("/homepage", function(req, res) {
    console.log(req.body);
});

app.listen(9001);

console.log("yolo");

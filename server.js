var express = require("express"),
    app = express();

app.use(express.static(__dirname + "/Static"));

app.get("/frank", function (req, res) {
    res.sendFile(__dirname + "/Static/index.html");
});


app.listen(9001);

console.log("yolo");

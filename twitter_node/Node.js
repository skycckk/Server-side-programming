var express = require("express");
var fs = require("fs");
var app = express();
var basePath = "/cs174/hw5";

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

// Get all tweets (create time, id, and tweet text) available in the archive.
app.get(basePath + "/listTweets", function (req, res) {
    fs.readFile(__dirname + "/" + "favs.json", "utf8", function (err, data) {
        // parse the json file to a JSON object
        var jsonObj = JSON.parse(data);

        // get selected field for the response
        var wantedData = [];
        for (var i = 0; i < jsonObj.length; i++) {
            var tweet = jsonObj[i];
            wantedData.push({"created_at": tweet["created_at"],
                             "id": tweet["id"],
                             "text": tweet["text"]});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(wantedData));
    });
});

// Get all known users and return as a JSON object
app.get(basePath + "/listUsers", function (req, res) {
    fs.readFile(__dirname + "/" + "favs.json", "utf8", function (err, data) {
        // parse the json file to a JSON object
        var jsonObj = JSON.parse(data);

        // get selected field for the response
        var wantedData = [];
        for (var i = 0; i < jsonObj.length; i++) {
            var tweet = jsonObj[i];
            // check if it has key "user" and the value is not null
            if (tweet.hasOwnProperty("user")) {
                var user = tweet["user"];
                if (user != null)
                    wantedData.push(tweet["user"]);
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(wantedData));
    });
});

// Get all external URLs in each tweet grouped by the tweet id
app.get(basePath + "/listAllExternalLinks", function (req, res) {
    fs.readFile(__dirname + "/" + "favs.json", "utf8", function (err, data) {
        // parse the json file to a JSON object
        var jsonObj = JSON.parse(data);

        // get selected field for the response
        var wantedData = [];
        for (var i = 0; i < jsonObj.length; i++) {
            var tweet = jsonObj[i];
            var re = new RegExp("(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?", "g");

            var links = JSON.stringify(tweet).match(re);
            wantedData.push({"id": tweet["id"],
                             "links": links});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(wantedData));
    });
});

// Get desired tweet by id
app.get(basePath + "/listTweets/:id", function (req, res) {
    fs.readFile(__dirname + "/" + "favs.json", "utf8", function (err, data) {
        // parse the json file to a JSON object
        var jsonObj = JSON.parse(data);

        // get selected field for the response
        var wantedTweet = null;
        for (var i = 0; i < jsonObj.length; i++) {
            var tweet = jsonObj[i];
            if (tweet["id"] == req.params.id) {
                wantedTweet = tweet;
                break;
            }
        }

        res.setHeader('Content-Type', 'application/json');
        if (wantedTweet == null) res.status(204);
        else res.status(200);
        res.end(JSON.stringify(wantedTweet));
    });
});

// Get desired user by its screen_name is the "user" field
app.get(basePath + "/listUsers/:screenName", function (req, res) {
    fs.readFile(__dirname + "/" + "favs.json", "utf8", function (err, data) {
        // parse the json file to a JSON object
        var jsonObj = JSON.parse(data);

        // get selected field for the response
        var wantedUser = null;
        for (var i = 0; i < jsonObj.length; i++) {
            var tweet = jsonObj[i];
            // check if it has key "user" and the value is not null
            if (tweet.hasOwnProperty("user")) {
                var user = tweet["user"];
                if (user != null && user.hasOwnProperty("screen_name")) {
                    if (user["screen_name"] == req.params.screenName)
                        wantedUser = user;
                }
            }
        }

        res.setHeader('Content-Type', 'application/json');
        if (wantedUser == null) res.status(204);
        else res.status(200);
        res.end(JSON.stringify(wantedUser));
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at http://%s:%s", host, port);
});
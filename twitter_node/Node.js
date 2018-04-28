var express = require("express");
var fs = require("fs");
var app = express();

// Get all tweets (create time, id, and tweet text) available in the archive.
app.get("/listTweets", function (req, res) {
    console.log("DEBUG[GET]: " + "NODE GET HERE");
    fs.readFile( __dirname + "/" + "favs.json", "utf8", function (err, data) {
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
app.get("/listUsers", function (req, res) {
    fs.readFile( __dirname + "/" + "favs.json", "utf8", function (err, data) {
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
app.get("/listAllExternalLinks", function (req, res) {
    fs.readFile( __dirname + "/" + "favs.json", "utf8", function (err, data) {
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
app.get("/listTweets/:id", function (req, res) {
    fs.readFile( __dirname + "/" + "favs.json", "utf8", function (err, data) {
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
app.get("/listUsers/:screenName", function (req, res) {
    fs.readFile( __dirname + "/" + "favs.json", "utf8", function (err, data) {
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
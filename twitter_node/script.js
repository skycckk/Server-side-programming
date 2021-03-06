var apiPath = "http://weichung.net:3000/cs174/hw5/api/v0";
// var apiPath = "http://localhost:3000/cs174/hw5/api/v0"; // enable only if you want to test on the local
function getAllTweets() {
    var url = apiPath + "/listTweets";
    $.get(url, function (data, status, xhr) {
        if (xhr.status == 200) {
            displayTweets(data);
        }
    });
}

function getTweetById(tweetId) {
    if (tweetId == "") return;
    var url = apiPath + "/listTweets";
    url += "/" + tweetId
    $.get(url, function(data, status, xhr) {
        if (xhr.status == 200) {
            displayTweetInfo(data);
        } else if (xhr.status == 204) {
            alert("Content not found!");
        }
    });
}

function getAllUsers() {
    var url = apiPath + "/listUsers";
    $.get(url, function (data, status, xhr) {
        if (xhr.status == 200) {
            displayUsers(data);
        }
    });
}

function getUserByScreenName(screenName) {
    if (screenName == "") return;
    var url = apiPath + "/listUsers";
    url += "/" + screenName
    $.get(url, function(data, status, xhr) {
        if (xhr.status == 200) {
            displayUserInfo(data);
        } else if (xhr.status == 204) {
            alert("Content not found!");
        }
    });
}

function getAllLinks() {
    var url = apiPath + "/listAllExternalLinks";
    $.get(url, function(data, status, xhr) {
        if (xhr.status == 200) {
            displayAllLinks(data);
        }
    });
}

function displayTweets(jsonObj) {
    var table_schema =
        "<table border='1'><tr>" +
        "<th>" + "created_at" + "</th>" +
        "<th>" + "id" + "</th>" +
        "<th>" + "text" + "</th>" +
        "</tr>";

    var html = table_schema;
    for (var i = 0; i < jsonObj.length; i++) {
        var tweet = jsonObj[i];
        var htmlRow = "<tr>" +
                        "<td>" + tweet["created_at"] + "</td>" +
                        "<td>" + tweet["id"] + "</td>" +
                        "<td>" + tweet["text"] + "</td>" +
                      "</tr>";

        html += htmlRow;
    }
    html += "</table>";
    document.getElementById("display_all_tweets").innerHTML = html;
}

function displayTweetInfo(jsonObj) {
    var table_schema = "<table border='1'>";
    var html = table_schema;
    for (var key in jsonObj) {
        var value = jsonObj[key];
        if (key == "user") {
            value = jsonObj[key]["screen_name"];
            key = "user_screen_name";
        }
        html += "<tr><td>" + key + "</td><td>" + value + "</td>";
    }
    html += "</table>";
    document.getElementById("display_tweet_info").innerHTML = html;
}

function displayUsers(jsonObj) {
    var table_schema = "<table border='1'><tr>" +
        "<th>" + "Screen Name" + "</th>" +
        "<th>" + "Name" + "</th>" +
        "<th>" + "ID" + "</th></tr>";
    var html = table_schema;
    for (var i = 0; i < jsonObj.length; i++) {
        var user = jsonObj[i];
        if (user.hasOwnProperty("screen_name")) {
            html += "<tr><td>" + user["screen_name"];
        } else {
            html += "<tr><td>" + "";
        }

        if (user.hasOwnProperty("name")) {
            html += "<td>" + user["name"];
        } else {
            html += "<tr><td>" + "";
        }

        if (user.hasOwnProperty("id")) {
            html += "<td>" + user["id"];
        } else {
            html += "<tr><td>" + "";
        }

        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("display_all_users").innerHTML = html;
}

function displayUserInfo(jsonObj) {
    var table_schema = "<table border='1' class='schema'>";
    var html = table_schema;
    for (var key in jsonObj) {
        html += "<tr><td>" + key + "</td><td>" + jsonObj[key] + "</td>";
    }
    html += "</table>";
    document.getElementById("display_user_info").innerHTML = html;
}

function displayAllLinks(jsonObj) {
    var table_schema =
        "<table border='1'><tr>" +
        "<th>" + "tweet_id" + "</th>" +
        "<th>" + "external links" + "</th></tr>";
    var html = table_schema;
    for (var i = 0; i < jsonObj.length; i++) {
        var tweet = jsonObj[i];
        html += "<tr><td>" + tweet["id"] + "</td>";
        html += "<td>";
        var allLinks = tweet["links"];
        for (var j = 0; j < allLinks.length; j++) {
            html += "<a href=" + allLinks[j] + ">" + allLinks[j] + "</a><br>";
        }
        html += "</td>";
    }
    html += "</table>" + "<br>";
    document.getElementById("display_all_links").innerHTML = html;
}
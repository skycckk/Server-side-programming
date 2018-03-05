
function loadJSON (url) {
	var xmlhttp = new XMLHttpRequest();
	var jsonObj = undefined;
    xmlhttp.onreadystatechange = function() {
        console.log("State: " + this.readyState + ", Status: " + this.status);
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Action to be performed when the document is read;
                console.log("JSON is okay");
                jsonObj = JSON.parse(xmlhttp.responseText);
                processTruckingList(jsonObj);
            } else {
                alert("File " + url + " does not exist!");
            }
        }
    };
	xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function submit() {
    var url = document.getElementById("json_url").value;
    loadJSON(url);
}

function processTruckingList(jsonObj) {
    var table = jsonObj["Mainline"]["Table"];
    var header = table["Header"];
    var header_data = header["Data"];
    if (header_data.length < 6) return;

    var newWindow = window.open("");
    newWindow.focus();

    var html_opening =
        "<!DOCTYPE html>" +
        "<html lang='en'>" +
        "<head>" +
            "<meta charset='UTF-8'>" +
            "<title>Trucking List</title>\n" +
        "</head>";
    html_opening += "<body>";
    newWindow.document.write(html_opening);

    var style = "<style type='text/css'> th {text-align:center; font-weight: bold;} </style>"
    newWindow.document.write(style);

    var table_schema =
        "<table border='2' class='schema'> " +
        "    <tr>" +
        "    <th>" + header_data[0] + "</th>" +
        "    <th>" + header_data[1] + "</th>" +
        "    <th>" + header_data[2] + "</th>" +
        "    <th>" + header_data[3] + "</th>" +
        "    <th>" + header_data[4] + "</th>" +
        "    <th>" + header_data[5] + "</th>" +
        "    </tr>"
        "</table>";
    newWindow.document.write(table_schema);
    var rows = table["Row"];
    if (rows == undefined) return;

    var n_rows = rows.length;
    for (var i = 0; i < n_rows; i++) {
        var row = rows[i];

        var company = row["Company"];
        var services = row["Services"];
        var hubs = row["Hubs"];
        var revenue = row["Revenue"];
        var homePage = row["HomePage"];
        var logoURL = row["Logo"];

        var row_str = "<tr>";
        // row: company
        row_str += "<td>" + company + "</td>";

        // row: services
        row_str += "<td>" + services + "</td>";

        // row: hubs
        var hub = hubs["Hub"];
        row_str += "<td>";
        if (hub.length > 0) {
            row_str += "<ul>";
            for (var j = 0; j < hub.length; j++)
                row_str += "<li>" + hub[j];
            row_str += "</ul>";
        }
        row_str += "</td>";

        // row: revenue
        row_str += "<td>" + revenue + "</td>";

        // row: homePage
        row_str += "<td>";
        row_str += "<a href=" + homePage + ">" + homePage + "</a>";
        row_str += "</td>";

        // row: logo
        row_str += "<td>";
        row_str += "<img src=" + logoURL + " style='display:block;' width='100%;'" + ">";
        row_str += "</td>";

        row_str += "</tr>";
        newWindow.document.write(row_str);

        var html_closing = "</body></html>";
        newWindow.document.write(html_closing);
    }
}
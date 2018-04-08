<?php
/**
* Created by Wei-Chung Huang.
* Date: 4/6/18
*/
?>
<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<head>
    <style type="text/css">
        div.box {
            background-color: aliceblue;
            text-align: center;
            border-style: solid;
            border-color: gray;
            border-width: 1px;
            width: 50%;
            margin-left: 25%;
        }
    </style>

    <script>
        function check() {
            var stock_name = document.getElementById("stock_name").value;
            if (!stock_name) {
                alert("Please enter name or Symbol");
                return false;
            }
            return true;
        }

        function resetPage() {
            window.location.href = "stock.php";
        }

    </script>
</head>
<body>
<div class="box">
    <i>Stock Search</i><hr>
    <div class="form">
        <form action="stock.php" method="get" onsubmit="return check();">
            Company Name of Symbol: <input type="text" name="stock_name" id="stock_name" placeholder="e.g. APPL"
                                           value="<?php echo isset($_GET['stock_name']) ? $_GET['stock_name'] : ''?>"><br>
            <input type="submit" name="btn_search" value="search"">
            <input type="button" name="btn_clear" value="clear" onclick="resetPage();">
        </form>
        <a href="https://ihsmarkit.com/products/digital.html"><p>Powered by Markit on Demand</p></a>
    </div>
</div>
<div>
    <br>
</div>
<?php

function format_date_from_string($arg) {
    $old_date = $arg;
    $old_date_timestamp = strtotime($old_date);
    $new_date = date('Y-m-d h:i A', $old_date_timestamp);
    return $new_date;
}

if (isset($_GET["more_info"]) && isset($_GET["stock_name"])) {
    $get_stock_info = $_GET["stock_name"];
    $response = file_get_contents("http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=" . $get_stock_info);
    $response = json_decode($response, true);

    $status = $response["Status"];
    $name = $response["Name"];
    $symbol = $response["Symbol"];
    $last_price = $response["LastPrice"];
    $change = $response["Change"];
    $change_percent = $response["ChangePercent"];
    $timestamp = $response["Timestamp"];
    $market_cap = $response["MarketCap"];
    $volume = $response["Volume"];
    $change_ytd = $response["ChangeYTD"];
    $change_percent_ydt = $response["ChangePercentYTD"];
    $high = $response["High"];
    $low = $response["Low"];
    $open = $response["Open"];

    $red_arrow_img_html = " <img src='red.png' width='10px' height='12px'>";
    $green_arrow_img_html = " <img src='green.png' width='10px' height='12px'>";

    $display_change = round($change, 2);
    if ($display_change > 0) $display_change .= $green_arrow_img_html;
    else if ($display_change < 0) $display_change .= $red_arrow_img_html;

    $display_change_percent = round($change_percent, 2) . "%";
    if ($display_change_percent > 0) $display_change_percent .= $green_arrow_img_html;
    else if ($display_change_percent < 0) $display_change_percent .= $red_arrow_img_html;

    $display_change_ytd = round(($last_price - $change_ytd), 2);
    if ($display_change_ytd > 0) $display_change_ytd .= $green_arrow_img_html;
    else if ($display_change_ytd < 0) $display_change_ytd = "(" . $display_change_ytd . ")" . $red_arrow_img_html;

    $display_change_percent_ydt = round($change_percent_ydt, 2) . "%";
    if ($display_change_percent_ydt > 0) $display_change_percent_ydt .= $green_arrow_img_html;
    else if ($display_change_percent_ydt < 0) $display_change_percent_ydt .= $red_arrow_img_html;

    if (isset($status) && $status == "SUCCESS") {
        $table = "<table border='1' align='center' style='border-collapse: collapse; border-color: gray; text-align: center;'>" .
            "<tr><td>Name</td><td>". $name . "</td></tr>" .
            "<tr><td>Symbol</td><td>". $symbol . "</td></tr>" .
            "<tr><td>Last Price</td><td>". $last_price . "</td></tr>" .
            "<tr><td>Change</td><td>". $display_change . "</td></tr>" .
            "<tr><td>Change Percent</td><td>". $display_change_percent . "</td></tr>" .
            "<tr><td>Timestamp</td><td>". format_date_from_string($timestamp) . "</td></tr>" .
            "<tr><td>Market Cap</td><td>". round($market_cap / 10e9, 2) . " B</td></tr>" .
            "<tr><td>Volume</td><td>". number_format($volume) . "</td></tr>" .
            "<tr><td>Change YTD</td><td>". $display_change_ytd . "</td></tr>" .
            "<tr><td>Change Percent YTD</td><td>". $display_change_percent_ydt . "</td></tr>" .
            "<tr><td>High</td><td>". $high . "</td></tr>" .
            "<tr><td>Low</td><td>". $low . "</td></tr>" .
            "<tr><td>Open</td><td>". $open . "</td></tr>";
        echo $table;
    } else {
        $no_stock_info_html = "";
        $no_stock_info_html .= "<p style='text-align: center;
                                   border-style: solid;
                                   width: 50%;
                                   margin-left: 25%;
                                   border-color: gray;
                                   border-width: 1px;'>There is no stock infomation available</p>";
        echo $no_stock_info_html;
    }
}

if (isset($_GET["btn_search"])) {
    $get_stock_name = $_GET["stock_name"];
    $response = file_get_contents("http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=" . $get_stock_name);
    $response = json_decode($response);

    if (count($response) > 0) {
        $table = "<table border='1' align='center' style='border-collapse: collapse; border-color: gray; text-align: center;'>" .
            "<tr>".
            "<th>Name</th>" .
            "<th>Symbol</th>" .
            "<th>Exchange</th>" .
            "<th>Details</th>" .
            "</tr>";

        $stock_name = "";
        $stock_symbol = "";
        $stock_exchange = "";

        foreach ($response as $stock) {
            foreach ($stock as $key=>$value) {
                if ($key == "Name") $stock_name = $value;
                else if ($key == "Symbol") $stock_symbol = $value;
                else if ($key == "Exchange") $stock_exchange = $value;
            }

            $stock_detail = "<a href='stock.php?stock_name=" . $stock_symbol . "&more_info=true". "'>More Info</a>";

            $table .= "<tr>".
                "<td>$stock_name</td>" .
                "<td>$stock_symbol</td>" .
                "<td>$stock_exchange</td>" .
                "<td>$stock_detail</td>" .
                "</tr>";
        }
        $table .= "</table>";
        echo $table;
    } else {
        $no_record_html = "";
        $no_record_html .= "<p style='text-align: center; 
                                      border-style: solid; 
                                      width: 50%; 
                                      margin-left: 25%;
                                      border-color: gray;
                                      border-width: 1px;'>No Records has been found</p>";
        echo $no_record_html;
    }
}
?>
</body>
</html>

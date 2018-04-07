<?php
/**
* Created by Wei-Chung Huang.
* Date: 4/6/18
*/
?>
<html>
<body>
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
    </script>
</head>
<div class="box">
    <i>Stock Search</i><hr>
    <div class="form">
        <form action="stock.php" method="get" onsubmit="return check();">
            Company Name of Symbol: <input type="text" name="stock_name" id="stock_name" placeholder="e.g. APPL" value=""><br>
            <input type="submit" name="btn_search" value="search"">
            <input type="button" name="btn_clear" value="clear">
        </form>
        <a href="https://ihsmarkit.com/products/digital.html"><p>Powered by Markit on Demand</p></a>
    </div>
</div>
<div>
    <br>
</div>
<?php
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
        $stock_detail = "<a href='#'>More info</a>";
        foreach ($response as $stock) {
            foreach ($stock as $key=>$value) {
                if ($key == "Name") $stock_name = $value;
                else if ($key == "Symbol") $stock_symbol = $value;
                else if ($key == "Exchange") $stock_exchange = $value;
            }

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

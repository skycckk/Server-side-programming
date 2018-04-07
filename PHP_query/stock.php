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
            Company Name of Symbol: <input type="text" id="stock_name" placeholder="e.g. AAPL" value=""><br>
            <input type="submit" name="btn_search" value="search"">
            <input type="button" name="btn_clear" value="clear">
        </form>
        <a href="https://ihsmarkit.com/products/digital.html"><p>Powered by Markit on Demand</p></a>
    </div>
</div>
</body>
</html>

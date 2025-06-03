<?php
    require 'timeout.php';

    if(isset($_SESSION['id'])) {

        echo http_response_code(200);

    } else {

        echo http_response_code(401);

    }

?>
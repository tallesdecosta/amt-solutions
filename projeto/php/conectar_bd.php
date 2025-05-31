<?php

function conectar() {

    $db_name = "db_amt";
    $db_user = "root";
    $db_pass = "";
    $db_server = "localhost:3306";
    $conn = new mysqli($db_server, $db_user, $db_pass, $db_name);
    
    return $conn;
    
    

}


?>
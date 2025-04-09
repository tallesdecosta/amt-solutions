<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarUsuarios());
            break;
        
        default:
            # code...
            break;
    }

    function retornarUsuarios() {

        $conn = conectar();
        $sql = "SELECT * FROM usuario";
        $res = $conn -> query($sql);
        $arr = [];
        while ($linha = $res -> fetch_assoc()) { 

            $arr[] = $linha;
            
        };
        
        return $arr;

    } 


?>
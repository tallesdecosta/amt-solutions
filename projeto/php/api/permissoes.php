<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarPermissoes());
            break;
        
        default:
            # code...
            break;
    }

    function retornarPermissoes() {

        $conn = conectar();
        $sql = "SELECT * FROM permissao WHERE id_usuario = '".$_SESSION['id']."'";
        $res = $conn -> query($sql);
        $data = $res -> fetch_assoc();
        return $data;

    } 


?>
<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarPermissoes());
            break;
        
        case "PUT":
            echo json_encode(atualizarPermissoes());
            break;

        default:
            # code...
            break;
    }

    function retornarPermissoes() {

        $sql = "SELECT * FROM permissao WHERE id_usuario = '".$_SESSION['id']."'";

        if(isset($_GET['id'])) {

            $sql = "SELECT * FROM permissao WHERE id_usuario = '".$_GET['id']."'";

        }

        $conn = conectar();
        
        $res = $conn -> query($sql);
        $data = $res -> fetch_assoc();
        return $data;

    } 

    function atualizarPermissoes() {

        if(isset($_GET['id'])) {

            $sql = "UPDATE permissao SET estoque = '".$_GET['estoque']."', vendas = '".$_GET['vendas']."', financeiro='".$_GET['financeiro']."', gestao='".$_GET['gestao']."'  WHERE id_usuario = '".$_GET['id']."'";

            $conn = conectar();
        
            $res = $conn -> query($sql);

            return http_response_code(200);

        }
    }
?>
<?php

include 'conectar_bd.php';

$_POST = json_decode(file_get_contents('php://input'), true);

if (isset($_POST)) {
    switch ($_POST) {
        case isset($_POST["resp"]) && $_POST["op"] == "abrir":
            echo json_encode(abrir());
            break;

        case isset($_POST["resp"]) && $_POST["op"] == "fechar":
            echo json_encode(fechar());
            break;

        case isset($_POST["user"]):
            echo json_encode(verificarAcesso());
            break;

        default:
            # code...
            break;
    }
} else if (isset($_GET)) {
    echo json_encode(retornarFuncs());
}




function abrir()
{

    $resp = intval($_POST["resp"]);
    $val = floatval($_POST["valor"]);

    $conn = conectar();
    $query = "INSERT INTO caixa(id_usuario,id_fech,valorTotal,horaAbertura,horaFecha) VALUES ('$resp',null,'$val',now(),null)";
    $resultado = $conn->query($query);

    if ($resultado) {
        return (["result" => 200]);
    } else {
        return (["result" => 0]);
    }
}

function fechar()
{
    $resp = intval($_POST["resp"]);
    $val = floatval($_POST["valor"]);

    $conn = conectar();
    $query = "SELECT id_op FROM caixa ORDER BY id_op DESC LIMIT 1;";
    $resultadoid = $conn->query($query);

    if ($resultadoid) {
        while ($linha = $resultadoid->fetch_assoc()) {
            $id = intval($linha["id_op"]);

            $conn = conectar();
            $query = "UPDATE caixa SET id_fech = $resp, horaFecha = now() WHERE id_op = $id";
            $resultado = $conn->query($query);

            if ($resultado) {
                return (["result" => 200]);
            } else {
                return (["result" => 0]);
            }

        }
    }

    
}

function retornarFuncs()
{

    $conn = conectar();
    $query = "SELECT id_usuario, nome FROM usuario";
    $resultado = $conn->query($query);

    if ($resultado) {

        $retorno = [];

        while ($linha = $resultado->fetch_assoc()) {

            $retorno[] = $linha;
        }

        return ($retorno);
    }
}

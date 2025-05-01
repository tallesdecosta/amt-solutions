<?php

include 'conectar_bd.php';

$_POST = json_decode(file_get_contents('php://input'), true);

if(isset($_POST)){
    switch ($_POST) {
        case isset($_POST["resp"]) && $_POST["op"] == "insert":
            echo json_encode(insert());
            break;
        
        case isset($_POST["user"]):
            echo json_encode(verificarAcesso());
            break;
        
        default:
            # code...
            break;
    }
}else if(isset($_GET)){
    echo json_encode(retornarFuncs());
}




function insert(){

    $resp = intval($_POST["resp"]);
    $val = floatval($_POST["valor"]);
    $obs = $_POST["obs"];

    $conn = conectar();
    $query = "INSERT INTO operacao(id_respon,valor,obs) VALUES ('$resp','$val','$obs')";
    $resultado = $conn->query($query);

    if ($resultado) {
        return(["result" => 200]);
    } else {
        return(["result" => 0]);
    }
}


function verificarAcesso(){

    $user = $_POST["user"];
    $senha = $_POST["senha"];

    $conn = conectar();
    $query = "SELECT id_usuario FROM usuario WHERE username = '$user' AND senha = '$senha'";
    $resultado = $conn->query($query);

    if ($resultado) {

        if ($resultado->num_rows > 0) {

            while ($linha = $resultado->fetch_assoc()) {

                $id = $linha["id_usuario"];

                $conn = conectar();
                $query = "SELECT gestao FROM permissao WHERE id_usuario = '$id'";
                $resultado = $conn->query($query);


                if ($resultado) {

                    while ($linha = $resultado->fetch_assoc()) {

                        if ($linha["gestao"] == 1) {
                            return(["acesso" => "autorizado"]);
                        } else if ($linha["gestao"] == 0) {
                            return(["acesso" => "negado"]);
                        }
                    }
                }
            }
        } else {
            return(["acesso" => "negado"]);
        }
    } else {
        return(["result" => 401]);
    }
}


function retornarFuncs(){

    $conn = conectar();
    $query = "SELECT id_usuario, nome FROM usuario";
    $resultado = $conn->query($query);

    if ($resultado) {

        $retorno = [];

        while ($linha = $resultado->fetch_assoc()) {

            $retorno[] = $linha;
        }

        return($retorno);
    }
}


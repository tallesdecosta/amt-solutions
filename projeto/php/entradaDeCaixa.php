<?php

include 'conectar_bd.php';

$_POST = json_decode(file_get_contents('php://input'), true);

if (isset($_POST["resp"])) {

    $resp = intval($_POST["resp"]);
    $val = floatval($_POST["valor"]);
    $obs = $_POST["obs"];

    $conn = conectar();
    $query = "INSERT INTO operacao(id_respon,valor,obs) VALUES ('$resp','$val','$obs')";
    $resultado = $conn->query($query);

    if ($resultado) {
        echo json_encode(["result" => 200]);
    } else {
        echo json_encode(["result" => 0]);
    }
} else if (isset($_POST["user"])) {

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
                            echo json_encode(["acesso" => "autorizado"]);
                        } else if ($linha["gestao"] == 0) {
                            echo json_encode(["acesso" => "negado"]);
                        }
                    }
                }
            }
        } else {
            echo json_encode(["acesso" => "negado"]);
        }
    } else {
        echo json_encode(["result" => 401]);
    }
} else if (isset($_GET)) {

    $conn = conectar();
    $query = "SELECT id_usuario, nome FROM usuario";
    $resultado = $conn->query($query);

    if ($resultado) {

        $retorno = [];

        while ($linha = $resultado->fetch_assoc()) {

            $retorno[] = $linha;
        }

        echo json_encode($retorno);
    }
}

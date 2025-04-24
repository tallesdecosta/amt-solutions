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

}

?>
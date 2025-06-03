<?php

session_start();
    require '../conectar_bd.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        echo json_encode(updateSenha());
        break;
    
    default:
        # code...
        break;
}

    function updateSenha() {
        $senha = $_POST['senha'];
        $id = $_POST['id'];

        if ($id == '') {

            return json_encode(['error' => 'id vazio']);

        }

        $sql = "UPDATE usuario SET senha = '".password_hash($senha, PASSWORD_BCRYPT)."' WHERE id_usuario = '".$id."';";

        $conn = conectar();
        
        if ($conn->query($sql)) {

            return json_encode(['status' => "ok"]);

        }  else {

            return http_response_code(500);
        }

    }
?>
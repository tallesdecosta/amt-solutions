<?php

require('conectar_bd.php');
session_start();

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    

    $conn = conectar();

    $user_form = $_POST['user'];
    $senha_form = $_POST['senha'];

    $query = "SELECT senha, id_usuario FROM usuario WHERE username = '".$user_form."'";
    $res = $conn -> query($query);
    $data = $res -> fetch_object();
    if($data != null) {

        $senha_certa = $data -> senha;
        
        if ($senha_certa == $senha_form) {

            $_SESSION['id'] = $data -> id_usuario;
            http_response_code(200);

        } else {

            http_response_code(401);

        }


    } else {

        http_response_code(401);
    }
    
    


} else {

    http_response_code(405);
    echo json_encode(["erro", "método não disponível nesse endpoint"], JSON_UNESCAPED_UNICODE);


}


?>
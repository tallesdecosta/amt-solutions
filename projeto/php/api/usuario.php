<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarUsuarios());
            break;
        
        case 'POST':
            echo json_encode(criarUsuario());
            break;

        case 'DELETE':
            echo json_encode(deletarUsuario());
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

    function criarUsuario() {

        $user_form = $_POST['user'];
        $senha_form = $_POST['senha'];
        $nome_form = $_POST['nome'];
        $cargo_form = $_POST['cargo'];
        $contato_form = $_POST['contato'];
        $admin_form = intval($_POST['admin']);
        $estoque_form = intval($_POST['estoque']);
        $gestao_form = intval($_POST['gestao']);
        $vendas_form = intval($_POST['vendas']);
        $financeiro_form = intval($_POST['financeiro']);
        
        $sql = "INSERT INTO usuario(nome, senha, username, ehAdm, contato, cargo) VALUES('".$nome_form."','".password_hash($senha_form, PASSWORD_BCRYPT)."','".$user_form."','".$admin_form."','".$contato_form."','".$cargo_form."');";

        $conn = conectar();
        $conn->query($sql);

        $sql1 = "SELECT id_usuario FROM usuario WHERE username = '".$user_form."'";
        $result = $conn->query($sql1);
        $data = $result->fetch_object();
        $id = $data -> id_usuario;
        $sql2 = "INSERT INTO permissao(id_usuario, gestao, estoque, financeiro, vendas) VALUES(".$id.", ".$gestao_form.", ".$estoque_form.", ".$financeiro_form.",".$vendas_form.")";
        $conn->query($sql2);

    }

    function deletarUsuario() {

        $id = $_GET['id'];
        $sql = "DELETE FROM permissao WHERE id_usuario = '".$id."';";

        $conn = conectar();
        $conn -> query($sql);

        $sql = "DELETE FROM usuario WHERE id_usuario = '".$id."';";
        $conn -> query($sql);


    }
?>
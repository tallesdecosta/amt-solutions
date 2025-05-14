<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarDespesa(), JSON_UNESCAPED_UNICODE);
            break;
        
        case "POST":
            break;

        case "DELETE":
            break;

        default:
            # code...
            break;
    }

    function retornarDespesa() {

        $sql = "SELECT despesa.*, usuario.nome 
        FROM despesa 
        JOIN usuario ON despesa.id_usuario = usuario.id_usuario 
        WHERE despesa.dataInicio BETWEEN '" . $_GET['inicio'] . "' AND '" . $_GET['fim'] . "'";

            $conn = conectar();
                    

            $res = $conn->query($sql);

            $id_produto = [];

            while ($linha = $res->fetch_assoc()) {

                $id_produto[] = $linha;
                
            }

            return $id_produto;
        }

    

function salvarDfc() {

    $sql = "INSERT INTO dfc(titulo, id_usuario, dataInicio, dataFinal) VALUES('".$_POST['titulo']."','".$_SESSION['id']."','".$_POST['data-inicio']."', '".$_POST['data-fim']."')";

    $conn = conectar();
                    

    $res = $conn->query($sql);

    if($res) {

        return ['status' => 'ok'];
    } else {

        return ['status' => 'erro'];

    }

}

function deletarDfc() {

    $sql = "DELETE FROM dfc WHERE id_dfc = '".$_GET['id']."'";

    $conn = conectar();

    $res = $conn->query($sql);

    if($res) {

        return ['status' => 'ok'];
    } else {

        return ['status' => 'erro'];

    }

}

?>
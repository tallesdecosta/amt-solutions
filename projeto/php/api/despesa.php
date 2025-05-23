<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarDespesa(), JSON_UNESCAPED_UNICODE);
            break;
        
        case "POST":
            echo json_encode(criarDespesa(), JSON_UNESCAPED_UNICODE);
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

    
        function criarDespesa() {

        $sql = "INSERT INTO despesa(id_tipo_despesa, descritivo, id_usuario, valor, dataInicio, dataVencimento, estaPago) VALUES('".$_POST['tipo_despesa']."', '".$_POST['descritivo']."', '".$_SESSION['id']."', '".$_POST['valor']."', '".$_POST['dataInicio']."', '".$_POST['dataVencimento']."', 0)";

        $conn = conectar();
                    
        $res = $conn -> query($sql);


        if ($res) {

            return ['status' => 'ok'];

        } else {

            return ['status' => 'erro'];

        }

        }

?>
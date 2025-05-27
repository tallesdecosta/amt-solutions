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

        case "PUT":
            echo json_encode(alterarDespesa(), JSON_UNESCAPED_UNICODE);
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

    function alterarDespesa() {

        parse_str(file_get_contents("php://input"), $put_vars);


          $sql = "UPDATE despesa SET " .
        "descritivo = '"       . $put_vars['descritivo']       . "', " .
        "valor = "             . $put_vars['valor']            . ", " .
        "dataInicio = '"       . $put_vars['data-inicio']      . "', " .
        "dataVencimento = '"   . $put_vars['data-fim']         . "', " .
        "estaPago = "          . $put_vars['status']           . ", " .
        "id_tipo_despesa = "   . $put_vars['id_tipo_despesa']  . " " .
        "WHERE id_despesa = "  . $put_vars['id_despesa']       . ";";
        
        $conn = conectar();
        $res = $conn->query($sql);

        if ($res) {

            return ['status' => 'ok'];

        } else {

            return [
        'status' => 'erro',
        'mensagem' => $conn->error
        ];
    }
    }

?>
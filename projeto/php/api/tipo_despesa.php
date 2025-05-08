<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarTipoDespesa());
            break;
        
        case "POST":
            break;

        case "DELETE":
            break;

        default:
            # code...
            break;
    }

    function retornarTipoDespesa() 
    {

        $sql = "SELECT * FROM tipodespesa";

        $conn = conectar();
                    
        $res = $conn -> query($sql);

        $tipos_despesa = [];

        while ($linha = $res -> fetch_assoc()) {

            $tipos_despesa[] = $linha;
                
        }

        return $tipos_despesa;
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
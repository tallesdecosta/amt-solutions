<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarDfc());
            break;
        
        case "POST":
            echo json_encode(salvarDfc());
            break;

        case "DELETE":
            echo json_encode(deletarDfc());
            break;

        default:
            # code...
            break;
    }

    function retornarDfc() {

        if(isset($_GET['inicio']) && isset($_GET['fim'])) {

            $sql = "SELECT 
            v.id AS venda_id, 
            v.data_emissao, 
            SUM(p.valor * vp.qntd) AS total_valor
        FROM venda v
        INNER JOIN venda_produto vp ON v.id = vp.id_venda
        INNER JOIN produto p ON vp.id_produto = p.id_produto
        WHERE v.data_emissao BETWEEN '" . $_GET['inicio'] . "' AND '" . $_GET['fim'] . "'
        GROUP BY v.id, v.data_emissao";

            $conn = conectar();
                    

            $res = $conn->query($sql);

            $id_produto = [];

            while ($linha = $res->fetch_assoc()) {

                $id_produto[] = $linha;
                
            }

            return $id_produto;
        }

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
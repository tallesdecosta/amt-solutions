<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarDfc());
            break;
        
        case "PUT":
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

?>
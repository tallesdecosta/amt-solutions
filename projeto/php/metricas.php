<?php

    session_start();
    require 'conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarMetricas(), JSON_UNESCAPED_UNICODE);
            break;

        default:
            # code...
            break;
    }

    function retornarMetricas() {

        $metricas = [];
        $sql_ticket_medio = "SELECT AVG(p.valor * vp.qntd) AS ticket_medio 
        FROM venda v 
        JOIN venda_produto vp ON v.id = vp.id_venda
        JOIN produto p ON vp.id_produto = p.id_produto
        WHERE v.data_emissao BETWEEN '".$_GET['dataInicio']."' AND '".$_GET['dataFim']."';";

        $conn = conectar();
        

        $res = $conn->query($sql_ticket_medio);

        $ticket_medio = $res->fetch_assoc();
        $metricas[] = $ticket_medio;

        //

        $sql_volume_vendas = "SELECT 
        COUNT(*) AS total_comandas
        FROM venda
        WHERE data_emissao BETWEEN '".$_GET['dataInicio']."' AND '".$_GET['dataFim']."';";

        $res = $conn->query($sql_volume_vendas);

        $volume_vendas = $res->fetch_assoc();
        $metricas[] = $volume_vendas;

        //

        $sql_margem_lucro = "SELECT 
        COUNT(*) AS total_comandas
        FROM venda
        WHERE data_emissao BETWEEN '".$_GET['dataInicio']."' AND '".$_GET['dataFim']."';";

        $res = $conn->query($sql_volume_vendas);

        $volume_vendas = $res->fetch_assoc();
        $metricas[] = $volume_vendas;

        $sql_horario_pico = "
        SELECT HOUR(v.data_emissao) AS hora, COUNT(*) AS total
        FROM venda v
        WHERE v.data_emissao BETWEEN '".$_GET['dataInicio']."' AND '".$_GET['dataFim']."'
        GROUP BY hora
        ORDER BY total DESC
        LIMIT 1;
    ";
    $res = $conn->query($sql_horario_pico);
    $metricas['horario_pico'] = $res->fetch_assoc()['hora'] . 'h';

        return $metricas;
    }

    


    
?>
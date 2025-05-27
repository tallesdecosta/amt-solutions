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
    $conn = conectar();

    $dataInicio = $_GET['dataInicio'];
    $dataFim = $_GET['dataFim'];

    $intervalo = strtotime($dataFim) - strtotime($dataInicio);
    $dataFimAnterior = date('Y-m-d', strtotime($dataInicio) - 1);
    $dataInicioAnterior = date('Y-m-d', strtotime($dataInicio) - $intervalo - 1);

    function buscarMetricas($conn, $inicio, $fim) {
        $metricas = [];

        // Receita, volume de vendas, ticket médio
        $sql = "
            SELECT 
                COUNT(DISTINCT v.id) AS volume_vendas,
                SUM(p.valor * vp.qntd) AS receita
            FROM venda v
            JOIN venda_produto vp ON v.id = vp.id_venda
            JOIN produto p ON vp.id_produto = p.id_produto
            WHERE DATE(v.data_emissao) BETWEEN ? AND ?
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $inicio, $fim);
        $stmt->execute();
        $res = $stmt->get_result()->fetch_assoc();

        $receita = floatval($res['receita'] ?? 0);
        $volumeVendas = intval($res['volume_vendas'] ?? 0);

        $metricas['receita'] = $receita;
        $metricas['volume_vendas'] = $volumeVendas;
        $metricas['ticket_medio'] = $volumeVendas > 0 ? $receita / $volumeVendas : 0;

        // Despesas pagas
        $sql = "
            SELECT SUM(valor) AS total_despesas
            FROM despesa
            WHERE dataVencimento BETWEEN ? AND ? AND estaPago = 1
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $inicio, $fim);
        $stmt->execute();
        $res = $stmt->get_result()->fetch_assoc();
        $totalDespesas = floatval($res['total_despesas'] ?? 0);

        // Lucro real
        $lucro = $receita - $totalDespesas;
        $metricas['lucro_real'] = $lucro;

        // Margem de lucro (%)
        $metricas['margem_lucro'] = $receita > 0 ? ($lucro / $receita) * 100 : null;

        return $metricas;
    }

    $atual = buscarMetricas($conn, $dataInicio, $dataFim);
    $anterior = buscarMetricas($conn, $dataInicioAnterior, $dataFimAnterior);

    $resultado = [];

    foreach ($atual as $key => $valorAtual) {
        $valorAnterior = $anterior[$key] ?? 0;
        $crescimento = $valorAnterior == 0 ? 100 : (($valorAtual - $valorAnterior) / $valorAnterior) * 100;

        $resultado[$key] = [
            'atual' => $valorAtual,
            'anterior' => $valorAnterior,
            'crescimento' => $crescimento,
        ];
    }

    return $resultado;
}



    


    
?>
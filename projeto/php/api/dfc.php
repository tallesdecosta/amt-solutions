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
    if (!isset($_GET['inicio'], $_GET['fim'])) {
        http_response_code(400);
        return ['error' => 'Parâmetros inicio e fim obrigatórios'];
    }

    $inicio = $_GET['inicio'];
    $fim    = $_GET['fim'];
    $conn   = conectar();

    // 1) VENDAS
    $sqlEntradasVendas = "
        SELECT 
            v.id            AS venda_id, 
            v.data_emissao, 
            SUM(p.valor * vp.qntd) AS total_valor
        FROM venda v
        INNER JOIN venda_produto vp ON v.id = vp.id_venda
        INNER JOIN produto p ON vp.id_produto = p.id_produto
        WHERE DATE(v.data_emissao) BETWEEN '$inicio' AND '$fim'
        GROUP BY v.id, v.data_emissao
    ";
    $resEntradasVendas = $conn->query($sqlEntradasVendas);
    if (!$resEntradasVendas) {
        die("Erro na query de vendas: " . $conn->error);
    }

    $entradas      = [];
    $totalEntradas = 0.0;

    while ($linha = $resEntradasVendas->fetch_assoc()) {
        $entradas[] = [
            'origem'       => 'venda',
            'id'           => (int)$linha['venda_id'],
            'data'         => $linha['data_emissao'],
            'valor'        => (float)$linha['total_valor']
        ];
        $totalEntradas += (float)$linha['total_valor'];
    }

    // 2) ENTRADAS DE CAIXA
    $sqlEntradasCaixa = "
        SELECT 
            id_op          AS caixa_id,
            valor_ini      AS valor,
            hora_ini       AS data
        FROM caixa
        WHERE DATE(hora_ini) BETWEEN '$inicio' AND '$fim'
          AND nome_op = 'Entrada'
    ";
    $resEntradasCaixa = $conn->query($sqlEntradasCaixa);
    if (!$resEntradasCaixa) {
        die("Erro na query de entradas de caixa: " . $conn->error);
    }

    while ($linha = $resEntradasCaixa->fetch_assoc()) {
        $entradas[] = [
            'origem'       => 'caixa',
            'id'           => (int)$linha['caixa_id'],
            'data'         => $linha['data'],
            'valor'        => (float)$linha['valor']
        ];
        $totalEntradas += (float)$linha['valor'];
    }

    // 3) DESPESAS
    $sqlSaidas = "
        SELECT 
            d.id_despesa   AS despesa_id, 
            d.descritivo, 
            td.nome        AS tipo, 
            d.valor        AS valor, 
            d.dataInicio   AS data
        FROM despesa d
        INNER JOIN tipodespesa td ON d.id_tipo_despesa = td.id_tipo_despesa
        WHERE d.dataInicio BETWEEN '$inicio' AND '$fim'
          AND d.estaPago = 1
    ";
    $resSaidas = $conn->query($sqlSaidas);
    if (!$resSaidas) {
        die("Erro na query de despesas: " . $conn->error);
    }

    $saidas      = [];
    $totalSaidas = 0.0;

    while ($linha = $resSaidas->fetch_assoc()) {
        $saidas[] = [
            'id'       => (int)$linha['despesa_id'],
            'descritivo' => $linha['descritivo'],
            'tipo'       => $linha['tipo'],
            'valor'      => (float)$linha['valor'],
            'data'       => $linha['data']
        ];
        $totalSaidas += (float)$linha['valor'];
    }

    // 4) SALDO FINAL
    $saldoFinal = $totalEntradas - $totalSaidas;

    return [
        'entradas' => [
            'detalhes' => $entradas,
            'total'    => $totalEntradas
        ],
        'saidas'   => [
            'detalhes' => $saidas,
            'total'    => $totalSaidas
        ],
        'saldo_final' => $saldoFinal
    ];
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
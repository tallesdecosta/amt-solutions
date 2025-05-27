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
    if (isset($_GET['inicio']) && isset($_GET['fim'])) {

        $inicio = $_GET['inicio'];
        $fim = $_GET['fim'];

        $conn = conectar();

        // ===== ENTRADAS (VENDAS) =====
        $sqlEntradas = "SELECT 
                            v.id AS venda_id, 
                            v.data_emissao, 
                            SUM(p.valor * vp.qntd) AS total_valor
                        FROM venda v
                        INNER JOIN venda_produto vp ON v.id = vp.id_venda
                        INNER JOIN produto p ON vp.id_produto = p.id_produto
                        WHERE v.data_emissao BETWEEN '$inicio' AND '$fim'
                        GROUP BY v.id, v.data_emissao";

        $resEntradas = $conn->query($sqlEntradas);

        $entradas = [];
        $totalEntradas = 0;

        while ($linha = $resEntradas->fetch_assoc()) {
            $entradas[] = $linha;
            $totalEntradas += $linha['total_valor'];
        }

        // ===== SAÍDAS (DESPESAS PAGAS) =====
        $sqlSaidas = "SELECT 
                            d.id_despesa, 
                            d.descritivo, 
                            td.nome AS tipo, 
                            d.valor, 
                            d.dataInicio
                        FROM despesa d
                        INNER JOIN tipodespesa td ON d.id_tipo_despesa = td.id_tipo_despesa
                        WHERE d.dataInicio BETWEEN '$inicio' AND '$fim'
                        AND d.estaPago = 1";

        $resSaidas = $conn->query($sqlSaidas);

        $saidas = [];
        $totalSaidas = 0;

        while ($linha = $resSaidas->fetch_assoc()) {
            $saidas[] = $linha;
            $totalSaidas += $linha['valor'];
        }

        // ===== SALDO FINAL =====
        $saldoFinal = $totalEntradas - $totalSaidas;

        // ===== RETORNO COMPLETO =====
        return [
            'entradas' => [
                'detalhes' => $entradas,
                'total' => $totalEntradas
            ],
            'saidas' => [
                'detalhes' => $saidas,
                'total' => $totalSaidas
            ],
            'saldo_final' => $saldoFinal
        ];
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
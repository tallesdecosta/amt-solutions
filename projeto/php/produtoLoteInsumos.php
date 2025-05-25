<?php
include 'conectar_bd.php';
$conn = conectar();

function responderErro($msg) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id_lote']) || empty($_GET['id_lote'])) {
        responderErro('ID do lote do produto não fornecido');
    }

    $idLote = intval($_GET['id_lote']);

    $sql = "SELECT pli.id_produtoLote, pli.id_insumoLote, pli.quantidade_utilizada,
                   il.id_Lote, il.lote, il.quantidade, i.id_insumo, i.nome
            FROM produtoLoteInsumo pli
            INNER JOIN insumoLote il ON pli.id_insumoLote = il.id_Lote
            INNER JOIN insumo i ON il.id_insumo = i.id_insumo
            WHERE pli.id_produtoLote = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $idLote);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $insumos = [];
    while ($row = $resultado->fetch_assoc()) {
        $insumos[] = [
            'id_produtoLote' => $row['id_produtoLote'],
            'id_insumoLote' => $row['id_insumoLote'],
            'quantidade_utilizada' => $row['quantidade_utilizada'],
            'id_Lote' => $row['id_Lote'],
            'lote' => $row['lote'],
            'quantidade' => $row['quantidade'],
            'id_insumo' => $row['id_insumo'],
            'nome' => $row['nome']
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($insumos);

    $stmt->close();
    $conn->close();
    exit;
}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $dados = json_decode(file_get_contents('php://input'), true);

    if (!isset($dados['id_produtoLote']) || !isset($dados['insumos'])) {
        responderErro('Dados incompletos para salvar insumos');
    }

    $idLote = intval($dados['id_produtoLote']);
    $insumos = $dados['insumos'];

    // Buscar insumos vinculados atuais para este lote do produto
    $stmt = $conn->prepare("SELECT id_insumoLote, quantidade_utilizada FROM produtoLoteInsumo WHERE id_produtoLote = ?");
    $stmt->bind_param("i", $idLote);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $insumosAtuais = [];
    while ($row = $resultado->fetch_assoc()) {
        $insumosAtuais[$row['id_insumoLote']] = $row['quantidade_utilizada'];
    }
    $stmt->close();

    // Preparar stmt
    $stmtInsert = $conn->prepare("INSERT INTO produtoLoteInsumo (id_produtoLote, id_insumoLote, quantidade_utilizada) VALUES (?, ?, ?)");
    $stmtInsert->bind_param("iid", $id_produtoLote, $id_insumoLote, $quantidade_utilizada);

    $stmtUpdate = $conn->prepare("UPDATE produtoLoteInsumo SET quantidade_utilizada = ? WHERE id_produtoLote = ? AND id_insumoLote = ?");
    $stmtUpdate->bind_param("dii", $quantidade_utilizada, $id_produtoLote_update, $id_insumoLote_update);

    $stmtUpdateEstoque = $conn->prepare("UPDATE insumoLote SET quantidade = quantidade + ? WHERE id_Lote = ?");
    $stmtUpdateEstoque->bind_param("di", $quantidade_diff, $id_insumoLote_estoque);

    $stmtCheckEstoque = $conn->prepare("SELECT quantidade FROM insumoLote WHERE id_Lote = ?");
    $stmtCheckEstoque->bind_param("i", $id_insumoLote_check);

    // Para controle de quais insumos foram atualizados/novos
    $insumosRecebidos = [];

    foreach ($insumos as $insumo) {
        $id_produtoLote = $idLote;
        $id_insumoLote = intval($insumo['id_insumoLote']);
        $quantidade_utilizada = floatval($insumo['quantidade']);

        $insumosRecebidos[] = $id_insumoLote;

        $quantidade_anterior = $insumosAtuais[$id_insumoLote] ?? 0;
        $quantidade_diff = $quantidade_anterior - $quantidade_utilizada; // Para devolver se diminuir uso

        if (isset($insumosAtuais[$id_insumoLote])) {
            // Atualizar quantidade usada
            $id_produtoLote_update = $idLote;
            $id_insumoLote_update = $id_insumoLote;
            $stmtUpdate->execute();

            // Atualizar estoque: devolver (quantidade_anterior - nova quantidade)
            $id_insumoLote_estoque = $id_insumoLote;
            $stmtUpdateEstoque->execute();

        } else {
            // Novo vínculo, inserir e debitar estoque
            $stmtInsert->execute();

            $id_insumoLote_estoque = $id_insumoLote;
            $quantidade_diff = -$quantidade_utilizada; // Debita do estoque
            $stmtUpdateEstoque->execute();
        }
    }

    // Insumos que foram removidos
    $insumosParaRemover = array_diff(array_keys($insumosAtuais), $insumosRecebidos);

    $stmtDelete = $conn->prepare("DELETE FROM produtoLoteInsumo WHERE id_produtoLote = ? AND id_insumoLote = ?");
    $stmtDelete->bind_param("ii", $id_produtoLote_del, $id_insumoLote_del);

    foreach ($insumosParaRemover as $id_remover) {
        $quantidade_devolvida = $insumosAtuais[$id_remover]; // quantidade antiga usada

        // Devolver ao estoque
        $id_insumoLote_estoque = $id_remover;
        $quantidade_diff = $quantidade_devolvida;
        $stmtUpdateEstoque->execute();

        // Remover vínculo
        $id_produtoLote_del = $idLote;
        $id_insumoLote_del = $id_remover;
        $stmtDelete->execute();
    }

    // Fechar stmt
    $stmtInsert->close();
    $stmtUpdate->close();
    $stmtUpdateEstoque->close();
    $stmtCheckEstoque->close();
    $stmtDelete->close();

    $conn->close();

    header('Content-Type: application/json');
    echo json_encode(['status' => 'sucesso']);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido']);
exit;
?>

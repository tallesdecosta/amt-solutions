<?php
include 'conectar_bd.php';
$conn = conectar();

function responderErro($msg) {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'mensagem' => $msg]);
    exit;
}

try {
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
                WHERE pli.id_produtoLote = $idLote";

        $resultado = $conn->query($sql);

        if (!$resultado) {
            throw new Exception("Erro na consulta SQL: " . $conn->error);
        }

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
        $sql = "SELECT id_insumoLote, quantidade_utilizada FROM produtoLoteInsumo WHERE id_produtoLote = $idLote";
        $resultado = $conn->query($sql);
        if (!$resultado) throw new Exception("Erro na consulta SQL: " . $conn->error);

        $insumosAtuais = [];
        while ($row = $resultado->fetch_assoc()) {
            $insumosAtuais[$row['id_insumoLote']] = $row['quantidade_utilizada'];
        }

        $insumosRecebidos = [];

        foreach ($insumos as $insumo) {
            $id_insumoLote = intval($insumo['id_insumoLote']);
            $quantidade_utilizada = floatval($insumo['quantidade']);
            $insumosRecebidos[] = $id_insumoLote;

            $quantidade_anterior = $insumosAtuais[$id_insumoLote] ?? 0;
            $quantidade_diff = $quantidade_anterior - $quantidade_utilizada; // Para devolver se diminuir uso

            if (isset($insumosAtuais[$id_insumoLote])) {
                // Atualizar quantidade usada
                $sqlUpdate = "UPDATE produtoLoteInsumo SET quantidade_utilizada = $quantidade_utilizada 
                              WHERE id_produtoLote = $idLote AND id_insumoLote = $id_insumoLote";
                if (!$conn->query($sqlUpdate)) throw new Exception("Erro no update: " . $conn->error);

                // Atualizar estoque: devolver (quantidade_anterior - nova quantidade)
                $sqlEstoque = "UPDATE insumoLote SET quantidade = quantidade + $quantidade_diff WHERE id_Lote = $id_insumoLote";
                if (!$conn->query($sqlEstoque)) throw new Exception("Erro no update estoque: " . $conn->error);

            } else {
                // inserir e debitar estoque
                $sqlInsert = "INSERT INTO produtoLoteInsumo (id_produtoLote, id_insumoLote, quantidade_utilizada) 
                              VALUES ($idLote, $id_insumoLote, $quantidade_utilizada)";
                if (!$conn->query($sqlInsert)) throw new Exception("Erro no insert: " . $conn->error);

                $quantidade_diff = -$quantidade_utilizada; // Debita do estoque
                $sqlEstoque = "UPDATE insumoLote SET quantidade = quantidade + $quantidade_diff WHERE id_Lote = $id_insumoLote";
                if (!$conn->query($sqlEstoque)) throw new Exception("Erro no update estoque: " . $conn->error);
            }
        }

        // Insumos que foram removidos
        $insumosParaRemover = array_diff(array_keys($insumosAtuais), $insumosRecebidos);

        foreach ($insumosParaRemover as $id_remover) {
            $quantidade_devolvida = $insumosAtuais[$id_remover]; // quantidade antiga usada

            // Devolver ao estoque
            $quantidade_diff = $quantidade_devolvida;
            $sqlEstoque = "UPDATE insumoLote SET quantidade = quantidade + $quantidade_diff WHERE id_Lote = $id_remover";
            if (!$conn->query($sqlEstoque)) throw new Exception("Erro no update estoque: " . $conn->error);

            // Remover vínculo
            $sqlDelete = "DELETE FROM produtoLoteInsumo WHERE id_produtoLote = $idLote AND id_insumoLote = $id_remover";
            if (!$conn->query($sqlDelete)) throw new Exception("Erro no delete: " . $conn->error);
        }

        $conn->close();
        header('Content-Type: application/json');
        echo json_encode(['status' => 'sucesso']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
    exit;
}
?>

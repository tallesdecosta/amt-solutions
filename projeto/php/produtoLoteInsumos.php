<?php
include 'conectar_bd.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(buscarInsumosLote());
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $_POST = json_decode(file_get_contents('php://input'), true);
    echo json_encode(salvarInsumos($_POST));
} else {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
}

function buscarInsumosLote() {
    try {
        if (!isset($_GET['id_lote']) || empty($_GET['id_lote'])) {
            throw new Exception('ID do lote do produto não fornecido');
        }

        $conn = conectar();
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
            $insumos[] = $row;
        }

        return $insumos;
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function salvarInsumos($dados) {
    try {
        if (!isset($dados['id_produtoLote']) || !isset($dados['insumos'])) {
            throw new Exception('Dados incompletos para salvar insumos');
        }

        $conn = conectar();
        $idLote = intval($dados['id_produtoLote']);
        $insumos = $dados['insumos'];

        // Buscar insumos vinculados atuais
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
            $quantidade_diff = $quantidade_anterior - $quantidade_utilizada;

            if (isset($insumosAtuais[$id_insumoLote])) {
                $sqlUpdate = "UPDATE produtoLoteInsumo SET quantidade_utilizada = $quantidade_utilizada 
                              WHERE id_produtoLote = $idLote AND id_insumoLote = $id_insumoLote";
                if (!$conn->query($sqlUpdate)) throw new Exception("Erro no update: " . $conn->error);

                $sqlEstoque = "UPDATE insumoLote SET quantidade = quantidade + $quantidade_diff WHERE id_Lote = $id_insumoLote";
                if (!$conn->query($sqlEstoque)) throw new Exception("Erro no update estoque: " . $conn->error);

            } else {
                $sqlInsert = "INSERT INTO produtoLoteInsumo (id_produtoLote, id_insumoLote, quantidade_utilizada) 
                              VALUES ($idLote, $id_insumoLote, $quantidade_utilizada)";
                if (!$conn->query($sqlInsert)) throw new Exception("Erro no insert: " . $conn->error);

                $quantidade_diff = -$quantidade_utilizada;
                $sqlEstoque = "UPDATE insumoLote SET quantidade = quantidade + $quantidade_diff WHERE id_Lote = $id_insumoLote";
                if (!$conn->query($sqlEstoque)) throw new Exception("Erro no update estoque: " . $conn->error);
            }
        }

        $insumosParaRemover = array_diff(array_keys($insumosAtuais), $insumosRecebidos);

        foreach ($insumosParaRemover as $id_remover) {
            $quantidade_devolvida = $insumosAtuais[$id_remover];
            $sqlEstoque = "UPDATE insumoLote SET quantidade = quantidade + $quantidade_devolvida WHERE id_Lote = $id_remover";
            if (!$conn->query($sqlEstoque)) throw new Exception("Erro no update estoque: " . $conn->error);

            $sqlDelete = "DELETE FROM produtoLoteInsumo WHERE id_produtoLote = $idLote AND id_insumoLote = $id_remover";
            if (!$conn->query($sqlDelete)) throw new Exception("Erro no delete: " . $conn->error);
        }

        return ['status' => 'sucesso'];
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}
?>

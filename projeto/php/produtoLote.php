<?php
include 'conectar_bd.php';
$conn = conectar();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $filtro = $_GET['id_produto'] ?? null;

        $sql = "SELECT pl.id_Lote, pl.id_produto, p.nome AS nome_produto, pl.lote, pl.vencimento, pl.fornecedor, pl.quantidade
                FROM produtoLote pl
                JOIN produto p ON pl.id_produto = p.id_produto";

        if ($filtro) {
            $sql .= " WHERE pl.id_produto = $filtro";
        }

        $resultado = $conn->query($sql);

        if (!$resultado) {
            throw new Exception("Erro na consulta: " . $conn->error);
        }

        $dados = [];
        while ($row = $resultado->fetch_assoc()) {
            $dados[] = $row;
        }

        header('Content-Type: application/json');
        echo json_encode($dados);
    }

    elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        $dados = json_decode(file_get_contents('php://input'), true);

        $id_produto = (int)($dados['id_produto'] ?? 0);
        $lote = $dados['lote'] ?? '';
        $vencimento = $dados['vencimento'] ?? '';
        $fornecedor = $dados['fornecedor'] ?? '';
        $quantidade = (int)($dados['quantidade'] ?? 0);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $sql = "INSERT INTO produtoLote (id_produto, lote, vencimento, fornecedor, quantidade) VALUES (
                $id_produto, '$lote', '$vencimento', '$fornecedor', $quantidade
            )";

            if ($conn->query($sql)) {
                header('Content-Type: application/json');
                echo json_encode([
                    "status" => "sucesso",
                    "id_Lote" => $conn->insert_id
                ]);
            } else {
                throw new Exception("Erro ao inserir lote: " . $conn->error);
            }
        } else {
            // PUT - Atualização
            if (!isset($dados['id_Lote'])) {
                http_response_code(400);
                echo json_encode(["erro" => "ID do lote não informado para atualização"]);
                exit;
            }
            $id_Lote = (int)$dados['id_Lote'];

            $sql = "UPDATE produtoLote SET
                    id_produto=$id_produto,
                    lote='$lote',
                    vencimento='$vencimento',
                    fornecedor='$fornecedor',
                    quantidade=$quantidade
                    WHERE id_Lote=$id_Lote";

            if ($conn->query($sql)) {
                header('Content-Type: application/json');
                echo json_encode(["status" => "sucesso"]);
            } else {
                throw new Exception("Erro ao atualizar lote: " . $conn->error);
            }
        }
    }

    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str($_SERVER['QUERY_STRING'], $params);

        if (!isset($params['id'])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID do lote não informado para exclusão"]);
            exit;
        }

        $id = (int)$params['id'];

        $sql = "DELETE FROM produtoLote WHERE id_Lote=$id";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "deletado"]);
        } else {
            throw new Exception("Erro ao deletar lote: " . $conn->error);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["erro" => $e->getMessage()]);
}

$conn->close();
?>

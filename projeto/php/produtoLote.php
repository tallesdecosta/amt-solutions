<?php
include 'conectar_bd.php';
$conn = conectar();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filtro = $_GET['id_produto'] ?? null;

    $sql = "SELECT pl.id_Lote, pl.id_produto, p.nome AS nome_produto, pl.lote, pl.vencimento, pl.fornecedor, pl.quantidade
            FROM produtoLote pl
            JOIN produto p ON pl.id_produto = p.id_produto";

    if ($filtro) {
        $sql .= " WHERE pl.id_produto = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $filtro);
        $stmt->execute();
        $resultado = $stmt->get_result();
    } else {
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->get_result();
    }

    $dados = [];
    while ($row = $resultado->fetch_assoc()) {
        $dados[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($dados);

    $stmt->close();
}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $dados = json_decode(file_get_contents('php://input'), true);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Inserção
        $stmt = $conn->prepare("INSERT INTO produtoLote (id_produto, lote, vencimento, fornecedor, quantidade) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "isssi",
            $dados['id_produto'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['fornecedor'],
            $dados['quantidade']
        );
        $sucesso = $stmt->execute();

        if ($sucesso) {
            header('Content-Type: application/json');
            echo json_encode([
                "status" => "sucesso",
                "id_Lote" => $conn->insert_id
            ]);
        } else {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(["erro" => "Erro ao inserir lote"]);
        }

        $stmt->close();

    } else {
        // Atualização (PUT)
        if (!isset($dados['id_Lote'])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID do lote não informado para atualização"]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE produtoLote SET id_produto=?, lote=?, vencimento=?, fornecedor=?, quantidade=? WHERE id_Lote=?");
        $stmt->bind_param(
            "isssii",
            $dados['id_produto'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['fornecedor'],
            $dados['quantidade'],
            $dados['id_Lote']
        );

        $sucesso = $stmt->execute();

        if ($sucesso) {
            header('Content-Type: application/json');
            echo json_encode(["status" => "sucesso"]);
        } else {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(["erro" => "Erro ao atualizar lote"]);
        }

        $stmt->close();
    }
}

elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'], $params);
    if (!isset($params['id'])) {
        http_response_code(400);
        echo json_encode(["erro" => "ID do lote não informado para exclusão"]);
        exit;
    }
    $id = intval($params['id']);

    $stmt = $conn->prepare("DELETE FROM produtoLote WHERE id_Lote=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "deletado"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao deletar"]);
    }

    $stmt->close();
}

$conn->close();
?>

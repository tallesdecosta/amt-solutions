<?php
include 'conectar_bd.php';

$conn = conectar();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $filtro = $_GET['id_insumo'] ?? null;

        $sql = "SELECT il.id_Lote, il.id_insumo, i.nome AS nome_insumo, il.lote, il.vencimento, il.fornecedor, il.quantidade
                FROM insumoLote il
                JOIN insumo i ON il.id_insumo = i.id_insumo";

        if ($filtro) {
            $filtro = (int)$filtro;
            $sql .= " WHERE il.id_insumo = $filtro";
        }

        $resultado = $conn->query($sql);

        $dados = [];

        while ($row = $resultado->fetch_assoc()) {
            $dados[] = $row;
        }

        header('Content-Type: application/json');
        echo json_encode($dados);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true);

        if (isset($dados['id'])) {
            $id = (int)$dados['id'];
            $id_insumo = (int)$dados['id_insumo'];
            $lote = $dados['lote'];
            $vencimento = $dados['vencimento'];
            $fornecedor = $dados['fornecedor'];
            $quantidade = (int)$dados['quantidade'];

            $sql = "UPDATE insumoLote SET 
                    id_insumo = $id_insumo, 
                    lote = '$lote', 
                    vencimento = '$vencimento', 
                    fornecedor = '$fornecedor', 
                    quantidade = $quantidade
                    WHERE id_Lote = $id";

        } else {
            $id_insumo = (int)$dados['id_insumo'];
            $lote = $dados['lote'];
            $vencimento = $dados['vencimento'];
            $fornecedor = $dados['fornecedor'];
            $quantidade = (int)$dados['quantidade'];

            $sql = "INSERT INTO insumoLote (id_insumo, lote, vencimento, fornecedor, quantidade) VALUES (
                $id_insumo,
                '$lote',
                '$vencimento',
                '$fornecedor',
                $quantidade
            )";
        }

        if ($conn->query($sql) === TRUE) {
            header('Content-Type: application/json');
            echo json_encode(["Status" => "Sucesso"]);
        } else {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(["erro" => "Erro ao salvar ou atualizar o Lote"]);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = (int)($params['id'] ?? 0);

        $sql = "DELETE FROM insumoLote WHERE id_Lote = $id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "deletado"]);
        } else {
            http_response_code(500);
            echo json_encode(["erro" => "Erro ao deletar"]);
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["erro" => $e->getMessage()]);
}

$conn->close();
?>

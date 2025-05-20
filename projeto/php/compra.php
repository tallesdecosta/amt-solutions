<?php
include 'conectar_bd.php';

$conn = conectar();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

    $query = "
        SELECT pedidocompra.*, insumo.nome AS nome_insumo, usuario.nome AS nome_usuario 
        FROM pedidocompra
        LEFT JOIN insumo ON pedidocompra.id_insumo = insumo.id_insumo
        LEFT JOIN usuario ON pedidocompra.id_usuario = usuario.id_usuario
        WHERE 1=1
    ";

    if ($filtro) {
        $query .= " AND (
            pedidocompra.id_pedido LIKE ? OR 
            insumo.nome LIKE ? OR 
            usuario.nome LIKE ? OR 
            pedidocompra.pedido_status LIKE ?
        )";
    }

    $query .= " ORDER BY pedidocompra.id_pedido DESC";

    $stmt = $conn->prepare($query);

    if ($filtro) {
        $param = "%$filtro%";
        $stmt->bind_param('ssss', $param, $param, $param, $param);
    }

    $stmt->execute();
    $resultado = $stmt->get_result();
    $dados = [];

    while ($linha = $resultado->fetch_assoc()) {
        $dados[] = $linha;
    }

    header('Content-Type: application/json');
    echo json_encode($dados);

    $stmt->close();
}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);

    if (isset($dados['id'])) {
        $stmt = $conn->prepare("UPDATE pedidocompra SET id_insumo=?, id_usuario=?, dataEmissao=?, pedido_status=?, qntComprar=?, observacao=? WHERE id_pedido=?");
        $stmt->bind_param(
            "iissdsi", 
            $dados['id_insumo'],
            $dados['id_usuario'],
            $dados['dataEmissao'],
            $dados['pedido_status'],
            $dados['qntComprar'],
            $dados['observacao'],
            $dados['id']
        );
    } else {
        $stmt = $conn->prepare("INSERT INTO pedidocompra (id_insumo, id_usuario, dataEmissao, pedido_status, qntComprar, observacao) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iissds", 
            $dados['id_insumo'],
            $dados['id_usuario'],
            $dados['dataEmissao'],
            $dados['pedido_status'],
            $dados['qntComprar'],
            $dados['observacao']
        );
    }

    if ($stmt->execute()) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "sucesso"]);
    } else {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(["erro" => "Erro ao salvar ou atualizar"]);
    }

    $stmt->close();
}

elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'];

    $stmt = $conn->prepare("DELETE FROM pedidocompra WHERE id_pedido=?");
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

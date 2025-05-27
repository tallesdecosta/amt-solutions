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

    if ($filtro != '') {
        $query .= " AND (
            pedidocompra.id_pedido LIKE '%$filtro%' OR 
            insumo.nome LIKE '%$filtro%' OR 
            usuario.nome LIKE '%$filtro%' OR 
            pedidocompra.pedido_status LIKE '%$filtro%'
        )";
    }

    $query .= " ORDER BY pedidocompra.id_pedido DESC";

    $resultado = $conn->query($query);
    $dados = [];

    while ($linha = $resultado->fetch_assoc()) {
        $dados[] = $linha;
    }

    header('Content-Type: application/json');
    echo json_encode($dados);
}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);
    $id_insumo = $dados['id_insumo'];
    $id_usuario = $dados['id_usuario'];
    $dataEmissao = $dados['dataEmissao'];
    $pedido_status = $dados['pedido_status'];
    $qntComprar = $dados['qntComprar'];
    $observacao = $dados['observacao'];

    if (isset($dados['id']) && $dados['id'] != '') {
        $id = $dados['id'];
        
        $sql = "UPDATE pedidocompra SET 
            id_insumo='$id_insumo', 
            id_usuario='$id_usuario', 
            dataEmissao='$dataEmissao', 
            pedido_status='$pedido_status', 
            qntComprar='$qntComprar', 
            observacao='$observacao' 
            WHERE id_pedido=$id";
    } else {
        $sql = "INSERT INTO pedidocompra (id_insumo, id_usuario, dataEmissao, pedido_status, qntComprar, observacao) 
                VALUES ('$id_insumo', '$id_usuario', '$dataEmissao', '$pedido_status', '$qntComprar', '$observacao')";
    }

    if ($conn->query($sql) === TRUE) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "sucesso"]);
    } else {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(["erro" => "Erro ao salvar ou atualizar"]);
    }
}

elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'];

    $sql = "DELETE FROM pedidocompra WHERE id_pedido = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "deletado"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao deletar"]);
    }
}

$conn->close();
?>
<?php
include 'conectar_bd.php';

$conn = conectar();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';
    $query = 'SELECT * FROM produto WHERE 1=1';

    if ($filtro) {
        $query .= " AND (id_produto LIKE ? OR nome LIKE ? OR categoria LIKE ? OR vencimento LIKE ?)";
    }

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
        $stmt = $conn->prepare("UPDATE produto SET nome=?, categoria=?, valor=?, quantidade=?, lote=?, vencimento=? WHERE id_produto=?");
        $stmt->bind_param(
            "ssssssi", 
            $dados['nome'],
            $dados['categoria'],
            $dados['valor'],
            $dados['quantidade'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['id']
        );
    } else {
        $stmt = $conn->prepare("INSERT INTO produto (nome, categoria, valor, quantidade, lote, vencimento) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssss", 
            $dados['nome'],
            $dados['categoria'],
            $dados['valor'],
            $dados['quantidade'],
            $dados['lote'],
            $dados['vencimento']
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

    $stmt = $conn->prepare("DELETE FROM produto WHERE id_produto=?");
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

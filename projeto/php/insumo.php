<?php
include 'conectar_bd.php';

$conn = conectar();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';
    $query = 'SELECT * FROM insumo WHERE 1=1';

    if ($filtro) {
        $query .= " AND (id_insumo LIKE ? OR nome LIKE ? OR classificacao LIKE ? OR vencimento LIKE ?)";
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
        $stmt = $conn->prepare("UPDATE insumo SET nome=?, classificacao=?, qntMinima=?, lote=?, vencimento=?, inspReceb=?, fornecedor=?, localizacao=?, quantidade=? WHERE id_insumo=?");
        $stmt->bind_param(
            "ssssssssii", 
            $dados['nome'],
            $dados['classificacao'],
            $dados['qntMinima'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['inspReceb'],
            $dados['fornecedor'],
            $dados['localizacao'],
            $dados['quantidade'],
            $dados['id']
        );
    } else {
        $stmt = $conn->prepare("INSERT INTO insumo (nome, classificacao, qntMinima, lote, vencimento, inspReceb, fornecedor, localizacao, quantidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssssssi", 
            $dados['nome'],
            $dados['classificacao'],
            $dados['qntMinima'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['inspReceb'],
            $dados['fornecedor'],
            $dados['localizacao'],
            $dados['quantidade']
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

    $stmt = $conn->prepare("DELETE FROM insumo WHERE id_insumo=?");
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

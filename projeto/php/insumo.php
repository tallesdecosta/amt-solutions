<?php
include 'conectar_bd.php';

$conn = conectar();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

    $query = "
        SELECT i.id_insumo, i.nome, i.classificacao, i.qntMinima, i.inspReceb, i.localizacao, 
        COALESCE(SUM(il.quantidade), 0) AS quantidadeTotal
        FROM insumo i
        LEFT JOIN insumoLote il ON i.id_insumo = il.id_insumo
        WHERE (
            i.id_insumo LIKE ? OR 
            i.nome LIKE ? OR 
            i.classificacao LIKE ?
        )
        GROUP BY i.id_insumo
    ";

    $stmt = $conn->prepare($query);

    $param = "%$filtro%";
    $stmt->bind_param('sss', $param, $param, $param);

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
        $stmt = $conn->prepare("UPDATE insumo SET nome=?, classificacao=?, qntMinima=?, inspReceb=?, localizacao=?, quantidadeTotal=? WHERE id_insumo=?");
        $stmt->bind_param(
            "ssissii", 
            $dados['nome'],
            $dados['classificacao'],
            $dados['qntMinima'],
            $dados['inspReceb'],
            $dados['localizacao'],
            $dados['quantidadeTotal'],
            $dados['id']
        );
    } else {
        $stmt = $conn->prepare("INSERT INTO insumo (nome, classificacao, qntMinima, inspReceb, localizacao, quantidadeTotal) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssissi", 
            $dados['nome'],
            $dados['classificacao'],
            $dados['qntMinima'],
            $dados['inspReceb'],
            $dados['localizacao'],
            $dados['quantidadeTotal']
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
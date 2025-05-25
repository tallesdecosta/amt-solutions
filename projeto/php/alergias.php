<?php
include 'conectar_bd.php';
$conn = conectar();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

    $query = "SELECT * FROM alergia WHERE 1=1";
    if ($filtro) {
        $query .= " AND (id_alergia LIKE ? OR nome LIKE ?)";
        $stmt = $conn->prepare($query);
        $param = "%$filtro%";
        $stmt->bind_param('ss', $param, $param);
    } else {
        $stmt = $conn->prepare($query);
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

    if (isset($dados['id_alergia'])) {
        $stmt = $conn->prepare("UPDATE alergia SET nome=?, observacao=? WHERE id_alergia=?");
        $stmt->bind_param("ssi", $dados['nome'], $dados['observacao'], $dados['id_alergia']);
    } else {
        $stmt = $conn->prepare("INSERT INTO alergia (nome, observacao) VALUES (?, ?)");
        $stmt->bind_param("ss", $dados['nome'], $dados['observacao']);
    }

    if ($stmt->execute()) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "sucesso"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao salvar ou atualizar"]);
    }

    $stmt->close();
}

elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'];

    $stmt = $conn->prepare("DELETE FROM alergia WHERE id_alergia=?");
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

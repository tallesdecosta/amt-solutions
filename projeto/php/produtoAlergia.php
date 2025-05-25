<?php
include 'conectar_bd.php';
$conn = conectar();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Buscar as alergias vinculadas a um produto
    $id_produto = isset($_GET['id_produto']) ? intval($_GET['id_produto']) : 0;

    if (!$id_produto) {
        echo json_encode(["erro" => "ID do produto não informado"]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT a.id_alergia, a.nome
        FROM produto_alergia pa
        JOIN alergia a ON pa.id_alergia = a.id_alergia
        WHERE pa.id_produto = ?
    ");
    $stmt->bind_param("i", $id_produto);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $alergias = [];

    while ($linha = $resultado->fetch_assoc()) {
        $alergias[] = $linha;
    }

    echo json_encode($alergias);
    $stmt->close();
    exit;
}

elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Salvar as alergias vinculadas a um produto
    $data = json_decode(file_get_contents('php://input'), true);

    $id_produto = isset($data['id_produto']) ? intval($data['id_produto']) : null;
    $alergias = isset($data['alergias']) ? $data['alergias'] : [];

    if (!$id_produto || !is_array($alergias)) {
        echo json_encode(["erro" => "Dados inválidos"]);
        exit;
    }

    // Remove alergias antigas
    $stmtDelete = $conn->prepare("DELETE FROM produto_alergia WHERE id_produto = ?");
    $stmtDelete->bind_param("i", $id_produto);
    $stmtDelete->execute();
    $stmtDelete->close();

    // Insere as novas alergias
    $stmtInsert = $conn->prepare("INSERT INTO produto_alergia (id_produto, id_alergia) VALUES (?, ?)");

    foreach ($alergias as $item) {
        if (!isset($item['id_alergia'])) continue;
        $id_alergia = intval($item['id_alergia']);
        $stmtInsert->bind_param("ii", $id_produto, $id_alergia);
        $stmtInsert->execute();
    }

    $stmtInsert->close();

    echo json_encode(["status" => "ok"]);
    exit;
}

else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não suportado"]);
    exit;
}
?>

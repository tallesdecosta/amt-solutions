<?php
include 'conectar_bd.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(buscarAlergias());

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_POST = json_decode(file_get_contents("php://input"), true);
    echo json_encode(salvarAlergias($_POST));

} else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não suportado"]);
}

function buscarAlergias() {
    
    $conn = conectar();

    $id_produto = isset($_GET['id_produto']) ? intval($_GET['id_produto']) : 0;

    if (!$id_produto) {
        http_response_code(400);
        return ["erro" => "ID do produto não informado"];
    }

    $sql = "
        SELECT a.id_alergia, a.nome
        FROM produto_alergia pa
        JOIN alergia a ON pa.id_alergia = a.id_alergia
        WHERE pa.id_produto = $id_produto
    ";

    $resultado = $conn->query($sql);
    if (!$resultado) {
        throw new Exception("Erro na consulta: " . $conn->error);
    }

    $alergias = [];
    while ($linha = $resultado->fetch_assoc()) {
        $alergias[] = $linha;
    }

    return $alergias;
}

function salvarAlergias($data) {
    $conn = conectar();

    $id_produto = isset($data['id_produto']) ? intval($data['id_produto']) : null;
    $alergias = isset($data['alergias']) ? $data['alergias'] : [];

    if (!$id_produto || !is_array($alergias)) {
        http_response_code(400);
        return ["erro" => "Dados inválidos"];
    }

    // Deletar alergias antigas
    $sqlDelete = "DELETE FROM produto_alergia WHERE id_produto = $id_produto";
    if (!$conn->query($sqlDelete)) {
        throw new Exception("Erro ao deletar alergias antigas: " . $conn->error);
    }

    // Inserir novas alergias
    foreach ($alergias as $item) {
        if (!isset($item['id_alergia'])) continue;

        $id_alergia = intval($item['id_alergia']);
        $sqlInsert = "INSERT INTO produto_alergia (id_produto, id_alergia) VALUES ($id_produto, $id_alergia)";

        if (!$conn->query($sqlInsert)) {
            throw new Exception("Erro ao inserir alergia: " . $conn->error);
        }
    }

    return ["status" => "ok"];
}

?>

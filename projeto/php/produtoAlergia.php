<?php
include 'conectar_bd.php';
$conn = conectar();

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Buscar alergias vinculadas a um produto
        $id_produto = isset($_GET['id_produto']) ? intval($_GET['id_produto']) : 0;

        if (!$id_produto) {
            echo json_encode(["erro" => "ID do produto não informado"]);
            exit;
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

        echo json_encode($alergias);
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

        // Deletar alergias antigas do produto
        $sqlDelete = "DELETE FROM produto_alergia WHERE id_produto = $id_produto";
        if (!$conn->query($sqlDelete)) {
            throw new Exception("Erro ao deletar alergias antigas: " . $conn->error);
        }

        // Inserir as novas alergias
        foreach ($alergias as $item) {
            if (!isset($item['id_alergia'])) continue;

            $id_alergia = intval($item['id_alergia']);
            $sqlInsert = "INSERT INTO produto_alergia (id_produto, id_alergia) VALUES ($id_produto, $id_alergia)";

            if (!$conn->query($sqlInsert)) {
                throw new Exception("Erro ao inserir alergia: " . $conn->error);
            }
        }

        echo json_encode(["status" => "ok"]);
        exit;
    }

    else {
        http_response_code(405);
        echo json_encode(["erro" => "Método não suportado"]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["erro" => $e->getMessage()]);
    exit;
}

$conn->close();
?>

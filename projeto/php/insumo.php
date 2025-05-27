<?php
include 'conectar_bd.php';

$conn = conectar();

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

        $sql = "
            SELECT i.id_insumo, i.nome, i.classificacao, i.qntMinima, i.inspReceb, i.localizacao, 
            COALESCE(SUM(il.quantidade), 0) AS quantidadeTotal
            FROM insumo i
            LEFT JOIN insumoLote il ON i.id_insumo = il.id_insumo
            WHERE i.id_insumo LIKE '%$filtro%' OR i.nome LIKE '%$filtro%' OR i.classificacao LIKE '%$filtro%'
            GROUP BY i.id_insumo
        ";

        $resultado = $conn->query($sql);

        $dados = [];
        while ($linha = $resultado->fetch_assoc()) {
            $dados[] = $linha;
        }

        echo json_encode($dados);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true);

        $id = isset($dados['id']) ? $dados['id'] : null;
        $nome = $dados['nome'];
        $classificacao = $dados['classificacao'];
        $qntMinima = $dados['qntMinima'];
        $inspReceb = $dados['inspReceb'];
        $localizacao = $dados['localizacao'];
        $quantidadeTotal = $dados['quantidadeTotal'];

        if ($id) {
            // UPDATE
            $sql = "UPDATE insumo SET 
                nome = '$nome',
                classificacao = '$classificacao',
                qntMinima = $qntMinima,
                inspReceb = '$inspReceb',
                localizacao = '$localizacao',
                WHERE id_insumo = $id
            ";
        } else {
            // INSERT
            $sql = "INSERT INTO insumo (nome, classificacao, qntMinima, inspReceb, localizacao) VALUES (
                '$nome',
                '$classificacao',
                $qntMinima,
                '$inspReceb',
                '$localizacao'
            )";
        }

        $resultado = $conn->query($sql);

        if ($resultado) {
            echo json_encode(["status" => "sucesso"]);
        } else {
            throw new Exception("Erro ao salvar: " . $conn->error);
        }

    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'];

        $sql = "DELETE FROM insumo WHERE id_insumo = $id";

        $resultado = $conn->query($sql);

        if ($resultado) {
            echo json_encode(["status" => "deletado"]);
        } else {
            throw new Exception("Erro ao deletar: " . $conn->error);
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["erro" => $e->getMessage()]);
}

$conn->close();
?>
<?php
include 'conectar_bd.php';

$conn = conectar();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';
    $query = "
        SELECT p.id_produto, p.nome, p.categoria, p.qntMinima, p.valor, p.localizacao, p.imagem,
        COALESCE(SUM(pl.quantidade), 0) AS quantidadeTotal
        FROM produto p
        LEFT JOIN produtoLote pl ON p.id_produto = pl.id_produto
        WHERE (
            p.id_produto LIKE ? OR 
            p.nome LIKE ? OR 
            p.categoria LIKE ?
        )
        GROUP BY p.id_produto
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
    
    $nomeImagem = null;
    if (isset($dados['imagem']) && !empty($dados['imagem'])) {
        $imgInfo = explode(',', $dados['imagem']);
        if (count($imgInfo) === 2) {
            $imgBase64 = base64_decode($imgInfo[1]);
            $nomeImagem = uniqid('img_') . '.png';
            file_put_contents('../img/' . $nomeImagem, $imgBase64);
        }
    }

    if (isset($dados['id'])) {
        if ($nomeImagem) {
            $stmt = $conn->prepare("UPDATE produto SET nome=?, categoria=?, qntMinima=?, valor=?, localizacao=?, quantidadeTotal=?, imagem=? WHERE id_produto=?");
            $stmt->bind_param(
                "ssiisisi",
                $dados['nome'],
                $dados['categoria'],
                $dados['qntMinima'],
                $dados['valor'],
                $dados['localizacao'],
                $dados['quantidadeTotal'],
                $nomeImagem,
                $dados['id']
            );
        } else {
            $stmt = $conn->prepare("UPDATE produto SET nome=?, categoria=?, qntMinima=?, valor=?, localizacao=?, quantidadeTotal=? WHERE id_produto=?");
            $stmt->bind_param(
                "ssiisii",
                $dados['nome'],
                $dados['categoria'],
                $dados['qntMinima'],
                $dados['valor'],
                $dados['localizacao'],
                $dados['quantidadeTotal'],
                $dados['id']
            );
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO produto (nome, categoria, qntMinima, valor, localizacao, quantidadeTotal, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssiisss",
            $dados['nome'],
            $dados['categoria'],
            $dados['qntMinima'],
            $dados['valor'],
            $dados['localizacao'],
            $dados['quantidadeTotal'],
            $nomeImagem
        );
    }

    if ($stmt->execute()) {
        header('Content-Type: application/json');
        $id_produto = isset($dados['id']) ? $dados['id'] : $conn->insert_id;
        echo json_encode(["status" => "sucesso", "id_produto" => $id_produto]);
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

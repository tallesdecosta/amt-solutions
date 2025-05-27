<?php
include 'conectar_bd.php';

$conn = conectar();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

        $query = "
            SELECT p.id_produto, p.nome, p.categoria, p.qntMinima, p.valor, p.localizacao, p.imagem,
            COALESCE(SUM(pl.quantidade), 0) AS quantidadeTotal
            FROM produto p
            LEFT JOIN produtoLote pl ON p.id_produto = pl.id_produto
            WHERE (
                p.id_produto LIKE '%$filtro%' OR 
                p.nome LIKE '%$filtro%' OR 
                p.categoria LIKE '%$filtro%'
            )
            GROUP BY p.id_produto
        ";

        $resultado = $conn->query($query);
        if (!$resultado) throw new Exception("Erro no SELECT: " . $conn->error);

        $dados = [];
        while ($linha = $resultado->fetch_assoc()) {
            $dados[] = $linha;
        }

        header('Content-Type: application/json');
        echo json_encode($dados);
    }

    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true);

        // tratar imagem base64
        $nomeImagem = null;
        if (isset($dados['imagem']) && !empty($dados['imagem'])) {
            $imgInfo = explode(',', $dados['imagem']);
            if (count($imgInfo) === 2) {
                $imgBase64 = base64_decode($imgInfo[1]);
                $nomeImagem = uniqid('img_') . '.png';
                file_put_contents('../img/' . $nomeImagem, $imgBase64);
            }
        }

        $nome = $dados['nome'] ?? '';
        $categoria = $dados['categoria'] ?? '';
        $qntMinima = (int)($dados['qntMinima'] ?? 0);
        $valor = (float)($dados['valor'] ?? 0);
        $localizacao = $dados['localizacao'] ?? '';
        $quantidadeTotal = (int)($dados['quantidadeTotal'] ?? 0);

        if (isset($dados['id'])) {
            $id = (int)$dados['id'];

            if ($nomeImagem) {
                $query = "
                    UPDATE produto SET
                    nome='$nome', categoria='$categoria', qntMinima=$qntMinima,
                    valor=$valor, localizacao='$localizacao', quantidadeTotal=$quantidadeTotal,
                    imagem='$nomeImagem'
                    WHERE id_produto=$id
                ";
            } else {
                $query = "
                    UPDATE produto SET
                    nome='$nome', categoria='$categoria', qntMinima=$qntMinima,
                    valor=$valor, localizacao='$localizacao', quantidadeTotal=$quantidadeTotal
                    WHERE id_produto=$id
                ";
            }
            $resultado = $conn->query($query);
            if (!$resultado) throw new Exception("Erro no UPDATE: " . $conn->error);

            $id_produto = $id;
        } else {
            $img = $nomeImagem ? "'$nomeImagem'" : "NULL";

            $query = "
                INSERT INTO produto (nome, categoria, qntMinima, valor, localizacao, quantidadeTotal, imagem)
                VALUES ('$nome', '$categoria', $qntMinima, $valor, '$localizacao', $quantidadeTotal, $img)
            ";
            $resultado = $conn->query($query);
            if (!$resultado) throw new Exception("Erro no INSERT: " . $conn->error);

            $id_produto = $conn->insert_id;
        }

        header('Content-Type: application/json');
        echo json_encode(["status" => "sucesso", "id_produto" => $id_produto]);
    }

    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = isset($params['id']) ? (int)$params['id'] : 0;

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["erro" => "ID inválido"]);
            exit;
        }

        $query = "DELETE FROM produto WHERE id_produto=$id";
        $resultado = $conn->query($query);

        if ($resultado) {
            echo json_encode(["status" => "deletado"]);
        } else {
            http_response_code(500);
            echo json_encode(["erro" => "Erro ao deletar"]);
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(["erro" => $e->getMessage()]);
}

$conn->close();
?>

<?php
include 'conectar_bd.php';

header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] == "POST"){

    $_POST = json_decode(file_get_contents("php://input"), true);
    
    $acao = isset($_POST['id']) ? 'atualizar' : 'inserir';

    switch ($acao) {
        case 'atualizar':
            echo json_encode(atualizar($_POST));
            break;
        case 'inserir':
            echo json_encode(inserir($_POST));
            break;
    }

}elseif($_SERVER["REQUEST_METHOD"] === "GET"){
    echo json_encode(retornarFuncs());
}elseif($_SERVER["REQUEST_METHOD"] === "DELETE"){
    echo json_encode(deletar());
}

function atualizar($data) {
    $conn = conectar();

    $nomeImagem = null;
    if (isset($data['imagem']) && !empty($data['imagem'])) {
        $imgInfo = explode(',', $data['imagem']);
        if (count($imgInfo) === 2) {
            $imgBase64 = base64_decode($imgInfo[1]);
            $nomeImagem = uniqid('img_') . '.png';
            file_put_contents('../img/' . $nomeImagem, $imgBase64);
        }
    }

    $nome = $data['nome'] ?? '';
    $categoria = $data['categoria'] ?? '';
    $qntMinima = (int)($data['qntMinima'] ?? 0);
    $valor = (float)($data['valor'] ?? 0);
    $localizacao = $data['localizacao'] ?? '';
    $id = (int)$data['id'];

    if ($nomeImagem) {
        $query = "
            UPDATE produto SET
                nome='$nome', categoria='$categoria', qntMinima=$qntMinima,
                valor=$valor, localizacao='$localizacao',
                imagem='$nomeImagem'
            WHERE id_produto=$id
        ";
    } else {
        $query = "
            UPDATE produto SET
                nome='$nome', categoria='$categoria', qntMinima=$qntMinima,
                valor=$valor, localizacao='$localizacao'
            WHERE id_produto=$id
        ";
    }

    $resultado = $conn->query($query);
    if (!$resultado) throw new Exception("Erro no UPDATE: " . $conn->error);
    return ["status" => "sucesso", "id_produto" => $id];
}

function inserir($data) {
    $conn = conectar();

    $nomeImagem = null;
    if (isset($data['imagem']) && !empty($data['imagem'])) {
        $imgInfo = explode(',', $data['imagem']);
        if (count($imgInfo) === 2) {
            $imgBase64 = base64_decode($imgInfo[1]);
            $nomeImagem = uniqid('img_') . '.png';
            file_put_contents('../img/' . $nomeImagem, $imgBase64);
        }
    }

    $nome = $data['nome'] ?? '';
    $categoria = $data['categoria'] ?? '';
    $qntMinima = (int)($data['qntMinima'] ?? 0);
    $valor = (float)($data['valor'] ?? 0);
    $localizacao = $data['localizacao'] ?? '';

    $img = $nomeImagem ? "'$nomeImagem'" : "NULL";
    $query = "
        INSERT INTO produto (nome, categoria, qntMinima, valor, localizacao, imagem)
        VALUES ('$nome', '$categoria', $qntMinima, $valor, '$localizacao', $img)
    ";

    $resultado = $conn->query($query);
    if (!$resultado) throw new Exception("Erro no INSERT: " . $conn->error);
    $id_produto = $conn->insert_id;

    return ["status" => "sucesso", "id_produto" => $id_produto];
}


function retornarFuncs(){
    try{

        $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

        $conn = conectar();

        $sql = "
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

        $resultado = $conn->query($sql);
        if (!$resultado) throw new Exception("Erro no SELECT: " . $conn->error);

        $dados = [];
        while ($linha = $resultado->fetch_assoc()) {
            $dados[] = $linha;
        }

        return $dados;
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }  
}

function deletar() {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = isset($params['id']) ? (int)$params['id'] : 0;

    if ($id <= 0) {
        http_response_code(400);
        return ["erro" => "ID inválido"];
    }

    $conn = conectar();

    // Verifica se existe lote vinculado ao produto
    $verificaLotes = $conn->query("SELECT COUNT(*) as total FROM produtoLote WHERE id_produto = $id");
    if (!$verificaLotes) {
        http_response_code(500);
        return ["erro" => "Erro ao verificar lotes: " . $conn->error];
    }

    $totalLotes = $verificaLotes->fetch_assoc()['total'];

    if ($totalLotes > 0) {
        http_response_code(409); 
        return ["erro" => "Não é possível deletar o produto. Existem lotes cadastrados para este produto."];
    }

    // Se não tiver lote deletar
    $query = "DELETE FROM produto WHERE id_produto=$id";
    $resultado = $conn->query($query);

    if ($resultado) {
        return ["status" => "deletado"];
    } else {
        http_response_code(500);
        return ["erro" => "Erro ao deletar: " . $conn->error];
    }
}
?>

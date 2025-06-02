<?php
include 'conectar_bd.php';
header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] == "POST"){

    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!is_array($data)) {
        throw new Exception("JSON inválido");
    }
    if (!empty($data['id_Lote'])) {
        echo json_encode(atualizar($data));
    } else {
        echo json_encode(inserir($data));
    }

}elseif($_SERVER["REQUEST_METHOD"] === "GET"){
    echo json_encode(retornarFuncs());

}elseif($_SERVER["REQUEST_METHOD"] === "PUT"){
    $data = json_decode(file_get_contents("php://input"), true);
    if (!is_array($data)) {
        throw new Exception("JSON inválido");
    }
    echo json_encode(atualizar($data));

}elseif($_SERVER["REQUEST_METHOD"] === "DELETE"){
    echo json_encode(deletar());
}

function inserir($data) {
    try {
        $conn = conectar();

        $id_produto = (int)($data['id_produto'] ?? 0);
        $lote = $conn->real_escape_string($data['lote'] ?? '');
        $vencimento = $conn->real_escape_string($data['vencimento'] ?? '');
        $fornecedor = $conn->real_escape_string($data['fornecedor'] ?? '');
        $quantidade = (int)($data['quantidade'] ?? 0);

        $sql = "INSERT INTO produtoLote (id_produto, lote, vencimento, fornecedor, quantidade)
                VALUES ($id_produto, '$lote', '$vencimento', '$fornecedor', $quantidade)";

        if (!$conn->query($sql)) {
            throw new Exception($conn->error);
        }

        return ["status" => "sucesso", "id_Lote" => $conn->insert_id];
    } catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function atualizar($data) {
    try {
        if (empty($data['id_Lote'])) {
            throw new Exception("ID do lote não informado");
        }

        $conn = conectar();

        $id_Lote = (int)$data['id_Lote'];
        $id_produto = (int)($data['id_produto'] ?? 0);
        $lote = $conn->real_escape_string($data['lote'] ?? '');
        $vencimento = $conn->real_escape_string($data['vencimento'] ?? '');
        $fornecedor = $conn->real_escape_string($data['fornecedor'] ?? '');
        $quantidade = (int)($data['quantidade'] ?? 0);

        $sql = "UPDATE produtoLote SET
                    id_produto = $id_produto,
                    lote = '$lote',
                    vencimento = '$vencimento',
                    fornecedor = '$fornecedor',
                    quantidade = $quantidade
                WHERE id_Lote = $id_Lote";

        if (!$conn->query($sql)) {
            throw new Exception($conn->error);
        }

        return ["status" => "sucesso"];
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function retornarFuncs() {
    try {
        $conn = conectar();
        $filtro = $conn->real_escape_string($_GET['filtro'] ?? '');

        $sql = "SELECT pl.id_Lote, pl.id_produto, p.nome AS nome_produto, pl.lote, pl.vencimento, pl.fornecedor, pl.quantidade
                FROM produtoLote pl
                JOIN produto p ON pl.id_produto = p.id_produto";

        // Aplica o filtro
        if ($filtro !== null && $filtro !== '') {
            $filtro = $conn->real_escape_string($filtro);
            $sql .= "
                WHERE (
                    p.id_produto = '$filtro' OR
                    p.nome LIKE '%$filtro%' OR
                    pl.lote LIKE '%$filtro%' OR
                    pl.vencimento LIKE '%$filtro%'
                )
            ";
        }

        $sql .= " ORDER BY pl.vencimento ASC";

        $resultado = $conn->query($sql);
        if (!$resultado) {
            throw new Exception($conn->error);
        }

        $dados = [];
        while ($row = $resultado->fetch_assoc()) {
            $dados[] = $row;
        }

        return $dados;
    } catch(Exception $e) {
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();
        return ["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro];
    }
}


function deletar() {
    try {
        parse_str($_SERVER['QUERY_STRING'], $params);

        if (empty($params['id'])) {
            throw new Exception("ID do lote não informado");
        }

        $id = (int)$params['id'];
        $conn = conectar();

        // Verifica se há vínculos com insumos
        $sql = "SELECT COUNT(*) AS total FROM produtoLoteInsumo WHERE id_produtoLote = $id";
        $resultado = $conn->query($sql);

        if (!$resultado) {
            throw new Exception("Erro ao verificar vínculos: " . $conn->error);
        }

        $dados = $resultado->fetch_assoc();

        if ($dados['total'] > 0) {
            return [
                "status" => "erro",
                "mensagem" => "Não foi possível deletar pois o lote possui vínculo a insumo."
            ];
        }

        // Exclui o lote
        $sql = "DELETE FROM produtoLote WHERE id_Lote = $id";
        if (!$conn->query($sql)) {
            throw new Exception("Erro ao deletar lote: " . $conn->error);
        }

        return ["status" => "sucesso"];

    } catch (Exception $e) {
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();
        return [
            "status" => "erro",
            "mensagem" => "Servidor em manutenção, por favor tente novamente mais tarde.",
            "erro" => $erro
        ];
    }
}



?>

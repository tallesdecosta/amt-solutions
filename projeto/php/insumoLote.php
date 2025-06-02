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

function atualizar($data){
    try{
        $id = (int)$data['id'];
        $id_insumo = (int)$data['id_insumo'];
        $lote = $data['lote'];
        $vencimento = $data['vencimento'];
        $fornecedor = $data['fornecedor'];
        $quantidade = (int)$data['quantidade'];

        $conn = conectar();

        $sql = "UPDATE insumoLote SET 
            id_insumo = $id_insumo, 
            lote = '$lote', 
            vencimento = '$vencimento', 
            fornecedor = '$fornecedor', 
            quantidade = $quantidade
            WHERE id_Lote = $id
        ";

        $resultado = $conn->query($sql);
        
        if(!$resultado){
            throw new Exception();
        }else{
            return ["response" => "Atualizado com sucesso"];
        }
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();
    
        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function inserir($data){
    try{
        $id_insumo = (int)$data['id_insumo'];
        $lote = $data['lote'];
        $vencimento = $data['vencimento'];
        $fornecedor = $data['fornecedor'];
        $quantidade = (int)$data['quantidade'];
        
        $conn = conectar();

        $sql = "INSERT INTO insumoLote (id_insumo, lote, vencimento, fornecedor, quantidade) VALUES (
            $id_insumo,
            '$lote',
            '$vencimento',
            '$fornecedor',
            $quantidade
        )";

        $resultado = $conn->query($sql);
        
        if(!$resultado){
            throw new Exception();
        }else{
            return ["response" => "Atualizado com sucesso"];
        }
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();
    
        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function retornarFuncs(){
    try{
        $filtro = $_GET['filtro'] ?? '';
        $conn = conectar();

        $sql = "
            SELECT il.id_Lote, il.id_insumo, i.nome AS nome_insumo, il.lote, il.vencimento, il.fornecedor, il.quantidade
            FROM insumoLote il
            JOIN insumo i ON il.id_insumo = i.id_insumo
        ";

        if ($filtro !== null && $filtro !== '') {
            $filtro = $conn->real_escape_string($filtro);
            $sql .= "
                WHERE (
                    il.id_insumo = '$filtro' OR 
                    i.nome LIKE '%$filtro%' OR 
                    il.vencimento LIKE '%$filtro%' OR 
                    il.lote LIKE '%$filtro%' OR 
                    i.classificacao LIKE '%$filtro%'
                )
            ";
        }

        $sql .= " ORDER BY il.vencimento ASC";

        $resultado = $conn->query($sql);

        $dados = [];

        while ($row = $resultado->fetch_assoc()) {
            $dados[] = $row;
        }

        return $dados;

    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();
        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function deletar(){
    try{
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = (int)($params['id'] ?? 0);

        $conn = conectar();

        // Verifica se há vínculos com produto
        $sql = "SELECT COUNT(*) AS total FROM produtoLoteInsumo WHERE id_insumoLote = $id";
        $resultado = $conn->query($sql);

        if (!$resultado) {
            throw new Exception("Erro ao verificar vínculos: " . $conn->error);
        }

        $dados = $resultado->fetch_assoc();

        if ($dados['total'] > 0) {
            return [
                "status" => "erro",
                "mensagem" => "Não foi possível deletar pois o lote possui vínculo a produto."
            ];
        }

        $sql = "DELETE FROM insumoLote WHERE id_Lote = $id";
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

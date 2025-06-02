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
        $id = $data['id'];
        $nome = $data['nome'];
        $classificacao = $data['classificacao'];
        $qntMinima = $data['qntMinima'];
        $inspReceb = $data['inspReceb'];
        $localizacao = $data['localizacao'];

        $conn = conectar();

        $sql = "UPDATE insumo SET
            nome = '$nome',
            classificacao = '$classificacao',
            qntMinima = '$qntMinima',
            inspReceb = '$inspReceb',
            localizacao = '$localizacao'
            WHERE id_insumo = $id
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
        $nome = $data['nome'];
        $classificacao = $data['classificacao'];
        $qntMinima = $data['qntMinima'];
        $inspReceb = $data['inspReceb'];
        $localizacao = $data['localizacao'];

        $conn = conectar();

        $sql = "INSERT INTO insumo (nome, classificacao, qntMinima, inspReceb, localizacao) VALUES (
            '$nome',
            '$classificacao',
            $qntMinima,
            '$inspReceb',
            '$localizacao'
        )";

        $resultado = $conn->query($sql);
        
        if(!$resultado){
            throw new Exception();
        }else{
            return ["response" => "Inserido com sucesso"];
        }
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function retornarFuncs(){
    try{
        $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

        $conn = conectar();

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
        return $dados;
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
    
}

function deletar(){
    try{
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'];

        $conn = conectar();

        // Verifica se existe lote vinculado ao insumo
        $verificaLotes = $conn->query("SELECT COUNT(*) as total FROM insumoLote WHERE id_insumo = $id");
        if (!$verificaLotes) {
            http_response_code(500);
            return ["erro" => "Erro ao verificar lotes: " . $conn->error];
        }

        $totalLotes = $verificaLotes->fetch_assoc()['total'];

        if ($totalLotes > 0) {
            http_response_code(409);
            return ["erro" => "Não é possível deletar o insumo. Existem lotes cadastrados para este insumo."];
        }

        $sql = "DELETE FROM insumo WHERE id_insumo = $id";

        $resultado = $conn->query($sql);

        if ($resultado) {
            return ["status" => "deletado"];
        } else {
            http_response_code(500);
            return ["erro" => "Erro ao deletar: " . $conn->error];
        }
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

?>
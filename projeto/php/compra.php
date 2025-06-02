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

function atualizar(){
    try{
        $id = $data['id'];
        $id_insumo = $data['id_insumo'];
        $id_usuario = $data['id_usuario'];
        $dataEmissao = $data['dataEmissao'];
        $pedido_status = $data['pedido_status'];
        $qntComprar = $data['qntComprar'];
        $observacao = $data['observacao'];

        $conn = conectar();

        $sql = "UPDATE pedidocompra SET 
            id_insumo='$id_insumo', 
            id_usuario='$id_usuario', 
            dataEmissao='$dataEmissao', 
            pedido_status='$pedido_status', 
            qntComprar='$qntComprar', 
            observacao='$observacao' 
            WHERE id_pedido=$id
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
        $id_insumo = $data['id_insumo'];
        $id_usuario = $data['id_usuario'];
        $dataEmissao = $data['dataEmissao'];
        $pedido_status = $data['pedido_status'];
        $qntComprar = $data['qntComprar'];
        $observacao = $data['observacao'];

        $conn = conectar();

        $sql = "INSERT INTO pedidocompra (id_insumo, id_usuario, dataEmissao, pedido_status, qntComprar, observacao) VALUES (
            '$id_insumo', 
            '$id_usuario', 
            '$dataEmissao', 
            '$pedido_status', 
            '$qntComprar', 
            '$observacao'
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
        $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

        $conn = conectar();

        $query = "
            SELECT pedidocompra.*, insumo.nome AS nome_insumo, usuario.nome AS nome_usuario 
            FROM pedidocompra
            LEFT JOIN insumo ON pedidocompra.id_insumo = insumo.id_insumo
            LEFT JOIN usuario ON pedidocompra.id_usuario = usuario.id_usuario
            WHERE 1=1
        ";

        if ($filtro != '') {
            $query .= " AND (
                pedidocompra.id_pedido LIKE '%$filtro%' OR 
                insumo.nome LIKE '%$filtro%' OR 
                usuario.nome LIKE '%$filtro%' OR 
                pedidocompra.pedido_status LIKE '%$filtro%'
            )";
        }
        
        $query .= " ORDER BY pedidocompra.id_pedido DESC";

        $resultado = $conn->query($query);
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

        $sql = "DELETE FROM pedidocompra WHERE id_pedido = $id";

        $resultado = $conn->query($sql);

        if(!$resultado){
            throw new Exception();
        }
    }catch(Exception $e){
        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

?>
<?php

include 'conectar_bd.php';

$conn = conectar();

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $filtro = $_GET['id_insumo'] ?? null;

    $sql = "SELECT il.id_Lote, il.id_insumo, i.nome AS nome_insumo, il.lote, il.vencimento, il.fornecedor, il.quantidade
            FROM insumoLote il
            JOIN insumo i ON il.id_insumo = i.id_insumo";

    if($filtro){
        $sql .= " WHERE il.id_insumo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $filtro);
        $stmt->execute();
        $resultado = $stmt->get_result();
    }else{
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->get_result();
    }

    $dados = [];

    while($row = $resultado->fetch_assoc()){
        $dados[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($dados);

    $stmt->close();

}

elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dados = json_decode(file_get_contents('php://input'), true);

    if(isset($dados['id'])){
        $stmt = $conn->prepare("UPDATE insumoLote SET id_insumo=?, lote=?, vencimento=?, fornecedor=?, quantidade=? WHERE id_Lote=?");
        $stmt->bind_param(
            "isssii",
            $dados['id_insumo'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['fornecedor'],
            $dados['quantidade'],
            $dados['id']
        );
    }else{
        $stmt = $conn->prepare("INSERT INTO insumoLote (id_insumo, lote, vencimento, fornecedor, quantidade) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "isssi",
            $dados['id_insumo'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['fornecedor'],
            $dados['quantidade']
        );
    }

    if($stmt->execute()){
        header('Content-Type: application/json');
        echo json_encode(["Status" => "Sucesso"]);
    }else{
        http_response_code(500);
        header('Content-Type application/json');
        echo json_encode(["erro" => "Erro ao salvar ou atualizar o Lote"]);
    }
    $stmt->close();
}

elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'];

    $stmt = $conn->prepare("DELETE FROM insumoLote WHERE id_Lote=?");
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

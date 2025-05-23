<?php

include 'conectar_bd.php';

$conn = conectar();

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $filtro = $_GET['id_produto'] ?? null;

    $sql = "SELECT pl.id_Lote, pl.id_produto, p.nome AS nome_produto, pl.lote, pl.vencimento, pl.fornecedor, pl.quantidade
            FROM produtoLote pl
            JOIN produto p ON pl.id_produto = p.id_produto";

    if($filtro){
        $sql .= " WHERE pl.id_produto = ?";
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
        $stmt = $conn->prepare("UPDATE produtoLote SET id_produto=?, lote=?, vencimento=?, fornecedor=?, quantidade=? WHERE id_Lote=?");
        $stmt->bind_param(
            "isssii",
            $dados['id_produto'],
            $dados['lote'],
            $dados['vencimento'],
            $dados['fornecedor'],
            $dados['quantidade'],
            $dados['id']
        );
    }else{
        $stmt = $conn->prepare("INSERT INTO produtoLote (id_produto, lote, vencimento, fornecedor, quantidade) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "isssi",
            $dados['id_produto'],
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

    $stmt = $conn->prepare("DELETE FROM produtoLote WHERE id_Lote=?");
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

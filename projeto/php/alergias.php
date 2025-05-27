<?php
include 'conectar_bd.php';
$conn = conectar();

if($_SERVER["REQUEST_METHOD"] === 'GET'){
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

    $query = "SELECT * FROM alergia";
    if($filtro){
        $query .= " WHERE id_alergia LIKE '%$filtro%' OR nome LIKE '%$filtro%'";
    }

    $resultado = $conn->query($query);

    $dados = [];

    while($linha = $resultado->fetch_assoc()){
        $dados[] = $linha;
    }

    header('content-Type: application/json');
    echo json_encode($dados);
}

elseif($_SERVER['REQUEST_METHOD'] === 'POST'){
    header('Content-Type: application/json');

    $dados = json_decode(file_get_contents('php://input'), true);
    $nome = $dados['nome'];
    $observacao = $dados['observacao'];
    

    if(isset($dados['id_alergia'])){
        $id_alergia = $dados['id_alergia'];
        $query = "UPDATE alergia SET nome='$nome', observacao='$observacao' WHERE id_alergia=$id_alergia";
    }else{
        $query = "INSERT INTO alergia (nome, observacao) VALUES ('$nome', '$observacao')";
    }

    $resultado = $conn->query($query);

    if($resultado){
        echo json_encode(["Status" => "Sucesso"]);
    }else{
        echo json_encode(["Status" => "erro"]);
    }
}

elseif($_SERVER['REQUEST_METHOD'] === 'DELETE'){
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = $params['id'];
    
    $query = "DELETE FROM alergia WHERE id_alergia = '$id'";
    $resultado = $conn->query($query);

    if($resultado){
        echo json_encode(["Status" => "apagado"]);
    }else{
        echo json_encode(["Status" => "erro"]);
    }
}

$conn->close();
?>

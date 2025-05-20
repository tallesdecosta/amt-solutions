<?php
include 'conectar_bd.php';
$conn = conectar();

$sql = "SELECT id_usuario, nome FROM usuario"; // Ajuste o nome da tabela/coluna conforme seu banco
$resultado = $conn->query($sql);

$dados = [];
while ($linha = $resultado->fetch_assoc()) {
    $dados[] = $linha;
}

header('Content-Type: application/json');
echo json_encode($dados);

$conn->close();
?>

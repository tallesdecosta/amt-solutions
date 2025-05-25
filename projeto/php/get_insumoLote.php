<?php
include 'conectar_bd.php';
$conn = conectar();

if (isset($_GET['id_insumo'])) {
    $id_insumo = intval($_GET['id_insumo']);

    $sql = "SELECT id_Lote, lote, quantidade FROM insumoLote WHERE id_insumo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_insumo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $dados = [];
    while ($linha = $resultado->fetch_assoc()) {
        $dados[] = $linha;
    }

    header('Content-Type: application/json');
    echo json_encode($dados);
} else {
    echo json_encode([]);
}

$conn->close();
?>

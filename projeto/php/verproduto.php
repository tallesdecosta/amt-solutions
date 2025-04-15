<?php
    include 'conectar_bd.php';

    $conn = conectar();
    $query = "SELECT * FROM produto";
    $resultado = $conn -> query($query);

    if ($resultado) {

        $retorno = [];

        while ($linha = $resultado -> fetch_assoc()) {

            $retorno[] = $linha;

        }

        echo json_encode($retorno);
    }

?>
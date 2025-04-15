<?php
include 'conectar_bd.php';

$_POST = json_decode(file_get_contents('php://input'), true);

if (isset($_POST["numcmd"])) {

    $ncmd = intval($_POST["numcmd"]);
    $ncliente = $_POST["ncliente"];
    $dataemiss = $_POST["dataemiss"];
    $formpag = $_POST["formpag"];
    $sts = "A";

    $conn = conectar();
    $query = "INSERT INTO venda(numComanda,nomeCliente,data_emissao,formaPagamento,statuscmd) VALUES ('$ncmd','$ncliente',now(),'$formpag','$sts')";
    $resultado = $conn->query($query);

    if ($resultado) {
        echo json_encode(["Resultado" => "venda salva"]);
    } else {
        echo json_encode(["Resultado" => "Deu erro aqui"]);
    }


    for ($x = 0; $x < count($_POST); $x++) {

        if (isset($_POST["valor" . $x])) {

            $queryid = "SELECT id FROM venda ORDER BY id DESC LIMIT 1";
            $resultadoid = $conn->query($queryid);

            if ($resultadoid) {
                while ($linha = $resultadoid->fetch_assoc()) {

                    $idprod = intval($_POST["valor" . $x]);

                    $idvenda = intval($linha["id"]);

                    $qnt = intval($_POST["qnt" . $x]);

                    $query1 = "INSERT INTO venda_produto(id_produto,id_venda,qntd) VALUES ('$idprod','$idvenda','$qnt')";

                    $resultado1 = $conn->query($query1);

                    if ($idvenda) {
                        echo json_encode(["Resultado" => "Deu boa no venda_prod"]);
                    } else {
                        echo json_encode(["Resultado" => "deu ruim no venda_prod"]);
                    }
                }
            }
        }
    }
} else if (isset($_GET)) {

    $conn = conectar();
    $query = "SELECT * FROM venda WHERE statuscmd = 'A'";
    $resultado = $conn->query($query);

    if ($resultado) {

        $retorno = [];

        while ($linha = $resultado->fetch_assoc()) {

            $retorno[] = $linha;
            
            echo json_encode($retorno);
        }

    }
}

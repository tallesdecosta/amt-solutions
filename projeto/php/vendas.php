<?php
include 'conectar_bd.php';

$_POST = json_decode(file_get_contents('php://input'), true);


if (isset($_POST)) {

    if (isset($_POST["finalizar"])) {

        $numCmd = $_POST["finalizar"];

        $conn = conectar();
        $query = "SELECT id FROM venda WHERE numComanda = '$numCmd' AND statuscmd = 'A'";
        $resultado = $conn->query($query);

        if ($resultado) {
            while ($linha = $resultado->fetch_assoc()) {

                $idvenda = intval($linha["id"]);

                $conn = conectar();
                $query1 = "UPDATE venda SET statuscmd = 'F' WHERE id = '$idvenda'";
                $resultado1 = $conn->query($query1);

                if ($resultado1) {
                    echo json_encode(["response" => 200]);
                } else {
                    echo json_encode(["response" => 0]);
                }
            }
        }
    } else if ($_POST["filtro"] == "uma comanda") {

        $id = $_POST["id"];

        if (is_numeric($id)) {

            $conn = conectar();
            $queryA = "SELECT * FROM venda WHERE numComanda = '$id' AND statuscmd = 'A'";
            $resultadoA = $conn->query($queryA);

            if ($resultadoA) {
                if ($resultadoA->num_rows == 0) {
                    echo json_encode(["response" => "none"]);

                } else {

                    $retorno = [];

                    while ($linha = $resultadoA->fetch_assoc()) {

                        $retorno[] = $linha;
                    }

                    echo json_encode($retorno);
                }
            }
        }else if(is_string($id)){

            $conn = conectar();
            $queryA = "SELECT * FROM venda WHERE nomeCliente = '$id' AND statuscmd = 'A'";
            $resultadoA = $conn->query($queryA);

            if ($resultadoA) {
                if ($resultadoA->num_rows == 0) {
                    echo json_encode(["response" => "none"]);

                } else {

                    $retorno = [];

                    

                    while ($linha = $resultadoA->fetch_assoc()) {

                        $retorno[] = $linha;
                    }

                    echo json_encode($retorno);
                }
            }

        }





    } else if ($_POST["op"] == "insert" && $_POST["filtro"] == "" && $_POST["tabela"] == "venda" && $_POST["id"] == "") {

        $ncmd = intval($_POST["numcmd"]);
        $ncliente = $_POST["ncliente"];
        $dataemiss = $_POST["dataemiss"];
        $formpag = $_POST["formpag"];

        $conn = conectar();
        $queryA = "SELECT * FROM venda WHERE numComanda = '$ncmd' AND statuscmd = 'A'";
        $resultadoA = $conn->query($queryA);

        if ($resultadoA->num_rows == 0) {


            if ($formpag == 0) {
                $formpag = "";
            } else if ($formpag == 1) {
                $formpag = "Débito";
            } else if ($formpag == 2) {
                $formpag = "Crédito";
            } else if ($formpag == 3) {
                $formpag = "Dinheiro";
            } else if ($formpag == 4) {
                $formpag = "Pix";
            }

            $sts = "A";

            $conn = conectar();
            $query = "INSERT INTO venda(numComanda,nomeCliente,data_emissao,formaPagamento,statuscmd) VALUES ('$ncmd','$ncliente',now(),'$formpag','$sts')";
            $resultado = $conn->query($query);

            if ($resultado) {
            } else {
                echo json_encode(["resposta" => "Deu erro aqui"]);
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

                            if ($resultado1) {
                            } else {
                                echo json_encode(["resposta" => "deu ruim no venda_prod"]);
                            }
                        }
                    }
                }
            }

            echo json_encode(["resposta" => 200]);
        } else if ($resultadoA->num_rows != 0) {

            if ($formpag == 0) {
                $formpag = "";
            } else if ($formpag == 1) {
                $formpag = "Débito";
            } else if ($formpag == 2) {
                $formpag = "Crédito";
            } else if ($formpag == 3) {
                $formpag = "Dinheiro";
            } else if ($formpag == 4) {
                $formpag = "Pix";
            }

            while ($linha = $resultadoA->fetch_assoc()) {

                $idvenda = $linha["id"];
            }

            $conn = conectar();
            $query = "UPDATE venda SET numComanda = '$ncmd', nomeCliente = '$ncliente', formaPagamento = '$formpag' WHERE id = '$idvenda'";
            $resultado = $conn->query($query);

            if ($resultado) {

                $conn = conectar();
                $query = "DELETE FROM venda_produto WHERE id_venda = '$idvenda';";
                $resultado = $conn->query($query);

                if ($resultado) {

                    for ($x = 0; $x < count($_POST); $x++) {

                        if (isset($_POST["valor" . $x])) {

                            $idprod = intval($_POST["valor" . $x]);

                            $qnt = intval($_POST["qnt" . $x]);

                            $query1 = "INSERT INTO venda_produto(id_produto,id_venda,qntd) VALUES ('$idprod','$idvenda','$qnt')";

                            $resultado1 = $conn->query($query1);

                            if ($resultado1) {
                                echo json_encode(["Resultado" => "Deu boa no venda_prod update"]);
                            } else {
                                echo json_encode(["Resultado" => "deu ruim no venda_prod update"]);
                            }
                        }
                    }
                }
            }
        }
    } else if ($_POST["op"] == "select" && isset($_POST["filtro"]) && isset($_POST["tabela"]) && isset($_POST["id"])) {

        if ($_POST["tabela"] == "venda" && $_POST["filtro"] == "all" && $_POST["id"] == "") {

            $conn = conectar();
            $query = "SELECT * FROM venda WHERE statuscmd = 'A'";
            $resultado = $conn->query($query);

            if ($resultado) {

                $retorno = [];

                while ($linha = $resultado->fetch_assoc()) {

                    $retorno[] = $linha;
                }

                echo json_encode($retorno);
            }
        } else if ($_POST["filtro"] == "one") {

            if ($_POST["tabela"] == "venda") {

                $id = $_POST["id"];

                $conn = conectar();
                $query = "SELECT * FROM venda WHERE id = '$id' AND statuscmd = 'A'";
                $resultado = $conn->query($query);

                if ($resultado) {

                    $retorno = [];

                    while ($linha = $resultado->fetch_assoc()) {

                        $retorno[] = $linha;
                    }

                    echo json_encode($retorno);
                }
            } else if ($_POST["tabela"] == "venda_produto") {

                $id = $_POST["id"];

                $conn = conectar();
                $query1 = "SELECT * FROM venda_produto AS vp JOIN produto AS p ON vp.id_produto = p.id_produto WHERE vp.id_venda = '$id';";
                $resultado1 = $conn->query($query1);

                if ($resultado1) {

                    $retorno1 = [];

                    while ($linha1 = $resultado1->fetch_assoc()) {

                        $retorno1[] = $linha1;
                    }

                    echo json_encode($retorno1);
                }
            }
        }
    } else if ($_POST["op"] == "delete" && $_POST["filtro"] == "one" && $_POST["tabela"] == "venda" && isset($_POST["id"])) {

        $id = $_POST["id"];

        $conn = conectar();
        $query1 = "DELETE FROM venda WHERE numComanda = '$id' AND statuscmd = 'A';";
        $resultado1 = $conn->query($query1);

        if ($resultado1) {

            echo json_encode(["resposta" => 200]);
        } else {
            echo json_encode(["resposta" => 0]);
        }
    }
}

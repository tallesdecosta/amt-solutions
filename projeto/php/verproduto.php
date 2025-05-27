<?php
include 'conectar_bd.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $_POST = json_decode(file_get_contents('php://input'), true);

    switch ($_POST) {

        case $_POST["filtro"] == 'all':
            echo json_encode(retornarAll());
            break;
        case $_POST["filtro"] == 'one':
            echo json_encode(retornarOne());
            break;
        case $_POST["filtro"] == 'produto':
            echo json_encode(retornarProd());
            break;
        case $_POST["filtro"] == 'alergia':
            echo json_encode(retornarAlergia());
            break;
        case $_POST["filtro"] == 'insumo':
            echo json_encode(retornarInsumo());
            break;
    }
}

function retornarOne()
{

    try {

        $id = $_POST["id"];

        if (is_numeric($id)) {

            $conn = conectar();
            $queryA = "SELECT * FROM produto WHERE id_produto = '$id'";
            $resultadoA = $conn->query($queryA);


            if (!$resultadoA) {
                throw new Exception();
            } else {
                if ($resultadoA->num_rows == 0) {
                    return (["response" => "none"]);
                } else {

                    $retorno = [];

                    while ($linha = $resultadoA->fetch_assoc()) {

                        $retorno[] = $linha;
                    }

                    return ($retorno);
                }
            }
        } else if (is_string($id)) {

            $conn = conectar();
            $queryA = "SELECT * FROM produto WHERE nome = '$id'";
            $resultadoA = $conn->query($queryA);

            if (!$resultadoA) {
                throw new Exception();
            } else {
                if ($resultadoA->num_rows == 0) {
                    return (["response" => "none"]);
                } else {

                    $retorno = [];



                    while ($linha = $resultadoA->fetch_assoc()) {

                        $retorno[] = $linha;
                    }

                    return ($retorno);
                }
            }
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return (["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function retornarAll()
{
    try {
        $conn = conectar();
        $query = "SELECT * FROM produto";
        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {

            $retorno = [];

            while ($linha = $resultado->fetch_assoc()) {

                $retorno[] = $linha;
            }

            return ($retorno);
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return (["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}


function retornarProd()
{

    try {

        $id = $_POST["id"];

        $conn = conectar();

        // $query = "SELECT p.nome AS 'nome_prod' ,p.categoria,a.nome AS 'alergia' FROM produto AS p
        //          JOIN produtolote AS pl ON p.id_produto = pl.id_produto
        //          JOIN produtoloteinsumo AS pli ON pl.id_Lote = pli.id_produtoLote
        //          JOIN insumolote AS il ON pli.id_insumoLote = il.id_Lote
        //          JOIN insumo AS i ON il.id_insumo = i.id_insumo
        //          JOIN produto_alergia AS pa ON p.id_produto = pa.id_produto
        //          JOIN alergia AS a ON pa.id_alergia = a.id_alergia
        //          WHERE p.id_produto = $id";

        $query = "SELECT nome, categoria FROM produto WHERE id_produto = $id";

        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {


            $retorno = [];

            while ($linha = $resultado->fetch_assoc()) {

                $retorno[] = $linha;
            }

            return ($retorno);
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return (["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}


function retornarAlergia()
{

    try {

        $id = $_POST["id"];

        $conn = conectar();

        $query = "SELECT a.nome AS 'alergia' FROM alergia AS a 
                  JOIN produto_alergia AS pa ON a.id_alergia = pa.id_alergia 
                  WHERE pa.id_produto = $id";

        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {


            $retorno = [];

            while ($linha = $resultado->fetch_assoc()) {

                $retorno[] = $linha;
            }

            return ($retorno);
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return (["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}


function retornarInsumo()
{

    try {
        
        $id = $_POST["id"];

        $conn = conectar();

        $query = "SELECT i.nome FROM produto AS p
                JOIN produtolote AS pl ON p.id_produto = pl.id_produto
                JOIN produtoloteinsumo AS pli ON pl.id_Lote = pli.id_produtoLote
                JOIN insumolote AS il ON pli.id_insumoLote = il.id_Lote
                JOIN insumo AS i ON il.id_insumo = i.id_insumo
                WHERE p.id_produto = $id";

        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {


            $retorno = [];

            while ($linha = $resultado->fetch_assoc()) {

                $retorno[] = $linha;
            }

            return ($retorno);
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return (["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

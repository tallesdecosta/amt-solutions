<?php

include 'conectar_bd.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $_POST = json_decode(file_get_contents('php://input'), true);

    switch ($_POST) {
        case isset($_POST["resp"]) && $_POST["op"] == "abrir":
            echo json_encode(abrir());
            break;

        case isset($_POST["resp"]) && $_POST["op"] == "fechar":
            echo json_encode(fechar());
            break;

        case $_POST["op"] == "caixa":
            echo json_encode(retornarCaixa());
            break;

        case $_POST["op"] == "verificar":
            echo json_encode(verificar());
            break;

        case $_POST["op"] == "valorAtual":
            echo json_encode(valorAtual());
            break;
        case $_POST["op"] == "valorDinheiro":
            echo json_encode(valorDinheiro());
            break;
        case isset($_POST["user"]):
            echo json_encode(verificarAcesso());
            break;


        default:
            # code...
            break;
    }
} else if ($_SERVER['REQUEST_METHOD'] == "GET") {

    echo json_encode(retornarFuncs());
}





function abrir()
{

    try {

        $resp = intval($_POST["resp"]);
        $val = floatval($_POST["valor"]);

        $conn = conectar();
        $query = "INSERT INTO caixa(valor_ini,valor_final,id_ini,id_final,nome_op,hora_ini,hora_final,obs) VALUES ('$val',null,'$resp',null,'Abertura',now(),null,null)";
        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {
            return (["reponse" => 200]);
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function fechar()
{
    try {

        $resp = intval($_POST["resp"]);
        $val = floatval($_POST["valor"]);
        $obs = $_POST["obs"];


        $conn = conectar();
        $query = "SELECT id_op FROM caixa WHERE (nome_op != 'Entrada' AND nome_op != 'Saida') ORDER BY id_op DESC LIMIT 1;";
        $resultadoid = $conn->query($query);

        if (!$resultadoid) {
            throw new Exception();
        } else {
            while ($linha = $resultadoid->fetch_assoc()) {

                $id = intval($linha["id_op"]);

                $conn = conectar();
                $query1 = "UPDATE caixa SET valor_final = $val, id_final = $resp, nome_op = 'Fechamento', hora_final = now(), obs = '$obs' WHERE id_op = $id;";
                $resultado1 = $conn->query($query1);

                if ($resultado1) {
                    return (["response" => 200]);
                } else {
                    return (["response" => 0]);
                }
            }
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function retornarFuncs()
{

    try {

        $conn = conectar();
        $query = "SELECT id_usuario, nome FROM usuario";
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

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function valorAtual()
{

    try {

        $conn = conectar();
        $query = "SELECT valor_final FROM caixa WHERE valor_final IS NOT NULL ORDER BY id_op DESC LIMIT 1;";
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

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function valorDinheiro()
{

    try {

        date_default_timezone_set('America/Sao_Paulo');
        $data_hoje = getdate();

        $dia = $data_hoje['mday'];
        $mes = $data_hoje['mon'];
        $ano = $data_hoje['year'];

        $data = $ano . "-" . $mes . "-" . $dia;

        $conn = conectar();
        $query = "SELECT valor FROM venda WHERE formaPagamento = 'Dinheiro' AND DATE(data_emissao) = '$data' AND statuscmd = 'F'";
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

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}


function verificar()
{
    try {

        $conn = conectar();
        $query = "SELECT valor_final FROM caixa WHERE (nome_op != 'Entrada' AND nome_op != 'Saida') ORDER BY id_op DESC LIMIT 1;";
        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {
            if ($resultado->num_rows > 0) {
                while ($linha = $resultado->fetch_assoc()) {

                    return $linha;
                }
            } else {
                return ["valor_final" => true];
            }
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

function retornarCaixa()
{

    try {

        $conn = conectar();
        $query = "SELECT caixa.*,u.nome FROM caixa JOIN usuario as u WHERE caixa.id_final = u.id_usuario AND caixa.nome_op != 'Abertura' ORDER BY hora_final DESC;";
        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {
            $result = [];

            while ($linha = $resultado->fetch_assoc()) {

                $result[] = $linha;
            }

            return $result;
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}

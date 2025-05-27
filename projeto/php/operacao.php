<?php

include 'conectar_bd.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $_POST = json_decode(file_get_contents('php://input'), true);

    switch ($_POST) {
        case isset($_POST["resp"]) && $_POST["op"] == "insert":
            echo json_encode(insert());
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


function insert()
{

    try {

        $resp = intval($_POST["resp"]);
        $val = floatval($_POST["valor"]);
        $obs = $_POST["obs"];
        $nome = $_POST["nome"];

        $conn = conectar();
        $query = "SELECT valor_final FROM caixa WHERE valor_final IS NOT NULL ORDER BY id_op DESC LIMIT 1;";
        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {
            if ($resultado->num_rows > 0) {

                $data = $resultado->fetch_object();

                $ultimo_valor = $data->valor_final;

                $ajuste = $ultimo_valor + ($val);

                if ($resultado) {

                    $conn = conectar();
                    $query = "INSERT INTO caixa(valor_ini,valor_final,id_ini,id_final,nome_op,hora_ini,hora_final,obs) VALUES ('$val','$ajuste','$resp','$resp','$nome',now(),now(),'$obs')";
                    $resultado = $conn->query($query);
                }

                if (!$resultado) {
                    throw new Exception();
                } else {
                    return (["result" => 200]);
                }
            } else {

                $conn = conectar();
                $query = "INSERT INTO caixa(valor_ini,valor_final,id_ini,id_final,nome_op,hora_ini,hora_final,obs) VALUES ('$val','$val','$resp','$resp','$nome',now(),now(),'$obs')";
                $resultado = $conn->query($query);

                if (!$resultado) {
                    throw new Exception();
                } else {
                    return (["result" => 200]);
                }
            }
        }
    } catch (Exception $e) {

        $erro = $e->getMessage() . " - " . $e->getLine() . " - " . $e->getFile();

        return(["response" => "Servidor em manutenção, por favor tente novamente mais tarde!", "erro" => $erro]);
    }
}


function verificarAcesso()
{

    try {

        $user = $_POST["user"];
        $senha = $_POST["senha"];

        $conn = conectar();
        $query = "SELECT id_usuario,senha FROM usuario WHERE username = '$user'";
        $resultado = $conn->query($query);

        if (!$resultado) {
            throw new Exception();
        } else {

            if ($resultado->num_rows > 0) {

                while ($linha = $resultado->fetch_assoc()) {

                    $id = $linha["id_usuario"];

                    $senha_certa = $linha["senha"];

                    if (password_verify($senha, $senha_certa)) {

                        $conn = conectar();
                        $query = "SELECT gestao FROM permissao WHERE id_usuario = '$id'";
                        $resultado = $conn->query($query);


                        if ($resultado) {

                            while ($linha = $resultado->fetch_assoc()) {

                                if ($linha["gestao"] == 1) {
                                    return (["acesso" => "autorizado"]);
                                } else if ($linha["gestao"] == 0) {
                                    return (["acesso" => "negado"]);
                                }
                            }
                        }
                    } else {
                        return (["acesso" => "negado"]);
                    }
                }
            } else {
                return (["acesso" => "negado"]);
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

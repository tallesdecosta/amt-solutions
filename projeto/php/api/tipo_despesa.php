<?php

    session_start();
    require '../conectar_bd.php';

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(retornarTipoDespesa());
            break;
        
        case "POST":
            echo json_encode(criarTipoDespesa());
            break;

        case "DELETE":
            break;

        default:
            # code...
            break;
    }

    function retornarTipoDespesa() 
    {

        $sql = "SELECT * FROM tipodespesa";

        $conn = conectar();
                    
        $res = $conn -> query($sql);

        $tipos_despesa = [];

        while ($linha = $res -> fetch_assoc()) {

            $tipos_despesa[] = $linha;
                
        }

        return $tipos_despesa;
    }

    
    function criarTipoDespesa() 
    {

        $sql = "INSERT INTO tipodespesa(nome) VALUES('".$_POST['nome']."')";

        $conn = conectar();
                    
        $res = $conn -> query($sql);

        if ($res) {

            return ['status' => 'ok'];
        } else {

            return ['status' => 'erro'];
        }

    }



?>
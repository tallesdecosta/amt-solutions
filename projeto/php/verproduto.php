<?php
    include 'conectar_bd.php';

    $_POST = json_decode(file_get_contents('php://input'), true);

    if(isset($_POST)){

        if($_POST["filtro"] == 'all'){
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
        } else if($_POST["filtro"] == "one") {

            $id = $_POST["id"];
    
            if (is_numeric($id)) {
    
                $conn = conectar();
                $queryA = "SELECT * FROM produto WHERE id_produto = '$id'";
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
                $queryA = "SELECT * FROM produto WHERE nome = '$id'";
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
        }
    }






?>
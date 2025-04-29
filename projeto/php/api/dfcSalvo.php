<?php
    session_start();
    require '../conectar_bd.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        echo json_encode(getDfcs());
        break;
    
    default:
        # code...
        break;
}

function getDfcs() {

    $sql = "SELECT * FROM dfc";

    $conn = conectar();
                    
    $res = $conn->query($sql);

    while ($linha = $res->fetch_assoc()) {

        $dfc[] = $linha;
        
    }

    return $dfc;


}


?>
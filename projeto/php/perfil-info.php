<?php
    require 'timeout.php';

    echo json_encode(['cargo' => $_SESSION['cargo'], 'nome' => $_SESSION['nome']]);
    

?>
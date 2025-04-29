<?php
    session_start();

    echo json_encode(['cargo' => $_SESSION['cargo'], 'nome' => $_SESSION['nome']]);

?>
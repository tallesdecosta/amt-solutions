<?php
session_start();


//900 segundos, 10 minutos
$timeout = 20; 


//retorna o tempo em segundos, tempo atual - última atividade n pode ser maior que dez minutos
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $timeout) {
    
    session_unset(); 
    session_destroy(); 
    header("Location: /amt-solutions/projeto/html/login.html"); 
    exit();
}

$_SESSION['last_activity'] = time();

?>
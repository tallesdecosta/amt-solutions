<?php

$password = $_GET['senha'];

// Generate a secure hash using bcrypt
$hash = password_hash($password, PASSWORD_DEFAULT);

// Store $hash in the database
echo "hash: " . $hash;

?>
<?php
// Verifica se a requisiçao é POST
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    //Redireciona para a página inicial se for acesso direto
    // MUDAR A PAGINA INICIAL
    header("Location:");
    exit;
}

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = 'usuarios';

// Cria a conexao
$conn = new mysqli($host, $usuario, $senha, $banco);

// Verifica se ocorreu erro
if ($conn->connect_error){
    die("Erro na conexao".$conn->connect_error);
}

echo("conectado!")
?>
<?php
session_start();
include 'conexao.php';

if($_SERVER["REQUEST_METHOD"] === "POST"){
//Recupera os dados do formulario
$email = trim($_POST['email']);
$senha = trim($_POST['senha']);

//Verifica se os campos nao estao vazios
if(empty($email) || empty($senha)){
    echo "<script>
            alert('Preencha todos os campos.');
            window.location.href = 'login.html';
            </script>";
            exit;
}

// Prepara a consulta para buscar o usuario e validar a senha utilizando a funçao PASSWORD do MySQL
$stmt = $conn->prepare("SELECT * FROM cadastro WHERE
email = ? AND senha = PASSWORD(?)");
$stmt->bind_param("ss",$email, $senha);
$stmt->execute();
$resultado = $stmt->get_result();

if($resultado->num_rows === 1){
    //Login bem-sucedido: iniciar sessao e redirecionar
$_SESSION['email'] = $email;
    echo"<script>
        alert('Login realizado com sucesso!');
        window.location.href = 'http://localhost/91134/app/cad.html'; 
        </script>";
        // muda o window.location para tela de inicio
}else{
    //Login falhou: redireciona de volta ao login
    echo "<script>
        alert('Usuario ou senha incorretos!');
        window.location.href = 'http://localhost/91134/app/';
        </script>";
        // muda para tela de login
}
$stmt->close();
$conn->close();
exit;
} else{
    // Caso o acesso nao seja via POST, redireciona para a pagina de login
    header("Location: login.html");
    exit;
}
?>


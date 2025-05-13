// Seleciona o elemento com o ID "container", que envolve todo o conteúdo do login/cadastro
const container = document.getElementById('container');

// Seleciona o botão de cadastro com o ID "register"
const registerBtn = document.getElementById('register');

// Seleciona o botão de login com o ID "login"
const loginBtn = document.getElementById('login');

// Quando o botão de cadastro for clicado, adiciona a classe "active" ao container
// Isso ativa as animações e mostra o formulário de cadastro
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

// Quando o botão de login for clicado, remove a classe "active" do container
// Isso reverte a animação e exibe o formulário de login
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

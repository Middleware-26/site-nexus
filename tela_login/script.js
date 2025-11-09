const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => container.classList.add("active"));
loginBtn.addEventListener('click', () => container.classList.remove("active"));

// URL da sua API (coloque seu link do Render aqui)
const API_URL = "https://backend-site-nexus.onrender.com/api";

// === Cadastro ===
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('emailCadastro').value.trim();
    const senha = document.getElementById('senhaCadastro').value.trim();
    const tipo = document.getElementById('tipoUsuario').value;

    if (!nome || !email || !senha || !tipo) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const resp = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, tipo })
        });

        const data = await resp.json();
        if (resp.ok) {
            alert("Conta criada com sucesso!");
            container.classList.remove("active"); // volta pra tela de login
        } else {
            alert(data.error || "Erro ao criar conta");
        }
    } catch (err) {
        alert("Erro de conexão com o servidor");
        console.error(err);
    }
});

// === Login ===
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailLogin').value.trim();
    const senha = document.getElementById('senhaLogin').value.trim();

    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const resp = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await resp.json();
        if (resp.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.user));
            alert("Login realizado com sucesso!");
            window.location.href = "alunos.html"; // redireciona para a página dos alunos
        } else {
            alert(data.error || "Email ou senha incorretos");
        }
    } catch (err) {
        alert("Erro de conexão com o servidor");
        console.error(err);
    }
});

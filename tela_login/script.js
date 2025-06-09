        // Seleciona o elemento com o ID "container", que envolve todo o conteúdo do login/cadastro
        const container = document.getElementById('container');
        // Seleciona o botão de cadastro com o ID "register"
        const registerBtn = document.getElementById('register');
        // Seleciona o botão de login com o ID "login"
        const loginBtn = document.getElementById('login');

        // Quando o botão de cadastro for clicado, adiciona a classe "active" ao container
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });

        // Quando o botão de login for clicado, remove a classe "active" do container
        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });

        // Validação básica com redirecionamento após sucesso
        function validateForm(event) {
            event.preventDefault(); // Impede o recarregamento da página

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!name || !email || !password) {
                alert("Preencha todos os campos!");
                return false;
            }

            alert("Conta criada com sucesso!");
            
            // Redirecionamento após validação bem-sucedida
            window.location.href = "oquevoceé.html";
            
            return false; // Para evitar envio real do formulário, se necessário
        }

        // Impede o comportamento padrão de scroll
        document.addEventListener('wheel', function(e) {
            e.preventDefault();
        }, { passive: false });

        // Impede scroll em dispositivos touch
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
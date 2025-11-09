// ======================================================
// 🔥 INTEGRAÇÃO COM FIREBASE - LOGIN E REDIRECIONAMENTO
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ------------------------------------------------------
// ⚙️ CONFIGURAÇÃO DO FIREBASE (substitua pelos seus dados)
// ------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyADnCSz9_kJCJQp1simuF52eZ9yz4MawgE",
  authDomain: "nexus-web-c35f1.firebaseapp.com",
  projectId: "nexus-web-c35f1",
  storageBucket: "nexus-web-c35f1.firebasestorage.app",
  messagingSenderId: "387285405125",
  appId: "1:387285405125:web:96c2d0edb9695b79690fac",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------------------------------------------
// 🧩 LOGIN DE USUÁRIO
// ------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailLogin')?.value.trim();
    const senha = document.getElementById('senhaLogin')?.value.trim();

    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      // 🔐 Faz login no Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 🔎 Busca dados do usuário no Firestore
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("Usuário não encontrado no banco de dados!");
        return;
      }

      const dados = docSnap.data();
      console.log("✅ Login bem-sucedido:", dados);

      // 🔁 Armazena localmente (se precisar em outras páginas)
      localStorage.setItem("usuario", JSON.stringify(dados));

      // 🚀 Redireciona conforme o tipo da conta
      switch (dados.tipo) {
        case "aluno":
          window.location.href = "alunos.html";
          break;
        case "professor":
          window.location.href = "professores.html";
          break;
        case "psicologo":
          window.location.href = "psicologos.html";
          break;
        case "admin":
          window.location.href = "adminpainel.html";
          break;
        default:
          alert("Tipo de usuário desconhecido!");
      }

    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-email") {
        alert("Email ou senha inválidos.");
      } else if (error.code === "auth/user-not-found") {
        alert("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        alert("Senha incorreta.");
      } else {
        alert("Erro ao fazer login: " + error.message);
      }
    }
  });
});

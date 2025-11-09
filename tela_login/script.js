import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collectionGroup,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ======================================================
// 🔥 CONFIGURAÇÃO DO FIREBASE
// ======================================================
const firebaseConfig = {
  apiKey: "AIzaSyADnCSz9_kJCJQp1simuF52eZ9yz4MawgE",
  authDomain: "nexus-web-c35f1.firebaseapp.com",
  projectId: "nexus-web-c35f1",
  storageBucket: "nexus-web-c35f1.firebasestorage.app",
  messagingSenderId: "387285405125",
  appId: "1:387285405125:web:96c2d0edb9695b79690fac",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======================================================
// 🧩 LOGIN INTELIGENTE COM SUPORTE A TODAS AS ESCOLAS E TIPOS
// ======================================================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    // 1️⃣ Login via Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 2️⃣ Busca o usuário em qualquer subcoleção (todas as escolas)
    const colecoes = ["alunos", "professores", "psicologos", "administradores"];
    let dadosUsuario = null;

    for (const col of colecoes) {
      const q = query(collectionGroup(db, col), where("email", "==", email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        dadosUsuario = snapshot.docs[0].data();
        dadosUsuario.tipo = col; // Salva o tipo de usuário com base na subcoleção
        break;
      }
    }

    if (!dadosUsuario) {
      alert("Usuário não encontrado no banco de dados!");
      return;
    }

    // 3️⃣ Armazena localmente e redireciona
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    alert("Login realizado com sucesso!");

    switch (dadosUsuario.tipo) {  // Usando o tipo correto
      case "alunos":
        window.location.href = "../tela_principal/alunos.html";
        break;
      case "professores":
        window.location.href = "../tela_principal/professor.html";
        break;
      case "psicologos":
        window.location.href = "../tela_principal/psicologo.html";
        break;
      case "administradores":
        window.location.href = "../tela_principal/adminpainel.html";
        break;
      default:
        alert("Tipo de usuário desconhecido!");
    }

  } catch (error) {
    console.error("❌ Erro no login:", error);

    // ======================================================
    // 🧠 DETECÇÃO AUTOMÁTICA DE ERRO DE ÍNDICE (COLLECTION_GROUP)
    // ======================================================
    if (error.message.includes("requires a COLLECTION_GROUP_ASC index")) {
      const match = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s"]+/);
      if (match && match[0]) {
        const url = match[0];
        alert("⚠️ É necessário criar um índice para esta consulta. Vamos abrir o painel do Firebase pra você.");
        window.open(url, "_blank"); // abre automaticamente o link de criação do índice
      } else {
        alert("Erro de índice detectado, mas o link não foi encontrado.");
      }
    } else if (error.code === "auth/invalid-email" || error.code === "auth/invalid-credential") {
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

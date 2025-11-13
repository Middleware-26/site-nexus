import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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
// 🧠 GARANTE QUE TODAS AS ABAS FIQUEM SINCRONIZADAS
// ======================================================
setPersistence(auth, browserLocalPersistence);

// ======================================================
// 🔄 MONITORAMENTO GLOBAL DE LOGIN ENTRE ABAS
// ======================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("✅ Usuário autenticado:", user.email);

    // Verifica o tipo de usuário no Firestore
    const colecoes = ["alunos", "professores", "psicologos", "administradores"];
    let dadosUsuario = null;

    for (const col of colecoes) {
      const q = query(collectionGroup(db, col), where("email", "==", user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        dadosUsuario = snapshot.docs[0].data();
        dadosUsuario.tipo = col;
        break;
      }
    }

    if (dadosUsuario) {
      localStorage.setItem("usuario", JSON.stringify(dadosUsuario));

      switch (dadosUsuario.tipo) {
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
          window.location.href = "../tela_principal/adminpainel.html";
      }
    } else {
      console.warn("⚠️ Usuário não encontrado no banco de dados Firestore.");
    }
  } else {
    console.log("🚪 Nenhum usuário autenticado — aguardando login...");
  }
});

// ======================================================
// 🧩 EVENTO DE LOGIN
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
    // 🔐 Login via Firebase Auth
    await signInWithEmailAndPassword(auth, email, senha);
    // Não precisa redirecionar aqui — o onAuthStateChanged cuidará disso
  } catch (error) {
    console.error("❌ Erro no login:", error);

    if (error.code === "auth/invalid-email" || error.code === "auth/invalid-credential") {
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

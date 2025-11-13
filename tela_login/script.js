import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut
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
// 🔄 SINCRONIZAÇÃO ENTRE ABAS (Login / Logout)
// ======================================================
setPersistence(auth, browserLocalPersistence);

// Monitora qualquer mudança no estado de autenticação
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("✅ Usuário autenticado:", user.email);

    // Verifica o tipo e a escola do usuário
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

      // Redireciona de acordo com o tipo
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
      console.warn("⚠️ Usuário não encontrado no Firestore.");
    }
  } else {
    console.log("🚪 Nenhum usuário autenticado — aguardando login...");
    // Se o usuário saiu, garante que volta à tela de login
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "../tela_login/login.html";
    }
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
    await signInWithEmailAndPassword(auth, email, senha);
    // Redirecionamento será feito automaticamente via onAuthStateChanged
  } catch (error) {
    console.error("❌ Erro no login:", error);
    if (error.code === "auth/invalid-credential") {
      alert("Email ou senha incorretos.");
    } else {
      alert("Erro ao fazer login: " + error.message);
    }
  }
});

// ======================================================
// 🚪 SINCRONIZAÇÃO DE LOGOUT ENTRE ABAS
// ======================================================

// Escuta evento de logout em qualquer aba
window.addEventListener("storage", (event) => {
  if (event.key === "logout" && event.newValue === "true") {
    console.log("🔁 Logout detectado em outra aba. Redirecionando...");
    signOut(auth).finally(() => {
      localStorage.removeItem("logout");
      window.location.href = "../tela_login/login.html";
    });
  }
});

// Função de logout global (chame essa em qualquer página)
window.logoutGlobal = async () => {
  await signOut(auth);
  localStorage.setItem("logout", "true"); // dispara evento em todas as abas
  window.location.href = "../tela_login/login.html";
};

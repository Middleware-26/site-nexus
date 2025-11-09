import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collectionGroup, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// ===================================
// 🧩 LOGIN COM BUSCA GLOBAL DE ESCOLA
// ===================================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailLogin").value.trim();
  const senha = document.getElementById("senhaLogin").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Busca o usuário em qualquer escola
    const q = query(collectionGroup(db, "usuarios"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Usuário não encontrado no banco de dados!");
      return;
    }

    const dados = querySnapshot.docs[0].data();
    localStorage.setItem("usuario", JSON.stringify(dados));

    alert("Login realizado com sucesso!");

    switch (dados.tipo) {
      case "aluno":
        window.location.href = "../tela_principal/alunos.html";
        break;
      case "professor":
        window.location.href = "../tela_principal/professor.html";
        break;
      case "psicologo":
        window.location.href = "../tela_principal/psicologo.html";
        break;
      case "admin":
        window.location.href = "../tela_principal/adminpainel.html";
        break;
      default:
        alert("Tipo de usuário desconhecido!");
    }

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao fazer login: " + error.message);
  }
});

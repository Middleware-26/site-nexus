// ===========================================
// 🔥 SCRIPT PARA CRIAR ADMINISTRADOR DE ESCOLA
// ===========================================

// Importações do Firebase Admin SDK
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Lê o arquivo de credenciais do Firebase
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf-8")
);

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ===========================================
// 🧠 Função principal
// ===========================================
async function criarAdministrador(email, senha, nome, codigoEscola) {
  try {
    console.log("🚀 Criando administrador...");

    // 1️⃣ Cria o usuário no Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password: senha,
      displayName: nome,
    });

    const uid = userRecord.uid;
    console.log(`✅ Usuário criado com UID: ${uid}`);

    // 2️⃣ Define as custom claims
    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
      role: "administrador",
      codigoEscola,
    });

    console.log("🔑 Custom claims definidas com sucesso!");

    // 3️⃣ Cria o documento da escola, se não existir
    const escolaRef = db.collection("escolas").doc(codigoEscola);
    const escolaSnap = await escolaRef.get();

    if (!escolaSnap.exists) {
      await escolaRef.set({
        nome: "Colégio Nexus",
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`🏫 Escola ${codigoEscola} criada.`);
    }

    // 4️⃣ Cria o documento do administrador dentro da escola
    const adminRef = escolaRef.collection("administradores").doc(uid);
    await adminRef.set({
      uid,
      nome,
      email,
      tipo: "administrador",
      codigoEscola,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      ativo: true,
    });

    console.log("📁 Documento do administrador criado no Firestore.");

    // 5️⃣ Cria também o documento global em "usuarios"
    await db.collection("usuarios").doc(uid).set({
      uid,
      nome,
      email,
      tipo: "administrador",
      codigoEscola,
      referenciaFirestore: `escolas/${codigoEscola}/administradores/${uid}`,
    });

    console.log("🌍 Documento global criado em 'usuarios'.");

    console.log("\n🎉 ADMINISTRADOR CRIADO COM SUCESSO!");
    console.log("Email:", email);
    console.log("Senha:", senha);
    console.log("Código da escola:", codigoEscola);
  } catch (error) {
    console.error("❌ Erro ao criar administrador:", error);
  }
}

// ===========================================
// 🧩 CONFIGURAÇÃO DE ENTRADA
// ===========================================
// 🔧 Altere esses valores conforme sua necessidade:
const email = "admin@nexus.com";
const senha = "123456";
const nome = "Administrador Nexus";
const codigoEscola = "ABC123";

criarAdministrador(email, senha, nome, codigoEscola);

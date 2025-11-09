import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const JWT_SECRET = process.env.JWT_SECRET;

// --- util middleware ---
const auth = async (req,res,next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "Sem token" });
  const token = h.split(" ")[1];
  try {
    const p = jwt.verify(token, JWT_SECRET);
    req.user = p;
    next();
  } catch(e) { return res.status(401).json({ error: "Token inválido" }); }
};

// --- rota: registrar (usa codigo da escola) ---
app.post("/api/auth/register", async (req,res) => {
  const { nome, email, senha, tipo, codigoEscola } = req.body;
  if (!nome || !email || !senha || !tipo || !codigoEscola) return res.status(400).json({ error: "Campos faltando" });
  try {
    const [escolas] = await pool.query("SELECT id FROM escolas WHERE codigo = ?", [codigoEscola]);
    if (escolas.length === 0) return res.status(400).json({ error: "Código de escola inválido" });
    const id_escola = escolas[0].id;
    const hash = await bcrypt.hash(senha, 10);
    await pool.query("INSERT INTO usuarios (id_escola,nome,email,senha,tipo) VALUES (?,?,?,?,?)",
      [id_escola, nome, email, hash, tipo]);
    res.json({ message: "Usuário criado" });
  } catch(err) { console.error(err); res.status(500).json({ error: "Erro ao criar usuário" }); }
});

// --- rota: login ---
app.post("/api/auth/login", async (req,res) => {
  const { email, senha, codigoEscola } = req.body;
  if (!email || !senha || !codigoEscola) return res.status(400).json({ error: "Campos faltando" });
  try {
    const [escolas] = await pool.query("SELECT id FROM escolas WHERE codigo = ?", [codigoEscola]);
    if (escolas.length === 0) return res.status(400).json({ error: "Código escola inválido" });
    const id_escola = escolas[0].id;
    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ? AND id_escola = ?", [email, id_escola]);
    if (users.length === 0) return res.status(401).json({ error: "Credenciais inválidas" });
    const user = users[0];
    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });
    const token = jwt.sign({ id: user.id, id_escola: user.id_escola, tipo: user.tipo, nome: user.nome }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, user: { id: user.id, nome: user.nome, tipo: user.tipo, foto_url: user.foto_url, id_escola: user.id_escola } });
  } catch(err) { console.error(err); res.status(500).json({ error: "Erro login" }); }
});

// --- rota: listar alunos (protegida) ---
app.get("/api/alunos", auth, async (req,res) => {
  try {
    const id_escola = req.user.id_escola;
    const [rows] = await pool.query("SELECT id, nome, email, foto_url FROM usuarios WHERE id_escola = ? AND tipo = 'aluno'", [id_escola]);
    res.json(rows);
  } catch(err){ console.error(err); res.status(500).json({ error: "erro" }); }
});

// --- rota: criar aluno (protegida) ---
app.post("/api/alunos", auth, async (req,res) => {
  try {
    const id_escola = req.user.id_escola;
    const { nome, email, senha, turma, idade } = req.body;
    const hash = await bcrypt.hash(senha || Math.random().toString(36).slice(2,8), 10);
    await pool.query("INSERT INTO usuarios (id_escola,nome,email,senha,tipo) VALUES (?,?,?,?)",
      [id_escola, nome, email, hash, 'aluno']);
    res.json({ message: "Aluno criado" });
  } catch(err){ console.error(err); res.status(500).json({ error: "erro" }); }
});

const port = process.env.PORT || 3001;
app.listen(port, ()=> console.log("API rodando na porta", port));

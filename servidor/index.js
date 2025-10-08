// servidor/index.js - Versão Atualizada com Banco de Dados
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// ======================= CONFIGURAÇÃO =======================
const TELEGRAM_TOKEN = '8252299530:AAH2dGhw-7rlrksMLorYjX48-z9HCDECFiM';
const PSICOLOGO_CHAT_ID = '-4951949378';
const PROFESSOR_CHAT_ID = '-4987808900';
// ============================================================

// Inicialização do banco de dados
const dbPath = path.join(__dirname, 'database', 'nexus.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite.');
        // Criar tabelas se não existirem
        initializeDatabase();
    }
});

function initializeDatabase() {
    const setupSQL = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            tipo TEXT NOT NULL CHECK(tipo IN ('estudante', 'professor', 'psicologo')),
            codigo_escola TEXT NOT NULL,
            avatar_url TEXT DEFAULT 'imagens/padrao.jpg',
            turma TEXT,
            materia TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS estados_emocionais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            emocao TEXT NOT NULL CHECK(emocao IN ('worst', 'bad', 'neutral', 'good', 'great')),
            descricao TEXT,
            data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno_id INTEGER NOT NULL,
            psicologo_id INTEGER NOT NULL,
            professor_id INTEGER,
            tipo_consulta TEXT NOT NULL CHECK(tipo_consulta IN ('psicologico', 'avaliacao')),
            data_agendamento DATE NOT NULL,
            horario TIME NOT NULL,
            motivo TEXT,
            status TEXT DEFAULT 'agendado' CHECK(status IN ('agendado', 'confirmado', 'realizado', 'cancelado')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (aluno_id) REFERENCES usuarios(id),
            FOREIGN KEY (psicologo_id) REFERENCES usuarios(id),
            FOREIGN KEY (professor_id) REFERENCES usuarios(id)
        );

        CREATE TABLE IF NOT EXISTS observacoes_alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluno_id INTEGER NOT NULL,
            professor_id INTEGER NOT NULL,
            observacao TEXT NOT NULL,
            data_observacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (aluno_id) REFERENCES usuarios(id),
            FOREIGN KEY (professor_id) REFERENCES usuarios(id)
        );
    `;

    db.exec(setupSQL, (err) => {
        if (err) {
            console.error('Erro ao criar tabelas:', err);
        } else {
            console.log('✅ Tabelas criadas/verificadas com sucesso.');
            // Inserir dados iniciais
            seedDatabase();
        }
    });
}

function seedDatabase() {
    // Verificar se já existem usuários
    db.get("SELECT COUNT(*) as count FROM usuarios", (err, row) => {
        if (err) {
            console.error('Erro ao verificar dados:', err);
            return;
        }

        if (row.count === 0) {
            const insertUsers = `
                INSERT INTO usuarios (nome, email, senha_hash, tipo, codigo_escola, turma, materia) VALUES
                ('Ana Carolina Silva', 'ana.silva@escola.com', '$2b$10$KssILxWRA2G6Hk5D6.3ZBe6f5R3R1R9pY9J8nW8nW8nW8nW8nW8nW', 'estudante', 'ESC001', '2º Ano - B', NULL),
                ('Pedro Henrique Oliveira', 'pedro.oliveira@escola.com', '$2b$10$KssILxWRA2G6Hk5D6.3ZBe6f5R3R1R9pY9J8nW8nW8nW8nW8nW8nW', 'estudante', 'ESC001', '3º Ano - A', NULL),
                ('Mariana Costa', 'mariana.costa@escola.com', '$2b$10$KssILxWRA2G6Hk5D6.3ZBe6f5R3R1R9pY9J8nW8nW8nW8nW8nW8nW', 'estudante', 'ESC001', '1º Ano - C', NULL),
                ('Professor João Santos', 'joao.santos@escola.com', '$2b$10$KssILxWRA2G6Hk5D6.3ZBe6f5R3R1R9pY9J8nW8nW8nW8nW8nW8nW', 'professor', 'ESC001', NULL, 'Matemática'),
                ('Dra. Carla Fernandes', 'carla.fernandes@escola.com', '$2b$10$KssILxWRA2G6Hk5D6.3ZBe6f5R3R1R9pY9J8nW8nW8nW8nW8nW8nW', 'psicologo', 'ESC001', NULL, NULL);
            `;

            db.exec(insertUsers, (err) => {
                if (err) {
                    console.error('Erro ao inserir dados iniciais:', err);
                } else {
                    console.log('✅ Dados iniciais inseridos com sucesso.');
                }
            });
        }
    });
}

// Resto do código do servidor permanece igual...
const userChatIds = {
    'psychologist': PSICOLOGO_CHAT_ID,
    'teacher': PROFESSOR_CHAT_ID
};

const chatIdToUserType = {
    [PSICOLOGO_CHAT_ID]: 'psychologist',
    [PROFESSOR_CHAT_ID]: 'teacher'
};

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

let activeConnections = new Map();

// ======================= NOVAS ROTAS PARA O BANCO DE DADOS =======================

// Rota de login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, usuario) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro no servidor' });
            }

            if (!usuario) {
                return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
            }

            // Em produção, usar bcrypt para verificar a senha
            // const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
            const senhaValida = true; // Temporariamente sempre true para testes

            if (senhaValida) {
                res.json({
                    success: true,
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        tipo: usuario.tipo,
                        codigo_escola: usuario.codigo_escola,
                        turma: usuario.turma,
                        materia: usuario.materia,
                        avatar_url: usuario.avatar_url
                    }
                });
            } else {
                res.status(401).json({ success: false, message: 'Senha incorreta' });
            }
        }
    );
});

// Rota para registrar estado emocional
app.post('/api/estado-emocional', (req, res) => {
    const { usuario_id, emocao, descricao } = req.body;

    db.run(
        "INSERT INTO estados_emocionais (usuario_id, emocao, descricao) VALUES (?, ?, ?)",
        [usuario_id, emocao, descricao],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao salvar estado emocional' });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
});

// Rota para obter agendamentos
app.get('/api/agendamentos/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    db.all(`
        SELECT a.*, u.nome as aluno_nome, p.nome as psicologo_nome 
        FROM agendamentos a
        JOIN usuarios u ON a.aluno_id = u.id
        JOIN usuarios p ON a.psicologo_id = p.id
        WHERE a.aluno_id = ? OR a.psicologo_id = ?
        ORDER BY a.data_agendamento, a.horario
    `, [usuario_id, usuario_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos' });
        }
        res.json({ success: true, agendamentos: rows });
    });
});

// Rota para criar agendamento
app.post('/api/agendamentos', (req, res) => {
    const { aluno_id, psicologo_id, tipo_consulta, data_agendamento, horario, motivo } = req.body;

    db.run(
        "INSERT INTO agendamentos (aluno_id, psicologo_id, tipo_consulta, data_agendamento, horario, motivo) VALUES (?, ?, ?, ?, ?, ?)",
        [aluno_id, psicologo_id, tipo_consulta, data_agendamento, horario, motivo],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao criar agendamento' });
            }
            res.json({ success: true, id: this.lastID });
        }
    );
});

// Rota para obter alunos (para professores)
app.get('/api/alunos', (req, res) => {
    db.all(
        "SELECT * FROM usuarios WHERE tipo = 'estudante' ORDER BY nome",
        (err, rows) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao buscar alunos' });
            }
            res.json({ success: true, alunos: rows });
        }
    );
});

// Resto do código do servidor (WebSocket, Telegram, etc.) permanece igual...
// ... [código anterior do servidor]

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`  🚀 Servidor Nexus Middleware iniciado!`);
    console.log(`  📡 Escutando na porta: ${PORT}`);
    console.log(`  🤖 Bot do Telegram conectado e pronto.`);
    console.log(`  🗄️  Banco de dados SQLite conectado.`);
    console.log(`  🔌 WebSocket habilitado para chat em tempo real.`);
    console.log(`================================================`);
});

// Rota para verificar o banco via navegador
app.get('/admin/db-status', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        let html = `<h1>Status do Banco de Dados</h1>`;
        html += `<h2>Tabelas (${tables.length}):</h2><ul>`;
        
        tables.forEach(table => {
            html += `<li>${table.name}</li>`;
        });
        html += `</ul>`;
        
        // Ver usuários
        db.all("SELECT * FROM usuarios", (err, usuarios) => {
            html += `<h2>Usuários (${usuarios.length}):</h2><ul>`;
            usuarios.forEach(user => {
                html += `<li>${user.nome} - ${user.email} (${user.tipo})</li>`;
            });
            html += `</ul>`;
            res.send(html);
        });
    });
});
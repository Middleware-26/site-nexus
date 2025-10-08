// servidor/create-database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🚀 Criando banco de dados do zero...\n');

const dbPath = path.join(__dirname, 'database', 'nexus.db');

// Garantir que a pasta existe
if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    console.log('📁 Pasta database criada');
}

// Deletar arquivo existente (se houver)
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🗑️  Arquivo antigo removido');
}

// Criar novo banco
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao criar banco:', err);
        return;
    }
    console.log('✅ Novo banco criado!');
});

// SQL COMPLETO para criar tudo
const setupSQL = `
-- Tabela de usuários
CREATE TABLE usuarios (
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

-- Tabela de estados emocionais
CREATE TABLE estados_emocionais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    emocao TEXT NOT NULL CHECK(emocao IN ('worst', 'bad', 'neutral', 'good', 'great')),
    descricao TEXT,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
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

-- Tabela de observações
CREATE TABLE observacoes_alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id INTEGER NOT NULL,
    professor_id INTEGER NOT NULL,
    observacao TEXT NOT NULL,
    data_observacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aluno_id) REFERENCES usuarios(id),
    FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

-- Tabela do fórum
CREATE TABLE forum_topicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserir dados de exemplo
INSERT INTO usuarios (nome, email, senha_hash, tipo, codigo_escola, turma, materia) VALUES
('Ana Carolina Silva', 'ana.silva@escola.com', 'hash123', 'estudante', 'ESC001', '2º Ano - B', NULL),
('Pedro Henrique Oliveira', 'pedro.oliveira@escola.com', 'hash123', 'estudante', 'ESC001', '3º Ano - A', NULL),
('Mariana Costa', 'mariana.costa@escola.com', 'hash123', 'estudante', 'ESC001', '1º Ano - C', NULL),
('Professor João Santos', 'joao.santos@escola.com', 'hash123', 'professor', 'ESC001', NULL, 'Matemática'),
('Dra. Carla Fernandes', 'carla.fernandes@escola.com', 'hash123', 'psicologo', 'ESC001', NULL, NULL);

-- Inserir estados emocionais
INSERT INTO estados_emocionais (usuario_id, emocao, descricao) VALUES
(1, 'neutral', 'Dia normal de estudos'),
(2, 'good', 'Me sentindo bem com as aulas'),
(3, 'bad', 'Estou com dificuldades para me concentrar');

-- Inserir agendamentos
INSERT INTO agendamentos (aluno_id, psicologo_id, tipo_consulta, data_agendamento, horario, motivo) VALUES
(1, 5, 'psicologico', '2024-01-15', '14:30', 'Acompanhamento de rotina'),
(3, 5, 'avaliacao', '2024-01-16', '10:00', 'Dificuldade de concentração');
`;

console.log('📝 Criando tabelas e inserindo dados...');
db.exec(setupSQL, (err) => {
    if (err) {
        console.error('❌ Erro durante a criação:', err);
        db.close();
        return;
    }
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    console.log('✅ Dados de exemplo inseridos!');
    
    // Verificar o resultado
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        console.log('\n📊 TABELAS CRIADAS:');
        tables.forEach(table => {
            console.log(`   - ${table.name}`);
        });
        
        db.get("SELECT COUNT(*) as total FROM usuarios", (err, row) => {
            console.log(`\n👥 TOTAL DE USUÁRIOS: ${row.total}`);
            
            db.close();
            console.log('\n🎉 BANCO DE DADOS PRONTO!');
            console.log('📍 Agora tente abrir no VS Code novamente.');
        });
    });
});
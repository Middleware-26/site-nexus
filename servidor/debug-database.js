// servidor/debug-database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🔍 Diagnosticando o banco de dados...\n');

const dbPath = path.join(__dirname, 'database', 'nexus.db');

// Verificar se a pasta database existe
if (!fs.existsSync(path.dirname(dbPath))) {
    console.log('📁 Criando pasta database...');
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Verificar se o arquivo existe
if (!fs.existsSync(dbPath)) {
    console.log('❌ Arquivo nexus.db não existe - será criado...');
} else {
    const stats = fs.statSync(dbPath);
    console.log(`✅ Arquivo existe - Tamanho: ${stats.size} bytes`);
}

// Conectar ao banco
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro na conexão:', err.message);
        return;
    }
    console.log('✅ Conectado ao SQLite com sucesso!');
});

// Testar criação de tabelas
const createTablesSQL = `
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
`;

console.log('\n📝 Tentando criar tabelas...');
db.exec(createTablesSQL, (err) => {
    if (err) {
        console.error('❌ Erro ao criar tabelas:', err);
        db.close();
        return;
    }
    
    console.log('✅ Tabelas criadas/verificadas com sucesso!');
    
    // Verificar se as tabelas foram criadas
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('❌ Erro ao verificar tabelas:', err);
            db.close();
            return;
        }
        
        console.log('\n📊 TABELAS NO BANCO:');
        tables.forEach(table => {
            console.log(`   - ${table.name}`);
        });
        
        // Inserir dados de exemplo
        console.log('\n👥 Inserindo dados de exemplo...');
        const insertDataSQL = `
            INSERT OR IGNORE INTO usuarios (nome, email, senha_hash, tipo, codigo_escola, turma, materia) VALUES
            ('Ana Carolina Silva', 'ana.silva@escola.com', 'hash123', 'estudante', 'ESC001', '2º Ano - B', NULL),
            ('Professor João Santos', 'joao.santos@escola.com', 'hash123', 'professor', 'ESC001', NULL, 'Matemática'),
            ('Dra. Carla Fernandes', 'carla.fernandes@escola.com', 'hash123', 'psicologo', 'ESC001', NULL, NULL);
        `;
        
        db.exec(insertDataSQL, (err) => {
            if (err) {
                console.error('❌ Erro ao inserir dados:', err);
            } else {
                console.log('✅ Dados de exemplo inseridos!');
                
                // Verificar os dados
                db.all("SELECT * FROM usuarios", (err, usuarios) => {
                    console.log('\n📋 USUÁRIOS CADASTRADOS:');
                    usuarios.forEach(user => {
                        console.log(`   - ${user.nome} (${user.tipo}) - ${user.email}`);
                    });
                    
                    db.close();
                    console.log('\n🎉 BANCO DE DADOS CONFIGURADO COM SUCESSO!');
                });
            }
        });
    });
});
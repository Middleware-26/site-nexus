-- arquivo: database/setup.sql
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

CREATE TABLE IF NOT EXISTS forum_topicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS forum_respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topico_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    resposta TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topico_id) REFERENCES forum_topicos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
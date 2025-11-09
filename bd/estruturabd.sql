-- TABELA: escolas
CREATE TABLE escolas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  codigo VARCHAR(12) NOT NULL UNIQUE,
  cidade VARCHAR(100),
  estado VARCHAR(50),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_escola INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('aluno','professor','psicologo','admin') NOT NULL,
  telegram VARCHAR(100), -- opcional, pode armazenar o @username do Telegram
  foto_url VARCHAR(500),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_escola) REFERENCES escolas(id) ON DELETE CASCADE,
  UNIQUE KEY ux_escola_email (id_escola, email)
);

-- TABELA: agendamentos
CREATE TABLE agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_escola INT NOT NULL,
  id_criador INT NOT NULL,
  id_aluno INT NOT NULL,
  tipo ENUM('psicologico','avaliacao','reuniao') DEFAULT 'psicologico',
  data_hora DATETIME NOT NULL,
  status ENUM('agendado','cancelado','concluido') DEFAULT 'agendado',
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_escola) REFERENCES escolas(id) ON DELETE CASCADE,
  FOREIGN KEY (id_criador) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (id_aluno) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- TABELA: fichamentos (relatórios)
CREATE TABLE fichamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_escola INT NOT NULL,
  id_aluno INT NOT NULL,
  id_autor INT,
  titulo VARCHAR(250),
  conteudo TEXT,
  privado BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_escola) REFERENCES escolas(id) ON DELETE CASCADE,
  FOREIGN KEY (id_aluno) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_autor) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABELA: notificacoes
CREATE TABLE notificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_escola INT NOT NULL,
  usuario_id INT,
  tipo VARCHAR(50),
  conteudo TEXT,
  lido BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar o banco de dados, se não existir
CREATE DATABASE IF NOT EXISTS usuarios;
USE usuarios;

-- Criar tabela de escolas (para relacionamento)
CREATE TABLE IF NOT EXISTS escolas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  codigo VARCHAR(12) NOT NULL UNIQUE,
  cidade VARCHAR(100),
  estado VARCHAR(50),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_escola INT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('aluno','professor','psicologo','admin') DEFAULT 'aluno',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_escola) REFERENCES escolas(id) ON DELETE SET NULL
);

-- Inserir uma escola de teste
INSERT INTO escolas (nome, codigo, cidade, estado)
VALUES ('Escola Central', 'ABC123', 'São Paulo', 'SP');

-- Inserir um usuário de teste (senha: 1234)
-- ⚠️ Obs: no backend ela é criptografada, então esse aqui é só pra teste direto via banco
INSERT INTO usuarios (id_escola, nome, email, senha, tipo)
VALUES (1, 'Admin', 'admin@teste.com', '$2b$10$G4yE59D1dnU9W9bgPfq7eOGC6ZtM27MLqO.0mKXLslMbhLDrTnD32', 'admin');

INSERT INTO usuarios (id_escola, nome, email, senha, tipo)
VALUES (1, 'Aluno Teste', 'aluno@teste.com', '$2b$10$Jd.8bIF6d3w.B2s7xi2O3OTbY9sFPcc9EcxLud4ZclC1v4U8TXxxa', 'aluno');


-- Consultar dados
SELECT * FROM usuarios;
SELECT * FROM escolas;

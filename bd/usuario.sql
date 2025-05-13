-- Cria o banco de dados caso ainda nao exista
CREATE DATABASE IF NOT EXISTS usuarios;

-- Seleciona o banco de dados para uso
USE usuarios;

-- Criaçao da tabela
CREATE TABLE IF NOT EXISTS cadastro (
    id iNT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
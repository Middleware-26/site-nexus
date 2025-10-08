-- arquivo: database/seed.sql
-- Inserir usuários de exemplo
INSERT INTO usuarios (nome, email, senha_hash, tipo, codigo_escola, turma, materia) VALUES
('Ana Carolina Silva', 'ana.silva@escola.com', '$2b$10$examplehash1', 'estudante', 'ESC001', '2º Ano - B', NULL),
('Pedro Henrique Oliveira', 'pedro.oliveira@escola.com', '$2b$10$examplehash2', 'estudante', 'ESC001', '3º Ano - A', NULL),
('Mariana Costa', 'mariana.costa@escola.com', '$2b$10$examplehash3', 'estudante', 'ESC001', '1º Ano - C', NULL),
('Professor João Santos', 'joao.santos@escola.com', '$2b$10$examplehash4', 'professor', 'ESC001', NULL, 'Matemática'),
('Dra. Carla Fernandes', 'carla.fernandes@escola.com', '$2b$10$examplehash5', 'psicologo', 'ESC001', NULL, NULL);

-- Inserir estados emocionais de exemplo
INSERT INTO estados_emocionais (usuario_id, emocao, descricao) VALUES
(1, 'neutral', 'Dia normal de estudos'),
(2, 'good', 'Me sentindo bem com as aulas'),
(3, 'bad', 'Estou com dificuldades para me concentrar');

-- Inserir agendamentos de exemplo
INSERT INTO agendamentos (aluno_id, psicologo_id, tipo_consulta, data_agendamento, horario, motivo) VALUES
(1, 5, 'psicologico', '2024-01-15', '14:30', 'Acompanhamento de rotina'),
(3, 5, 'avaliacao', '2024-01-16', '10:00', 'Dificuldade de concentração');

-- Inserir observações de exemplo
INSERT INTO observacoes_alunos (aluno_id, professor_id, observacao) VALUES
(1, 4, 'Aluna apresenta queda no rendimento nas últimas semanas'),
(3, 4, 'Demonstra dificuldade de concentração durante as aulas');
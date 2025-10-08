// Arquivo: servidor/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// ======================= ÁREA DE CONFIGURAÇÃO =======================
// 1. Insira o Token do seu bot que você pegou do BotFather.
const TELEGRAM_TOKEN = '8252299530:AAH2dGhw-7rlrksMLorYjX48-z9HCDECFiM';

// 2. Insira os Chat IDs dos seus grupos de teste.
const PSICOLOGO_CHAT_ID = '-4951949378'; // ID do grupo do Psicólogo
const PROFESSOR_CHAT_ID = '-4987808900'; // ID do grupo do Professor
// ====================================================================

// Mapeamento de papéis para os Chat IDs corretos
const userChatIds = {
    'psychologist': PSICOLOGO_CHAT_ID,
    'teacher': PROFESSOR_CHAT_ID
};

// Inicializa o bot e o servidor
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const app = express();
app.use(cors()); // Permite que a página HTML se comunique com este servidor
app.use(bodyParser.json()); // Permite que o servidor entenda os dados JSON enviados

// Rota para receber e enviar mensagens
app.post('/enviar-mensagem', (req, res) => {
    const { senderType, receiverType, text } = req.body;

    console.log(`[Servidor] Mensagem recebida de: ${senderType} | Para: ${receiverType} | Texto: "${text}"`);

    // Determina para qual Chat ID a mensagem deve ser enviada
    const targetChatId = userChatIds[receiverType];

    if (!targetChatId) {
        console.error(`[Servidor] Erro: Destinatário '${receiverType}' inválido.`);
        return res.status(400).send({ status: 'erro', message: 'Destinatário inválido.' });
    }

    // Formata a mensagem que será enviada para o Telegram
    const messageToSend = `Nova mensagem de ${senderType}:\n\n"${text}"`;

    // Envia a mensagem usando o bot
    bot.sendMessage(targetChatId, messageToSend)
        .then(() => {
            console.log(`[Servidor] Mensagem enviada com sucesso para o Telegram (Chat ID: ${targetChatId}).`);
            res.send({ status: 'ok', message: 'Mensagem enviada com sucesso!' });
        })
        .catch(error => {
            console.error('[Servidor] Erro ao enviar mensagem para o Telegram:', error.response.body.description);
            res.status(500).send({ status: 'erro', message: 'Falha ao contatar o Telegram.' });
        });
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`  🚀 Servidor Nexus Middleware iniciado!`);
    console.log(`  📡 Escutando na porta: ${PORT}`);
    console.log(`  🤖 Bot do Telegram conectado e pronto.`);
    console.log(`================================================`);
});

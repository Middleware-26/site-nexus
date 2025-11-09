// servidor/index.js - Versão Atualizada com Chat Bidirecional

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const socketIo = require('socket.io');

// ======================= CONFIGURAÇÃO =======================
// IMPORTANTE: Substitua pelos seus valores reais
const TELEGRAM_TOKEN = '8252299530:AAH2dGhw-7rlrksMLorYjX48-z9HCDECFiM';
const PSICOLOGO_CHAT_ID = '-4951949378';
const PROFESSOR_CHAT_ID = '-4987808900';
// ============================================================

// Mapeamento de usuários para Chat IDs
const userChatIds = {
    'psychologist': PSICOLOGO_CHAT_ID,
    'teacher': PROFESSOR_CHAT_ID
};

// Mapeamento reverso: Chat ID para tipo de usuário
const chatIdToUserType = {
    [PSICOLOGO_CHAT_ID]: 'psychologist',
    [PROFESSOR_CHAT_ID]: 'teacher'
};

// Inicializa o bot, servidor e WebSocket
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Em produção, especifique o domínio exato
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

// Armazena as conexões WebSocket ativas
let activeConnections = new Map();

// ======================= WEBSOCKET =======================
io.on('connection', (socket) => {
    console.log(`[WebSocket] Nova conexão: ${socket.id}`);

    // Quando um cliente se identifica (psicólogo ou professor)
    socket.on('identify', (userType) => {
        console.log(`[WebSocket] Cliente ${socket.id} se identificou como: ${userType}`);
        activeConnections.set(userType, socket);
        
        socket.on('disconnect', () => {
            console.log(`[WebSocket] Cliente ${userType} desconectado`);
            activeConnections.delete(userType);
        });
    });
});

// ======================= ROTAS HTTP =======================
app.post('/enviar-mensagem', (req, res) => {
    const { senderType, receiverType, text } = req.body;

    console.log(`[Servidor] Mensagem recebida de: ${senderType} | Para: ${receiverType} | Texto: "${text}"`);

    const targetChatId = userChatIds[receiverType];

    if (!targetChatId) {
        return res.status(400).send({ status: 'erro', message: 'Destinatário inválido.' });
    }

    // Formata a mensagem para o Telegram
    const messageToSend = `💬 Nova mensagem de ${senderType === 'psychologist' ? 'Psicólogo' : 'Professor'}:\n\n"${text}"`;

    bot.sendMessage(targetChatId, messageToSend)
        .then(() => {
            console.log(`[Servidor] Mensagem enviada para o Telegram (Chat ID: ${targetChatId}).`);
            res.send({ status: 'ok', message: 'Mensagem enviada com sucesso!' });
        })
        .catch(error => {
            console.error('[Servidor] Erro ao enviar mensagem para o Telegram:', error.response?.body?.description || error.message);
            res.status(500).send({ status: 'erro', message: 'Falha ao contatar o Telegram.' });
        });
});

// ======================= ESCUTANDO MENSAGENS DO TELEGRAM =======================
bot.on('message', (msg) => {
    const chatId = msg.chat.id.toString();
    const text = msg.text;
    const senderName = msg.from.first_name || 'Usuário';

    // Ignora mensagens do próprio bot
    if (msg.from.is_bot) return;

    console.log(`[Telegram] Mensagem recebida do Chat ID: ${chatId} | Remetente: ${senderName} | Texto: "${text}"`);

    // Identifica de qual usuário veio a mensagem
    const senderType = chatIdToUserType[chatId];
    
    if (!senderType) {
        console.log(`[Telegram] Mensagem ignorada: Chat ID ${chatId} não reconhecido.`);
        return;
    }

    // Determina quem deve receber a mensagem no site
    const receiverType = senderType === 'psychologist' ? 'teacher' : 'psychologist';
    
    // Verifica se há uma conexão WebSocket ativa para o destinatário
    const receiverSocket = activeConnections.get(receiverType);
    
    if (receiverSocket) {
        // Envia a mensagem em tempo real para o site
        const messageData = {
            text: text,
            senderName: senderName,
            senderType: senderType,
            timestamp: new Date().toISOString()
        };
        
        receiverSocket.emit('nova-mensagem', messageData);
        console.log(`[WebSocket] Mensagem encaminhada para ${receiverType} via WebSocket.`);
    } else {
        console.log(`[WebSocket] Nenhuma conexão ativa encontrada para ${receiverType}.`);
    }
});

// ======================= INICIALIZAÇÃO =======================
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`  🚀 Servidor Nexus Middleware iniciado!`);
    console.log(`  📡 Escutando na porta: ${PORT}`);
    console.log(`  🤖 Bot do Telegram conectado e pronto.`);
    console.log(`  🔌 WebSocket habilitado para chat em tempo real.`);
    console.log(`================================================`);
});

// Tratamento de erros do bot
bot.on('error', (error) => {
    console.error('[Bot] Erro:', error);
});

bot.on('polling_error', (error) => {
    console.error('[Bot] Erro de polling:', error);
});

// api/index.js - Versão Serverless para Vercel (sem WebSocket/polling)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// Configuração do Bot do Telegram
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8252299530:AAH2dGhw-7rlrksMLorYjX48-z9HCDECFiM';
const PSICOLOGO_CHAT_ID = process.env.PSICOLOGO_CHAT_ID || '-4951949378';
const PROFESSOR_CHAT_ID = process.env.PROFESSOR_CHAT_ID || '-4987808900';

// Mapeamento de usuários para Chat IDs
const userChatIds = {
    'psychologist': PSICOLOGO_CHAT_ID,
    'teacher': PROFESSOR_CHAT_ID
};

// Inicializa o bot (SEM polling para Vercel)
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"]
}));
app.use(bodyParser.json());

// Rota de health check
app.get('/api', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'API Nexus funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota para enviar mensagem ao Telegram
app.post('/api/enviar-mensagem', async (req, res) => {
    try {
        const { senderType, receiverType, text } = req.body;

        console.log(`[API] Mensagem recebida de: ${senderType} | Para: ${receiverType} | Texto: "${text}"`);

        if (!text || !senderType || !receiverType) {
            return res.status(400).json({ 
                status: 'erro', 
                message: 'Campos obrigatórios faltando: senderType, receiverType, text' 
            });
        }

        const targetChatId = userChatIds[receiverType];

        if (!targetChatId) {
            return res.status(400).json({ 
                status: 'erro', 
                message: 'Destinatário inválido.' 
            });
        }

        // Formata a mensagem para o Telegram
        const messageToSend = `💬 Nova mensagem de ${senderType === 'psychologist' ? 'Psicólogo' : 'Professor'}:\n\n"${text}"`;

        await bot.sendMessage(targetChatId, messageToSend);
        
        console.log(`[API] Mensagem enviada para o Telegram (Chat ID: ${targetChatId}).`);
        
        res.json({ 
            status: 'ok', 
            message: 'Mensagem enviada com sucesso!' 
        });
    } catch (error) {
        console.error('[API] Erro ao enviar mensagem:', error.message);
        res.status(500).json({ 
            status: 'erro', 
            message: 'Falha ao contatar o Telegram.',
            error: error.message 
        });
    }
});

// Webhook do Telegram (opcional - para receber mensagens)
app.post('/api/webhook', async (req, res) => {
    try {
        const update = req.body;
        
        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id.toString();
            const text = msg.text;
            const senderName = msg.from.first_name || 'Usuário';

            console.log(`[Webhook] Mensagem recebida do Chat ID: ${chatId} | Remetente: ${senderName} | Texto: "${text}"`);
            
            // Aqui você pode implementar lógica adicional se necessário
            // Por enquanto, apenas confirmamos o recebimento
        }
        
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('[Webhook] Erro:', error.message);
        res.status(500).json({ status: 'erro', message: error.message });
    }
});

// Exporta o app para o Vercel
module.exports = app;

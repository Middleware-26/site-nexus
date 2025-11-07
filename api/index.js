// api/index.js - Versão Serverless para Vercel
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

// Handler principal para requisições
module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Tratar OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // GET / - Health check
    if (req.method === 'GET') {
        res.status(200).json({ 
            status: 'ok', 
            message: 'API Nexus funcionando!',
            timestamp: new Date().toISOString()
        });
        return;
    }

    // POST - Processar requisições
    if (req.method === 'POST') {
        try {
            const { senderType, receiverType, text } = req.body;

            console.log(`[API] Mensagem recebida de: ${senderType} | Para: ${receiverType} | Texto: "${text}"`);

            if (!text || !senderType || !receiverType) {
                res.status(400).json({ 
                    status: 'erro', 
                    message: 'Campos obrigatórios faltando: senderType, receiverType, text' 
                });
                return;
            }

            const targetChatId = userChatIds[receiverType];

            if (!targetChatId) {
                res.status(400).json({ 
                    status: 'erro', 
                    message: 'Destinatário inválido.' 
                });
                return;
            }

            // Formata a mensagem para o Telegram
            const messageToSend = `💬 Nova mensagem de ${senderType === 'psychologist' ? 'Psicólogo' : 'Professor'}:\n\n"${text}"`;

            await bot.sendMessage(targetChatId, messageToSend);
            
            console.log(`[API] Mensagem enviada para o Telegram (Chat ID: ${targetChatId}).`);
            
            res.status(200).json({ 
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
        return;
    }

    // Método não permitido
    res.status(405).json({ status: 'erro', message: 'Método não permitido' });
};

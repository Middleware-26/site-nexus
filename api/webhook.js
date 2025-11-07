// api/webhook.js - Webhook do Telegram
const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8252299530:AAH2dGhw-7rlrksMLorYjX48-z9HCDECFiM';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ status: 'erro', message: 'Método não permitido' });
        return;
    }

    try {
        const update = req.body;
        
        if (update.message) {
            const msg = update.message;
            const chatId = msg.chat.id.toString();
            const text = msg.text;
            const senderName = msg.from.first_name || 'Usuário';

            console.log(`[Webhook] Mensagem recebida do Chat ID: ${chatId} | Remetente: ${senderName} | Texto: "${text}"`);
            
            // Aqui você pode implementar lógica adicional se necessário
        }
        
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('[Webhook] Erro:', error.message);
        res.status(500).json({ status: 'erro', message: error.message });
    }
};

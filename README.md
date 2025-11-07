# 🚀 CitySync Nexus - Sistema de Comunicação

Sistema de comunicação integrada entre psicólogos e professores utilizando Telegram Bot e interface web.

## 📋 Sobre o Projeto

O Nexus é uma plataforma que facilita a comunicação entre profissionais da educação e saúde mental, permitindo que professores e psicólogos troquem mensagens através de uma interface web moderna que se integra com grupos do Telegram.

## ⚠️ Limitações do Vercel

O Vercel é uma plataforma serverless otimizada para Node.js e frontend estático. **Os seguintes componentes NÃO funcionarão no Vercel:**

### ❌ Não Suportado:
- **PHP**: Arquivos em `conexao/` (conexao.php, login.php)
- **MySQL/Banco de Dados**: Scripts SQL em `bd/`
- **WebSocket Persistente**: Socket.io com conexões persistentes
- **Telegram Bot Polling**: O modo `polling: true` não funciona em serverless

### ✅ Alternativas Implementadas:
- **API Serverless**: Substituída em `api/index.js` (sem polling)
- **Webhook do Telegram**: Endpoint `/api/webhook` para receber mensagens
- **Frontend Estático**: HTML, CSS, JS servidos normalmente

## 🔧 Configuração para Deploy no Vercel

### 1. Instalar Vercel CLI (Opcional)

```bash
npm install -g vercel
```

### 2. Configurar Variáveis de Ambiente

No painel do Vercel ou usando CLI, configure:

```env
TELEGRAM_TOKEN=seu_token_do_bot
PSICOLOGO_CHAT_ID=id_do_chat_psicologo
PROFESSOR_CHAT_ID=id_do_chat_professor
```

### 3. Deploy

**Opção A - Via Dashboard Vercel:**
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Clique em "Deploy"

**Opção B - Via CLI:**
```bash
vercel
```

### 4. Configurar Webhook do Telegram (Após Deploy)

Execute este comando substituindo `<SEU_BOT_TOKEN>` e `<SUA_URL_VERCEL>`:

```bash
curl -X POST "https://api.telegram.org/bot<SEU_BOT_TOKEN>/setWebhook?url=https://<SUA_URL_VERCEL>/api/webhook"
```

Exemplo:
```bash
curl -X POST "https://api.telegram.org/bot123456:ABC-DEF/setWebhook?url=https://meu-app.vercel.app/api/webhook"
```

## 📁 Estrutura do Projeto

```
site-nexus/
├── api/                    # Funções serverless (Vercel)
│   └── index.js           # API principal (substitui servidor/index.js)
├── tela_inicial/          # Página inicial
├── tela_login/            # Sistema de login (necessita backend alternativo)
├── tela_principal/        # Dashboard principal
├── logo/                  # Assets e imagens
├── conexao/              # ❌ PHP (não funciona no Vercel)
├── bd/                   # ❌ SQL (não funciona no Vercel)
├── servidor/             # ❌ Servidor local (não usado no Vercel)
├── vercel.json           # Configuração do Vercel
├── .vercelignore         # Arquivos ignorados no deploy
└── package.json          # Dependências do projeto
```

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express
- **API**: Serverless Functions (Vercel)
- **Integração**: Telegram Bot API
- **Deploy**: Vercel

## 🔐 Sistema de Login/Autenticação

⚠️ **IMPORTANTE**: O sistema de login atual usa PHP + MySQL, que não é suportado pelo Vercel.

### Soluções Alternativas:

1. **Supabase** (Recomendado)
   - Backend as a Service gratuito
   - PostgreSQL integrado
   - Autenticação pronta
   - [supabase.com](https://supabase.com)

2. **Firebase Authentication**
   - Google, Email/Password, etc.
   - Gratuito até certo limite
   - [firebase.google.com](https://firebase.google.com)

3. **NextAuth.js**
   - Autenticação para Next.js/React
   - Suporta múltiplos providers
   - [next-auth.js.org](https://next-auth.js.org)

4. **Vercel Postgres + Next.js API Routes**
   - Banco PostgreSQL gerenciado
   - Requer conversão do código

## 📡 Endpoints da API

### `GET /api`
Health check da API
```json
{
  "status": "ok",
  "message": "API Nexus funcionando!",
  "timestamp": "2024-11-07T..."
}
```

### `POST /api/enviar-mensagem`
Envia mensagem para o Telegram

**Body:**
```json
{
  "senderType": "psychologist",
  "receiverType": "teacher",
  "text": "Mensagem aqui"
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Mensagem enviada com sucesso!"
}
```

### `POST /api/webhook`
Webhook para receber mensagens do Telegram (configurado automaticamente)

## 🐛 Problemas Conhecidos e Soluções

### 1. WebSocket não funciona
**Problema**: Socket.io requer conexão persistente
**Solução**: Usar webhook do Telegram + polling no frontend ou migrar para Pusher/Ably

### 2. Sistema de login não funciona
**Problema**: PHP não é suportado
**Solução**: Migrar para uma das alternativas listadas acima

### 3. Bot não recebe mensagens do Telegram
**Problema**: Webhook não configurado
**Solução**: Executar o comando `setWebhook` mencionado acima

### 4. Erro 404 nas rotas
**Problema**: Configuração de rotas no vercel.json
**Solução**: Verificar se o `vercel.json` está na raiz do projeto

## 🚀 Desenvolvimento Local

Para testar localmente antes do deploy:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor rodará em `http://localhost:3000`

## 📝 Checklist de Deploy

- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Verificar se `vercel.json` está correto
- [ ] Fazer commit e push do código
- [ ] Deploy via Vercel Dashboard ou CLI
- [ ] Configurar webhook do Telegram com a URL do deploy
- [ ] Testar envio de mensagens
- [ ] Configurar alternativa para autenticação (se necessário)

## 🔗 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

## 📞 Suporte

Para problemas técnicos ou dúvidas, consulte:
- Issues do GitHub
- Documentação do Vercel
- Telegram Bot API Documentation

---

**Desenvolvido por**: Middleware-26  
**Repositório**: [CitySync/site-nexus](https://github.com/Middleware-26/site-nexus)

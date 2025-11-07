# 🚀 GUIA RÁPIDO DE DEPLOY NO VERCEL

## 📝 Passo a Passo Completo

### 1️⃣ Preparação do Código

**Todos os arquivos necessários já foram criados:**
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `api/index.js` - API serverless
- ✅ `package.json` - Dependências e scripts
- ✅ `.vercelignore` - Arquivos ignorados
- ✅ `.gitignore` - Proteção de dados sensíveis
- ✅ `.env.example` - Template de variáveis

**Agora você precisa:**

```powershell
# Fazer commit das alterações
git add .
git commit -m "Configuração para deploy no Vercel"
git push origin main
```

### 2️⃣ Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Conecte com GitHub
4. Autorize o Vercel a acessar seus repositórios

### 3️⃣ Importar Projeto

1. No dashboard do Vercel, clique em **"Add New Project"**
2. Selecione o repositório: **`Middleware-26/site-nexus`**
3. Clique em **"Import"**

### 4️⃣ Configurar Variáveis de Ambiente

**IMPORTANTE**: Configure estas variáveis antes do deploy!

Na página de configuração do projeto, vá até **"Environment Variables"** e adicione:

| Nome | Valor | Onde Obter |
|------|-------|------------|
| `TELEGRAM_TOKEN` | Token do seu bot | [@BotFather](https://t.me/BotFather) no Telegram |
| `PSICOLOGO_CHAT_ID` | ID do chat do psicólogo | Veja instruções abaixo |
| `PROFESSOR_CHAT_ID` | ID do chat do professor | Veja instruções abaixo |

#### 🔍 Como Obter o TELEGRAM_TOKEN:

1. Abra o Telegram
2. Procure por **@BotFather**
3. Envie `/newbot`
4. Siga as instruções
5. Copie o token fornecido (formato: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

#### 🔍 Como Obter os Chat IDs:

**Opção A - Usando um grupo:**
1. Crie um grupo no Telegram
2. Adicione seu bot ao grupo
3. Envie uma mensagem no grupo
4. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
5. Procure por `"chat":{"id":-123456789}` no JSON
6. Copie o número (incluindo o sinal de menos)

**Opção B - Chat privado:**
1. Inicie uma conversa com seu bot
2. Envie qualquer mensagem
3. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
4. Procure por `"chat":{"id":123456789}` no JSON
5. Copie o número

### 5️⃣ Deploy

1. Após configurar as variáveis, clique em **"Deploy"**
2. Aguarde o build completar (1-3 minutos)
3. Você receberá uma URL (ex: `https://seu-projeto.vercel.app`)

### 6️⃣ Configurar Webhook do Telegram

**CRUCIAL**: Sem esta etapa, o bot não receberá mensagens!

Abra o PowerShell e execute (substituindo os valores):

```powershell
curl -X POST "https://api.telegram.org/bot<SEU_TOKEN>/setWebhook?url=https://<SUA_URL_VERCEL>/api/webhook"
```

**Exemplo:**
```powershell
curl -X POST "https://api.telegram.org/bot123456:ABC-DEF/setWebhook?url=https://nexus-app.vercel.app/api/webhook"
```

**Verificar se funcionou:**
```powershell
curl "https://api.telegram.org/bot<SEU_TOKEN>/getWebhookInfo"
```

Você deve ver:
```json
{
  "ok": true,
  "result": {
    "url": "https://sua-url.vercel.app/api/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

### 7️⃣ Testar a Aplicação

#### Teste 1: API Health Check
```powershell
curl https://sua-url.vercel.app/api
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "API Nexus funcionando!",
  "timestamp": "..."
}
```

#### Teste 2: Enviar Mensagem
1. Acesse: `https://sua-url.vercel.app`
2. Navegue até a área de chat
3. Selecione um contato
4. Envie uma mensagem
5. Verifique se chegou no grupo do Telegram

#### Teste 3: Receber Mensagem do Telegram
1. Envie uma mensagem no grupo do Telegram
2. A mensagem deve aparecer no site (se o WebSocket estiver funcionando)
3. **Nota**: WebSocket pode não funcionar - veja alternativas no README

## ⚠️ Problemas Comuns

### Problema 1: Deploy Falha com Erro de Build
**Solução**: Verifique se todas as dependências estão no `package.json`

### Problema 2: Erro 404 ao Acessar /api
**Solução**: Verifique se o `vercel.json` está na raiz do projeto

### Problema 3: Bot não Envia Mensagens
**Possíveis causas:**
- Token inválido
- Chat ID incorreto
- Variáveis de ambiente não configuradas

**Solução:**
1. Verifique as variáveis no painel do Vercel
2. Teste o token: `curl "https://api.telegram.org/bot<TOKEN>/getMe"`

### Problema 4: Bot não Recebe Mensagens
**Possíveis causas:**
- Webhook não configurado
- URL do webhook incorreta

**Solução:**
1. Execute o comando `setWebhook` novamente
2. Verifique com `getWebhookInfo`

### Problema 5: Sistema de Login não Funciona
**Causa**: PHP não é suportado no Vercel

**Solução**: Implementar alternativa
- **Recomendado**: Supabase (https://supabase.com)
  1. Crie conta gratuita
  2. Crie projeto
  3. Use Supabase Auth
  4. Configure tabelas de usuários
  5. Substitua as chamadas PHP por Supabase JS

## 📊 Monitoramento

### Ver Logs no Vercel:
1. Acesse o dashboard do projeto
2. Clique em "Deployments"
3. Clique no deployment ativo
4. Vá em "Functions"
5. Selecione a função `api/index.js`
6. Veja os logs em tempo real

### Logs Úteis:
```
[API] Mensagem recebida de: psychologist | Para: teacher | Texto: "..."
[API] Mensagem enviada para o Telegram (Chat ID: ...)
[Webhook] Mensagem recebida do Chat ID: ...
```

## 🔄 Atualizações Futuras

Para atualizar o site após mudanças:

```powershell
# 1. Faça suas alterações
# 2. Commit e push
git add .
git commit -m "Descrição das alterações"
git push origin main

# 3. Vercel fará deploy automaticamente!
```

## 🎯 Checklist Final

Antes de considerar concluído:

- [ ] ✅ Código commitado e pushed
- [ ] ✅ Projeto importado no Vercel
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Deploy realizado com sucesso
- [ ] ✅ Webhook do Telegram configurado
- [ ] ✅ Webhook verificado com getWebhookInfo
- [ ] ✅ API health check funcionando
- [ ] ✅ Envio de mensagens testado
- [ ] ✅ Recebimento de mensagens testado
- [ ] ⚠️ Sistema de login alternativo implementado (pendente)
- [ ] ⚠️ WebSocket substituído ou alternativa implementada (pendente)

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## 🆘 Precisa de Ajuda?

1. **Logs do Vercel**: Primeiro lugar para verificar erros
2. **getWebhookInfo**: Verifica status do bot
3. **Health Check**: Testa se a API está respondendo
4. **README.md**: Documentação completa do projeto

---

**Boa sorte com o deploy! 🚀**

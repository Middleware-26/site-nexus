// IIFE para aplicar o tema sem flash de tela branca
(function(){
  // Verifica tema salvo no localStorage
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  
  // Aplica classes de tema no documento
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);
  
  // Torna o documento visível após aplicação do tema
  document.documentElement.style.visibility = 'visible';
})();

// =========================================================================
// SISTEMA DE CHAT COM REDIRECIONAMENTO PARA TELEGRAM
// =========================================================================
class ChatSystem {
    constructor() {
        console.log('[ChatSystem] Iniciando...');
        this.chatSection = document.querySelector('#conversar');
        if (!this.chatSection) {
            console.warn('[ChatSystem] Seção de chat não encontrada. O sistema de chat não será iniciado.');
            return;
        }

        this.currentChatId = null;
        this.currentContact = null;
        this.firstMessageSent = false;
        this.detectUserType();
        this.setupEventListeners();
    }

    detectUserType() {
        const pageTitle = document.title || '';
        if (pageTitle.toLowerCase().includes('psicólogo')) {
            this.userType = 'psychologist';
            this.userName = 'Dr. Usuário';
        } else if (pageTitle.toLowerCase().includes('professor')) {
            this.userType = 'teacher';
            this.userName = 'Pr. Usuário';
        } else {
            this.userType = 'unknown';
            this.userName = 'Usuário';
        }
        console.log(`[ChatSystem] Usuário detectado como: ${this.userType}`);
    }

    setupEventListeners() {
        const contactItems = this.chatSection.querySelectorAll('.contact-item');
        const messageInput = this.chatSection.querySelector('input[placeholder*="Digite sua mensagem"]');

        // Encontra o botão de enviar
        let sendButton = null;
        const allButtons = this.chatSection.querySelectorAll('button');
        allButtons.forEach(button => {
            const icon = button.querySelector('.material-symbols-outlined');
            if (icon && icon.textContent.trim() === 'send') {
                sendButton = button;
            }
        });

        if (contactItems.length > 0) {
            contactItems.forEach(contact => {
                contact.addEventListener('click', () => this.startChatWithContact(contact));
            });
        }

        if (sendButton && messageInput) {
            console.log('[ChatSystem] Botão de enviar e input de mensagem encontrados com sucesso.');
            sendButton.addEventListener('click', () => this.sendMessage(messageInput.value));
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendMessage(messageInput.value);
                }
            });
        } else {
            console.error('[ChatSystem] Não foi possível encontrar o input de mensagem ou o botão de enviar.');
        }
    }

    startChatWithContact(contactElement) {
        const contactName = contactElement.querySelector('h3').textContent.trim();
        const contactRole = contactName.toLowerCase().startsWith('dr.') ? 'psychologist' : 'teacher';

        this.currentContact = {
            name: contactName,
            role: contactRole
        };
        this.currentChatId = `${this.userType}_${contactRole}`;

        const chatHeaderName = this.chatSection.querySelector('.chat-header h3');
        if (chatHeaderName) chatHeaderName.textContent = contactName;

        console.log(`[ChatSystem] Chat iniciado com: ${contactName} (ID da conversa: ${this.currentChatId})`);
        
        // Limpa mensagens antigas ao trocar de conversa
        const chatContainer = this.chatSection.querySelector('.chat-messages');
        if(chatContainer) chatContainer.innerHTML = '';
        
        // Reset do estado da primeira mensagem
        this.firstMessageSent = false;
    }

    async sendMessage(messageText) {
        if (!this.currentContact) {
            alert('Por favor, selecione um contato para iniciar a conversa.');
            return;
        }
        const text = messageText.trim();
        if (!text) return;

        console.log(`[Frontend] Enviando mensagem: "${text}"`);

        const message = {
            text: text,
            senderName: this.userName,
            senderType: this.userType,
            receiverType: this.currentContact.role,
            timestamp: new Date()
        };

        // Adiciona a mensagem na tela imediatamente
        this.addMessageToChat(message, true);
        this.clearMessageInput();

        // Detecta a URL da API baseado no ambiente
        const apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/enviar-mensagem'
            : '/api/enviar-mensagem';

        // Envia para o servidor
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderType: message.senderType,
                    receiverType: message.receiverType,
                    text: message.text
                }),
            });

            if (response.ok) {
                console.log('[Frontend] Servidor confirmou o envio da mensagem.');
                
                // **FUNCIONALIDADE: Mostra o banner de redirecionamento após primeira mensagem**
                if (!this.firstMessageSent) {
                    this.firstMessageSent = true;
                    setTimeout(() => {
                        this.showTelegramRedirectBanner();
                    }, 1000); // Aguarda 1 segundo para dar tempo da mensagem aparecer
                }
            } else {
                const errorResult = await response.json();
                console.error('[Frontend] Erro retornado pelo servidor:', errorResult.message);
                this.showErrorMessage('Falha ao enviar mensagem. Tente novamente.');
            }
        } catch (error) {
            console.error('[Frontend] Falha de conexão com o servidor:', error);
            this.showErrorMessage('Sem conexão com o servidor. Verifique sua internet.');
        }
    }

    showTelegramRedirectBanner() {
        const chatContainer = this.chatSection.querySelector('.chat-messages');
        if (!chatContainer) return;

        // Remove banner anterior se existir
        const existingBanner = chatContainer.querySelector('.telegram-redirect-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        // Determina o link do grupo baseado no tipo de usuário
        const groupLink = this.getGroupLink();

        // Cria o banner de redirecionamento (SEM o botão "Continuar aqui")
        const bannerDiv = document.createElement('div');
        bannerDiv.className = 'telegram-redirect-banner w-full my-4';
        
        bannerDiv.innerHTML = `
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg border-l-4 border-blue-300">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.655-.377 2.655-1.377 2.655-.896 0-1.377-.896-1.377-2.655 0 0-.896-4.87-.896-6.728 0-1.858.481-2.655 1.377-2.655s1.377.797 1.377 2.655z"/>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold mb-2">
                            🚀 Continue a conversa no Telegram!
                        </h3>
                        <p class="text-sm text-blue-100 mb-3">
                            Sua mensagem foi enviada com sucesso! Para uma experiência de chat mais fluida e receber notificações em tempo real, continue a conversa diretamente no Telegram.
                        </p>
                        <div class="flex justify-center">
                            <a href="${groupLink}" 
                               target="_blank" 
                               class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 text-sm shadow-md">
                                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.655-.377 2.655-1.377 2.655-.896 0-1.377-.896-1.377-2.655 0 0-.896-4.87-.896-6.728 0-1.858.481-2.655 1.377-2.655s1.377.797 1.377 2.655z"/>
                                </svg>
                                Abrir no Telegram
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mt-3 text-xs text-blue-200">
                    💡 <strong>Dica:</strong> No Telegram você receberá notificações instantâneas e poderá usar recursos como áudio, fotos e documentos.
                </div>
            </div>
        `;

        chatContainer.appendChild(bannerDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Adiciona animação de entrada
        bannerDiv.style.opacity = '0';
        bannerDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            bannerDiv.style.transition = 'all 0.5s ease';
            bannerDiv.style.opacity = '1';
            bannerDiv.style.transform = 'translateY(0)';
        }, 100);

        console.log('[ChatSystem] Banner de redirecionamento para Telegram exibido.');
    }

    getGroupLink() {
        if (this.userType === 'psychologist') {
            return 'https://web.telegram.org/a/#-4987808900'; // Link do grupo do professor
        } else {
            return 'https://web.telegram.org/a/#-4987808900'; // Link do grupo do psicólogo
        }
    }

    addMessageToChat(message, isSender) {
        const chatContainer = this.chatSection.querySelector('.chat-messages');
        if (!chatContainer) return;

        const messageDiv = document.createElement('div');
        const time = new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const messageClass = isSender ? 'eu' : 'ele';
        messageDiv.className = `${messageClass} max-w-[80%] mb-3`;

        const senderLabel = isSender ? 'Você' : (message.senderName || 'Contato');
        
        messageDiv.innerHTML = `
            <div class="p-3 rounded-lg ${isSender ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}">
                <p class="text-sm">${message.text}</p>
                <p class="text-xs opacity-75 mt-1">${senderLabel} - ${time}</p>
            </div>
        `;

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    clearMessageInput() {
        const messageInput = this.chatSection.querySelector('input[placeholder*="Digite sua mensagem"]');
        if (messageInput) {
            messageInput.value = '';
            messageInput.focus();
        }
    }

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// 
// SELEÇÃO DE ELEMENTOS
// 
const sidebar      = document.getElementById('sidebar');
const mainContent  = document.getElementById('mainContent');
const mainHdr      = document.getElementById('main-header');
const sbHdr        = document.getElementById('sidebar-header');
const nameTag      = document.getElementById('userName');
const preview      = document.getElementById('avatarPreview');
const themeToggle  = document.getElementById('themeToggle');
const themeLabel   = document.getElementById('themeLabel');
const notifButton  = document.getElementById('notifButton');
const notifList    = document.getElementById('notifList');

// 
// FUNÇÕES DE MENU LATERAL
// 
function abrirMenu() {
  // Alterna classes para mostrar/esconder sidebar
  sidebar.classList.toggle('-translate-x-full');
  sidebar.classList.toggle('opacity-0');
  sidebar.classList.toggle('translate-x-0');
  sidebar.classList.toggle('opacity-100');
  
  // Ajusta margem do conteúdo principal
  const hidden = sidebar.classList.contains('-translate-x-full');
  if (mainContent) {
    mainContent.classList.toggle('ml-64', !hidden);
    mainContent.classList.toggle('ml-0', hidden);
  }
}

function fecharMenu() {
  // Fecha menu usando a função abrirMenu para consistência
  if (!sidebar.classList.contains('-translate-x-full')) {
    abrirMenu();
  }
}

function syncSidebarHeaderHeight() {
  // Sincroniza altura do cabeçalho da sidebar com o principal
  if (!mainHdr || !sbHdr) return;
  sbHdr.style.height = mainHdr.getBoundingClientRect().height + 'px';
}

// 
// FUNÇÕES DE TEMA
// 
function toggleTheme() {
  // Alterna entre temas claro/escuro
  const isDark = document.documentElement.classList.toggle('dark');
  
  // Salva preferência no localStorage
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Atualiza rótulo do tema
  if (themeLabel) themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

function loadTheme() {
  // Carrega tema salvo ou usa 'light' como padrão
  const savedTheme = localStorage.getItem('theme') || 'light';
  const isDark = savedTheme === 'dark';
  
  // Aplica tema
  document.documentElement.classList.toggle('dark', isDark);
  
  // Atualiza toggle e rótulo
  if (themeToggle) themeToggle.checked = isDark;
  if (themeLabel) themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

// 
// CONFIGURAÇÃO GERAL
// 
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o sistema de chat
  new ChatSystem();

  // Configurações iniciais
  loadTheme();
  syncSidebarHeaderHeight();

  // Carrega dados do usuário
  const savedName   = localStorage.getItem('nomeUsuario');
  const savedAvatar = localStorage.getItem('avatarUsuario');
  if (savedName && nameTag)   nameTag.textContent = savedName;
  if (savedAvatar && preview) preview.src = savedAvatar;

  // 
  // LÓGICA DE SELEÇÃO DE CARDS (EMOÇÕES)
  // 
  const cards = document.querySelectorAll('.card');
  let activeCard = null;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove destaque do card anterior
      if (activeCard) {
        const prevRings = activeCard.dataset.ring.split(' ');
        activeCard.classList.remove('ring-2', ...prevRings);
      }
      
      // Aplica destaque ao card atual
      const rings = card.dataset.ring.split(' ');
      card.classList.add('ring-2', ...rings);
      activeCard = card;
    });
  });

  // 
  // LÓGICA DE SELEÇÃO DE EMOÇÕES
  // 
  let selectedEmotion = null;

  function selectEmotion(element) {
    // Remove seleção de todos os cards
    document.querySelectorAll('.emotion-card').forEach(card => {
      card.classList.remove('selected');
      card.classList.remove(
        'border-emotion-worst',
        'border-emotion-bad',
        'border-emotion-neutral',
        'border-emotion-good',
        'border-emotion-great'
      );
    });

    // Adiciona seleção no card clicado
    element.classList.add('selected');
    const emotion = element.getAttribute('data-emotion');
    element.classList.add(`border-emotion-${emotion}`);
    selectedEmotion = emotion;

    // Habilita botão de envio
    const btnSubmit = document.getElementById('submitEmotion');
    if (btnSubmit) btnSubmit.disabled = false;
  }

  // Adiciona eventos aos cards de emoção
  document.querySelectorAll('.emotion-card').forEach(card => {
    card.addEventListener('click', () => selectEmotion(card));
  });

  // Configura botão de envio de emoção
  const btnSubmitEmotion = document.getElementById('submitEmotion');
  if (btnSubmitEmotion) {
    btnSubmitEmotion.addEventListener('click', () => {
      const details = document.getElementById('emotionDetails').value;

      // Simulação de envio (substituir por API real)
      console.log('Emotion submitted:', { emotion: selectedEmotion, details });

      // Feedback ao usuário
      alert('Obrigado por compartilhar como você está se sentindo! Se precisar de ajuda, estamos aqui para você.');

      // Reseta formulário
      document.querySelectorAll('.emotion-card').forEach(card => {
        card.classList.remove('selected');
        card.classList.remove(
          'border-emotion-worst',
          'border-emotion-bad',
          'border-emotion-neutral',
          'border-emotion-good',
          'border-emotion-great'
        );
      });
      document.getElementById('emotionDetails').value = '';
      btnSubmitEmotion.disabled = true;
      selectedEmotion = null;
    });
  }

  // ======================
  // NOTIFICAÇÕES
  // ======================
  if (notifButton && notifList) {
    notifList.classList.add('hidden');

    function toggleNotifs() {
      notifList.classList.toggle('hidden');
    }

    function handleClickOutside(e) {
      const notifContainer = notifButton.parentElement;
      if (!notifContainer.contains(e.target)) notifList.classList.add('hidden');
    }

    notifButton.addEventListener('click', toggleNotifs);
    document.addEventListener('click', handleClickOutside);

    const notifContainer = notifButton.parentElement;
    notifContainer.addEventListener('mouseenter', () => notifList.classList.remove('hidden'));
    notifContainer.addEventListener('mouseleave', () => notifList.classList.add('hidden'));
  }

  // ======================
  // MODAL DE AGENDAMENTO
  // ======================
  const modal = document.getElementById('agendamentoModal');
  const openModalBtn = document.getElementById('addScheduleBtn');
  const openFirstBtn = document.getElementById('addFirstScheduleBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelarBtn');

  function resetTipoConsulta() {
    const cardsTipo = document.querySelectorAll('.card-tipo-agendamento');
    cardsTipo.forEach(c => c.classList.remove(
      'ring-2','ring-primary-600','bg-primary-600','bg-opacity-20',
      'dark:bg-primary-400','dark:bg-opacity-50'
    ));
    selectedTipo = null;
  }

  function resetAlunoFiltro() {
    const filterSeries = document.getElementById('filterSeries');
    const filterTurma = document.getElementById('filterTurma');
    const searchStudent = document.getElementById('searchStudent');
    if (filterSeries) filterSeries.value = '';
    if (filterTurma) filterTurma.value = '';
    if (searchStudent) searchStudent.value = '';
    resetAlunoSelecao();
    filterAlunos();
  }

  function fecharModal() {
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
      resetTipoConsulta();
      resetAlunoFiltro();
    }
  }

  [openModalBtn, openFirstBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        resetCalendar();
      }
    });
  });

  [closeModalBtn, cancelModalBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', fecharModal);
  });

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) fecharModal();
    });
  }

  // ======================
  // ABA DE AGENDAMENTOS
  // ======================
  const tabAgendados = document.getElementById('tab-agendados');
  const tabPassados = document.getElementById('tab-passados');
  const emptyAgendados = document.getElementById('empty-agendados');
  const emptyPassados = document.getElementById('empty-passados');
  const scheduleCards = document.getElementById('schedule-cards');

  const agendados = [];
  const passados = [];

  function updateView() {
    if (tabAgendados && tabPassados) {
      if (tabAgendados.classList.contains('active')) {
        tabAgendados.classList.replace('text-gray-500','text-primary-600');
        tabAgendados.classList.replace('dark:text-gray-400','dark:text-primary-400');
        tabAgendados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');

        tabPassados.classList.replace('text-primary-600','text-gray-500');
        tabPassados.classList.replace('dark:text-primary-400','dark:text-gray-400');
        tabPassados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

        if (emptyAgendados) emptyAgendados.classList.toggle('hidden', agendados.length !== 0);
        if (scheduleCards) scheduleCards.classList.toggle('hidden', agendados.length === 0);
        if (emptyPassados) emptyPassados.classList.add('hidden');
      } else {
        tabPassados.classList.replace('text-gray-500','text-primary-600');
        tabPassados.classList.replace('dark:text-gray-400','dark:text-primary-400');
        tabPassados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');

        tabAgendados.classList.replace('text-primary-600','text-gray-500');
        tabAgendados.classList.replace('dark:text-primary-400','dark:text-gray-400');
        tabAgendados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

        if (emptyPassados) emptyPassados.classList.toggle('hidden', passados.length !== 0);
        if (emptyAgendados) emptyAgendados.classList.add('hidden');
        if (scheduleCards) scheduleCards.classList.add('hidden');
      }
    }
  }

  if (tabAgendados && tabPassados) {
    tabAgendados.addEventListener('click', () => {
      tabAgendados.classList.add('active');
      tabPassados.classList.remove('active');
      updateView();
    });

    tabPassados.addEventListener('click', () => {
      tabPassados.classList.add('active');
      tabAgendados.classList.remove('active');
      updateView();
    });

    updateView();
  }

  // ======================
  // SELEÇÃO DE TIPO DE AGENDAMENTO
  // ======================
  const cardsTipo = document.querySelectorAll('.card-tipo-agendamento');
  let selectedTipo = null;

  cardsTipo.forEach(card => {
    card.addEventListener('click', () => {
      if(selectedTipo === card){
        resetTipoConsulta();
      } else {
        resetTipoConsulta();
        card.classList.add(
          'ring-2','ring-primary-600','bg-primary-600','bg-opacity-20',
          'dark:bg-primary-400','dark:bg-opacity-50'
        );
        selectedTipo = card;
      }
      console.log('Tipo selecionado:', selectedTipo ? selectedTipo.dataset.tipo : null);
    });
  });

  // ======================
  // SELEÇÃO DE ALUNOS E FILTROS
  // ======================
  const cardsAluno = document.querySelectorAll('.card-aluno');
  const filterSeries = document.getElementById('filterSeries');
  const filterTurma = document.getElementById('filterTurma');
  const searchStudent = document.getElementById('searchStudent');
  const noStudentsMsg = document.getElementById('noStudentsMsg');

  let selectedAluno = null;

  function resetAlunoSelecao() {
    selectedAluno = null;
    cardsAluno.forEach(c => c.classList.remove(
      'ring-2','ring-primary-600','bg-primary-600','bg-opacity-20',
      'dark:bg-primary-400','dark:bg-opacity-50'
    ));
  }

  function filterAlunos() {
    const serieFiltro = filterSeries ? filterSeries.value.trim().toLowerCase() : '';
    const turmaFiltro = filterTurma ? filterTurma.value.trim().toLowerCase() : '';
    const busca = searchStudent ? searchStudent.value.trim().toLowerCase() : '';

    let visibleCount = 0;

    cardsAluno.forEach(card => {
      const serieAluno = (card.dataset.serie || '').toLowerCase();
      const turmaAluno = (card.dataset.turma || '').toLowerCase();
      const nomeAluno  = (card.dataset.nome || (card.querySelector('h5')?.textContent || '')).toLowerCase();
      const fullText   = card.textContent.toLowerCase();

      const matchesSerie = !serieFiltro || serieAluno === serieFiltro;
      const matchesTurma = !turmaFiltro || turmaAluno === turmaFiltro;
      const matchesBusca = !busca || nomeAluno.includes(busca) || fullText.includes(busca);

      if (matchesSerie && matchesTurma && matchesBusca) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
        if (selectedAluno === card) resetAlunoSelecao();
      }
    });

    if (noStudentsMsg) noStudentsMsg.style.display = visibleCount ? 'none' : 'block';
  }

  function selecionarAluno(card) {
    if (card.style.display === 'none') return;

    if (selectedAluno === card) {
      resetAlunoSelecao();
    } else {
      resetAlunoSelecao();
      card.classList.add(
        'ring-2','ring-primary-600','bg-primary-600','bg-opacity-20',
        'dark:bg-primary-400','dark:bg-opacity-50'
      );
      selectedAluno = card;
    }
    console.log('Aluno selecionado:', selectedAluno ? (selectedAluno.querySelector('h5')?.textContent || selectedAluno.dataset.nome) : null);
  }

  cardsAluno.forEach(card => card.addEventListener('click', () => selecionarAluno(card)));

  [filterSeries, filterTurma].forEach(f => { if(f) f.addEventListener('change', filterAlunos) });
  if(searchStudent) searchStudent.addEventListener('input', filterAlunos);

  resetAlunoFiltro();

  // ======================
  // SCROLLSPY
  // ======================
  const links = document.querySelectorAll('.scrollspy-link');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

  const ACTIVE_CLASSES   = ['bg-primary-600', 'bg-opacity-40','text-primary-600', 'dark:text-primary-400', 'border-l-4', 'border-primary-600', 'pl-2'];
  const INACTIVE_CLASSES = ['text-gray-700', 'dark:text-gray-300', 'border-l-0'];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector(`.scrollspy-link[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        links.forEach(l => {
          l.classList.remove(...ACTIVE_CLASSES);
          l.classList.add(...INACTIVE_CLASSES);
        });
        link.classList.remove(...INACTIVE_CLASSES);
        link.classList.add(...ACTIVE_CLASSES);
      }
    });
  }, { root: null, threshold: 0.5 });

  sections.forEach(sec => { if(sec) observer.observe(sec); });

  // ======================
  // CALENDÁRIO
  // ======================
  const monthYearElement = document.getElementById('MonthYear');
  const datesElement = document.getElementById('dates');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentDate = new Date();
  let selectedDate = new Date().toDateString();

  function updateCalendar() {
    if (!monthYearElement || !datesElement) return;
    
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    monthYearElement.textContent = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    let datesHTML = '';

    for (let i = firstDayIndex; i > 0; i--) {
      const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
      datesHTML += `<div class="date inactive text-gray-500">${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate;
      
      datesHTML += `<div class="date cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isToday ? 'bg-blue-100 text-blue-600' : ''} ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}" data-date="${date.toDateString()}">${i}</div>`;
    }

    for (let i = 1; i <= (6 - lastDayIndex); i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      datesHTML += `<div class="date inactive text-gray-500">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;

    datesElement.querySelectorAll('.date').forEach(day => {
      if (!day.classList.contains('inactive')) {
        day.addEventListener('click', () => {
          datesElement.querySelectorAll('.date').forEach(d => d.classList.remove('bg-blue-600','text-white','font-semibold'));
          day.classList.add('bg-blue-600','text-white','font-semibold');
          selectedDate = day.dataset.date;
          console.log('Data selecionada:', selectedDate);
        });
      }
    });
  }

  function resetCalendar() {
    currentDate = new Date();
    selectedDate = new Date().toDateString();
    updateCalendar();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); updateCalendar(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); updateCalendar(); });

  updateCalendar();

  // ======================
  // HORÁRIOS DISPONÍVEIS
  // ======================

const timeSlotsContainer = document.getElementById('time-slots'); // precisa existir no HTML
const selectedTimeInput = document.getElementById('selectedTimeInput'); // input hidden
let selectedTime = null;

// Gera horários de 08:00 até 16:00 (último slot = 16:00) em passos de 15 minutos
function gerarHorarios() {
  const slots = [];
  for (let mins = 8 * 60; mins <= 16 * 60; mins += 15) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return slots;
}

// Mostra horários para a data (Date object)
function mostrarHorariosDisponiveis(dateObj) {
  if (!timeSlotsContainer || !dateObj) return;

  timeSlotsContainer.innerHTML = '';
  selectedTime = null;
  if (selectedTimeInput) selectedTimeInput.value = '';

  const slots = gerarHorarios();
  const agora = new Date();
  const ehHoje =
    dateObj.getFullYear() === agora.getFullYear() &&
    dateObj.getMonth() === agora.getMonth() &&
    dateObj.getDate() === agora.getDate();

  slots.forEach(slot => {
    const [hh, mm] = slot.split(':').map(Number);
    const slotDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hh, mm, 0, 0);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = slot;
    btn.className = 'p-2 border border-gray-300 rounded-lg text-sm transition hover:bg-blue-50 dark:hover:bg-blue-800 dark:border-gray-600';

    // Se for hoje e o horário já passou (<= agora) => desativa
    if (ehHoje && slotDate <= agora) {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      btn.addEventListener('click', () => {
        // desmarca os outros
        timeSlotsContainer.querySelectorAll('button').forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
        // marca este
        btn.classList.add('bg-blue-600', 'text-white');
        selectedTime = slot;
        if (selectedTimeInput) selectedTimeInput.value = slot;
        console.log('Horário selecionado:', slot);
      });
    }
     timeSlotsContainer.appendChild(btn);
  });
}

// Reset visual/estado dos horários
function resetHorario() {
  if (timeSlotsContainer) timeSlotsContainer.innerHTML = '';
  selectedTime = null;
  if (selectedTimeInput) selectedTimeInput.value = '';
}

// --- Integrar com o calendário (delegation) ---
// Ao clicar em um dia ('.date') mostramos os horários para aquela data.
// OBS: o seu updateCalendar já cria elementos com data-date contendo uma string de data.
// Aqui usamos event delegation para não duplicar listeners por mês.

if (datesElement) {
  datesElement.addEventListener('click', (e) => {
    const day = e.target.closest('.date');
    if (!day || day.classList.contains('inactive')) return;

    // garante seleção visual
    datesElement.querySelectorAll('.date').forEach(d => d.classList.remove('bg-blue-600','text-white','font-semibold'));
    day.classList.add('bg-blue-600','text-white','font-semibold');

    // pega a data do data-date (criada no updateCalendar)
    const ds = day.dataset.date;
    let dateObj = new Date(ds);
    if (isNaN(dateObj.getTime())) {
      // fallback seguro para evitar erro
      dateObj = new Date();
    }
     // mostra horários para a data escolhida
    mostrarHorariosDisponiveis(dateObj);
  });
}

// --- Reset quando modal abre/fecha ---
// limpa sempre que abrir o modal
if (openModalBtn) openModalBtn.addEventListener('click', resetHorario);
if (openFirstBtn) openFirstBtn.addEventListener('click', resetHorario);

// limpa quando fechar o modal (X, cancelar, clique fora)
if (closeModalBtn) closeModalBtn.addEventListener('click', resetHorario);
if (cancelModalBtn) cancelModalBtn.addEventListener('click', resetHorario);
if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) resetHorario(); });

});

// 
// EVENTOS SECUNDÁRIOS
// 
if (themeToggle) themeToggle.addEventListener('change', toggleTheme);
window.addEventListener('resize', syncSidebarHeaderHeight);

// 
// MODAL DE VISUALIZAÇÃO DO ESTUDANTE
// 
const studentModal      = document.getElementById('student-modal');
const closeModalButton  = document.getElementById('close-modal');
const historyList       = document.getElementById('history-list');

// Elementos do modal
const fldName    = document.getElementById('student-name');
const fldInitial = document.getElementById('student-initial');
const fldStatus  = document.getElementById('student-status');
const fldAge     = document.getElementById('student-age');
const fldClass   = document.getElementById('student-class');
const fldEmail   = document.getElementById('student-email');

// Evento de abertura (ícone "olho")
document.querySelectorAll('button span.material-symbols-outlined').forEach(icon => {
  if (icon.textContent.trim() !== 'visibility') return;
  
  icon.parentElement.addEventListener('click', () => {
    // Obtém dados da linha da tabela
    const tr = icon.closest('tr');
    const [tdAluno, tdTurma, tdStatus, tdUltima] = tr.querySelectorAll('td');

    // Extrai dados
    const nome  = tdAluno.querySelector('.font-medium').textContent;
    const idade = tdAluno.querySelector('.text-gray-500').textContent;
    const turma = tdTurma.textContent.trim();
    const status= tdStatus.textContent.trim();
    const ultima= tdUltima.textContent.trim();

    // Preenche modal
    if (fldName) fldName.textContent    = nome;
    if (fldInitial) fldInitial.textContent = nome.charAt(0);
    if (fldStatus) fldStatus.textContent  = status;
    if (fldAge) fldAge.textContent     = idade;
    if (fldClass) fldClass.textContent   = turma;
    if (fldEmail) fldEmail.textContent   = tr.dataset.email || 'sememail@escola.edu.br';

    // Exibe histórico (simplificado)
    if (historyList) {
      historyList.innerHTML = `
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between items-start mb-2">
            <h5 class="font-medium">Última Sessão</h5>
            <span class="text-sm text-gray-500 dark:text-gray-400">${ultima}</span>
          </div>
          <p class="text-sm">[descrição do registro]</p>
        </div>
      `;
    }

    // Mostra modal
    if (studentModal) studentModal.classList.remove('hidden');
  });
});

// Fechar modal
if (closeModalButton) {
  closeModalButton.addEventListener('click', () => {
    if (studentModal) studentModal.classList.add('hidden');
  });
}

// Relatorio dos Alunos Psicologo.
// Referências ao DOM
const chatModal       = document.getElementById('relatorio-chat-modal');
const btnCloseChat    = document.getElementById('btn-close-rel-chat');

const fldNameChat     = document.getElementById('rel-student-name');
const fldInitialChat  = document.getElementById('rel-student-initial');
const fldStatusChat   = document.getElementById('rel-student-status');
const fldAgeChat      = document.getElementById('rel-student-age');
const fldClassChat    = document.getElementById('rel-student-class');

// Abre modal ao clicar no ícone de chat
document.querySelectorAll('button span.material-symbols-outlined')
  .forEach(icon => {
    if (icon.textContent.trim() !== 'chat') return;

    icon.parentElement.addEventListener('click', () => {
      const tr = icon.closest('tr');
      const [tdAluno, tdTurma, tdStatus] = tr.querySelectorAll('td');

      const nome  = tdAluno.querySelector('.font-medium').textContent.trim();
      const idade = tdAluno.querySelector('.text-gray-500').textContent.trim();
      const turma = tdTurma.textContent.trim();
      const status= tdStatus.textContent.trim();

      if (fldNameChat) fldNameChat.textContent    = nome;
      if (fldInitialChat) fldInitialChat.textContent = nome.charAt(0).toUpperCase();
      if (fldStatusChat) fldStatusChat.textContent  = status;
      if (fldAgeChat) fldAgeChat.textContent     = idade;
      if (fldClassChat) fldClassChat.textContent   = turma;

      if (chatModal) chatModal.classList.remove('hidden');
    });
  });

// Fecha o modal de chat
if (btnCloseChat) {
  btnCloseChat.addEventListener('click', () => {
    if (chatModal) chatModal.classList.add('hidden');
  });
}

// 
// MODAL DE FICHA DO ESTUDANTE (CHAT)
// 
const fichaModal = document.getElementById('ficha-modal');
const fecharModalButton = document.getElementById('fechar-modal');

// Evento de abertura (ícone "chat")
document.querySelectorAll('button span.material-symbols-outlined').forEach(icon => {
  if (icon.textContent.trim() !== 'chat') return;

  icon.parentElement.addEventListener('click', () => {
    // Mostrar modal (dados podem ser preenchidos aqui)
    if (fichaModal) fichaModal.classList.remove('hidden');
  });
});

// Fechar modal
if (fecharModalButton) {
  fecharModalButton.addEventListener('click', () => {
    if (fichaModal) fichaModal.classList.add('hidden');
  });
}


// =======================================================
// 🔥 INTEGRAÇÃO FIREBASE - CADASTRO DE USUÁRIOS ADMIN
// =======================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyADnCSz9_kJCJQp1simuF52eZ9yz4MawgE",
  authDomain: "nexus-web-c35f1.firebaseapp.com",
  projectId: "nexus-web-c35f1",
  storageBucket: "nexus-web-c35f1.firebasestorage.app",
  messagingSenderId: "387285405125",
  appId: "1:387285405125:web:96c2d0edb9695b79690fac",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================
// 🧩 CADASTRO DE USUÁRIOS POR TIPO
// =======================
document.getElementById("formCadastro")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = document.getElementById("role").value; // aluno, professor, etc.
  const codigoEscola = document.getElementById("codigoEscola").value.trim();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmar = document.getElementById("confirmar").value.trim();
  const msg = document.getElementById("mensagem");

  if (!codigoEscola || !role || !nome || !email || !senha) {
    msg.textContent = "Por favor, preencha todos os campos obrigatórios.";
    msg.className = "msg erro";
    return;
  }

  if (senha !== confirmar) {
    msg.textContent = "As senhas não conferem!";
    msg.className = "msg erro";
    return;
  }

  try {
    // 🔐 Cria usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 🔧 Define o nome da subcoleção com base no tipo
    const subcolecao = role.toLowerCase() + "s"; // aluno -> alunos, professor -> professores etc.

    // 🏫 Cria o documento dentro da escola e da subcoleção
    await setDoc(doc(db, "escolas", codigoEscola, subcolecao, user.uid), {
      nome,
      email,
      cpf,
      tipo: role,
      codigoEscola,
      criadoEm: new Date().toISOString(),
    });

    msg.textContent = `✅ Usuário ${role} criado com sucesso!`;
    msg.className = "msg sucesso";
    e.target.reset();

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    msg.textContent = "Erro: " + error.message;
    msg.className = "msg erro";
  }
});

// =======================================================
// 🔥 PERFIL DO USUÁRIO LOGADO (aluno, professor, psicólogo, admin)
// =======================================================
const storage = getStorage(app);
const authRef = getAuth(app);

const userNameEl = document.getElementById("userName");
const userAvatarEl = document.getElementById("avatarPreview");

onAuthStateChanged(authRef, async (user) => {
  if (!user) {
    console.warn("⚠️ Nenhum usuário logado. Redirecionando...");
    window.location.href = "../tela_login/login.html";
    return;
  }

  // Pega informações do localStorage (definidas no login)
  const role = localStorage.getItem("role") || "aluno"; // padrão aluno
  const codigoEscola = localStorage.getItem("codigoEscola");
  const uid = localStorage.getItem("uid") || user.uid;

  try {
    const userRef = doc(db, `escolas/${codigoEscola}/${role}s/${uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const dados = userSnap.data();
      console.log("✅ Dados do usuário:", dados);

      // Atualiza nome
      if (userNameEl) userNameEl.textContent = dados.nome || "Usuário";

      // Atualiza imagem de perfil (se existir)
      if (dados.fotoPerfil) {
        try {
          const fotoRef = ref(storage, dados.fotoPerfil);
          const url = await getDownloadURL(fotoRef);
          if (userAvatarEl) userAvatarEl.src = url;
        } catch (error) {
          console.warn("⚠️ Falha ao carregar imagem:", error);
        }
      }

      // Salva em cache
      localStorage.setItem("nomeUsuario", dados.nome || "");
      localStorage.setItem("avatarUsuario", userAvatarEl?.src || "");
    } else {
      console.warn("⚠️ Documento de usuário não encontrado no Firestore!");
    }
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
  }
});



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

// 
// SELEÇÃO DE ELEMENTOS
// 
const sidebar      = document.getElementById('sidebar');
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
  mainContent.classList.toggle('ml-64', !hidden);
  mainContent.classList.toggle('ml-0', hidden);
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
  themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

function loadTheme() {
  // Carrega tema salvo ou usa 'light' como padrão
  const savedTheme = localStorage.getItem('theme') || 'light';
  const isDark = savedTheme === 'dark';
  
  // Aplica tema
  document.documentElement.classList.toggle('dark', isDark);
  
  // Atualiza toggle e rótulo
  themeToggle.checked = isDark;
  themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

// 
// EVENTOS PRINCIPAIS
// 
window.addEventListener('load', () => {
  // Configurações iniciais
  loadTheme();
  syncSidebarHeaderHeight();

  // Carrega dados do usuário
  const savedName   = localStorage.getItem('nomeUsuario');
  const savedAvatar = localStorage.getItem('avatarUsuario');
  if (savedName)   nameTag.textContent = savedName;
  if (savedAvatar) preview.src = savedAvatar;

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
});

// 
// EVENTOS SECUNDÁRIOS
// 
themeToggle.addEventListener('change', toggleTheme);
window.addEventListener('resize', syncSidebarHeaderHeight);

// 
// FUNÇÕES DE NOTIFICAÇÃO
// 
function toggleNotifs() {
  // Alterna visibilidade da lista de notificações
  const list = document.getElementById('notifList');
  list.classList.toggle('hidden');
}

function handleClickOutside(e) {
  // Fecha notificações ao clicar fora
  const btn = document.getElementById('notifButton');
  const list = document.getElementById('notifList');
  if (!btn.contains(e.target) && !list.contains(e.target)) {
    list.classList.add('hidden');
  }
}

// 
// CONFIGURAÇÃO GERAL
// 
document.addEventListener('DOMContentLoaded', () => {
  // Referências de notificação
  const notifButton    = document.getElementById('notifButton');
  const notifList      = document.getElementById('notifList');
  const notifContainer = notifButton.parentElement;

  // Inicia com notificações ocultas
  notifList.classList.add('hidden');

  // Eventos de notificação
  notifButton.addEventListener('click', toggleNotifs);
  document.addEventListener('click', handleClickOutside);
  
  // Comportamento hover
  notifContainer.addEventListener('mouseenter', () => notifList.classList.remove('hidden'));
  notifContainer.addEventListener('mouseleave', () => notifList.classList.add('hidden'));

  // 
  // MODAL DE AGENDAMENTO
  // 
  const openModalBtn = document.getElementById('addScheduleBtn');
  const openFirstBtn = document.getElementById('addFirstScheduleBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('agendamentoModal');
  
  // Abrir modal
  if(openModalBtn) openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  });
  
  if(openFirstBtn) openFirstBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  });
  
  // Fechar modal
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });
  
  // Fechar ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  });

  // 
  // ABA DE AGENDAMENTOS
  // 
  const tabAgendados   = document.getElementById('tab-agendados');
  const tabPassados    = document.getElementById('tab-passados');
  const emptyAgendados = document.getElementById('empty-agendados');
  const emptyPassados  = document.getElementById('empty-passados');
  const scheduleCards  = document.getElementById('schedule-cards');

  // Dados simulados
  const agendados   = [];                
  const passados    = [];                

  function updateView() {
    if (tabAgendados.classList.contains('active')) {
      // Configura aba "Agendados"
      tabAgendados.classList.replace('text-gray-500','text-primary-600');
      tabAgendados.classList.replace('dark:text-gray-400','dark:text-primary-400');
      tabAgendados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');
      
      tabPassados.classList.replace('text-primary-600','text-gray-500');
      tabPassados.classList.replace('dark:text-primary-400','dark:text-gray-400');
      tabPassados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

      // Mostra/oculta conteúdo
      if (agendados.length === 0) {
        emptyAgendados.classList.remove('hidden');
        scheduleCards.classList.add('hidden');
      } else {
        emptyAgendados.classList.add('hidden');
        scheduleCards.classList.remove('hidden');
      }
      emptyPassados.classList.add('hidden');
    } else {
      // Configura aba "Passados"
      tabPassados.classList.replace('text-gray-500','text-primary-600');
      tabPassados.classList.replace('dark:text-gray-400','dark:text-primary-400');
      tabPassados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');
      
      tabAgendados.classList.replace('text-primary-600','text-gray-500');
      tabAgendados.classList.replace('dark:text-primary-400','dark:text-gray-400');
      tabAgendados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

      // Mostra/oculta conteúdo
      if (passados.length === 0) {
        emptyPassados.classList.remove('hidden');
      } else {
        emptyPassados.classList.add('hidden');
      }
      emptyAgendados.classList.add('hidden');
      scheduleCards.classList.add('hidden');
    }
  }

  // Eventos das abas
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

  // Inicialização
  updateView();

  // 
  // SELEÇÃO DE TIPO DE AGENDAMENTO
  // 
  const cardsTipo = document.querySelectorAll('.card-tipo-agendamento');
  cardsTipo.forEach(card => {
    card.addEventListener('click', () => {
      // Remove destaque de todos
      cardsTipo.forEach(c => {
        c.classList.remove(
          'ring-2',
          'ring-primary-600',
          'bg-primary-600',
          'bg-opacity-20',
          'dark:bg-primary-400',
          'dark:bg-opacity-50'
        );
      });

      // Aplica destaque ao selecionado
      card.classList.add(
        'ring-2',
        'ring-primary-600',
        'bg-primary-600',
        'bg-opacity-20',
        'dark:bg-primary-400',
        'dark:bg-opacity-50'
      );

      // Log para debug (pode ser removido)
      console.log('Tipo selecionado:', card.dataset.tipo);
    });
  });

    // 1) Selecione todos os cards
    const cardsAluno = document.querySelectorAll('.card-aluno');

    // 2) Itere e adicione o listener de clique
    cardsAluno.forEach(card => {
      card.addEventListener('click', () => {
        // 3) Remove destaque de todos
        cardsAluno.forEach(c => {
          c.classList.remove(
          'ring-2',
          'ring-primary-600',
          'bg-primary-600',
          'bg-opacity-20',
          'dark:bg-primary-400',
          'dark:bg-opacity-50')
        });

        // 4) Aplica destaque só ao clicado
        card.classList.add(
        'ring-2',
        'ring-primary-600',
        'bg-primary-600',
        'bg-opacity-20',
        'dark:bg-primary-400',
        'dark:bg-opacity-50');

      });
    });

  // 
  // SCROLLSPY (NAVEGAÇÃO)
  // 
  const links    = document.querySelectorAll('.scrollspy-link');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

  // Classes para estado ativo/inativo
  const ACTIVE_CLASSES   = ['bg-primary-600', 'bg-opacity-40','text-primary-600', 'dark:text-primary-400', 'border-l-4', 'border-primary-600', 'pl-2'];
  const INACTIVE_CLASSES = ['text-gray-700',   'dark:text-gray-300',            'border-l-0'];

  // Observer para elementos visíveis
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id   = entry.target.id;
      const link = document.querySelector(`.scrollspy-link[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        // Ativa link correspondente à seção visível
        links.forEach(l => {
          l.classList.remove(...ACTIVE_CLASSES);
          l.classList.add(...INACTIVE_CLASSES);
        });
        link.classList.remove(...INACTIVE_CLASSES);
        link.classList.add(...ACTIVE_CLASSES);
      }
    });
  }, { root: null, threshold: 0.5 });

  // Observa todas as seções
  sections.forEach(sec => {
    if (sec) observer.observe(sec);
  });
});

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
    fldName.textContent    = nome;
    fldInitial.textContent = nome.charAt(0);
    fldStatus.textContent  = status;
    fldAge.textContent     = idade;
    fldClass.textContent   = turma;
    fldEmail.textContent   = tr.dataset.email || 'sememail@escola.edu.br';

    // Exibe histórico (simplificado)
    historyList.innerHTML = `
      <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
        <div class="flex justify-between items-start mb-2">
          <h5 class="font-medium">Última Sessão</h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">${ultima}</span>
        </div>
        <p class="text-sm">[descrição do registro]</p>
      </div>
    `;

    // Mostra modal
    studentModal.classList.remove('hidden');
  });
});

// Fechar modal
closeModalButton.addEventListener('click', () => {
  studentModal.classList.add('hidden');
});

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
    fichaModal.classList.remove('hidden');
  });
});

// Fechar modal
fecharModalButton.addEventListener('click', () => {
  fichaModal.classList.add('hidden');
});
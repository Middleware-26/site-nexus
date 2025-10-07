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
  // ======================
  // NOTIFICAÇÕES
  // ======================
  const notifButton = document.getElementById('notifButton');
  const notifList = document.getElementById('notifList');
  const notifContainer = notifButton.parentElement;

  notifList.classList.add('hidden');

  function toggleNotifs() {
    notifList.classList.toggle('hidden');
  }

  function handleClickOutside(e) {
    if (!notifContainer.contains(e.target)) notifList.classList.add('hidden');
  }

  notifButton.addEventListener('click', toggleNotifs);
  document.addEventListener('click', handleClickOutside);

  notifContainer.addEventListener('mouseenter', () => notifList.classList.remove('hidden'));
  notifContainer.addEventListener('mouseleave', () => notifList.classList.add('hidden'));

  // ======================
  // MODAL DE AGENDAMENTO
  // ======================
  const modal = document.getElementById('agendamentoModal');
  const openModalBtn = document.getElementById('addScheduleBtn');
  const openFirstBtn = document.getElementById('addFirstScheduleBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelarBtn');

  function resetTipoConsulta() {
    cardsTipo.forEach(c => c.classList.remove(
      'ring-2','ring-primary-600','bg-primary-600','bg-opacity-20',
      'dark:bg-primary-400','dark:bg-opacity-50'
    ));
    selectedTipo = null;
  }

  function resetAlunoFiltro() {
    if (filterSeries) filterSeries.value = '';
    if (filterTurma) filterTurma.value = '';
    if (searchStudent) searchStudent.value = '';
    resetAlunoSelecao();
    filterAlunos();
  }

  function fecharModal() {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    resetTipoConsulta();
    resetAlunoFiltro();
  }

  [openModalBtn, openFirstBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.classList.add('modal-open');
      resetCalendar();
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
    if (tabAgendados.classList.contains('active')) {
      tabAgendados.classList.replace('text-gray-500','text-primary-600');
      tabAgendados.classList.replace('dark:text-gray-400','dark:text-primary-400');
      tabAgendados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');

      tabPassados.classList.replace('text-primary-600','text-gray-500');
      tabPassados.classList.replace('dark:text-primary-400','dark:text-gray-400');
      tabPassados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

      emptyAgendados.classList.toggle('hidden', agendados.length !== 0);
      scheduleCards.classList.toggle('hidden', agendados.length === 0);
      emptyPassados.classList.add('hidden');
    } else {
      tabPassados.classList.replace('text-gray-500','text-primary-600');
      tabPassados.classList.replace('dark:text-gray-400','dark:text-primary-400');
      tabPassados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');

      tabAgendados.classList.replace('text-primary-600','text-gray-500');
      tabAgendados.classList.replace('dark:text-primary-400','dark:text-gray-400');
      tabAgendados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

      emptyPassados.classList.toggle('hidden', passados.length !== 0);
      emptyAgendados.classList.add('hidden');
      scheduleCards.classList.add('hidden');
    }
  }

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
      const prevDate = new Date(currentYear, currentMonth, 1 - i);
      datesHTML += `<div class="date inactive text-gray-500">${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate;

      let classes = 'hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer';
      if (isToday && !selectedDate) classes += ' bg-blue-600 text-white font-semibold';
      if (isSelected) classes += ' bg-blue-600 text-white font-semibold';

      datesHTML += `<div class="date ${classes}" data-date="${date.toDateString()}">${i}</div>`;
    }

    for (let i = 1; i < 7 - lastDayIndex; i++) {
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

  prevBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); updateCalendar(); });
  nextBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); updateCalendar(); });

  updateCalendar();

  // ======================
  // HORÁRIOS DISPONÍVEIS
  // ======================
  const horarios = document.querySelectorAll('.availability-time');
  const horariosIndisponiveis = ['08:30', '10:00'];

  function selecionarHorario(e) {
    horarios.forEach(h => {
      h.classList.remove('time-selected', 'bg-blue-100', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-300');
    });

    const horario = e.currentTarget;
    if (!horario.classList.contains('opacity-50')) {
      horario.classList.add('time-selected', 'bg-blue-100', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-300');
      console.log('Horário selecionado:', horario.textContent);
    }
  }

  function resetHorario() {
    horarios.forEach(h => {
      h.classList.remove('time-selected', 'bg-blue-100', 'dark:bg-blue-900/30', 'text-blue-600', 'dark:text-blue-300');

      if (horariosIndisponiveis.includes(h.textContent)) {
        h.classList.add('opacity-50', 'cursor-not-allowed');
        h.removeEventListener('click', selecionarHorario);
      } else {
        h.classList.remove('opacity-50', 'cursor-not-allowed');
        h.addEventListener('click', selecionarHorario);
      }
    });
  }

  resetHorario();
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

      fldNameChat.textContent    = nome;
      fldInitialChat.textContent = nome.charAt(0).toUpperCase();
      fldStatusChat.textContent  = status;
      fldAgeChat.textContent     = idade;
      fldClassChat.textContent   = turma;

      chatModal.classList.remove('hidden');
    });
  });

// Fecha o modal de chat
btnCloseChat.addEventListener('click', () => {
  chatModal.classList.add('hidden');
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




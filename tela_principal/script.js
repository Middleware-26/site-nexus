// IIFE para aplicar o tema sem flash
(function(){
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);
  document.documentElement.style.visibility = 'visible';
})();

// Seleciona elementos do DOM
const sidebar      = document.getElementById('sidebar');
const mainHdr      = document.getElementById('main-header');
const sbHdr        = document.getElementById('sidebar-header');
const nameTag      = document.getElementById('userName');
const preview      = document.getElementById('avatarPreview');
const themeToggle  = document.getElementById('themeToggle');
const themeLabel   = document.getElementById('themeLabel'); // ← declaração adicionada
const notifButton  = document.getElementById('notifButton');
const notifList    = document.getElementById('notifList');

// Funções de menu lateral
function abrirMenu() {
  sidebar.classList.toggle('-translate-x-full');
  sidebar.classList.toggle('opacity-0');
  sidebar.classList.toggle('translate-x-0');
  sidebar.classList.toggle('opacity-100');
  // se sidebar agora estiver escondido, main perde margem; senão, ganha
  const hidden = sidebar.classList.contains('-translate-x-full');
  mainContent.classList.toggle('ml-64', !hidden);
  mainContent.classList.toggle('ml-0', hidden);
}

function fecharMenu() {
  // opcional: chamar abrirMenu() garante consistência
  if (!sidebar.classList.contains('-translate-x-full')) {
    abrirMenu();
  }
}

function syncSidebarHeaderHeight() {
  if (!mainHdr || !sbHdr) return;
  sbHdr.style.height = mainHdr.getBoundingClientRect().height + 'px';
}

// Funções de tema
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const isDark = savedTheme === 'dark';              // ← criei isDark aqui
  document.documentElement.classList.toggle('dark', isDark);
  themeToggle.checked = isDark;
  themeLabel.textContent = isDark ? 'Tema: Escuro' : 'Tema: Claro';
}

// Eventos
window.addEventListener('load', () => {
  loadTheme();
  syncSidebarHeaderHeight();

  const savedName   = localStorage.getItem('nomeUsuario');
  const savedAvatar = localStorage.getItem('avatarUsuario');
  if (savedName)   nameTag.textContent = savedName;
  if (savedAvatar) preview.src = savedAvatar;


  

// --- início: lógica de seleção de cards ---
  // seleção de cards com cor específica
  const cards = document.querySelectorAll('.card');
  let activeCard = null;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // remove ring do anterior
      if (activeCard) {
        const prevRings = activeCard.dataset.ring.split(' ');
        activeCard.classList.remove('ring-2', ...prevRings);
      }
      // adiciona ring no atual
      const rings = card.dataset.ring.split(' ');
      card.classList.add('ring-2', ...rings);
      activeCard = card;
    });
  });
  // --- fim: lógica de seleção de cards ---

  // --- início: lógica de seleção de emoções ---
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

    // Habilita o botão de envio
    const btnSubmit = document.getElementById('submitEmotion');
    if (btnSubmit) btnSubmit.disabled = false;
  }

  // Adiciona event listener em cada card de emoção
  document.querySelectorAll('.emotion-card').forEach(card => {
    card.addEventListener('click', () => {
      selectEmotion(card);
    });
  });

  // Botão “Enviar Emoção”
  const btnSubmitEmotion = document.getElementById('submitEmotion');
  if (btnSubmitEmotion) {
    btnSubmitEmotion.addEventListener('click', () => {
      const details = document.getElementById('emotionDetails').value;

      // Aqui você pode enviar selectedEmotion e details para o backend
      console.log('Emotion submitted:', {
        emotion: selectedEmotion,
        details: details
      });

      // Mostrar mensagem de sucesso
      alert('Obrigado por compartilhar como você está se sentindo! Se precisar de ajuda, estamos aqui para você.');

      // Resetar formulário de emoções
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
  // --- fim: lógica de seleção de emoções ---

  
});


themeToggle.addEventListener('change', toggleTheme);
window.addEventListener('resize', syncSidebarHeaderHeight);

// Funções de notificação
function toggleNotifs() {
  const list = document.getElementById('notifList');
  list.classList.toggle('hidden');
}

// Fecha a lista ao clicar fora do botão ou da lista
function handleClickOutside(e) {
  const btn = document.getElementById('notifButton');
  const list = document.getElementById('notifList');
  if (!btn.contains(e.target) && !list.contains(e.target)) {
    list.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const notifButton    = document.getElementById('notifButton');
  const notifList      = document.getElementById('notifList');
  const notifContainer = notifButton.parentElement;

  // Inicia com a lista oculta
  notifList.classList.add('hidden');

  // Clique no botão: alterna visibilidade
  notifButton.addEventListener('click', toggleNotifs);

  // Clique externo: esconde
  document.addEventListener('click', handleClickOutside);

  // Hover: ao passar o mouse, mostrar; ao sair, esconder
  notifContainer.addEventListener('mouseenter', () => {
    notifList.classList.remove('hidden');
  });
  notifContainer.addEventListener('mouseleave', () => {
    notifList.classList.add('hidden');
  });


        // Configura o modal de agendamento
      const openModalBtn = document.getElementById('addScheduleBtn');
      const openFirstBtn = document.getElementById('addFirstScheduleBtn');
      const closeModalBtn = document.getElementById('closeModalBtn');
      const modal = document.getElementById('agendamentoModal');
      
      if(openModalBtn) {
        openModalBtn.addEventListener('click', () => {
          modal.classList.remove('hidden');
          document.body.classList.add('modal-open');
        });
      }
      
      if(openFirstBtn) {
        openFirstBtn.addEventListener('click', () => {
          modal.classList.remove('hidden');
          document.body.classList.add('modal-open');
        });
      }
      
      closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
      });
      
      // Fecha modal ao clicar fora
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          document.body.classList.remove('modal-open');
        }
      });
  

  const tabAgendados   = document.getElementById('tab-agendados');
  const tabPassados    = document.getElementById('tab-passados');
  const emptyAgendados = document.getElementById('empty-agendados');
  const emptyPassados  = document.getElementById('empty-passados');
  const scheduleCards  = document.getElementById('schedule-cards');

  // Simule seus dados reais aqui:
  const agendados   = [];                
  const passados    = [];                

  function updateView() {
    if (tabAgendados.classList.contains('active')) {
      // aba Agendados
      tabAgendados.classList.replace('text-gray-500','text-primary-600');
      tabAgendados.classList.replace('dark:text-gray-400','dark:text-primary-400');
      tabAgendados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');
      tabPassados.classList.replace('text-primary-600','text-gray-500');
      tabPassados.classList.replace('dark:text-primary-400','dark:text-gray-400');
      tabPassados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

      // conteúdo
      if (agendados.length === 0) {
        emptyAgendados.classList.remove('hidden');
        scheduleCards.classList.add('hidden');
      } else {
        emptyAgendados.classList.add('hidden');
        scheduleCards.classList.remove('hidden');
      }
      emptyPassados.classList.add('hidden');
    } else {
      // aba Passados
      tabPassados.classList.replace('text-gray-500','text-primary-600');
      tabPassados.classList.replace('dark:text-gray-400','dark:text-primary-400');
      tabPassados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');
      tabAgendados.classList.replace('text-primary-600','text-gray-500');
      tabAgendados.classList.replace('dark:text-primary-400','dark:text-gray-400');
      tabAgendados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

      // conteúdo
      if (passados.length === 0) {
        emptyPassados.classList.remove('hidden');
      } else {
        emptyPassados.classList.add('hidden');
        // Se quiser listar cards de passados, adapte aqui
      }
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

  // Inicializa
  updateView();

  // seleção de tipo de agendamento
  const cardsTipo = document.querySelectorAll('.card-tipo-agendamento');
  cardsTipo.forEach(card => {
    card.addEventListener('click', () => {
      // 1) limpa o destaque de todos
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

      // 2) adiciona destaque no clicado
      card.classList.add(
        'ring-2',
        'ring-primary-600',
        'bg-primary-600',
        'bg-opacity-20',
        'dark:bg-primary-400',
        'dark:bg-opacity-50'

      );

      // opcional: pega o tipo
      console.log('Tipo selecionado:', card.dataset.tipo);
    });
  });

  // scrollspy para links de navegação
  const links    = document.querySelectorAll('.scrollspy-link');
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href')));

  const ACTIVE_CLASSES   = ['bg-primary-600', 'bg-opacity-40','text-primary-600', 'dark:text-primary-400', 'border-l-4', 'border-primary-600', 'pl-2'];
  const INACTIVE_CLASSES = ['text-gray-700',   'dark:text-gray-300',            'border-l-0'];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id   = entry.target.id;
      const link = document.querySelector(`.scrollspy-link[href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        // marca só este link como ativo
        links.forEach(l => {
          l.classList.remove(...ACTIVE_CLASSES);
          l.classList.add(...INACTIVE_CLASSES);
        });
        link.classList.remove(...INACTIVE_CLASSES);
        link.classList.add(...ACTIVE_CLASSES);
      }
    });
  }, {
    root: null,
    threshold: 0.5
  });

  sections.forEach(sec => {
    if (sec) observer.observe(sec);
  });
});
// js/tabs.js
const tabAgendados   = document.getElementById('tab-agendados');
const tabPassados    = document.getElementById('tab-passados');
const emptyAgendados = document.getElementById('empty-agendados');
const emptyPassados  = document.getElementById('empty-passados');
const scheduleCards  = document.getElementById('schedule-cards');

// Simulação de dados
const agendados   = [];
const passados    = [];

function updateView() {
  if (tabAgendados.classList.contains('active')) {
    tabAgendados.classList.replace('text-gray-500','text-primary-600');
    tabAgendados.classList.replace('dark:text-gray-400','dark:text-primary-400');
    tabAgendados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');
    tabPassados.classList.replace('text-primary-600','text-gray-500');
    tabPassados.classList.replace('dark:text-primary-400','dark:text-gray-400');
    tabPassados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

    if (agendados.length === 0) {
      emptyAgendados.classList.remove('hidden');
      scheduleCards.classList.add('hidden');
    } else {
      emptyAgendados.classList.add('hidden');
      scheduleCards.classList.remove('hidden');
    }
    emptyPassados.classList.add('hidden');
  } else {
    tabPassados.classList.replace('text-gray-500','text-primary-600');
    tabPassados.classList.replace('dark:text-gray-300','dark:text-primary-400');
    tabPassados.classList.add('border-b-2','border-primary-600','dark:border-primary-400');
    tabAgendados.classList.replace('text-primary-600','text-gray-500');
    tabAgendados.classList.replace('dark:text-primary-400','dark:text-gray-400');
    tabAgendados.classList.remove('border-b-2','border-primary-600','dark:border-primary-400');

    if (passados.length === 0) {
      emptyPassados.classList.remove('hidden');
    } else {
      emptyPassados.classList.add('hidden');
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

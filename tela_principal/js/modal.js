// js/modal.js
// Configura o modal de agendamento
const openModalBtn = document.getElementById('addScheduleBtn');
const openFirstBtn = document.getElementById('addFirstScheduleBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('agendamentoModal');

if (openModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  });
}

if (openFirstBtn) {
  openFirstBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  });
}

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
});




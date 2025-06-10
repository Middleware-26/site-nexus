// js/selection.js

// --- início: lógica de seleção de cards ---
const cards = document.querySelectorAll('.card');
let activeCard = null;

cards.forEach(card => {
  card.addEventListener('click', () => {
    if (activeCard) {
      const prevRings = activeCard.dataset.ring.split(' ');
      activeCard.classList.remove('ring-2', ...prevRings);
    }
    const rings = card.dataset.ring.split(' ');
    card.classList.add('ring-2', ...rings);
    activeCard = card;
  });
});
// --- fim: lógica de seleção de cards ---

// --- início: lógica de seleção de emoções ---
let selectedEmotion = null;

function selectEmotion(element) {
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

  element.classList.add('selected');
  const emotion = element.getAttribute('data-emotion');
  element.classList.add(`border-emotion-${emotion}`);

  selectedEmotion = emotion;

  const btnSubmit = document.getElementById('submitEmotion');
  if (btnSubmit) btnSubmit.disabled = false;
}

document.querySelectorAll('.emotion-card').forEach(card => {
  card.addEventListener('click', () => {
    selectEmotion(card);
  });
});

const btnSubmitEmotion = document.getElementById('submitEmotion');
if (btnSubmitEmotion) {
  btnSubmitEmotion.addEventListener('click', () => {
    const details = document.getElementById('emotionDetails').value;

    console.log('Emotion submitted:', {
      emotion: selectedEmotion,
      details: details
    });

    alert('Obrigado por compartilhar como você está se sentindo! Se precisar de ajuda, estamos aqui para você.');

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




// --- início: lógica de seleção de tipo de agendamento ---
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
    // opcional: log do tipo
    console.log('Tipo selecionado:', card.dataset.tipo);
  });
});
// --- fim: lógica de seleção de tipo de agendamento ---

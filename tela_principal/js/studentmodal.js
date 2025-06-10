// js/studentModal.js
// 1) pegar referências
const studentModal      = document.getElementById('student-modal');
const closeModalButton  = document.getElementById('close-modal');
const historyList       = document.getElementById('history-list');

// campos do modal
const fldName    = document.getElementById('student-name');
const fldInitial = document.getElementById('student-initial');
const fldStatus  = document.getElementById('student-status');
const fldAge     = document.getElementById('student-age');
const fldClass   = document.getElementById('student-class');
const fldEmail   = document.getElementById('student-email');

// 2) ao clicar no “olhinho”
document.querySelectorAll('button span.material-symbols-outlined')
  .forEach(icon => {
    if (icon.textContent.trim() !== 'visibility') return;
    icon.parentElement.addEventListener('click', () => {
      // a linha da tabela:
      const tr = icon.closest('tr');

      // extrair dados de cada coluna
      const [tdAluno, tdTurma, tdStatus, tdUltima] = tr.querySelectorAll('td');

      const nome  = tdAluno.querySelector('.font-medium').textContent;
      const idade = tdAluno.querySelector('.text-gray-500').textContent;
      const turma = tdTurma.textContent.trim();
      const status= tdStatus.textContent.trim();
      const ultima= tdUltima.textContent.trim();

      // 3) preencher o modal
      fldName.textContent    = nome;
      fldInitial.textContent = nome.charAt(0);
      fldStatus.textContent  = status;
      fldAge.textContent     = idade;
      fldClass.textContent   = turma;
      // se não tiver email na tabela, pode deixar fixo ou buscar via data-attribute:
      fldEmail.textContent   = tr.dataset.email || 'sememail@escola.edu.br';

      // exibir histórico – aqui você pode limpar e adicionar cards dinamicamente
      // (se os registros estiverem em um array, ou data-attributes no <tr>)
      // por enquanto só mostramos a última sessão:
      historyList.innerHTML = `
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="flex justify-between items-start mb-2">
            <h5 class="font-medium">Última Sessão</h5>
            <span class="text-sm text-gray-500 dark:text-gray-400">${ultima}</span>
          </div>
          <p class="text-sm">[descrição do registro]</p>
        </div>
      `;

      // 4) mostrar o modal
      studentModal.classList.remove('hidden');
    });
  });

// 5) fechar
closeModalButton.addEventListener('click', () => {
  studentModal.classList.add('hidden');
});


// js/studentModal.js

// 1) Pegar referências corretas
const fichaModal = document.getElementById('ficha-modal');
const fecharModalButton = document.getElementById('fechar-modal');

// 2) Ao clicar no ícone “chat”
document.querySelectorAll('button span.material-symbols-outlined')
  .forEach(icon => {
    if (icon.textContent.trim() !== 'chat') return;

    icon.parentElement.addEventListener('click', () => {
      // Aqui você poderia pegar dados da linha <tr> se quiser

      // Mostrar o modal
      fichaModal.classList.remove('hidden');
    });
  });

// 3) Fechar o modal ao clicar no botão de fechar
fecharModalButton.addEventListener('click', () => {
  fichaModal.classList.add('hidden');
});





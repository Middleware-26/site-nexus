let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Seleciona todos os dots (assumindo que você já inseriu as <span> em HTML)
const indicators = document.querySelectorAll('.indicators span');

// Função para mudar os slides
function changeSlide() {
    // Desloca os slides
    const slideWidth = slides[0].clientWidth;
    document.querySelector('.slides').style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

// Atualiza a classe .active nos indicadores
function updateIndicators() {
    indicators.forEach(dot => dot.classList.remove('active'));
    indicators[currentIndex].classList.add('active');
}

// Função para ir para o slide anterior
function prevSlide() {
    currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
    changeSlide();
    updateIndicators();
}

// Função para ir para o slide seguinte
function nextSlide() {
    currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
    changeSlide();
    updateIndicators();
}

// Adiciona clique nos indicadores para saltar diretamente ao slide
indicators.forEach(dot => {
    dot.addEventListener('click', () => {
        currentIndex = Number(dot.dataset.index);
        changeSlide();
        updateIndicators();
    });
});

// Definir intervalos automáticos para o slide
setInterval(nextSlide, 5000); // 5000ms = 5 segundos

// Eventos de clique nos botões de navegação
document.querySelector('.prev').addEventListener('click', prevSlide);
document.querySelector('.next').addEventListener('click', nextSlide);

// Inicializa o slide e os indicadores
changeSlide();
updateIndicators();

// public/js/flipbook.js
// public/js/flipbook.js

// 1. Lista de páginas del libro (en pares: izquierda, derecha)
const pageImages = [
  '/items/1.jpg',
  '/items/2.jpg',
  '/items/3.jpg',
  '/items/4.jpg',
  '/items/5.jpg',
  '/items/6.jpg',
  '/items/7.jpg',
  '/items/8.jpg'
];

// Cada "spread" es un par de páginas (izquierda/derecha)
const spreads = [];
for (let i = 0; i < pageImages.length; i += 2) {
  spreads.push([pageImages[i], pageImages[i + 1] || null]);
}

let currentSpread = 0;
let isFlipping = false;

function setupFlipbook() {
  const leftEl = document.getElementById('leftPage');
  const rightEl = document.getElementById('rightPage');
  const flipEl = document.getElementById('flipPage');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  if (!leftEl || !rightEl || !flipEl || !prevBtn || !nextBtn) return;

  function renderSpread() {
    const [leftSrc, rightSrc] = spreads[currentSpread];

    leftEl.style.backgroundImage = leftSrc
      ? `url(${leftSrc})`
      : 'none';

    if (rightSrc) {
      rightEl.style.display = 'block';
      rightEl.style.backgroundImage = `url(${rightSrc})`;
    } else {
      // Última hoja impar
      rightEl.style.display = 'none';
    }

    prevBtn.disabled = currentSpread === 0;
    nextBtn.disabled = currentSpread === spreads.length - 1;
  }

  function flip(direction) {
    if (isFlipping) return;

    const delta = direction === 'next' ? 1 : -1;
    const nextSpread = currentSpread + delta;

    if (nextSpread < 0 || nextSpread >= spreads.length) return;

    isFlipping = true;

    const [leftSrc, rightSrc] = spreads[currentSpread];
    const [nextLeftSrc, nextRightSrc] = spreads[nextSpread];

    // Configuramos la página que "se voltea"
    flipEl.classList.remove(
      'is-active',
      'is-flipping-next',
      'is-flipping-prev'
    );

    // Forzar reflow para reiniciar la animación
    void flipEl.offsetWidth;

    if (direction === 'next') {
      // volteo derecha -> izquierda
      flipEl.style.backgroundImage = rightSrc
        ? `url(${rightSrc})`
        : 'none';
      flipEl.classList.add('is-active', 'is-flipping-next');
    } else {
      // volteo izquierda <- derecha
      flipEl.style.backgroundImage = leftSrc
        ? `url(${leftSrc})`
        : 'none';
      flipEl.classList.add('is-active', 'is-flipping-prev');
    }

    flipEl.addEventListener(
      'animationend',
      () => {
        currentSpread = nextSpread;
        renderSpread();

        flipEl.classList.remove(
          'is-active',
          'is-flipping-next',
          'is-flipping-prev'
        );
        isFlipping = false;
      },
      { once: true }
    );
  }

  prevBtn.addEventListener('click', () => flip('prev'));
  nextBtn.addEventListener('click', () => flip('next'));

  // Navegación con teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') flip('next');
    if (e.key === 'ArrowLeft') flip('prev');
  });

  // Render inicial
  renderSpread();
}

document.addEventListener('DOMContentLoaded', setupFlipbook);

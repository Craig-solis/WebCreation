document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const dotsNav = document.querySelector('.carousel-dots');
  const leftButton = document.querySelector('.nav.left');
  const rightButton = document.querySelector('.nav.right');

  let cards = Array.from(track.children);
  const totalCards = cards.length;

  // Clone first and last cards for infinite effect
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);
  firstClone.id = 'first-clone';
  lastClone.id = 'last-clone';

  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  cards = Array.from(track.children); // Update cards list

  function getCardWidth() {
    return cards[1].offsetWidth;
  }

  function getContainerWidth() {
    return track.parentElement.offsetWidth;
  }

  let currentIndex = 1; // Start at first real card

  function setTrackPosition(animate = true) {
    const cardStyle = getComputedStyle(cards[1]);
    const cardWidth = getCardWidth() + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
    const containerWidth = getContainerWidth();
    const offset = (containerWidth - cardWidth) / 2;
    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(${-cardWidth * currentIndex + offset}px)`;
  }

  setTrackPosition(false);

  // Create dots for real cards
  dotsNav.innerHTML = '';
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = i + 1;
      setTrackPosition();
      updateDots();
      updateOpacity();
    });
    dotsNav.appendChild(dot);
  }

  function updateDots() {
    const dots = Array.from(dotsNav.children);
    dots.forEach(dot => dot.classList.remove('active'));
    let dotIndex = currentIndex - 1;
    if (currentIndex === 0) dotIndex = totalCards - 1;
    if (currentIndex === cards.length - 1) dotIndex = 0;
    if (dots[dotIndex]) dots[dotIndex].classList.add('active');
  }

  function updateOpacity() {
    cards.forEach((card, index) => {
      card.classList.remove('active', 'left', 'right');
      if (index === currentIndex) card.classList.add('active');
      if (index === currentIndex - 1) card.classList.add('left');
      if (index === currentIndex + 1) card.classList.add('right');
    });
  }

  function moveToNext() {
    if (currentIndex >= cards.length - 1) return;
    currentIndex++;
    setTrackPosition();
    updateDots();
    updateOpacity();
  }

  function moveToPrev() {
    if (currentIndex <= 0) return;
    currentIndex--;
    setTrackPosition();
    updateDots();
    updateOpacity();
  }

  rightButton.addEventListener('click', moveToNext);
  leftButton.addEventListener('click', moveToPrev);

  // --- Feature 1: Click on left/right card to activate it ---
  track.addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.carousel-card');
    if (!clickedCard) return;
    const idx = cards.indexOf(clickedCard);
    if (idx === currentIndex - 1) {
      moveToPrev();
    } else if (idx === currentIndex + 1) {
      moveToNext();
    }
  });

  // --- Feature 2: Swipe/drag support (mouse and touch) ---
  let startX = 0;
  let isDragging = false;
  let animationFrame;

  function onDragStart(e) {
    isDragging = true;
    startX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    track.style.transition = 'none';
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const dx = x - startX;
    const cardStyle = getComputedStyle(cards[1]);
    const cardWidth = getCardWidth() + parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
    const containerWidth = getContainerWidth();
    const offset = (containerWidth - cardWidth) / 2;
    track.style.transform = `translateX(${-cardWidth * currentIndex + offset + dx}px)`;
  }

  function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const x = e.type.startsWith('touch') ? (e.changedTouches[0]?.clientX ?? 0) : e.clientX;
    const dx = x - startX;
    const threshold = getCardWidth() / 4; // Swipe at least 1/4 card width
    if (dx > threshold) {
      moveToPrev();
    } else if (dx < -threshold) {
      moveToNext();
    } else {
      setTrackPosition();
    }
  }

  // Mouse events
  track.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  // Touch events
  track.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('touchend', onDragEnd);

  track.addEventListener('transitionend', () => {
    if (cards[currentIndex].id === 'first-clone') {
      currentIndex = 1;
      setTrackPosition(false);
    }
    if (cards[currentIndex].id === 'last-clone') {
      currentIndex = cards.length - 2;
      setTrackPosition(false);
    }
    updateDots();
    updateOpacity();
  });

  // Responsive: update cardWidth on resize
  window.addEventListener('resize', () => {
    setTrackPosition(false);
  });

  updateDots();
  updateOpacity();
});

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('matrixRain');
  const ctx = canvas.getContext('2d');

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Characters to use
  const chars = '01';
  const fontSize = 35;
  const columns = Math.floor(window.innerWidth / fontSize);
  const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * (window.innerHeight / fontSize)));

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";
    ctx.fillStyle = "rgb(0, 255, 200)";

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 60);
});


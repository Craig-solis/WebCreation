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

  // Use offsetWidth for reliability
  function getCardWidth() {
    return cards[1].offsetWidth;
  }

  function getContainerWidth() {
    return track.parentElement.offsetWidth;
  }

  let currentIndex = 1; // Start at first real card

  function setTrackPosition(animate = true) {
    const cardWidth = getCardWidth();
    const containerWidth = getContainerWidth();
    // Calculate offset so the active card is centered
    const offset = (containerWidth - cardWidth) / 2;
    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(${-cardWidth * currentIndex + offset}px)`;
  }

  setTrackPosition(false);

  // Create 5 dots for 5 real cards
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


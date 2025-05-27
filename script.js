document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slider-track');
    const images = document.querySelectorAll('.slider-img');
    const leftArrow = document.querySelector('.slider-arrow.left');
    const rightArrow = document.querySelector('.slider-arrow.right');
    const dotsContainer = document.querySelector('.slider-dots');
    let current = 0;

    // Create dots
    dotsContainer.innerHTML = '';
    images.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function updateSlider() {
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[current].classList.add('active');
    }

    function goToSlide(idx) {
        current = idx;
        updateSlider();
    }

    leftArrow.addEventListener('click', () => {
        current = (current === 0) ? images.length - 1 : current - 1;
        updateSlider();
    });

    rightArrow.addEventListener('click', () => {
        current = (current === images.length - 1) ? 0 : current + 1;
        updateSlider();
    });

    // Touch swipe support
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchmove', function(e) {
        endX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', function() {
        if (startX && endX) {
            if (startX - endX > 50) {
                // Swipe left
                current = (current === images.length - 1) ? 0 : current + 1;
                updateSlider();
            } else if (endX - startX > 50) {
                // Swipe right
                current = (current === 0) ? images.length - 1 : current - 1;
                updateSlider();
            }
        }
        startX = 0;
        endX = 0;
    });

    // Initialize position
    updateSlider();
});

const images = document.querySelectorAll(".TrackLogo");
        let currentIndex = 0;

        function updateCarousel() {
            images.forEach((img, index) => {
                img.style.opacity = index === currentIndex ? 1 : 0;
            });
            currentIndex = (currentIndex + 1) % images.length;
        }

        setInterval(updateCarousel, 10000);

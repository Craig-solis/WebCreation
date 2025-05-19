const images = document.querySelectorAll(".TrackLogo");
        let currentIndex = 0;

        function updateCarousel() {
            images.forEach((img, index) => {
                img.style.opacity = index === currentIndex ? 1 : 0;
            });
            currentIndex = (currentIndex + 1) % images.length;
        }

        setInterval(updateCarousel, 2000);

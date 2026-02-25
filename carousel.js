// Carousel functionality for Regulamentos section
document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('regulamentosCarousel');
    const track = carousel.querySelector('.carousel-track');
    const leftArrow = carousel.parentElement.querySelector('.carousel-arrow-left');
    const rightArrow = carousel.parentElement.querySelector('.carousel-arrow-right');

    const cardWidth = 320; // Scroll one card at a time (280px card + gap)

    // Scroll left
    leftArrow.addEventListener('click', function () {
        track.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });

    // Scroll right
    rightArrow.addEventListener('click', function () {
        track.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });

    // Update arrow visibility based on scroll position
    function updateArrows() {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;

        // Hide left arrow at start
        leftArrow.style.opacity = scrollLeft <= 0 ? '0.3' : '1';
        leftArrow.style.pointerEvents = scrollLeft <= 0 ? 'none' : 'auto';

        // Hide right arrow at end
        rightArrow.style.opacity = scrollLeft >= maxScroll - 5 ? '0.3' : '1';
        rightArrow.style.pointerEvents = scrollLeft >= maxScroll - 5 ? 'none' : 'auto';
    }

    track.addEventListener('scroll', updateArrows);
    updateArrows(); // Initial state
});

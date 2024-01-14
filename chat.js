let currentSlide = 0;

function changeSlide(n) {
    showSlide(currentSlide += n);
}

function showSlide(n) {
    const slides = document.querySelector('.slider');
    if (n >= slides.children.length) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = slides.children.length - 1;
    } else {
        currentSlide = n;
    }

    slides.style.transform = `translateX(${-currentSlide * 100}%)`;
}

// Automatic slideshow
setInterval(() => {
    changeSlide(1);
}, 3000); // Change the interval (in milliseconds) here
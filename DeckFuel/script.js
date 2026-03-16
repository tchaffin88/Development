/* Pokémon Center–style underline animation */
const navLinks = document.querySelectorAll(".nav a");
const underline = document.querySelector(".nav-underline");

navLinks.forEach(link => {
    link.addEventListener("mouseenter", e => {
        const rect = e.target.getBoundingClientRect();
        const navRect = e.target.parentElement.parentElement.getBoundingClientRect();
        underline.style.width = rect.width + "px";
        underline.style.left = rect.left - navRect.left + "px";
    });
});

document.querySelector(".nav").addEventListener("mouseleave", () => {
    underline.style.width = "0";
});

let slideIndex = 0;
let slides = document.querySelectorAll(".slide");
let autoPlay = true;
let slideInterval = setInterval(nextSlide, 5000); // 5 seconds

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[n].classList.add("active");
}

function nextSlide() {
    if (!autoPlay) return;
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
}

/* Buttons */
document.querySelector(".next").addEventListener("click", () => {
    autoPlay = false;
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
});

document.querySelector(".prev").addEventListener("click", () => {
    autoPlay = false;
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
});

/* Pause/Play Button */
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", () => {
    autoPlay = !autoPlay;
    pauseBtn.textContent = autoPlay ? "❚❚" : "▶";
});

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

/* HERO SLIDESHOW */
let heroIndex = 0;
const heroSlides = document.querySelectorAll(".hero-slide");

function cycleHero() {
    heroSlides[heroIndex].classList.remove("active");
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.add("active");
}

setInterval(cycleHero, 5000); // 5 seconds per slide
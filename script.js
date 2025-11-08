// Force dark mode on load
document.body.classList.add('dark-mode');

// Start experience button logic
document.getElementById('start-experience').addEventListener('click', () => {
  const video = document.getElementById('bg-video');
  video.muted = false;
  video.play();
  document.getElementById('start-experience').style.display = 'none';
});

// Reveal sections on scroll
const revealSections = () => {
  const sections = document.querySelectorAll('section');
  const triggerBottom = window.innerHeight * 0.85;

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// Dynamic content loader
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    const container = document.getElementById('content-container');

    if (page) {
      container.classList.add('fade-out');

      setTimeout(() => {
        fetch(page)
          .then(res => res.text())
          .then(html => {
            container.innerHTML = html;
            container.classList.remove('fade-out');
            setTimeout(() => {
              revealSections();
            }, 50);
          });
      }, 300);
    }
  });
});
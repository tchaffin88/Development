// Force dark mode on load
document.body.classList.add('dark-mode');

// Start experience button logic
document.getElementById('start-experience').addEventListener('click', () => {
  const video = document.getElementById('bg-video');
  video.muted = false;
  video.play();
  document.getElementById('start-experience').style.display = 'none';
});

// Countdown logic
function updateCountdown() {
  const countdownElement = document.getElementById("countdown-timer");
  if (!countdownElement) return;
  const targetTime = new Date("2025-11-22T18:00:00-05:00").getTime();
  const now = new Date().getTime();
  const distance = targetTime - now;

  if (distance <= 0) {
    countdownElement.textContent = "Mission Initiated";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownElement.textContent = `Countdown: ${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

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
              if (page.includes("rsvp")) {
                initRSVP();

                // Delay slightly to ensure overlay is in DOM
                setTimeout(() => {
                  const overlay = document.getElementById("confirmation-overlay");
                  if (overlay) overlay.classList.add("hidden");
                }, 50);
              }
            }, 50);
          });
      }, 300);
    }
  });
});

// Modular RSVP logic
function initRSVP() {
  const form = document.querySelector("#rsvp-form");
  if (!form) return;

  const nameInput = form.querySelector("input[name='name']");
  const emailInput = form.querySelector("input[name='email']");
  const submitButton = form.querySelector("button");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form intercepted");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      showStatus("Please fill out all fields.", "error");
      return;
    }

    submitButton.disabled = true;
    showStatus("Deploying confirmation beacon...", "loading");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        showStatus("Mission confirmed. Directions inbound.", "success");
        form.reset();
        showOverlay();
      } else {
        showStatus("Transmission failed. Try again later.", "error");
      }
    } catch (err) {
      console.error("RSVP error:", err);
      showStatus("System offline. Please retry.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  function showStatus(message, type) {
    let statusEl = document.querySelector(".rsvp-status");
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.className = "rsvp-status";
      form.appendChild(statusEl);
    }

    statusEl.textContent = message;
    statusEl.style.color =
      type === "success"
        ? "#00ffcc"
        : type === "error"
          ? "#ff4444"
          : "#ffffff";
    statusEl.style.fontWeight = "bold";
    statusEl.style.marginTop = "1rem";
  }

  function showOverlay() {
    const overlay = document.getElementById("confirmation-overlay");
    if (!overlay) return;

    overlay.classList.remove("hidden");

    const closeBtn = document.getElementById("close-overlay");
    if (closeBtn) {
      closeBtn.onclick = () => {
        overlay.classList.add("hidden");
      };
    }
  }
}
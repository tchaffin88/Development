// Force dark mode on load
document.body.classList.add('dark-mode');

// Start experience button logic
document.getElementById('start-experience').addEventListener('click', () => {
  const video = document.getElementById('bg-video');
  const overlay = document.getElementById('video-overlay');

  video.muted = false;
  video.play();
  video.classList.add('visible');
  overlay.classList.add('hidden');
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
                // Removed the previous faulty logic to hide the overlay here.
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

  const steps = form.querySelectorAll(".form-step");
  let currentStep = 0;

  const overlay = document.getElementById("confirmation-overlay");
  const closeBtn = document.getElementById("close-overlay");

  // Ensure overlay hidden by default
  if (overlay) overlay.classList.add("hidden");
  if (closeBtn && overlay) {
    closeBtn.onclick = () => overlay.classList.add("hidden");
  }

  // Step navigation
  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle("active", i === index));
  }
  form.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });
  form.querySelectorAll(".prev-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });
  showStep(currentStep);

  // Submit logic
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form intercepted");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.name || !data.email) {
      showStatus("Please fill out all required fields.", "error");
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    showStatus("Deploying confirmation beacon...", "loading");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showStatus("Mission confirmed. Directions inbound.", "success");
        form.reset();
        currentStep = 0;
        showStep(currentStep);
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
      type === "success" ? "#00ffcc" :
      type === "error"   ? "#ff4444" :
                           "#ffffff";
    statusEl.style.fontWeight = "bold";
    statusEl.style.marginTop = "1rem";
  }

  function showOverlay() {
    if (!overlay) return;
    overlay.classList.remove("hidden");
  }
}
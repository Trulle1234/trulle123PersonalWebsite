document.addEventListener("DOMContentLoaded", () => {
  const hamMenu      = document.querySelector(".ham-menu");
  const offScreenMenu = document.querySelector(".off-screen-menu");

  hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
    const isActive = offScreenMenu.classList.contains("active");

    hamMenu.textContent = isActive ? "✕" : "☰";
  });

  
  filey = document.getElementById("filey")

  function fileyBlink() {
    filey.src="filey/dithered/filey_blink.png"
    setTimeout(() => {
      filey.src = "filey/dithered/filey_idle.png";
    }, 150);
  }

  function scheduleRandomBlink() {
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      fileyBlink();
      scheduleRandomBlink();
    }, delay);
  }

  scheduleRandomBlink();
});

const root = document.documentElement;

function updateChroab() {
  const base = 2

  const jitter   = (Math.random() * 2 - 1);
  const strength = Math.round(Math.max(1, Math.min(8, base + jitter)));

  root.style.setProperty("--chroab-strength", `${strength}px`);
}

window.addEventListener("resize", updateChroab);
setInterval(updateChroab, 256);

updateChroab();

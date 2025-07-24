document.addEventListener("DOMContentLoaded", () => {
  const hamMenu      = document.querySelector(".ham-menu");
  const offScreenMenu = document.querySelector(".off-screen-menu");

  hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
    const isActive = offScreenMenu.classList.contains("active");

    hamMenu.textContent = isActive ? "✕" : "☰";
  });
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

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

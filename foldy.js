document.addEventListener("DOMContentLoaded", () => {
  const foldy = document.getElementById("foldy")
  const foldyWrapper = document.querySelector(".foldy");

  foldyWrapper.addEventListener("click", function () {
      const dialog = document.querySelector(".foldy-dialog");
      dialog.classList.toggle("active");
      foldyWrapper.classList.toggle("talking");
  });


  function foldyBlink() {
    foldy.src="foldy/dithered/blink.png"
    setTimeout(() => {
      foldy.src = "foldy/dithered/idle.png";
    }, 200);
  }

  function scheduleRandomBlink() {
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      foldyBlink();
      scheduleRandomBlink();
    }, delay);
  }

  scheduleRandomBlink();
});
const foldyLines = new Map([
    ["hi", "Hi I am Foldy, your assistant on this website!"]
]);

document.addEventListener("DOMContentLoaded", () => {
    const foldy = document.getElementById("foldy");
    const foldyWrapper = document.querySelector(".foldy");
    const foldyInput = document.getElementById("foldy-input");

    var inputString = ""

    foldyWrapper.addEventListener("click", function () {
        const dialog = document.querySelector(".foldy-dialog");
        dialog.classList.toggle("active");
        foldyWrapper.classList.toggle("talking");
    });

    foldyInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
        const value = foldyInput.value.trim();
        if (value !== "") {
            inputString = value.toLowerCase();
            foldyInput.value = "";
        }
        }
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
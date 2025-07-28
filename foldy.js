const foldyLines = new Map([
    [["hi", "hello"], ["Hello! How can I help you?", "foldy/dithered/idle.png"]],
    [["who are you", "what are you", "do you do"], ["I am Foldy, your helper for Trulle123's website.", "foldy/dithered/idle.png"]],
    [["ai", "artificial intelligence"], ["No, No I am no AI, I am an AS (Artificial Stupidity).", "foldy/dithered/jugemental.png"]],
    [["sleep", "late"], ["Okay I'll sleep! 1 sheep, 2 sheep, 3 sheep, 4 sheep, 5 sheep, 6 sh....", "foldy/dithered/sleeping.png"]]
]);

document.addEventListener("DOMContentLoaded", () => {
    const foldy = document.getElementById("foldy");
    const foldyWrapper = document.querySelector(".foldy");
    const foldyInput = document.getElementById("foldy-input");
    const foldyReply = document.getElementById("foldy-reply")

    foldyWrapper.addEventListener("click", function () {
        const dialog = document.querySelector(".foldy-dialog");
        dialog.classList.toggle("active");
        foldyWrapper.classList.toggle("talking");
        foldyReply.innerHTML = "";

        if (!dialog.classList.contains("active")) {
            foldy.src = "foldy/dithered/idle.png";
        }
    });

    foldyInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const value = foldyInput.value.trim();
            if (value !== "") {
                const reply = getFoldyReply(value);
                foldyReply.innerHTML = reply.text;
                foldy.src = reply.image;
                foldyInput.value = "";
            }
        }
    });
    
    function foldyBlink() {
        if (!foldy.src.endsWith("idle.png")) return;

        foldy.src = "foldy/dithered/blink.png";
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

function getFoldyReply(input) {
    input = input.toLowerCase();
    for (const [keys, value] of foldyLines) {
        for (const key of keys) {
            if (input.includes(key)) {
                return {
                    text: value[0],
                    image: value[1]
                };
            }
        }
    }
    return {
        text: "I don't understad that yet. Do you need help with somthing else?",
        image: "foldy/dithered/thinking.png"
    };
}

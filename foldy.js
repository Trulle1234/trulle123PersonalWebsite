const foldyLines = new Map([
    [["what do you think", "opinion"], ["My opinion? I was not programmed for that responsibility.", "foldy/dithered/thinking.png"]],
    [["who are you", "what are you", "do you do"], ["I am Foldy, your helper for Trulle123's website.", "foldy/dithered/idle.png"]],
    [["artificial intelligence", "ai"], ["No, No I am no AI, I am an AS (Artificial Stupidity).", "foldy/dithered/judgmental.png"]],
    [["crash", "error", "uh oh"], ["Abort! Retry! Panic!!", "foldy/dithered/stressed.png"]],
    [["stop it", "shut up"], ["WELL EXCUSE ME FOR TRYING TO HELP!!", "foldy/dithered/angry.png"]],
    [["wrong", "is not", "s not", "stop"],["AND, I DID NOT UNDERSTAND CORRECTLY!! YOU DON'T HAVE TO GET ANGRY!!!! BLAME TRULLE, HE MADE ME!", "foldy/dithered/angry.png"]],
    [["what can you do", "can you even do", "you do", "do nothing", "do anything"], ["What can i do, Just check the github...           github.com/Trulle1234/            trulle123PersonalWebsite", "foldy/dithered/judgmental.png"]],
    [["bug", "this sucks"], ["Take it up with Trulle. I'm just the messenger!", "foldy/dithered/angry.png"]],
    [["stupid", "bad"], ["Awww that's not nice, Foldy sad now", "foldy/dithered/sad.png"]],
    [["serious", "really"], ["I'm judging you silently. Very silently.", "foldy/dithered/judgmental.png"]],
    [["bored", "nothing to do"], ["Try clicking around, or go to the Gallery and get inspired!", "foldy/dithered/thinking.png"]],
    [["sleep", "late"], ["Okay I'll sleep! 1 sheep, 2 sheep, 3 sheep, 4 sheep, 5 sheep, 6 sh....", "foldy/dithered/sleeping.png"]],
    [["hi", "hello"], ["Hello! How can I help you?", "foldy/dithered/idle.png"]],
]);

const foldyImgLines = new Map([
    [["flowers"], ["That is one of Trulle’s first good photos. The cool background was actually an accident while experimenting with editing.", "foldy/dithered/idle.png"]],
    [["factory"], ["This one was taken at a beach in Sweden. The smoke was added in post. If you look very closely, you can see a girl looking up at the dystopian sight.", "foldy/dithered/idle.png"]],
    [["laser"], ["This photo was taken in front of a concrete wall. The girl is holding Trulle’s lightsaber.", "foldy/dithered/idle.png"]],
    [["cows"], ["This photo is quite special — it's taken at 'Alvaret' on Öland, which is a national park. Trulle submitted this to 'Wiki Loves Earth 2024'.", "foldy/dithered/idle.png"]],
    [["sun_and_grass"], ["Also from Öland. This was captured at sundown at a rest area beside an old windmill.", "foldy/dithered/idle.png"]],
    [["field"], ["This photo shows a field outside of Kalmar. Fun fact: it’s the cover image for a Wikipedia article — can you find it without image search?", "foldy/dithered/idle.png"]],
    [["pier"], ["Taken on Gotland, this shows a little old swimming pier.", "foldy/dithered/idle.png"]],
    [["vespa"], ["Also from Gotland — a Vespa parked outside an Italian restaurant called 'Mille Lire', which means 'A Thousand Lire' (Italy’s old currency).", "foldy/dithered/idle.png"]],
    [["trash_rabbit"], ["This photo is very interesting — while walking around, Trulle found this: a discarded bag that looks a lot like a little bunny.", "foldy/dithered/idle.png"]],
    [["fire_sign"], ["This was taken at a restaurant in Copenhagen called Wok On, and it shows their logo.", "foldy/dithered/idle.png"]],
    [["street_lamp"], ["This photo speaks for itself — it’s a street lamp on a foggy night. Nothing more to say!", "foldy/dithered/idle.png"]],
    [["sun_down_on_mountain"], ["Taken at Idre Fjäll, right as the sun dipped below the mountains.", "foldy/dithered/idle.png"]],
    [["pizza"], ["Captured at Ernesto Ristorante in Kalmar, this shows a spicy pizza called 'Diavola'. The camera shown is the same one used for the last two photos.", "foldy/dithered/idle.png"]],
    [["primosten_at_night"], ["Taken by the statue on the mountain overlooking Primošten at night.", "foldy/dithered/idle.png"]],
    [["waterfall"], ["This is the largest waterfall at Krka National Park in Croatia. Trulle told me it was breathtaking in real life!", "foldy/dithered/idle.png"]],
    [["mill"], ["Also at Krka, this is one of the buildings in the water mill area.", "foldy/dithered/idle.png"]],
]);

function preloadFoldyImages() {
    const imageSet = new Set();

    for (const [, value] of foldyLines) {
        imageSet.add(value[1]);
    }

    for (const [, value] of foldyImgLines) {
        imageSet.add(value[1]);
    }

    imageSet.add("foldy/dithered/blink.png");

    for (const src of imageSet) {
        const img = new Image();
        img.src = src;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    preloadFoldyImages();
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

    const images = document.querySelectorAll(".images img");

    images.forEach(img => {
        img.addEventListener("click", function () {
            const altText = this.alt;
            const reply = getFoldyImgReply(altText);

            const dialog = document.querySelector(".foldy-dialog");
            dialog.classList.add("active");
            foldyWrapper.classList.add("talking");

            foldyReply.innerHTML = reply.text;
            foldy.src = reply.image;

            foldyInput.value = "";
        });
    });
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


function getFoldyImgReply(input) {
    for (const [keys, value] of foldyImgLines) {
        for (const key of keys) {
            if (input === key) {
                return {
                    text: value[0],
                    image: value[1]
                };
            }
        }
    }
}
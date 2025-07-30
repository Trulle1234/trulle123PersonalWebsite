const foldyLines = new Map([
    [["what do you think", "opinion"], ["My opinion? I was not programmed for that responsibility.", "foldy/dithered/thinking.png"]],
    [["who are you", "what are you", "do you do"], ["I am Foldy, your helper for Trulle123's website.", "foldy/dithered/idle.png"]],
    [["artificial intelligence", "ai"], ["No, No I am no AI, I am an AS (Artificial Stupidity).", "foldy/dithered/judgemental.png"]],
    [["crash", "error", "uh oh"], ["Abort! Retry! Panic!!", "foldy/dithered/stressed.png"]],
    [["stop it", "shut up"], ["WELL EXCUSE ME FOR TRYING TO HELP!!", "foldy/dithered/angry.png"]],
    [["wrong", "is not", "s not", "stop"],["AND, I DID NOT UNDERSTAND CORRECTLY!! YOU DON'T HAVE TO GET ANGRY!!!! BLAME TRULLE, HE MADE ME!", "foldy/dithered/angry.png"]],
    [["bug", "this sucks"], ["Take it up with Trulle. I'm just the messenger!", "foldy/dithered/angry.png"]],
    [["stupid", "bad"], ["Awww that's not nice, Foldy sad now", "foldy/dithered/sad.png"]],
    [["serious", "really"], ["I'm judging you silently. Very silently.", "foldy/dithered/judgemental.png"]],
    [["bored", "nothing to do"], ["Try clicking around, or go to the Gallery and get inspired!", "foldy/dithered/thinking.png"]],
    [["sleep", "late"], ["Okay I'll sleep! 1 sheep, 2 sheep, 3 sheep, 4 sheep, 5 sheep, 6 sh....", "foldy/dithered/sleeping.png"]],
    [["hi", "hello"], ["Hello! How can I help you?", "foldy/dithered/idle.png"]],
]);

const foldyImgLines = new Map([
    [["flowers"], ["That is one of Trulles first good photos, the cool background was accidental when messing with editing.", "foldy/dithered/idle.png"]],
    [["factory"], ["This one is taken at a beach in Sweden. The somke is added in post. If you look very closly you can see a girl looking up at the dystopian sight.", "foldy/dithered/idle.png"]],
    [["laser"], ["The photo is taken in front of a concreate wall and the girl is holding Trulles light saber.", "foldy/dithered/idle.png"]],
    [["cows"], ["This photo is quite special as it is taken at \"Alvaret\" on Öland. Which is a national park. Trulle submited this to \"Wiki Loves Earth 2024\".", "foldy/dithered/idle.png"]],
    [["sun_and_grass"], ["This image is also from Öland. It is captured at sundown at a rest area beside an old windmill.", "foldy/dithered/idle.png"]],
    [["field"], ["The image shows a field outside of Kalmar. Fun fact, this is the cover image for a wikipedia article, can you find it without image serch?", "foldy/dithered/idle.png"]],
    [["pier"], ["That one is taken on Gotland and it shows a litte old swimming pier.", "foldy/dithered/idle.png", "foldy/dithered/idle.png"]],
    [["vespa"], ["Also from Gotland, a vespa outside of an italian resturant called \"Mille Lire\" which means \"A thousand Lire\" (lire was there currency before the euro).", "foldy/dithered/idle.png"]],
    [["trash_rabbit"], ["This photo is very intersting, you see when Trulle was waliking around he found this. A bag somone threw away that looked a lot like a litte bunny.", "foldy/dithered/idle.png"]],
    [["fire_sign"], ["The photo here is taken at a restaurant in Copenhagen called Wok On and it shows there logo.", "foldy/dithered/idle.png"]],
    [["street_lamp"], ["This photo speeks for it self, its a street lamp on a fogy night. Nothing more to say!", "foldy/dithered/idle.png"]],
    [["sun_down_on_mountain"], ["This is taken on Idre Fjäll right as the sun goes dow below the mountains.", "foldy/dithered/idle.png"]],
    [["pizza"], ["Captured at Ernesto Ristorante in Kalmar the photo shows a spicy pizza caled \"Diavola\". The camera shown is the one used for the two last photos.", "foldy/dithered/idle.png"]],
    [["primosten_at_night"], ["This photo is taken right by the statue on the mountain overlooking Primosten.", "foldy/dithered/idle.png"]],
    [["waterfall"], ["Here you see the biggest of the waterfalls at Krka National Park in Croatia. Trulle told me it was very beautiful IRL there.", "foldy/dithered/idle.png"]],
    [["mill"], ["Also at Krka this is one of the houses in the water mill.", "foldy/dithered/idle.png"]],
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
/* ==========================================================
   AVION Premium Avatar V2.1
   Part 5 - Avatar Engine
========================================================== */

class AvionAvatar {

    constructor() {

        this.avatar = document.getElementById("avionAvatar");

        this.leftEye = document.querySelector(".left-eye");
        this.rightEye = document.querySelector(".right-eye");

        this.mouth = document.getElementById("mouth");

        this.state = "idle";

        this.init();

    }

    init() {

        if (!this.avatar) return;

        this.wakeUp();

        this.startBlinking();

        this.startBreathing();

    }

    /* ==========================
       Wake Up Animation
    ========================== */

    wakeUp() {

        this.avatar.style.opacity = "0";

        this.avatar.animate([

            {
                opacity: 0,
                transform: "translateY(30px) scale(.9)"
            },

            {
                opacity: 1,
                transform: "translateY(0) scale(1)"
            }

        ], {

            duration: 1200,
            easing: "ease-out",
            fill: "forwards"

        });

    }

    /* ==========================
       Natural Blinking
    ========================== */

    startBlinking() {

        setInterval(() => {

            this.blink();

        }, 4500 + Math.random() * 2500);

    }

    blink() {

        if (!this.leftEye || !this.rightEye) return;

        this.leftEye.animate([
            { transform: "scaleY(1)" },
            { transform: "scaleY(.08)" },
            { transform: "scaleY(1)" }
        ], {
            duration: 180
        });

        this.rightEye.animate([
            { transform: "scaleY(1)" },
            { transform: "scaleY(.08)" },
            { transform: "scaleY(1)" }
        ], {
            duration: 180
        });

    }

    /* ==========================
       Idle Breathing
    ========================== */

    startBreathing() {

        setInterval(() => {

            if (this.state !== "idle") return;

            this.avatar.animate([

                {
                    transform: "translateY(0px)"
                },

                {
                    transform: "translateY(-5px)"
                },

                {
                    transform: "translateY(0px)"
                }

            ], {

                duration: 3500

            });

        }, 3500);

    }

    /* ==========================
       Listening
    ========================== */

    startListening() {

        this.state = "listening";

        this.avatar.classList.remove("speaking", "thinking");

        this.avatar.classList.add("listening");

    }

    stopListening() {

        this.avatar.classList.remove("listening");

        this.state = "idle";

    }

    /* ==========================
       Thinking
    ========================== */

    thinking() {

        this.state = "thinking";

        this.avatar.classList.remove("listening", "speaking");

        this.avatar.classList.add("thinking");

    }

    stopThinking() {

        this.avatar.classList.remove("thinking");

        this.state = "idle";

    }

    /* ==========================
       Speaking
    ========================== */

    startSpeaking() {

        this.state = "speaking";

        this.avatar.classList.remove("listening", "thinking");

        this.avatar.classList.add("speaking");

    }

    stopSpeaking() {

        this.avatar.classList.remove("speaking");

        this.state = "idle";

    }

    /* ==========================
       Smile
    ========================== */

    smile() {

        if (!this.mouth) return;

        this.mouth.animate([

            {
                transform: "translateX(-50%) scaleY(1)"
            },

            {
                transform: "translateX(-50%) scaleY(1.4)"
            },

            {
                transform: "translateX(-50%) scaleY(1)"
            }

        ], {

            duration: 700

        });

    }

}

/* ==========================================================
   Create Avatar
========================================================== */

let avionAvatar = null;

function initAvatar() {
    avionAvatar = new AvionAvatar();
}
/* ==========================================================
   Global Functions
========================================================== */

function avatarStartListening() {
    if (!avionAvatar) return;

    avionAvatar.startListening();

}

function avatarStopListening() {
    if (!avionAvatar) return;

    avionAvatar.stopListening();

}

function avatarThinking() {
    if (!avionAvatar) return;

    avionAvatar.thinking();

}

function avatarStopThinking() {
    if (!avionAvatar) return;

    avionAvatar.stopThinking();

}

function avatarStartSpeaking() {
    if (!avionAvatar) return;

    avionAvatar.startSpeaking();

}

function avatarStopSpeaking() {
    if (!avionAvatar) return;

    avionAvatar.stopSpeaking();

}

function avatarSmile() {
    if (!avionAvatar) return;

    avionAvatar.smile();

}
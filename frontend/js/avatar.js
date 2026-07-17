/* ==========================================
   AVION Premium Avatar
   File: js/avatar.js
========================================== */

class AvionAvatar {

    constructor() {

        this.leftEye = document.getElementById("leftEye");
        this.rightEye = document.getElementById("rightEye");
        this.mouth = document.getElementById("mouth");
        this.statusText = document.querySelector(".avatar-status span:last-child");
        this.statusDot = document.querySelector(".status-dot");

        this.isTalking = false;
        this.isListening = false;

        this.startIdle();

    }

    startIdle() {

        this.setStatus("ONLINE");

        this.randomBlink();

    }

    randomBlink() {

        setInterval(() => {

            if (!this.leftEye || !this.rightEye) return;

            this.leftEye.style.transform = "scaleY(.05)";
            this.rightEye.style.transform = "scaleY(.05)";

            setTimeout(() => {

                this.leftEye.style.transform = "scaleY(1)";
                this.rightEye.style.transform = "scaleY(1)";

            }, 150);

        }, 4000 + Math.random() * 3000);

    }

    startTalking() {

        if (this.isTalking) return;

        this.isTalking = true;

        this.setStatus("SPEAKING");

        this.talkAnimation = setInterval(() => {

            this.mouth.setAttribute(
                "d",
                "M180 220 Q200 242 220 220"
            );

            setTimeout(() => {

                this.mouth.setAttribute(
                    "d",
                    "M180 220 Q200 233 220 220"
                );

            }, 180);

        }, 300);

    }

    stopTalking() {

        this.isTalking = false;

        clearInterval(this.talkAnimation);

        this.mouth.setAttribute(
            "d",
            "M180 220 Q200 233 220 220"
        );

        this.setStatus("ONLINE");

    }

    startListening() {

        this.isListening = true;

        this.setStatus("LISTENING");

        this.statusDot.style.background = "#00ffff";
        this.statusDot.style.boxShadow = "0 0 20px cyan";

    }

    stopListening() {

        this.isListening = false;

        this.statusDot.style.background = "#00ff88";
        this.statusDot.style.boxShadow = "0 0 12px #00ff88";

        this.setStatus("ONLINE");

    }

    thinking() {

        this.setStatus("THINKING");

    }

    setStatus(text) {

        if (this.statusText)

            this.statusText.textContent = text;

    }

}

/* ------------------------------ */

window.addEventListener("DOMContentLoaded", () => {

    window.avatar = new AvionAvatar();

});

/* ======================================
   Demo
====================================== */

function demoConversation(){

    avatar.startListening();

    setTimeout(()=>{

        avatar.thinking();

    },2000);

    setTimeout(()=>{

        avatar.startTalking();

    },3500);

    setTimeout(()=>{

        avatar.stopTalking();

    },7000);

}

/* ======================================
   Future Integration

speechSynthesis

↓

avatar.startTalking()

↓

speech ends

↓

avatar.stopTalking()

====================================== */
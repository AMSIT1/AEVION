/*
==================================================
 AVION Premium 2C.2B
 Speech Recognition + TTS
==================================================
*/

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition is not supported.\nUse Google Chrome or Microsoft Edge.");
}

const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

/* ==========================================
   Start Listening
========================================== */

function startListening() {

    speechSynthesis.cancel();

    console.log("🎤 Listening...");

    recognition.start();

}

/* ==========================================
   Recognition Started
========================================== */

recognition.onstart = () => {

    console.log("Microphone Active");

    updateStatus("🎤 Listening...");

    if (typeof avatarStartListening === "function") {
        avatarStartListening();
    }

};

/* ==========================================
   Speech Result
========================================== */

recognition.onresult = async (event) => {

    const text = event.results[0][0].transcript;

    console.log("User:", text);

    updateConversation("You", text);

    if (typeof avatarStopListening === "function")
        avatarStopListening();

    if (typeof avatarThinking === "function")
        avatarThinking();

    let reply = "";

    try {

        reply = await sendToBrain(text);

    } catch (e) {

        console.error(e);

        reply = "Brain se connect nahi ho paaya.";

    }

    if (typeof avatarStopThinking === "function")
        avatarStopThinking();

    updateConversation("Avion", reply);

    speak(reply);

};

/* ==========================================
   Recognition Finished
========================================== */

recognition.onend = () => {

    console.log("Listening Finished");

    updateStatus("🟢 Online");

    if (typeof avatarStopListening === "function")
        avatarStopListening();

};

/* ==========================================
   Recognition Error
========================================== */

recognition.onerror = (event) => {

    console.error(event.error);

    updateStatus("🔴 " + event.error);

    if (typeof avatarStopListening === "function")
        avatarStopListening();

    if (typeof avatarStopThinking === "function")
        avatarStopThinking();

};

/* ==========================================
   Text To Speech
========================================== */

function speak(text) {

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "hi-IN";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    speech.onstart = () => {

        console.log("🗣 Avion Speaking");

        updateStatus("🗣 Speaking");

        if (typeof avatarStartSpeaking === "function")
            avatarStartSpeaking();

    };

    speech.onend = () => {

        updateStatus("🟢 Online");

        if (typeof avatarStopSpeaking === "function")
            avatarStopSpeaking();

        if (typeof avatarSmile === "function")
            avatarSmile();

    };

    speechSynthesis.speak(speech);

}

/* ==========================================
   UI Helpers
========================================== */

function updateStatus(text) {

    const status = document.getElementById("status");

    if (status)
        status.innerText = text;

}

function updateConversation(sender, message) {

    const box = document.getElementById("conversation");

    if (!box)
        return;

    const div = document.createElement("div");

    div.className = "msg";

    if (sender === "You") {

        div.innerHTML =
            "<span class='user'><b>You:</b></span> " + message;

    } else {

        div.innerHTML =
            "<span class='avion'><b>Avion:</b></span> " + message;

    }

    box.appendChild(div);

    box.scrollTop = box.scrollHeight;

}

/* ==========================================
   Talk Button
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const talkBtn = document.getElementById("talkBtn");

    if (talkBtn) {

        talkBtn.addEventListener("click", startListening);

    }

});
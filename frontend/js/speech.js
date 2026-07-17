/*
==================================================
 AVION Premium 2C.2B
 Speech Recognition
==================================================
*/

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition.\nPlease use Google Chrome or Microsoft Edge.");
}

const recognition = new SpeechRecognition();

recognition.lang = "hi-IN";          // Hindi
recognition.continuous = false;      // One sentence
recognition.interimResults = false;  // Final result only
recognition.maxAlternatives = 1;


/*
-------------------------------------
Start Listening
-------------------------------------
*/
function startListening() {

    console.log("🎤 Listening...");

    recognition.start();

}


/*
-------------------------------------
Recognition Started
-------------------------------------
*/
recognition.onstart = () => {

    console.log("Microphone Active");

    updateStatus("🎤 Listening...");

};


/*
-------------------------------------
Speech Result
-------------------------------------
*/
recognition.onresult = async (event) => {

    const text = event.results[0][0].transcript;

    console.log("User:", text);

    updateConversation("You", text);

    // Send to Python Brain
    const reply = await sendToBrain(text);

    updateConversation("Avion", reply);

    speak(reply);

};


/*
-------------------------------------
Recognition Finished
-------------------------------------
*/
recognition.onend = () => {

    console.log("Listening Finished");

    updateStatus("🟢 Online");

};


/*
-------------------------------------
Recognition Error
-------------------------------------
*/
recognition.onerror = (event) => {

    console.error(event.error);

    updateStatus("🔴 " + event.error);

};

/*
==================================================
Text To Speech
==================================================
*/

function speak(text) {

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "hi-IN";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    speech.onstart = () => {

        console.log("Avion Speaking");

        updateStatus("🗣 Speaking");

    };

    speech.onend = () => {

        updateStatus("🟢 Online");

    };

    speechSynthesis.speak(speech);

}
/*
========================================
Temporary UI Functions
========================================
*/

function updateStatus(status) {

    const el = document.getElementById("status");

    if (el) {
        el.innerText = status;
    }

}

function updateConversation(sender, message) {

    const box = document.getElementById("conversation");

    if (!box) return;

    box.innerHTML += `
        <div class="msg">
            <strong>${sender}:</strong> ${message}
        </div>
    `;

    box.scrollTop = box.scrollHeight;

}
/**
 * AVION API Bridge
 * Premium 2C.2B
 */

const API_URL = "/api/chat";

/**
 * Send user message to Python backend
 */
async function sendToBrain(message) {

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.reply);
        }

        return data.reply;

    } catch (error) {

        console.error("Brain Error:", error);

        return "Sorry. I am unable to connect to my brain.";

    }

}
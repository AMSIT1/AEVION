def generate_response(message: str) -> str:

    message = message.lower().strip()

    greetings = [
        "namaste",
        "namaskar",
        "hello",
        "hi",
        "नमस्ते",
        "नमस्कार",
        "हेलो"
    ]

    if message in greetings:
        return (
            "नमस्ते। मैं Avion हूँ। "
            "आपका स्वागत है। मैं आपकी किस तरह मदद कर सकती हूँ?"
        )

    if message in ["who are you", "tum kaun ho", "तुम कौन हो", "आप कौन हो"]:
        return (
            "मैं Avion हूँ। "
            "एक AI सहायक जो आपकी मदद के लिए बनाया गया है।"
        )

    return (
        "माफ़ कीजिए। मैं अभी इस प्रश्न को समझ नहीं पाई।"
    )
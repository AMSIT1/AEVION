"""
AVION AI Brain
Premium 2C.2B - Part 1
"""


def generate_response(message: str) -> str:
    """
    Generate a simple response based on the user's message.
    """

    message = message.lower().strip()

    # Greetings
    if message in ["namaste", "namaskar", "hello", "hi"]:
        return (
            "Namaste. Main Avion hoon. "
            "Aapka swagat hai. Main aapki kis tarah madad kar sakti hoon?"
        )

    # Identity
    elif "who are you" in message or "tum kaun ho" in message:
        return (
            "Main Avion hoon. "
            "Ek AI assistant jo aapki madad ke liye bana hai."
        )

    # Time
    elif "time" in message or "samay" in message:
        return (
            "Abhi main samay batane ke liye taiyar nahin hoon."
        )

    # Default
    return (
        "Maaf kijiye. Main abhi is prashn ko samajh nahin paayi."
    )
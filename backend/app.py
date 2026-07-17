from flask import Flask, request, jsonify
from brain.response import generate_response

app = Flask(
    __name__,
    static_folder="../frontend",
    static_url_path=""
)

@app.route("/")
def home():
    return app.send_static_file("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "success": False,
            "reply": "Please say something."
        }), 400

    return jsonify({
        "success": True,
        "reply": generate_response(message)
    })


if __name__ == "__main__":
    app.run(debug=True)
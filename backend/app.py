from flask import Flask, send_from_directory
import os

FRONTEND = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))

app = Flask(__name__, static_folder=FRONTEND)


@app.route("/")
def index():
    return send_from_directory(FRONTEND, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND, path)


if __name__ == "__main__":
    app.run(debug=True)
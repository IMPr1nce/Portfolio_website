import json
import os
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

MESSAGES_FILE = os.path.join(os.path.dirname(__file__), "messages.json")


def _load():
    if not os.path.exists(MESSAGES_FILE):
        return []
    with open(MESSAGES_FILE) as f:
        return json.load(f)


def _save(data):
    with open(MESSAGES_FILE, "w") as f:
        json.dump(data, f, indent=2)


@app.post("/api/messages")
def post_message():
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip()
    message = (body.get("message") or "").strip()

    if not name or not message:
        return jsonify({"error": "name and message are required"}), 400
    if len(message) > 2000:
        return jsonify({"error": "message too long (max 2000 chars)"}), 400

    entry = {
        "id": datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f"),
        "name": name,
        "email": email,
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    messages = _load()
    messages.append(entry)
    _save(messages)
    return jsonify({"ok": True}), 201


@app.get("/api/messages")
def get_messages():
    return jsonify(_load())


if __name__ == "__main__":
    app.run(port=5000, debug=True)

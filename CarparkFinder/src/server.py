from flask import Flask, request, jsonify
from flask_cors import CORS
import acc_database  # Import your database functions

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Validate user credentials
    if acc_database.login(email, password):
        return jsonify({"success": True, "message": "Login successful!"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid email or password!"}), 401

if __name__ == "__main__":
    app.run(debug=True)

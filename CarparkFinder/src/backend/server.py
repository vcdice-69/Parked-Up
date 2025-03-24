from flask import Flask, request, jsonify
from flask_cors import CORS
import acc_database  # Import your database functions

app = Flask(__name__)

# Enable CORS for all routes and methods, explicitly allowing frontend (localhost:3000)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    phone_no = data.get("phone_no")
    password = data.get("password")

    # Check if user already exists
    if acc_database.find_acc(email):
        return jsonify({"success": False, "message": "Email already exists!"}), 400

    # Create new user account
    if acc_database.new_acc(username, email, phone_no, password):
        return jsonify({"success": True, "message": "Account created successfully!"}), 200
    else:
        return jsonify({"success": False, "message": "Failed to create account!"}), 500

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

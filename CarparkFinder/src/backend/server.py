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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    # Here, validate the credentials, and fetch user from the database
    user = acc_database.find_acc(email)
    if user and user['password'] == password:
        return jsonify({
            'success': True,
            'user': user,  # Send the user object back
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401


@app.route("/profile/<email>", methods=["GET"])
def get_profile(email):
    user_data = acc_database.find_acc(email)
    if user_data:
        return jsonify({"success": True, "user": user_data}), 200
    else:
        return jsonify({"success": False, "message": "User not found."}), 404

@app.route("/update-profile", methods=["POST"])
def update_profile():
    data = request.json
    old_email = data.get("old_email")  # Capture old email
    new_email = data.get("email")  # User may change email
    username = data.get("username")
    phone_no = data.get("phone_no")
    password = data.get("password")

    # Check if old email exists
    user = acc_database.find_acc(old_email)
    print("Received a request to /update-profile")
    print(user)

    if not user:
        return jsonify({"success": False, "message": "User not found!"}), 404

    # If email is changed, ensure the new email isn't already taken
    if old_email != new_email and acc_database.find_acc(new_email):
        return jsonify({"success": False, "message": "Email already in use!"}), 400

    # Prepare updated data
    updated_data = {
        "username": username,
        "email": new_email,
        "phone_no": phone_no,
        "password": password
    }

    # Update in the database
    if acc_database.update_details(old_email, updated_data):
        return jsonify({
            "success": True,
            "message": "Profile updated successfully!",
            "email": new_email,
            "username": username,
            "phone_no": phone_no
        }), 200  # Successful update response
    else:
        return jsonify({"success": False, "message": "Failed to update profile!"}), 500


if __name__ == "__main__":
    app.run(debug=True)

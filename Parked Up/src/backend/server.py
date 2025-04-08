"""
Flask Server for User Account Management and Favourites API

This Flask server provides endpoints for managing user accounts and their 
associated carpark favourites. It supports user signup, login, profile management, 
account deletion, and adding/removing carpark favourites. It also includes 
basic functionality for updating user profile details such as email, username, 
phone number, and password.

The server uses CORS (Cross-Origin Resource Sharing) to allow communication 
with a frontend hosted on `http://localhost:3000`.

Key Routes and Their Purpose:
--------------------------------

1. **POST /signup**:
    - Registers a new user with the provided username, email, phone number, and password.
    - Checks if the email already exists before creating the account.
    - Returns a success message or error message based on the result.

2. **POST /login**:
    - Authenticates a user using their email and password.
    - If credentials are valid, it returns the user data.
    - Returns an error message if login fails due to invalid credentials.

3. **GET /profile/<email>**:
    - Retrieves the profile information for the user identified by the email.
    - Returns the user data or an error message if the user is not found.

4. **DELETE /delete-account/<email>**:
    - Deletes the user account identified by the email.
    - Deletes associated favourites before the account is removed.
    - Returns a success message or error message based on the result.

5. **POST /update-profile**:
    - Allows users to update their profile details (email, username, phone number, password).
    - Checks if the old email exists, verifies the current password, and handles potential conflicts like changing the email to one already in use.

6. **POST /add-favourite**:
    - Adds a carpark to the user's favourites list using their email and carpark number.
    - Returns success or error based on the result of the operation.

7. **POST /remove-favourite**:
    - Removes a carpark from the user's favourites list using their email and carpark number.
    - Returns success or error based on the result of the operation.

8. **GET /favourites/<email>**:
    - Retrieves the list of carparks that the user has added to their favourites using their email.
    - Returns the list of favourites or an error message if no favourites are found.

External Libraries Used:
-------------------------
1. **Flask**: The main web framework used for building the API.
2. **Flask-CORS**: A package used to handle Cross-Origin Resource Sharing (CORS) and enable requests from the frontend.
3. **acc_database**: A custom module that handles database operations (e.g., creating a new account, checking for existing accounts, adding/removing favourites, etc.).

Database Operations:
-------------------
The server interacts with the database using the functions from the `acc_database` module, which handles:
- User account creation and management (e.g., `find_acc`, `new_acc`, `update_details`, `delete_acc`).
- Handling user favourites (e.g., `add_fav`, `delete_fav`, `get_all_favs`, `delete_all_favs`).

"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import acc_database  # Import your database functions

# Create a Flask application
app = Flask(__name__)

# Enable CORS for all routes and methods, explicitly allowing frontend (localhost:3000)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route("/signup", methods=["POST"])
def signup():
    """
    User Signup Route:
    Registers a new user account with the provided details (username, email, phone number, password).
    Checks for existing accounts with the same email.

    Returns:
        - success message if account creation is successful.
        - error message if account creation fails or email already exists.
    """
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
    """
    User Login Route:
    Authenticates a user using their email and password.

    Returns:
        - success message along with user data if login is successful.
        - error message if credentials are invalid.
    """
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    # Validate the credentials, and fetch user from the database
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
    """
    Get User Profile Route:
    Retrieves user profile data for a user with the specified email.

    Returns:
        - success message with user data if found.
        - error message if user not found.
    """
    user_data = acc_database.find_acc(email)
    if user_data:
        return jsonify({"success": True, "user": user_data}), 200
    else:
        return jsonify({"success": False, "message": "User not found."}), 404

@app.route("/delete-account/<email>", methods=["DELETE"])
def delete_account(email):
    """
    Delete User Account Route:
    Deletes the user account and all associated favourites.

    Returns:
        - success message if the account is successfully deleted.
        - error message if user not found or deletion fails.
    """
    user = acc_database.find_acc(email)

    if not user:
        return jsonify({"success": False, "message": "User not found!"}), 404

    # Delete favourites first to avoid foreign key constraints
    acc_database.delete_all_favs(email)

    # Delete account
    if acc_database.delete_acc(email):
        return jsonify({"success": True, "message": "Account deleted successfully!"}), 200
    else:
        return jsonify({"success": False, "message": "Failed to delete account!"}), 500

@app.route("/update-profile", methods=["POST"])
def update_profile():
    """
    Update User Profile Route:
    Allows users to update their profile (username, email, phone number, password).

    Returns:
        - success message if the profile is updated.
        - error message if current password is incorrect or email already in use.
    """
    data = request.json
    old_email = data.get("old_email")  # Capture old email
    new_email = data.get("email")  # User may change email
    new_username = data.get("username")
    new_phone_no = str(data.get("phone_no"))  # Convert phone_no to string
    new_password = data.get("password")
    current_password = data.get("current_password")

    # Check if old email exists
    user = acc_database.find_acc(old_email)

    if not user:
        return jsonify({"success": False, "message": "User not found!"}), 404

    # Verify if the current_password matches the stored password
    if user["password"] != current_password:
        return jsonify({"success": False, "message": "Current password is incorrect!"}), 401

    # If email is changed, ensure the new email isn't already taken
    if old_email != new_email and acc_database.find_acc(new_email):
        return jsonify({"success": False, "message": "Email already in use!"}), 400

    # Prepare updated data
    updated_data = {
        "username": new_username,
        "email": new_email,
        "phone_no": new_phone_no,
        "password": new_password if len(new_password) > 0 else current_password
    }

    # Update in the database (Accounts table and Favourites table)
    if acc_database.update_details(old_email, updated_data):
        return jsonify({
            "success": True,
            "message": "Profile updated successfully!",
            "email": new_email,
            "username": new_username,
            "phone_no": new_phone_no
        }), 200  # Successful update response
    else:
        return jsonify({"success": False, "message": "Failed to update profile!"}), 500

@app.route("/add-favourite", methods=["POST"])
def add_favourite():
    """
    Add Carpark to Favourites Route:
    Adds a carpark to the user's favourites list.

    Returns:
        - success message if the carpark is successfully added to favourites.
        - error message if adding to favourites fails.
    """
    data = request.json
    email = data.get("email")
    carpark_no = data.get("carpark_no")

    # Add to favourites table in database
    if acc_database.add_fav(email, carpark_no):
        return jsonify({"success": True, "message": "Carpark added to favourites!"}), 200
    else:
        return jsonify({"success": False, "message": "Failed to add to favourites!"}), 500

@app.route("/remove-favourite", methods=["POST"])
def remove_favourite():
    """
    Remove Carpark from Favourites Route:
    Removes a carpark from the user's favourites list.

    Returns:
        - success message if the carpark is successfully removed from favourites.
        - error message if removal fails.
    """
    data = request.json
    email = data.get("email")
    carpark_no = data.get("carpark_no")

    # Remove from favourites table in database
    if acc_database.delete_fav(email, carpark_no):
        return jsonify({"success": True, "message": "Carpark removed from favourites!"}), 200
    else:
        return jsonify({"success": False, "message": "Failed to remove from favourites!"}), 500

@app.route("/favourites/<email>", methods=["GET"])
def get_favourites(email):
    """
    Get Favourites Route:
    Retrieves a list of carparks that the user has added to their favourites.

    Returns:
        - success message with the list of favourites.
        - error message if no favourites are found.
    """
    favs = acc_database.get_all_favs(email)
    if favs is not None:
        return jsonify({"success": True, "favourites": favs}), 200
    else:
        return jsonify({"success": False, "message": "No favourites found!"}), 404

if __name__ == "__main__":
    """
    Starts the Flask server and runs it in debug mode.
    """
    app.run(debug=True)

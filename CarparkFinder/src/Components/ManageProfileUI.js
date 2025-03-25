import React, { useState, useEffect } from "react";
import { useLogin } from "./useLogin";  // Import the useLogin hook

const ManageProfile = () => {
  const { user, handleLogout } = useLogin();  // Use the user from the login hook
  const [formData, setFormData] = useState({
    username: "",
    email: "",  
    phone_no: "",
    password: "",
  });

  // Fetch user profile when the component is mounted and user is available
  useEffect(() => {
    if (user) {
      // Set the profile data from the user object
      setFormData({
        username: user.username,
        email: user.email,  // Email comes from backend
        phone_no: user.phone_no,
        password: "",  // Leave password field empty for security
      });
    } else {
      alert("Please log in first.");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure required fields are filled
    if (!formData.username || !formData.phone_no || !formData.password) {
      alert("All fields are required.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_email: user.email,  // Send the old email for updating purposes
          username: formData.username,
          email: formData.email,
          phone_no: formData.phone_no,
          password: formData.password,
        }), // Send updated user data to backend
      });
  
      const data = await response.json();
  
      // If the update was successful
      if (data.success) {
        alert("Profile updated successfully!");
  
        // Update local state with new user details
        setFormData({
          username: data.username,  // Use updated username
          email: data.email,        // Use updated email
          phone_no: data.phone_no,
          password: "",  // Keep password field empty for security
        });
  
        // Optionally, update login state if necessary
        // For example, if using a state management tool like Context or Redux:
        // updateLoginState(data.username, data.email);
      } else {
        alert(data.message);  // Display error message from backend
      }
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };
  
  

  return (
    <div>
      <h2>Manage Profile</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter new username"
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}  // The email input field is readonly
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              placeholder="Enter new phone number"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
          </div>

          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <p>Please log in to manage your profile.</p>  // Show this message if no user is logged in
      )}
    </div>
  );
};

export default ManageProfile;

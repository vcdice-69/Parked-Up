import React from "react";
import { useLogin } from "../../Control/Hooks/useLogin"; 
import { deleteAccount } from "../../Control/DeleteAccountAPI";
import { useProfileForm } from "../../Control/Hooks/useProfileForm";

const ManageProfile = () => {
  const { user, setUser, handleLogout } = useLogin();
  const { formData, handleChange, handleSubmit } = useProfileForm(user, setUser);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Manage Profile</h2>

      {user ? (
        <form 
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            backgroundColor: "#f9f9f9",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Current Info */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "1rem" }}>Current Info</h3>
              <label>Username</label>
              <input type="text" value={user.username} disabled style={inputStyle} />

              <label>Email</label>
              <input type="email" value={user.email} disabled style={inputStyle} />

              <label>Phone Number</label>
              <input type="text" value={user.phone_no} disabled style={inputStyle} />
            </div>

            {/* New Info */}
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "1rem" }}>Update Info</h3>
              <label>New Username</label>
              <input
                type="text"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                placeholder="Enter new username"
                style={inputStyle}
              />

              <label>New Email</label>
              <input
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
                placeholder="Enter new email"
                style={inputStyle}
              />

              <label>New Phone Number</label>
              <input
                type="text"
                name="newPhone_no"
                value={formData.newPhone_no}
                onChange={handleChange}
                placeholder="Enter new phone number"
                style={inputStyle}
              />

              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Current Password */}
          <div>
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password to update profile"
              required
              style={inputStyle}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" style={primaryButtonStyle}>
            Update Profile
          </button>
        </form>
      ) : (
        <p style={{ textAlign: "center" }}>Please log in to manage your profile.</p>
      )}

      {/* Delete Account */}
      {user && (
        <button
          onClick={() => deleteAccount(user, handleLogout)}
          style={deleteButtonStyle}
        >
          Delete Account
        </button>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const primaryButtonStyle = {
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  marginTop: "20px",
  padding: "12px",
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
  width: "100%",
  maxWidth: "900px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};

export default ManageProfile;

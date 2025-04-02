import React from "react";
import { useLogin } from "../../Control/useLogin"; 
import { deleteAccount } from "../../Control/DeleteAccountService";
import { useProfileForm } from "../../Control/useProfileForm";

const ManageProfile = () => {
  const { user, setUser, handleLogout } = useLogin();
  const { formData, handleChange, handleSubmit } = useProfileForm(user, setUser);

  return (
    <div>
      <h2>Manage Profile</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1, marginRight: "20px" }}>
              <div>
                <label>Current Username</label>
                <input type="text" name="username" value={user.username} readOnly disabled />
              </div>
              <div>
                <label>Current Email</label>
                <input type="email" name="email" value={user.email} readOnly disabled />
              </div>
              <div>
                <label>Current Phone Number</label>
                <input type="text" name="phone_no" value={user.phone_no} readOnly disabled />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div>
                <label>New Username</label>
                <input type="text" name="newUsername" value={formData.newUsername} onChange={handleChange} placeholder="Enter new username" />
              </div>
              <div>
                <label>New Email</label>
                <input type="email" name="newEmail" value={formData.newEmail} onChange={handleChange} placeholder="Enter new email" />
              </div>
              <div>
                <label>New Phone Number</label>
                <input type="text" name="newPhone_no" value={formData.newPhone_no} onChange={handleChange} placeholder="Enter new phone number" />
              </div>
              <div>
                <label>New Password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter new password" />
              </div>
            </div>
          </div>

          <div>
            <label>Current Password</label>
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter your current password" required />
          </div>

          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <p>Please log in to manage your profile.</p>
      )}
      
      {/* Delete Account Button */}
      <button 
        style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
        onClick={() => deleteAccount(user, handleLogout)}
      >
        Delete Account
      </button>
    </div>
  );
};

export default ManageProfile;

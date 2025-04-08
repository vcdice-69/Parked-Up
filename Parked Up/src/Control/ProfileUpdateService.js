/**
 * @module ProfileUpdateService
 * 
 * This module provides a service to handle profile updates for the user. It interacts with the backend API to
 * update the user's profile information and then updates the state and localStorage accordingly.
 */

/**
 * ProfileService object that provides methods to interact with the profile update API.
 * 
 * @namespace ProfileService
 */
export const ProfileService = {
  /**
   * Updates the user's profile with the provided data.
   * 
   * This method sends a POST request to the backend API to update the user's profile information. If the
   * update is successful, the user data is updated in both the application state and in localStorage.
   * 
   * @param {Object} user - The current user object.
   * @param {Object} formData - The form data containing the updated profile information.
   * @param {string} formData.username - The username of the user.
   * @param {string} formData.email - The email address of the user.
   * @param {string} formData.phone_no - The phone number of the user.
   * @param {string} formData.password - The new password of the user.
   * @param {string} formData.currentPassword - The current password of the user.
   * @param {string} [formData.newUsername] - The new username (optional).
   * @param {string} [formData.newEmail] - The new email address (optional).
   * @param {string} [formData.newPhone_no] - The new phone number (optional).
   * @param {string} [formData.newPassword] - The new password (optional).
   * 
   * @param {Function} setUser - A function to update the user state in the application.
   * 
   * @returns {Promise<Object>} The response from the backend containing success status and any relevant messages.
   * 
   * @throws {Error} If there is an issue with the network request or the profile update.
   * 
   * @example
   * const formData = {
   *   currentPassword: "oldPassword123",
   *   newUsername: "newUsername",
   *   newEmail: "newEmail@example.com",
   *   newPhone_no: "12345678",
   *   newPassword: "newPassword123",
   * };
   * ProfileService.updateProfile(user, formData, setUser)
   *   .then((data) => {
   *     if (data.success) {
   *       console.log("Profile updated successfully.");
   *     } else {
   *       console.error("Profile update failed:", data.message);
   *     }
   *   })
   *   .catch((error) => console.error("Error:", error));
   */
  async updateProfile(user, formData, setUser) {
    try {
      const response = await fetch("http://127.0.0.1:5000/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_email: user.email,
          username: formData.newUsername || formData.username,
          email: formData.newEmail || formData.email,
          phone_no: formData.newPhone_no || formData.phone_no,
          password: formData.newPassword || formData.password,
          current_password: formData.currentPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update user data in state and localStorage
        const updatedUser = {
          username: formData.newUsername || user.username,
          email: formData.newEmail || user.email,
          phone_no: formData.newPhone_no || user.phone_no,
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage
      }

      return data;
    } catch (error) {
      throw new Error("Error updating profile: " + error.message);
    }
  },
};

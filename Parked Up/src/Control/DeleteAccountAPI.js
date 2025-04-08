/**
 * @module DeleteAccountAPI
 * 
 * This module contains a function for deleting a user account.
 * It sends a DELETE request to the backend to delete the user's account and handles the response.
 */

/**
 * Deletes the user account and handles the post-deletion actions.
 * 
 * This function prompts the user for confirmation before sending a DELETE request to the backend API to delete
 * the user's account. Upon successful deletion, it clears the user session and redirects the user by calling
 * the provided `handleLogout` function. If an error occurs or the deletion fails, the user is alerted with an appropriate message.
 * 
 * @param {Object} user - The user object representing the logged-in user.
 * @param {string} user.email - The email address of the user, used to identify the account to be deleted.
 * @param {Function} handleLogout - A function to log the user out and clear the session state after account deletion.
 * 
 * @returns {void} This function does not return any value. It performs side effects such as showing alerts and invoking `handleLogout`.
 * 
 * @throws {Error} If there is an error during the network request or account deletion process.
 * 
 * @example
 * const user = { email: "user@example.com" };
 * const handleLogout = () => { logout logic here };
 * deleteAccount(user, handleLogout); // Deletes the user's account and logs them out if successful.
 */
export const deleteAccount = async (user, handleLogout) => {
    if (!user) {
      alert("User not found.");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-account/${user.email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("Your account has been deleted.");
        handleLogout();  // Clear user state and redirect
      } else {
        alert("Failed to delete account: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account.");
    }
};

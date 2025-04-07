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
  
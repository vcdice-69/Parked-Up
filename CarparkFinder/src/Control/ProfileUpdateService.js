export const ProfileService = {
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

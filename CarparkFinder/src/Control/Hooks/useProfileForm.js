import { useState, useEffect } from "react";
import { ProfileService } from "../ProfileUpdateService";
import { validateProfileUpdate } from "../ProfileUpdateValidation";

export const useProfileForm = (user, setUser) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_no: "",
    password: "",
    newUsername: "",
    newEmail: "",
    newPhone_no: "",
    newPassword: "",
    currentPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        phone_no: user.phone_no,
        password: "",
        newUsername: "",
        newEmail: "",
        newPhone_no: "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateProfileUpdate(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const data = await ProfileService.updateProfile(user, formData, setUser);
      
      if (data.success) {
        alert("Profile updated successfully!");

        const updatedUser = {
          username: formData.newUsername || user.username,
          email: formData.newEmail || user.email,
          phone_no: formData.newPhone_no || user.phone_no,
        };

        // Update user state
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ Save to localStorage

        // Reset form after successful update
        setFormData((prev) => ({
          ...prev,
          newUsername: "",
          newEmail: "",
          newPhone_no: "",
          newPassword: "",
          currentPassword: "",
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("An error occurred while updating your profile.");
      console.error(error);
    }
  };

  return { formData, handleChange, handleSubmit };
};

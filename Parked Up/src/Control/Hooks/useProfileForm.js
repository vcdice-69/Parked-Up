import { useState, useEffect } from "react";
import { ProfileService } from "../ProfileUpdateService";
import { validateProfileUpdate } from "../ProfileUpdateValidation";

/**
 * Custom Hook for managing and handling the profile update form.
 * 
 * This hook handles the state and behavior of the profile update form.
 * It manages form input fields, handles user changes to the form, performs validation,
 * and handles submitting the updated user profile to the backend.
 * 
 * @param {Object} user - The current user object containing user details.
 * @param {Function} setUser - A function to update the current user state.
 * 
 * @returns {Object} An object containing:
 * - `formData` (Object): The current form data.
 * - `handleChange` (Function): Updates the form field values when changed.
 * - `handleSubmit` (Function): Handles form submission, including validation and API call.
 */
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

  /**
   * Updates the form state when the `user` prop changes.
   * 
   * This effect runs whenever the `user` state changes and updates the form with
   * the user's current data (except password fields). It ensures the form is pre-filled
   * with the current user data for updating.
   * 
   * @param {Object} user - The current user object containing user details.
   */
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

  /**
   * Handles changes to the form fields.
   * 
   * This function is triggered when a user types in any of the form fields. It updates
   * the form state with the new value entered by the user.
   * 
   * @param {Event} e - The event object triggered by a form field change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  /**
   * Handles the form submission, including validation and profile update.
   * 
   * This function prevents the default form submission behavior, performs form data validation,
   * and sends the updated profile to the backend API. If successful, it updates the user's data in the
   * state and localStorage. If an error occurs, it displays an alert message.
   * 
   * @param {Event} e - The form submission event.
   * 
   * @returns {void}
   */
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

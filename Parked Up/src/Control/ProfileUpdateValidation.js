/**
 * @module ProfileUpdateValidation
 * 
 * This module provides a function to validate the data entered by the user during the profile update process.
 * It checks for necessary fields like the current password, validates the format of the new email address,
 * and checks if the new phone number is correctly formatted.
 */

/**
 * Validates the profile update form data.
 * 
 * This function checks the required fields for the profile update process and validates the format of the new email
 * and phone number (if provided). If any validation fails, an appropriate error message is returned.
 * 
 * @param {Object} formData - The data submitted by the user for profile update.
 * @param {string} formData.currentPassword - The current password of the user (required).
 * @param {string} formData.newEmail - The new email address of the user (optional).
 * @param {string} formData.newPhone_no - The new phone number of the user (optional).
 * 
 * @returns {string|null} Returns an error message if validation fails, or null if no errors are found.
 * 
 * @example
 * const formData = {
 *   currentPassword: 'oldPassword123',
 *   newEmail: 'newEmail@example.com',
 *   newPhone_no: '12345678'
 * };
 * const validationError = validateProfileUpdate(formData);
 * if (validationError) {
 *   console.error(validationError); // Logs validation error if present
 * } else {
 *   console.log('Profile data is valid');
 * }
 */
export const validateProfileUpdate = (formData) => {
  if (!formData.currentPassword) {
    return "Please enter your current password.";
  }

  if (formData.newEmail && !/\S+@\S+\.\S+/.test(formData.newEmail)) {
    return "Invalid email format.";
  }

  if (formData.newPhone_no && !/^\d{8,12}$/.test(formData.newPhone_no)) {
    return "Phone number should be 8-12 digits long.";
  }

  return null; // No errors
};

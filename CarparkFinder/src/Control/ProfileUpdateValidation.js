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
  
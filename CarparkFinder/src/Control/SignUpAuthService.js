/**
 * Sends a signup request to the backend API.
 * 
 * This function makes a POST request to the `/signup` endpoint
 * with user details and returns the server response.
 * 
 * @param {Object} userDetails - The user details for signup.
 * @param {string} userDetails.username - The username.
 * @param {string} userDetails.email - The email address.
 * @param {string} userDetails.phone_no - The phone number.
 * @param {string} userDetails.password - The password.
 * 
 * @returns {Promise<Object>} The API response containing success status and message.
 * @throws {Error} If there is an issue with the network request.
 */
export const signupUser = async (userDetails) => {
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error during signup:", error);
      throw new Error("Something went wrong. Please try again.");
    }
  };
  
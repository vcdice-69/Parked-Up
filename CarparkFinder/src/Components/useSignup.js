import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../Services/SignUpAuthService";

/**
 * Custom Hook for handling the signup form.
 * 
 * This hook manages the form state and handles user signup via API requests.
 * 
 * @returns {Object} An object containing:
 * - `username` (string): The entered username.
 * - `setUsername` (function): Updates the username state.
 * - `email` (string): The entered email.
 * - `setEmail` (function): Updates the email state.
 * - `phoneNumber` (string): The entered phone number.
 * - `setPhoneNumber` (function): Updates the phone number state.
 * - `password` (string): The entered password.
 * - `setPassword` (function): Updates the password state.
 * - `handleSignup` (function): Submits the signup request.
 */
export const useSignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /**
   * Handles the signup form submission.
   * 
   * Sends a POST request to the server with user details.
   * If successful, navigates to the login page.
   * 
   * @param {Event} e - The form submission event.
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    const userDetails = { username, email, phone_no: phoneNumber, password };
    console.log("Sign in request from user with email ", email);
    try {
      const data = await signupUser(userDetails);
      if (data.success) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return { username, setUsername, email, setEmail, phoneNumber, setPhoneNumber, password, setPassword, handleSignup };
};

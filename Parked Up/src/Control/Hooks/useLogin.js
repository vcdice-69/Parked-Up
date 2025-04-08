import { useState, useEffect } from "react";

/**
 * Custom Hook for handling user login and logout functionality.
 * 
 * This hook manages the state for the user login, stores user information in the state and localStorage,
 * and provides methods for logging in and logging out.
 * 
 * @returns {Object} An object containing:
 * - `user` (Object | null): The current logged-in user's data or null if no user is logged in.
 * - `setUser` (Function): A function to set the user state.
 * - `email` (string): The current email value.
 * - `password` (string): The current password value.
 * - `setEmail` (Function): A function to set the email state.
 * - `setPassword` (Function): A function to set the password state.
 * - `handleLogin` (Function): Submits the login request to the server and handles the response.
 * - `handleLogout` (Function): Logs out the current user, removes the user data from state and localStorage.
 */
export const useLogin = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [email, setEmail] = useState(user?.email || "");  
  const [password, setPassword] = useState("");  

  /**
   * Syncs the email field with the user state whenever the user is updated.
   * This ensures that the email field is pre-filled with the logged-in user's email.
   */
  useEffect(() => {
    if (user) {
      setEmail(user.email); 
    }
  }, [user]);

  /**
   * Handles the login process by submitting the user's email and password to the server.
   * 
   * If the login is successful, the user information is stored in the state and localStorage.
   * If the login fails, an error message is displayed.
   * 
   * @param {string} email - The email entered by the user.
   * @param {string} password - The password entered by the user.
   * 
   * @returns {void}
   */
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        window.location.reload();
      } else {
        alert(data.message || "Incorrect information. Try again");
      }
    } catch (error) {
      alert("Login failed!");
      console.error(error);
    }
  };

  /**
   * Logs the user out by clearing the user data from the state and localStorage.
   * It also resets the email and password fields and reloads the page.
   * 
   * @returns {void}
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setEmail("");
    setPassword("");
    window.location.reload();
  };

  return { user, setUser, email, password, setEmail, setPassword, handleLogin, handleLogout };
};

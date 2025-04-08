import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../Control/Hooks/useLogin";

/**
 * Login Component
 *
 * This component handles the login functionality for the user. It allows users to input their email and password, and upon successful authentication, redirects them to the home page. If the user is already logged in, they are automatically redirected to the home page.
 * 
 * @returns {JSX.Element} The rendered login page component.
 */
const Login = () => {
  const navigate = useNavigate();
  const { email, password, setEmail, setPassword, handleLogin, user } = useLogin();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [user, navigate]);

  /**
   * Handle form submission for logging in
   *
   * This function prevents the default form submission behavior, checks if both email and password are provided, and then calls the handleLogin function to authenticate the user.
   *
   * @param {Event} e The form submission event
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    await handleLogin(email, password);
  };

  return (
    <div style={pageContainerStyle}>
      <h2 style={headingStyle}>Login</h2>
      <form onSubmit={handleFormSubmit} style={formStyle}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={submitButtonStyle}>
          Login
        </button>
      </form>
      <p style={signupPromptStyle}>
        Don't have an account?{" "}
        <a href="/signup" style={signupLinkStyle}>
          Signup
        </a>
      </p>
    </div>
  );
};

/**
 * Style for the login page container.
 */
const pageContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
  maxWidth: "500px",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

/**
 * Style for the heading text.
 */
const headingStyle = {
  fontSize: "2rem",
  marginBottom: "2rem",
  textAlign: "center",
};

/**
 * Style for the form container.
 */
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  width: "100%",
};

/**
 * Style for the input fields.
 */
const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

/**
 * Style for the submit button.
 */
const submitButtonStyle = {
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

/**
 * Style for the signup prompt text.
 */
const signupPromptStyle = {
  marginTop: "1rem",
  textAlign: "center",
};

/**
 * Style for the signup link.
 */
const signupLinkStyle = {
  color: "#4CAF50",
  textDecoration: "none",
};

export default Login;

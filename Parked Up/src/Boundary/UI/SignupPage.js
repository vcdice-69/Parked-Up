import React from "react";
import { useSignup } from "../../Control/Hooks/useSignup";

/**
 * Signup Component
 *
 * This component renders the signup page where users can create an account by providing their
 * username, email, phone number, and password. Upon form submission, the `handleSignup` function
 * is called to handle the signup logic.
 *
 * @returns {JSX.Element} The rendered Signup component.
 */
const Signup = () => {
  const { username, setUsername, email, setEmail, phoneNumber, setPhoneNumber, password, setPassword, handleSignup } = useSignup();

  return (
    <div style={pageContainerStyle}>
      <h2 style={headingStyle}>Signup</h2>
      <form onSubmit={handleSignup} style={formStyle}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Phone Number"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
          Signup
        </button>
      </form>
      <p style={loginPromptStyle}>
        Already have an account?{" "}
        <a href="/login" style={loginLinkStyle}>
          Login
        </a>
      </p>
    </div>
  );
};

/**
 * The styles for the Signup page container.
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
 * The styles for the heading of the Signup page.
 */
const headingStyle = {
  fontSize: "2rem",
  marginBottom: "2rem",
  textAlign: "center",
};

/**
 * The styles for the form element in the Signup page.
 */
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  width: "100%",
};

/**
 * The styles for the input fields in the Signup form.
 */
const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

/**
 * The styles for the signup button.
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
 * The styles for the login prompt text below the form.
 */
const loginPromptStyle = {
  marginTop: "1rem",
  textAlign: "center",
};

/**
 * The styles for the link to the login page.
 */
const loginLinkStyle = {
  color: "#4CAF50",
  textDecoration: "none",
};

export default Signup;

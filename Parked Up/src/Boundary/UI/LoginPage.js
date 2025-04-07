import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../Control/Hooks/useLogin";

const Login = () => {
  const navigate = useNavigate();
  const { email, password, setEmail, setPassword, handleLogin, user } = useLogin();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [user, navigate]);

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

const headingStyle = {
  fontSize: "2rem",
  marginBottom: "2rem",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  width: "100%",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const submitButtonStyle = {
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

const signupPromptStyle = {
  marginTop: "1rem",
  textAlign: "center",
};

const signupLinkStyle = {
  color: "#4CAF50",
  textDecoration: "none",
};

export default Login;

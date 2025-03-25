import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";

const Login = () => {
  const navigate = useNavigate();
  const { email, password, setEmail, setPassword, handleLogin } = useLogin();
  console.log("LoginUI.js called useLogin from useLogin.js")
  // Check if email and password are set correctly
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    // Call the login handler with email and password
    await handleLogin(email, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email} 
          onChange={(e) => setEmail(e.target.value)}  // Updates email state
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password} 
          onChange={(e) => setPassword(e.target.value)}  // Updates password state
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Signup</a></p>
    </div>
  );
};

export default Login;

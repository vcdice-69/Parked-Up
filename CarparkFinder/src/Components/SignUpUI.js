import React from "react";
import { useSignup } from "./useSignup";

/**
 * Signup Component
 * 
 * This component renders a signup form where users can enter their details
 * (username, email, phone number, and password). It utilizes the `useSignup` hook
 * to manage form state and handle the signup process.
 * 
 * @component
 * @returns {JSX.Element} The Signup form component.
 */
const Signup = () => {
  const { username, setUsername, email, setEmail, phoneNumber, setPhoneNumber, password, setPassword, handleSignup } = useSignup();

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone Number" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Signup</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Signup;

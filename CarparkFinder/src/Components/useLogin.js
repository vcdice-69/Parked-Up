import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if it exists
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [email, setEmail] = useState(user?.email || "");  // Load email if user is saved
  const [password, setPassword] = useState("");  // Password should not persist
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleLogin = async (email, password) => {
    console.log("Request for login from user with email ", email)
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (data.success) {
        setUser(data.user);  // Save user info in state
        localStorage.setItem("user", JSON.stringify(data.user));  // Save user in localStorage
        alert("Login successful!"); // Show success alert
        navigate("/profile");  // Navigate to profile page
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Login failed!");
      console.error(error);  // Log any network or API error
    }
  };

  const handleLogout = () => {
    setUser(null);  // Clear user state on logout
    localStorage.removeItem("user");  // Remove user from localStorage
    setEmail("");   // Clear email
    setPassword("");  // Clear password
    navigate("/login");  // Redirect to login page
  };

  return { user, email, password, setEmail, setPassword, handleLogin, handleLogout };
};

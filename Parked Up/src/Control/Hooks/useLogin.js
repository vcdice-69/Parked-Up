import { useState, useEffect } from "react";

export const useLogin = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [email, setEmail] = useState(user?.email || "");  
  const [password, setPassword] = useState("");  

  useEffect(() => {
    if (user) {
      setEmail(user.email); 
    }
  }, [user]);

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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setEmail("");
    setPassword("");
    window.location.reload();
  };

  return { user, setUser, email, password, setEmail, setPassword, handleLogin, handleLogout };
};

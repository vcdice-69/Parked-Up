export const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Something went wrong. Please try again.");
    }
  };
  
  export const updateUserInfo = async (email, updatedInfo) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, ...updatedInfo }),
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Something went wrong. Please try again.");
    }
  };
  
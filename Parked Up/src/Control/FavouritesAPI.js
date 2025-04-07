const API_URL = "http://localhost:5000";

export const addFavourite = async (email, carparkNo) => {
  const response = await fetch(`${API_URL}/add-favourite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, carpark_no: carparkNo }),
  });
  return response.json();
};

export const removeFavourite = async (email, carpark_no) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/remove-favourite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, carpark_no }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error removing favourite:", error);
    return { success: false, message: "Failed to remove favourite" };
  }
};


export const fetchFavourites = async (email) => {
  try {
    const response = await fetch(`http://localhost:5000/favourites/${email}`);

    if (!response.ok) {
      console.error("Failed to fetch favourites:", response.statusText);
      return { success: false, favourites: [] };
    }

    const data = await response.json(); // Extract JSON data properly
    console.log("Fetched favourites data:", data); // Log parsed data
    return data;
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return { success: false, favourites: [] };
  }
};


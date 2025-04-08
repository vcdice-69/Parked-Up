/**
 * @module FavouritesAPI
 * 
 * This module handles API requests related to user favourites. It provides functions to:
 * - Add a carpark to a user's favourites.
 * - Remove a carpark from a user's favourites.
 * - Fetch a user's list of favourite carparks.
 * 
 * All operations involve making HTTP requests to the backend API to manage the favourite carparks.
 */

const API_URL = "http://localhost:5000";

/**
 * Adds a carpark to the user's list of favourites.
 * 
 * This function sends a POST request to the backend to add a carpark to the user's favourites list.
 * It requires the user's email and the carpark number to be added.
 * 
 * @param {string} email - The email address of the user to whom the carpark is being added as a favourite.
 * @param {string} carparkNo - The carpark number to be added to the favourites list.
 * 
 * @returns {Promise<Object>} A promise that resolves to the API response, containing a success status and message.
 * 
 * @throws {Error} If there is an error during the request.
 * 
 * @example
 * const response = await addFavourite("user@example.com", "C123");
 * console.log(response); // The response containing the success status and message.
 */
export const addFavourite = async (email, carparkNo) => {
  const response = await fetch(`${API_URL}/add-favourite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, carpark_no: carparkNo }),
  });
  return response.json();
};

/**
 * Removes a carpark from the user's list of favourites.
 * 
 * This function sends a POST request to the backend to remove a carpark from the user's favourites list.
 * It requires the user's email and the carpark number to be removed.
 * 
 * @param {string} email - The email address of the user from whose favourites the carpark is being removed.
 * @param {string} carparkNo - The carpark number to be removed from the favourites list.
 * 
 * @returns {Promise<Object>} A promise that resolves to the API response, containing a success status and message.
 * 
 * @throws {Error} If there is an error during the request.
 * 
 * @example
 * const response = await removeFavourite("user@example.com", "C123");
 * console.log(response); // The response containing the success status and message.
 */
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

/**
 * Fetches the list of favourite carparks for a user.
 * 
 * This function sends a GET request to the backend to retrieve the list of favourite carparks for a given user.
 * It requires the user's email to identify the favourites.
 * 
 * @param {string} email - The email address of the user whose favourites are being fetched.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing a success status and an array of favourite carparks.
 * 
 * @throws {Error} If there is an error during the request or if the request fails.
 * 
 * @example
 * const favourites = await fetchFavourites("user@example.com");
 * console.log(favourites); // An object containing the success status and the list of favourite carparks.
 */
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

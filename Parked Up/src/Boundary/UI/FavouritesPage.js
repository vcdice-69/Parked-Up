import React, { useState, useEffect } from "react";
import { fetchFavourites, removeFavourite } from "../../Control/FavouritesAPI.js"; 
import { fetchCarparkDataWithAvailability } from "../../Control/CarparkDataFormatter.js"; 
import { handleGetDirections } from "../../Control/DirectionsService.js";

/**
 * Favourites Page Component
 *
 * This component displays the user's favourite carparks, fetched from the backend API, and allows the user to remove carparks from their favourites list.
 * It also provides an option to get directions to a carpark.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.user - The current logged-in user object containing user data (e.g., email).
 * @returns {JSX.Element} The rendered favourites page component.
 */
const Favourites = ({ user }) => {
  const [favourites, setFavourites] = useState([]);
  const [selectedCarpark, setSelectedCarpark] = useState(null);

  /**
   * Fetches the user's favourite carparks when the component mounts.
   * 
   * This function makes an API call to fetch the user's favourite carparks and filters them with the available carpark data.
   * 
   * @returns {void}
   */
  useEffect(() => {
    const fetchUserFavourites = async () => {
      if (!user?.email) return;

      try {
        const favouriteResponse = await fetchFavourites(user.email);
        
        if (favouriteResponse.success) {
          const favouriteCarparkNumbers = favouriteResponse.favourites;
          const allCarparks = await fetchCarparkDataWithAvailability();
          const favouriteCarparks = allCarparks.filter(carpark =>
            favouriteCarparkNumbers.includes(carpark.carparkNumber)
          );
          setFavourites(favouriteCarparks);
        }
      } catch (error) {
        console.error("Error fetching favourites:", error);
      }
    };

    fetchUserFavourites();
  }, [user?.email]);

  /**
   * Removes a carpark from the user's favourites.
   * 
   * This function makes an API call to remove a carpark from the user's favourites and updates the UI accordingly.
   * 
   * @param {string} carparkNumber - The number of the carpark to be removed from favourites.
   * @returns {void}
   */
  const handleRemoveFavourite = async (carparkNumber) => {
    if (!user?.email) return;
    
    try {
      const response = await removeFavourite(user.email, carparkNumber);
      if (response.success) {
        setFavourites((prevFavourites) => 
          prevFavourites.filter(carpark => carpark.carparkNumber !== carparkNumber)
        );
      } else {
        alert("Failed to remove favourite.");
      }
    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  return (
    <div className="favourites-page-container" style={{ padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Your Favourite Carparks</h2>
      {favourites.length === 0 ? (
        <p style={{ textAlign: "center" }}>No favourite carparks saved.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favourites.map((carpark) => (
            <li key={carpark.carparkNumber} style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
              <div
                onClick={() => setSelectedCarpark(carpark.carparkNumber)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer"
                }}
              >
                <h3 style={{ margin: 0 }}>{carpark.address}</h3>
                <span style={{ fontSize: "24px" }}>📍</span>
              </div>

              {selectedCarpark === carpark.carparkNumber && (
                <div
                  className="carpark-details-dropdown"
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#f9f9f9",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <button
                    onClick={() => setSelectedCarpark(null)}
                    style={{
                      float: "right",
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer"
                    }}
                  >
                    ✖️
                  </button>
                  <p><strong>Carpark Number:</strong> {carpark.carparkNumber}</p>
                  <p><strong>Address:</strong> {carpark.address}</p>
                  <p><strong>Carpark Type:</strong> {carpark.carparkType}</p>
                  <p><strong>Availability:</strong> {carpark.availableLots}</p>
                  <p><strong>Gantry Height:</strong> {carpark.gantryHeight || "N/A"}</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                    <button
                      onClick={() => handleRemoveFavourite(carpark.carparkNumber)}
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#ff4d4d",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleGetDirections(carpark)}
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      Directions
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favourites;

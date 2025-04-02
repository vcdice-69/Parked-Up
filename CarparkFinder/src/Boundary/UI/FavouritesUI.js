import React, { useState, useEffect } from "react";
import { fetchFavourites, removeFavourite } from "../../Entity/FavouritesBackendInteraction.js"; 
import { fetchCarparkDataWithAvailability } from "../../Entity/CarparkDataService.js"; 

const Favourites = ({ user }) => {
  const [favourites, setFavourites] = useState([]);
  const [selectedCarpark, setSelectedCarpark] = useState(null);

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
  }, [user?.email]); // ✅ Re-fetch when `user.email` changes

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
    <div>
      <h2>Your Favourite Carparks</h2>
      {favourites.length === 0 ? (
        <p>No favourite carparks saved.</p>
      ) : (
        <ul>
          {favourites.map((carpark) => (
            <li key={carpark.carparkNumber}>
              <div onClick={() => setSelectedCarpark(carpark.carparkNumber)}>
                <h3>Carpark {carpark.carparkNumber}</h3>
              </div>

              {selectedCarpark === carpark.carparkNumber && (
                <div className="carpark-details-dropdown">
                  <button onClick={() => setSelectedCarpark(null)}>Close</button>
                  <p><strong>Carpark Number:</strong> {carpark.carparkNumber}</p>
                  <p><strong>Address:</strong> {carpark.address}</p>
                  <p><strong>Carpark Type:</strong> {carpark.carparkType}</p>
                  <p><strong>Availability:</strong> {carpark.availableLots}</p>
                  <p><strong>Gantry Height:</strong> {carpark.gantryHeight || "N/A"}</p>
                  <button onClick={() => handleRemoveFavourite(carpark.carparkNumber)}>Remove</button>
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

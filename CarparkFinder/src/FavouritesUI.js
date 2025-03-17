import React, { useState, useEffect } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  return (
    <div>
      <h2>Favorite Carparks</h2>
      {favorites.length === 0 ? (
        <p>No favorite carparks saved.</p>
      ) : (
        <ul>
          {favorites.map((carpark) => (
            <li key={carpark.carparkNumber}>
              <h3>Carpark {carpark.carparkNumber}</h3>
              <p><strong>Address:</strong> {carpark.address}</p>
              <p><strong>Carpark Type:</strong> {carpark.carparkType}</p>
              <p><strong>Gantry Height:</strong> {carpark.gantryHeight}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;

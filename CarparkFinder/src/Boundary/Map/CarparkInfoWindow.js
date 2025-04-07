import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { handleGetDirections } from "../../Control/DirectionsService"

const CarparkInfoWindow = ({ selectedCarpark, onClose, userFavourites, handleFavouriteToggle }) => {
  if (!selectedCarpark) return null;

  // Check if the selected carpark is in favourites
  const isFavourited = userFavourites.has(selectedCarpark.carparkNumber);

  return (
    <InfoWindow
      position={{ lat: selectedCarpark.lat, lng: selectedCarpark.lng }}
      onCloseClick={onClose}
    >
      <div>
        <h3>{selectedCarpark.carparkNumber}</h3>
        <p><strong>Address:</strong> {selectedCarpark.address}</p>
        <p><strong>Available Lots:</strong> {selectedCarpark.availableLots}</p>
        <p><strong>Gantry Height:</strong> {selectedCarpark.gantryHeight ? `${selectedCarpark.gantryHeight}m` : "N/A"}</p>
        <p><strong>Carpark Type:</strong> {selectedCarpark.carparkType}</p>

        {/* Heart Icon Button */}
        <button
          onClick={() => handleFavouriteToggle(selectedCarpark.carparkNumber)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px", // Size of the heart icon
            color: isFavourited ? "red" : "gray", // Toggle between red and gray
          }}
        >
          {isFavourited ? "❤️" : "♡"} {/* Change heart based on favourited status */}
        </button>
        <button onClick={() => handleGetDirections(selectedCarpark)}>Directions</button>
      </div>
    </InfoWindow>
  );
};

export default CarparkInfoWindow;
import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { handleGetDirections } from "../../Control/DirectionsService"

/**
 * CarparkInfoWindow Component
 *
 * The `CarparkInfoWindow` is a component used to display detailed information about a selected carpark on the map.
 * It shows the carpark's number, address, available lots, gantry height, and carpark type. Additionally, users can
 * toggle the carpark as a favourite and get directions to the carpark via a button.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.selectedCarpark - The selected carpark object containing details like carpark number, address, availability, etc.
 * @param {Function} props.onClose - Callback function to close the InfoWindow when the close button is clicked.
 * @param {Set} props.userFavourites - A set containing the carpark numbers of the user's favourite carparks.
 * @param {Function} props.handleFavouriteToggle - A function to toggle the favourite status of the carpark.
 * @returns {JSX.Element|null} The rendered InfoWindow displaying carpark details, or `null` if no carpark is selected.
 */
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
        <button 
          onClick={() => handleGetDirections(selectedCarpark)}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}>
            Directions
            </button>
      </div>
    </InfoWindow>
  );
};

export default CarparkInfoWindow;
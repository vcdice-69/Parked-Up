import React from "react";
import { InfoWindow } from "@react-google-maps/api";

const CarparkInfoWindow = ({ selectedCarpark, onClose }) => {
  if (!selectedCarpark) return null;

  return (
    <InfoWindow
      position={{ lat: selectedCarpark.lat, lng: selectedCarpark.lng }}
      onCloseClick={onClose}
    >
      <div>
        <h3>{selectedCarpark.carparkNumber}</h3>
        <p><strong>Address:</strong> {selectedCarpark.address}</p>
        <p><strong>Available Lots:</strong> {selectedCarpark.availableLots}</p>
        <p><strong>Carpark Type:</strong> {selectedCarpark.carparkType}</p>
        <p><strong>Gantry Height:</strong> {selectedCarpark.gantryHeight}m</p>
      </div>
    </InfoWindow>
  );
};

export default CarparkInfoWindow;

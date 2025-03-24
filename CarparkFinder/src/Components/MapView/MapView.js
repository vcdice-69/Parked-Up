import React from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { bubbleStyle } from "../../Utility Classes/bubbleStyle";
import CarparkInfoWindow from "../CarparkInfoWindow/CarparkInfoWindow";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const MapView = ({ filteredCarparks, setSelectedCarpark, selectedCarpark }) => {
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: 1.3521, lng: 103.8198 }} zoom={14}>
      {filteredCarparks.map((carpark, index) => (
        <OverlayView key={index} position={{ lat: carpark.lat, lng: carpark.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div style={bubbleStyle(carpark.availableLots)} onClick={() => setSelectedCarpark(carpark)}>
            <span>{carpark.availableLots}</span>
          </div>
        </OverlayView>
      ))}
      <CarparkInfoWindow selectedCarpark={selectedCarpark} onClose={() => setSelectedCarpark(null)} />
    </GoogleMap>
  );
};

export default MapView;

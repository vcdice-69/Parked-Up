import React from "react";
import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { bubbleStyle } from "../../Utility Classes/bubbleStyle";
import CarparkInfoWindow from "../CarparkInfoWindow/CarparkInfoWindow";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const MapView = ({ center, filteredCarparks, setSelectedCarpark, selectedCarpark }) => {
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={16}>
      {/* User's current location marker (Blue dot) */}
      <Marker
        position={center}
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40), // Adjust size
        }}
      />

      {/* Carpark markers */}
      {filteredCarparks.map((carpark, index) => (
        <OverlayView key={index} position={{ lat: carpark.lat, lng: carpark.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div style={bubbleStyle(carpark.availableLots)} onClick={() => setSelectedCarpark(carpark)}>
            <span>{carpark.availableLots}</span>
          </div>
        </OverlayView>
      ))}

      {/* Carpark Info Window */}
      {selectedCarpark && (
        <CarparkInfoWindow selectedCarpark={selectedCarpark} onClose={() => setSelectedCarpark(null)} />
      )}
    </GoogleMap>
  );
};

export default MapView;

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { bubbleStyle } from "../../Utility/bubbleStyle";
import CarparkInfoWindow from "./CarparkInfoWindow";
import { addFavourite, removeFavourite } from "../../Entity/FavouritesBackendInteraction";

const MapView = ({ center, filteredCarparks, setSelectedCarpark, selectedCarpark, user, handleFavouriteToggle, userFavourites }) => {
  return (
    <GoogleMap mapContainerStyle={{ width: "100vw", height: "100vh" }} center={center} zoom={16}>
      <Marker
        position={center}
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />

      {filteredCarparks.map((carpark, index) => (
        <OverlayView
          key={index}
          position={{ lat: carpark.lat, lng: carpark.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={bubbleStyle(carpark.availableLots)} onClick={() => setSelectedCarpark(carpark)}>
            <span>{carpark.availableLots}</span>
          </div>
        </OverlayView>
      ))}

      {selectedCarpark && (
        <CarparkInfoWindow
          selectedCarpark={selectedCarpark}
          onClose={() => setSelectedCarpark(null)}
          userFavourites={userFavourites} // Pass the updated userFavourites
          handleFavouriteToggle={handleFavouriteToggle} // Pass function for toggling favourite
        />
      )}
    </GoogleMap>
  );
};

export default MapView;
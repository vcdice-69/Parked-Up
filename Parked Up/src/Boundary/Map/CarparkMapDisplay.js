import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { BubbleStyle } from "../../Utility/BubbleStyle";
import CarparkInfoWindow from "./CarparkInfoWindow";

/**
 * MapView Component
 *
 * This component renders a Google Map with markers for carparks and provides an interface to view carpark availability and toggle favourites.
 * It allows users to click on carparks to view more details and interact with carpark favourites.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.center - The center coordinates of the map (latitude, longitude).
 * @param {Array} props.filteredCarparks - An array of carpark objects that should be displayed on the map.
 * @param {function} props.setSelectedCarpark - A function to set the selected carpark when a carpark bubble is clicked.
 * @param {Object} props.selectedCarpark - The currently selected carpark object.
 * @param {Object} props.user - The current logged-in user object.
 * @param {function} props.handleFavouriteToggle - A function to handle toggling carpark favourites (add/remove).
 * @param {Array} props.userFavourites - An array of the user's current favourite carparks.
 * @returns {JSX.Element} The rendered map view component.
 */
const MapView = ({ center, filteredCarparks, setSelectedCarpark, selectedCarpark, user, handleFavouriteToggle, userFavourites }) => {
  return (
    <GoogleMap mapContainerStyle={{ width: "100vw", height: "100vh" }} center={center} zoom={16}>
      {/* Marker for the center location */}
      <Marker
        position={center}
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />

      {/* OverlayView for each filtered carpark */}
      {filteredCarparks.map((carpark, index) => (
        <OverlayView
          key={index}
          position={{ lat: carpark.lat, lng: carpark.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={BubbleStyle(carpark.availableLots)} onClick={() => setSelectedCarpark(carpark)}>
            <span>{carpark.availableLots}</span>
          </div>
        </OverlayView>
      ))}

      {/* Carpark InfoWindow displayed when a carpark is selected */}
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

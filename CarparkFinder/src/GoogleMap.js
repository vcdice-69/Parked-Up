import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { bubbleStyle } from "./bubbleStyle";
import Papa from "papaparse"; // CSV parsing library
import { convertCoordToLatLong } from "./CoordinateConverter";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const defaultCenter = {
  lat: 1.3521, // Default to Singapore
  lng: 103.8198,
};

const GoogleMapComponent = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [carparks, setCarparks] = useState([]);

  useEffect(() => {
    // Set the user's location if allowed
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Geolocation permission denied. Using default location.");
        }
      );
    }

    // Fetch and parse CSV data
    fetch("/HDBCarparkInformation.csv")
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true, // Ensure headers are correctly parsed
          skipEmptyLines: true,
          complete: (result) => {
            const parsedCarparks = result.data.map((row) => {
              // Ensure valid numbers for x, y coordinates
              const x = parseFloat(row.x_coord);
              const y = parseFloat(row.y_coord);

              if (isNaN(x) || isNaN(y)) {
                console.warn("Invalid coordinate data:", row);
                return null;
              }

              // Convert x, y to latitude/longitude
              const coords = convertCoordToLatLong(x, y);

              return coords ? { lat: coords.latitude, lng: coords.longitude } : null;
            }).filter(Boolean); // Remove null entries

            const firstFew = parsedCarparks.slice(0, 5);
            console.log("Final carparks in state:", parsedCarparks.slice(0, 5));


            setCarparks(parsedCarparks);
          },
        });
      })
      .catch((error) => console.error("Error reading CSV:", error));
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14}>
      {carparks.map((carpark, index) => {
        return (
          <OverlayView
            key={index}
            position={{ lat: carpark.lat, lng: carpark.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div>
              <div style={bubbleStyle(10)}>🚗</div> {/* Temporary emoji to check rendering */}
            </div>
          </OverlayView>
        );
      })}

      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
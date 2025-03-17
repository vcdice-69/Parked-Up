import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, OverlayView, InfoWindow } from "@react-google-maps/api";
import { bubbleStyle } from "./bubbleStyle";
import { convertCoordToLatLong } from "./CoordinateConverter";
import { fetchAvailability } from "./AvailabilityEntity";
import { fetchCarparkData } from "./CarparkDataEntity";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const defaultCenter = {
  lat: 1.3521,
  lng: 103.8198,
};

const carparkTypes = [
  "BASEMENT CAR PARK",
  "MULTI-STOREY CAR PARK",
  "SURFACE CAR PARK",
  "MECHANISED CAR PARK",
  "MECHANISED AND SURFACE CAR PARK",
];

const GoogleMapComponent = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [carparks, setCarparks] = useState([]);
  const [selectedCarpark, setSelectedCarpark] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [availableLotsFilter, setAvailableLotsFilter] = useState(0);
  const [gantryHeightFilter, setGantryHeightFilter] = useState(0);
  const [selectedCarparkTypes, setSelectedCarparkTypes] = useState(new Set(carparkTypes));

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => console.error("Geolocation permission denied. Using default location.")
      );
    }

    const mergeData = async () => {
      const [availabilityMap, csvCarparks] = await Promise.all([fetchAvailability(), fetchCarparkData()]);

      const parsedCarparks = csvCarparks
        .map((row) => {
          const x = parseFloat(row.x_coord);
          const y = parseFloat(row.y_coord);
          if (isNaN(x) || isNaN(y)) return null;

          const coords = convertCoordToLatLong(x, y);
          const availableLots = availabilityMap[row.car_park_no] || 0;
          const gantryHeight = parseFloat(row.gantry_height) || 0;

          return coords
            ? {
                lat: coords.latitude,
                lng: coords.longitude,
                carparkNumber: row.car_park_no,
                address: row.address || "N/A",
                availableLots,
                carparkType: row.car_park_type || "N/A",
                gantryHeight,
              }
            : null;
        })
        .filter(Boolean);

      setCarparks(parsedCarparks);
    };

    mergeData();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (carpark) => {
    const updatedFavorites = favorites.some(fav => fav.carparkNumber === carpark.carparkNumber)
      ? favorites.filter(fav => fav.carparkNumber !== carpark.carparkNumber)
      : [...favorites, carpark];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Toggle carpark type filter
  const toggleCarparkType = (type) => {
    const newSet = new Set(selectedCarparkTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedCarparkTypes(newSet);
  };

  // Filter carparks based on selected criteria
  const filteredCarparks = carparks.filter(
    (carpark) =>
      carpark.availableLots >= availableLotsFilter &&
      carpark.gantryHeight >= gantryHeightFilter &&
      selectedCarparkTypes.has(carpark.carparkType)
  );

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ display: "flex", height: "100vh", position: "relative" }}>
        {/* Filter Toggle Button (Bottom-Left) */}
        <img
          src="/filter-icon.jpg"
          alt="Filter"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            zIndex: 1000,
            borderRadius: "50%",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          }}
        />

        {/* Sidebar for Filters (Bottom-Left) */}
        <div
          style={{
            position: "absolute",
            left: showFilters ? "20px" : "-320px", // Slide in/out effect
            bottom: "80px",
            width: "300px",
            padding: "15px",
            background: "#fff",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            transition: "left 0.3s ease-in-out",
            zIndex: 999,
          }}
        >
          <h3>Filters</h3>

          <label><strong>Available Lots: {availableLotsFilter}+</strong></label>
          <input
            type="range"
            min="0"
            max="100"
            value={availableLotsFilter}
            onChange={(e) => setAvailableLotsFilter(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />

          <label><strong>Gantry Height: {gantryHeightFilter}m+</strong></label>
          <input
            type="range"
            min="0"
            max="2.5"
            step="0.1"
            value={gantryHeightFilter}
            onChange={(e) => setGantryHeightFilter(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />

          <h4>Carpark Type</h4>
          {carparkTypes.map((type) => (
            <div key={type}>
              <input
                type="checkbox"
                checked={selectedCarparkTypes.has(type)}
                onChange={() => toggleCarparkType(type)}
              />
              <label>{type}</label>
            </div>
          ))}
        </div>

        {/* Map */}
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={14}>
          {filteredCarparks.map((carpark, index) => (
            <React.Fragment key={index}>
              <OverlayView
                position={{ lat: carpark.lat, lng: carpark.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  style={bubbleStyle(carpark.availableLots)}
                  onClick={() => setSelectedCarpark(carpark)}
                >
                  <span>{carpark.availableLots}</span>
                </div>
              </OverlayView>

              {selectedCarpark && selectedCarpark.carparkNumber === carpark.carparkNumber && (
                <InfoWindow
                  position={{ lat: carpark.lat, lng: carpark.lng }}
                  onCloseClick={() => setSelectedCarpark(null)}
                >
                  <div>
                    <h3>Carpark {carpark.carparkNumber}</h3>
                    <p><strong>Address:</strong> {carpark.address}</p>
                    <p><strong>Carpark Type:</strong> {carpark.carparkType}</p>
                    <p><strong>Gantry Height:</strong> {carpark.gantryHeight}m</p>
                    <p><strong>Available Lots:</strong> {carpark.availableLots}</p>
                    <button onClick={() => toggleFavorite(carpark)}>
                      {favorites.some(fav => fav.carparkNumber === carpark.carparkNumber)
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </button>
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default GoogleMapComponent;

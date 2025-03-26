import React, { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useCarparkFilter } from "../Services/CarparkFilterService";
import { fetchCarparkDataWithAvailability } from "../Services/CarparkDataService";
import CarparkFiltersPanel from "./CarparkFiltersPanel/CarparkFiltersPanel";
import MapView from "./MapView/MapView";

const MapViewComponent = () => {
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });
  const [carparks, setCarparks] = useState([]);
  const [selectedCarpark, setSelectedCarpark] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [filteredCarparksByAddress, setFilteredCarparksByAddress] = useState([]);

  const {
    filteredCarparks,
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  } = useCarparkFilter(carparks);

  // Filter carparks by address and apply filters
  useEffect(() => {
    if (searchQuery) {
      // Filter by both search query and active filters
      setFilteredCarparksByAddress(
        filteredCarparks.filter((carpark) =>
          carpark.address.toLowerCase().includes(searchQuery.toLowerCase()) // Match address
        )
      );
    } else {
      setFilteredCarparksByAddress(filteredCarparks);
    }
  }, [searchQuery, filteredCarparks]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Geolocation permission denied:", error)
      );
    }

    const mergeData = async () => {
      const parsedCarparks = await fetchCarparkDataWithAvailability();
      setCarparks(parsedCarparks);
    };

    mergeData();
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ display: "flex", height: "100vh", position: "relative" }}>
        <img
          src="../Assets/filter-icon.jpg"
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

        {showFilters && (
          <CarparkFiltersPanel
            availableLotsFilter={availableLotsFilter}
            setAvailableLotsFilter={setAvailableLotsFilter}
            gantryHeightFilter={gantryHeightFilter}
            setGantryHeightFilter={setGantryHeightFilter}
            selectedCarparkTypes={selectedCarparkTypes}
            toggleCarparkType={toggleCarparkType}
          />
        )}

        {/* Search bar */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)", // Center the search bar
            zIndex: 1000,
            width: "80%", // Adjust width to make it more compact
            maxWidth: "500px", // Limit the maximum width
            textAlign: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search for carparks by address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px", // Reduce padding
              fontSize: "14px", // Smaller font size
              borderRadius: "4px",
              boxSizing: "border-box",
              width: "100%", // Full width of the container
              boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
            }}
          />

          {/* Dropdown for filtered carparks */}
          {searchQuery && (
            <ul
              style={{
                listStyleType: "none",
                padding: "0", // Remove padding to eliminate space
                margin: "0", // Remove margin to eliminate space
                backgroundColor: "white",
                maxHeight: "200px",
                overflowY: "auto",
                borderRadius: "4px",
                boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
                position: "absolute",
                left: "50%", // Position dropdown at the center horizontally
                transform: "translateX(-50%)", // Offset to truly center the dropdown
                zIndex: 1000,
                width: "100%",
              }}
            >
              {filteredCarparksByAddress.map((carpark) => (
                <li
                  key={carpark.id}
                  onClick={() => {
                    setCenter({ lat: carpark.lat, lng: carpark.lng });
                    setSelectedCarpark(carpark);
                    setSearchQuery(""); // Clear search query after selection
                  }}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {carpark.address}
                </li>
              ))}
            </ul>
          )}
        </div>

        <MapView center={center} filteredCarparks={filteredCarparks} setSelectedCarpark={setSelectedCarpark} selectedCarpark={selectedCarpark} />
      </div>
    </LoadScript>
  );
};

export default MapViewComponent;

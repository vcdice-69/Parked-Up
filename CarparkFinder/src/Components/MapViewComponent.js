import React, { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { useCarparkFilter } from "../Services/CarparkFilterService";
import { fetchCarparkDataWithAvailability } from "../Services/CarparkDataService";
import CarparkFiltersPanel from "./CarparkFiltersPanel/CarparkFiltersPanel";
import MapView from "./MapView/MapView";

/**
 * MapViewComponent
 *
 * This component renders an interactive map displaying carpark locations with filtering options.
 * It fetches carpark data with availability and allows users to apply filters to refine the displayed results.
 *
 * @component
 * @returns {JSX.Element} The main map view with carpark markers and filter controls.
 */
const MapViewComponent = () => {
  /** @type {[{ lat: number, lng: number }, Function]} */
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });

  /** @type {[Array, Function]} */
  const [carparks, setCarparks] = useState([]);

  /** @type {[Object|null, Function]} */
  const [selectedCarpark, setSelectedCarpark] = useState(null);

  /** @type {[boolean, Function]} */
  const [showFilters, setShowFilters] = useState(false);

  // Use the custom hook to manage carpark filtering logic
  const {
    filteredCarparks,
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  } = useCarparkFilter(carparks);

  /**
   * Fetches user location and carpark data on component mount.
   * - Retrieves user's geolocation if permitted.
   * - Fetches carpark data and availability.
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        () => console.error("Geolocation permission denied. Using default location.")
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
        {/* Button to toggle filter panel */}
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

        {/* Carpark Filters Panel */}
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

        {/* MapView displaying filtered carparks */}
        <MapView filteredCarparks={filteredCarparks} setSelectedCarpark={setSelectedCarpark} selectedCarpark={selectedCarpark} />
      </div>
    </LoadScript>
  );
};

export default MapViewComponent;

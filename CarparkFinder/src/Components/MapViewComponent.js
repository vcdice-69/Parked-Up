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

  const {
    filteredCarparks,
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  } = useCarparkFilter(carparks);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
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

        <MapView filteredCarparks={filteredCarparks} setSelectedCarpark={setSelectedCarpark} selectedCarpark={selectedCarpark} />
      </div>
    </LoadScript>
  );
};

export default MapViewComponent;

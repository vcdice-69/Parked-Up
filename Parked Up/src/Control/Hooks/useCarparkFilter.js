import { useState } from "react";
import { getDistance } from "../DistanceCalculator";

const carparkTypes = [
  "BASEMENT CAR PARK",
  "MULTI-STOREY CAR PARK",
  "SURFACE CAR PARK",
  "MECHANISED CAR PARK",
  "MECHANISED AND SURFACE CAR PARK",
];

// Custom hook for carpark filtering
export const useCarparkFilter = (carparks = [], userLocation, distanceFilter) => {
  const [availableLotsFilter, setAvailableLotsFilter] = useState(0);
  const [gantryHeightFilter, setGantryHeightFilter] = useState(0);
  const [selectedCarparkTypes, setSelectedCarparkTypes] = useState([...carparkTypes]); // Ensure it always initializes as an array

  const toggleCarparkType = (type) => {
    setSelectedCarparkTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type); // Remove type if already selected
      } else {
        return [...prev, type]; // Add type if not selected
      }
    });
  };

  const filteredCarparks = carparks
    .filter(
      (carpark) =>
        carpark.availableLots >= availableLotsFilter &&
        carpark.gantryHeight >= gantryHeightFilter &&
        selectedCarparkTypes.includes(carpark.carparkType) && // Ensure selectedCarparkTypes is always an array
        (userLocation
          ? getDistance(userLocation.lat, userLocation.lng, carpark.lat, carpark.lng) <= distanceFilter
          : true)
    );

  return {
    filteredCarparks,
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  };
};
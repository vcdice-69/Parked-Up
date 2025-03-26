import { useState } from "react";

const carparkTypes = [
  "BASEMENT CAR PARK",
  "MULTI-STOREY CAR PARK",
  "SURFACE CAR PARK",
  "MECHANISED CAR PARK",
  "MECHANISED AND SURFACE CAR PARK",
];

// Custom hook for carpark filtering
export const useCarparkFilter = (carparks, userLocation, distanceFilter) => {
  const [availableLotsFilter, setAvailableLotsFilter] = useState(0);
  const [gantryHeightFilter, setGantryHeightFilter] = useState(0);
  const [selectedCarparkTypes, setSelectedCarparkTypes] = useState([...carparkTypes]); // Initialize as an array

  const toggleCarparkType = (type) => {
    setSelectedCarparkTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type); // Remove type if already selected
      } else {
        return [...prev, type]; // Add type if not selected
      }
    });
  };

  // Function to calculate distance between user and carpark
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
  };

  const filteredCarparks = carparks
    .filter(
      (carpark) =>
        carpark.availableLots >= availableLotsFilter &&
        carpark.gantryHeight >= gantryHeightFilter && // Minimum gantry height filter
        selectedCarparkTypes.includes(carpark.carparkType) && // Check using .includes() for array
        (userLocation
          ? getDistance(userLocation.lat, userLocation.lng, carpark.lat, carpark.lng) <= distanceFilter
          : true) // Filter by distance if user location exists
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

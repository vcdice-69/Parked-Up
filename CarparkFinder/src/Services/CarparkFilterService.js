import { useState } from "react";

const carparkTypes = [
  "BASEMENT CAR PARK",
  "MULTI-STOREY CAR PARK",
  "SURFACE CAR PARK",
  "MECHANISED CAR PARK",
  "MECHANISED AND SURFACE CAR PARK",
];

// Custom hook for carpark filtering
export const useCarparkFilter = (carparks) => {
  const [availableLotsFilter, setAvailableLotsFilter] = useState(0);
  const [gantryHeightFilter, setGantryHeightFilter] = useState(0);
  const [selectedCarparkTypes, setSelectedCarparkTypes] = useState(new Set(carparkTypes));

  const toggleCarparkType = (type) => {
    setSelectedCarparkTypes((prev) => {
      const newSet = new Set(prev);
      newSet.has(type) ? newSet.delete(type) : newSet.add(type);
      return newSet;
    });
  };

  const filteredCarparks = carparks.filter(
    (carpark) =>
      carpark.availableLots >= availableLotsFilter &&
      carpark.gantryHeight >= gantryHeightFilter &&
      selectedCarparkTypes.has(carpark.carparkType)
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

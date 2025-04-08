import { useState } from "react";
import { getDistance } from "../DistanceCalculator";

const carparkTypes = [
  "BASEMENT CAR PARK",
  "MULTI-STOREY CAR PARK",
  "SURFACE CAR PARK",
  "MECHANISED CAR PARK",
  "MECHANISED AND SURFACE CAR PARK",
];

/**
 * Custom Hook for filtering carparks based on user-selected criteria.
 * 
 * This hook allows the user to filter carparks by:
 * - Available lots.
 * - Gantry height.
 * - Carpark type.
 * - Distance from the user's current location.
 * 
 * It provides functions to toggle carpark types and set filtering parameters.
 * 
 * @param {Array} carparks - An array of carpark objects to be filtered.
 * @param {Object} userLocation - The user's current location (latitude and longitude).
 * @param {number} distanceFilter - The maximum distance (in kilometers) from the user's location.
 * 
 * @returns {Object} An object containing:
 * - `filteredCarparks` (Array): The list of carparks filtered by the user's selected criteria.
 * - `availableLotsFilter` (number): The current filter value for available lots.
 * - `setAvailableLotsFilter` (function): A function to update the available lots filter.
 * - `gantryHeightFilter` (number): The current filter value for gantry height.
 * - `setGantryHeightFilter` (function): A function to update the gantry height filter.
 * - `selectedCarparkTypes` (Array): The current selected carpark types.
 * - `toggleCarparkType` (function): A function to toggle the selection of a carpark type.
 */
export const useCarparkFilter = (carparks = [], userLocation, distanceFilter) => {
  const [availableLotsFilter, setAvailableLotsFilter] = useState(0);
  const [gantryHeightFilter, setGantryHeightFilter] = useState(0);
  const [selectedCarparkTypes, setSelectedCarparkTypes] = useState([...carparkTypes]); // Ensure it always initializes as an array

  /**
   * Toggles the selection of a carpark type for filtering.
   * 
   * If the carpark type is already selected, it is removed from the selection.
   * If the carpark type is not selected, it is added to the selection.
   * 
   * @param {string} type - The carpark type to toggle.
   */
  const toggleCarparkType = (type) => {
    setSelectedCarparkTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type); // Remove type if already selected
      } else {
        return [...prev, type]; // Add type if not selected
      }
    });
  };

  /**
   * Filters the carpark data based on the selected filtering criteria.
   * The filtering considers:
   * - Available lots (greater than or equal to `availableLotsFilter`).
   * - Gantry height (greater than or equal to `gantryHeightFilter`).
   * - Selected carpark types (must match one of the selected types).
   * - Distance from the user's location (less than or equal to `distanceFilter`).
   */
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

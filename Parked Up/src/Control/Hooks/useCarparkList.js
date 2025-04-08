import { useMemo } from "react";
import { getDistance } from "../DistanceCalculator";

/**
 * Custom Hook for filtering and sorting carpark data based on user-defined criteria.
 * 
 * This hook accepts a list of carparks and filters them according to various criteria such as:
 * - User's distance from the carpark (based on a distance filter).
 * - Number of available lots in the carpark (based on an available lots filter).
 * - Gantry height (based on a gantry height filter).
 * - Carpark types selected by the user.
 * 
 * The filtered list of carparks is then sorted by distance from the user's location.
 * 
 * @param {Array} carparks - An array of carpark objects to filter and sort.
 * @param {Object} userLocation - The user's current location (latitude and longitude).
 * @param {number} distanceFilter - The maximum distance (in km) that a carpark can be from the user.
 * @param {number} availableLotsFilter - The minimum number of available lots required in a carpark.
 * @param {number} gantryHeightFilter - The minimum gantry height required for a carpark.
 * @param {Array} selectedCarparkTypes - An array of carpark types selected by the user to filter by.
 * 
 * @returns {Object} An object containing:
 * - `filteredCarparks` (Array): A list of carparks filtered and sorted according to the criteria.
 */
export const useCarparkList = (
  carparks,
  userLocation,
  distanceFilter,
  availableLotsFilter,
  gantryHeightFilter,
  selectedCarparkTypes
) => {
  /**
   * Filters and sorts the carpark data based on the provided filters.
   * 
   * The filtering process checks:
   * - Distance from the user's location.
   * - Available lots in the carpark.
   * - Gantry height of the carpark.
   * - Carpark type.
   * 
   * It returns only those carparks that match all the criteria, and sorts them by distance.
   */
  const filteredCarparks = useMemo(() => {
    return carparks
      .map((carpark) => ({
        ...carpark,
        distance: userLocation
          ? getDistance(userLocation.lat, userLocation.lng, carpark.lat, carpark.lng)
          : null,
      }))
      .filter((carpark) => {
        // Filter by distance
        const withinDistance =
          carpark.distance === null || carpark.distance <= distanceFilter;

        // Filter by available lots
        const matchesAvailableLots =
          availableLotsFilter === 0 ||
          (typeof carpark.availableLots === 'number' && carpark.availableLots >= availableLotsFilter);

        // Filter by gantry height
        const matchesGantryHeight =
          gantryHeightFilter === null ||
          carpark.gantryHeight >= gantryHeightFilter;

        // Filter by carpark type
        const matchesCarparkType =
          selectedCarparkTypes.length === 0 ||
          selectedCarparkTypes.includes(carpark.carparkType);

        return (
          withinDistance &&
          matchesAvailableLots &&
          matchesGantryHeight &&
          matchesCarparkType
        );
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [
    carparks,
    userLocation,
    distanceFilter,
    availableLotsFilter,
    gantryHeightFilter,
    selectedCarparkTypes,
  ]);

  return { filteredCarparks };
};

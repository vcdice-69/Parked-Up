import { useState, useMemo } from "react";
import { getDistance } from "../DistanceCalculator";
import { filterCarparksByAddress } from "../CarparkController";

export const useCarparkList = (
  carparks,
  userLocation,
  distanceFilter,
  availableLotsFilter,
  gantryHeightFilter,
  selectedCarparkTypes
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCarparks = useMemo(() => {
    return filterCarparksByAddress(carparks, searchTerm)
      .map((carpark) => ({
        ...carpark,
        distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, carpark.lat, carpark.lng) : null,
      }))
      .filter((carpark) => {
        // Filter by distance
        const withinDistance = carpark.distance <= distanceFilter;

        // Apply available lots filter
        const matchesAvailableLots = availableLotsFilter
          ? carpark.availableLots > 0
          : true;

        // Apply gantry height filter
        const matchesGantryHeight = gantryHeightFilter
          ? carpark.gantryHeight >= gantryHeightFilter
          : true;

        // Apply carpark type filter
        const matchesCarparkType =
          selectedCarparkTypes.length === 0 ||
          selectedCarparkTypes.includes(carpark.carparkType);

        return withinDistance && matchesAvailableLots && matchesGantryHeight && matchesCarparkType;
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0)); // Sort by distance
  }, [
    carparks,
    userLocation,
    distanceFilter,
    availableLotsFilter,
    gantryHeightFilter,
    selectedCarparkTypes,
    searchTerm,
  ]);

  return { filteredCarparks, searchTerm, setSearchTerm };
};

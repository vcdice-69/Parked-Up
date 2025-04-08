import { useMemo } from "react";
import { getDistance } from "../DistanceCalculator";

export const useCarparkList = (
  carparks,
  userLocation,
  distanceFilter,
  availableLotsFilter,
  gantryHeightFilter,
  selectedCarparkTypes
) => {
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

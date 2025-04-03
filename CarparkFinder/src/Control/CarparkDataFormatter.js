// CarparkDataService.js
import { fetchAvailability } from './CarparkAvailabilityAPI';
import { fetchCarparkData } from './CarparkDataFetcher';
import { convertCoordToLatLong } from './CoordinateConverter';

const fetchCarparkDataWithAvailability = async () => {
  const [availabilityMap, csvCarparks] = await Promise.all([fetchAvailability(), fetchCarparkData()]);

  return csvCarparks
    .map((row) => {
      const x = parseFloat(row.x_coord);
      const y = parseFloat(row.y_coord);
      if (isNaN(x) || isNaN(y)) return null;

      const coords = convertCoordToLatLong(x, y);
      const availableLots = availabilityMap[row.car_park_no] || 0;
      const gantryHeight = parseFloat(row.gantry_height) || 0;

      return coords
        ? {
            lat: coords.latitude,
            lng: coords.longitude,
            carparkNumber: row.car_park_no,
            address: row.address || 'N/A',
            availableLots,
            carparkType: row.car_park_type || 'N/A',
            gantryHeight,
          }
        : null;
    })
    .filter(Boolean);
};

export { fetchCarparkDataWithAvailability };

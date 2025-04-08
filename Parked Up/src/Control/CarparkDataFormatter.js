import { fetchAvailability } from './CarparkAvailabilityAPI';
import { fetchCarparkData } from './CarparkDataFetcher';
import { convertCoordToLatLong } from './CoordinateConverter';

/**
 * @module CarparkDataFormatter
 * 
 * This module provides a function for fetching carpark data and its availability, 
 * then combining them into a structured format for further use.
 */

/**
 * Fetches carpark data along with its availability, formats the data, 
 * and returns an array of carpark objects.
 * 
 * This function performs the following operations:
 * 1. Fetches carpark availability data and carpark CSV data concurrently using `Promise.all`.
 * 2. Converts the coordinates from EPSG:3414 projection to latitude and longitude using `convertCoordToLatLong`.
 * 3. Creates an array of carpark objects that includes relevant information such as the carpark number, 
 *    address, available lots, carpark type, and gantry height.
 * 4. Filters out any invalid data or missing coordinates.
 * 
 * @returns {Promise<Object[]>} A promise that resolves to an array of carpark objects with the following properties:
 * @returns {number} return.lat - The latitude of the carpark.
 * @returns {number} return.lng - The longitude of the carpark.
 * @returns {string} return.carparkNumber - The unique identifier for the carpark.
 * @returns {string} return.address - The address of the carpark, or 'N/A' if unavailable.
 * @returns {number} return.availableLots - The number of available parking lots in the carpark.
 * @returns {string} return.carparkType - The type of the carpark, or 'N/A' if unavailable.
 * @returns {number} return.gantryHeight - The gantry height of the carpark.
 * 
 * @example
 * fetchCarparkDataWithAvailability().then((carparks) => {
 *   console.log(carparks); // Logs an array of carpark objects.
 * });
 */
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

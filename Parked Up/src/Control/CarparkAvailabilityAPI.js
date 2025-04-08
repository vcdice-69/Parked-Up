/**
 * @module CarparkAvailabilityAPI
 * 
 * This module is responsible for fetching carpark availability data from an external API.
 * It retrieves the current availability of parking lots for various carparks and
 * returns a map that associates carpark numbers with the number of available lots.
 */

/**
 * Fetches carpark availability data from the public API.
 * 
 * This function retrieves data from the "Carpark Availability" API provided by the
 * Singapore government, processes the data, and creates a map of carpark numbers
 * to the number of available lots.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object mapping carpark numbers
 *                            to the number of available lots.
 * 
 * @example
 * fetchAvailability().then((availabilityMap) => {
 *   console.log(availabilityMap); // Logs a map of carpark numbers to available lots.
 * });
 */
export const fetchAvailability = async () => {
  try {
    const response = await fetch("https://api.data.gov.sg/v1/transport/carpark-availability");
    const apiData = await response.json();
    const availabilityMap = {};

    apiData.items[0].carpark_data.forEach((carpark) => {
      const carparkNumber = carpark.carpark_number;
      const availableLots = carpark.carpark_info.reduce((sum, lot) => sum + parseInt(lot.lots_available, 10), 0);
      availabilityMap[carparkNumber] = availableLots;
    });

    return availabilityMap;
  } catch (error) {
    console.error("Error fetching API data:", error);
    return {};
  }
};

import { fetchCarparkDataWithAvailability } from "./CarparkDataFormatter";

/**
 * @module CarparkController
 * 
 * This module provides functionality for retrieving and filtering carpark data.
 * It interacts with the CarparkDataFormatter module to fetch carpark data and provides
 * utility functions for filtering the data based on specific criteria, such as the address.
 */

/**
 * Fetches carpark data along with availability information.
 * 
 * This function calls the `fetchCarparkDataWithAvailability` function from the 
 * `CarparkDataFormatter` module to retrieve carpark data, including availability
 * of parking lots. It returns a promise that resolves to the carpark data.
 * 
 * @returns {Promise<Object[]>} A promise that resolves to an array of carpark objects.
 * 
 * @example
 * getCarparks().then((carparks) => {
 *   console.log(carparks); // Logs the fetched carpark data with availability information.
 * });
 */
export const getCarparks = async () => {
  return await fetchCarparkDataWithAvailability();
};

/**
 * Filters carpark data based on a query string and the carpark address.
 * 
 * This function filters the list of carparks to include only those whose 
 * address contains the provided query string (case-insensitive).
 * 
 * @param {Object[]} carparks - The array of carpark objects to filter.
 * @param {string} query - The query string to match against carpark addresses.
 * 
 * @returns {Object[]} A filtered array of carpark objects that match the query string.
 * 
 * @example
 * const filteredCarparks = filterCarparksByAddress(carparks, "City");
 * console.log(filteredCarparks); // Logs carparks whose addresses contain "City".
 */
export const filterCarparksByAddress = (carparks, query) => {
  return carparks.filter(carpark =>
    carpark.address.toLowerCase().includes(query.toLowerCase())
  );
};

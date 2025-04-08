import Papa from "papaparse";

/**
 * @module CarparkDataFetcher
 * 
 * This module provides a function to fetch and parse carpark data from a CSV file.
 */

/**
 * Fetches carpark data from a CSV file and parses it into an array of objects.
 * 
 * This function performs the following operations:
 * 1. Fetches the CSV data from the `/HDBCarparkInformation.csv` file.
 * 2. Parses the CSV data using the PapaParse library, which converts the data into an array of objects.
 * 3. Each object corresponds to a row of the CSV file, where keys are the column headers.
 * 
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects representing the carpark data.
 * 
 * @example
 * fetchCarparkData().then((carparks) => {
 *   console.log(carparks); // Logs the parsed carpark data.
 * });
 */
export const fetchCarparkData = async () => {
    try {
        const response = await fetch("/HDBCarparkInformation.csv");
        const csvData = await response.text();

        return new Promise((resolve) => {
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data),
          });
        });
    } 
    catch (error) {
        console.error("Error reading CSV:", error);
        return [];
    }
};

import proj4 from 'proj4';

/**
 * @module CoordinateConverter
 * 
 * This module provides a function to convert coordinates from the EPSG:3414 projection (used in Singapore) 
 * to WGS84 (latitude, longitude) coordinates.
 */

// Define the EPSG:3414 projection for Singapore
const singaporeProjection = '+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1.0 +x_0=28001.642 +y_0=38744.572 +datum=WGS84';

/**
 * Converts coordinates from the EPSG:3414 projection (used in Singapore) to WGS84 (latitude, longitude).
 * 
 * This function takes in coordinates in the EPSG:3414 projection system and converts them into latitude 
 * and longitude values based on the WGS84 coordinate system. This conversion is commonly used when working with 
 * geographic data specific to Singapore.
 * 
 * @param {number} x - The x-coordinate (Eastings) in the EPSG:3414 projection system.
 * @param {number} y - The y-coordinate (Northings) in the EPSG:3414 projection system.
 * 
 * @returns {Object} An object containing the latitude and longitude in WGS84.
 * @returns {number} return.latitude - The latitude in WGS84.
 * @returns {number} return.longitude - The longitude in WGS84.
 * 
 * @example
 * const coordinates = convertCoordToLatLong(28010, 38750);
 * console.log(coordinates.latitude, coordinates.longitude); // Logs the corresponding latitude and longitude.
 */
export function convertCoordToLatLong(x, y) {
  const [longitude, latitude] = proj4(singaporeProjection, 'WGS84', [x, y]);
  return { latitude, longitude };
}

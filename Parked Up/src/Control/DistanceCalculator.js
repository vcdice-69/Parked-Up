/**
 * @module DistanceCalculator
 * 
 * This module provides a function to calculate the distance between two geographical points
 * specified by their latitude and longitude using the Haversine formula.
 * The result is returned in kilometers.
 */

/**
 * Calculates the distance between two points on the Earth's surface.
 * 
 * This function uses the Haversine formula to calculate the great-circle distance between two
 * points given their latitude and longitude in decimal degrees.
 * 
 * @param {number} lat1 - The latitude of the first point in decimal degrees.
 * @param {number} lng1 - The longitude of the first point in decimal degrees.
 * @param {number} lat2 - The latitude of the second point in decimal degrees.
 * @param {number} lng2 - The longitude of the second point in decimal degrees.
 * 
 * @returns {number} The distance between the two points in kilometers.
 * 
 * @example
 * const distance = getDistance(1.3521, 103.8198, 1.290270, 103.851959);
 * console.log(distance); // The distance between the points in kilometers.
 */
export const getDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
};

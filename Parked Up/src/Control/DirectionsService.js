/**
 * @module DirectionsService
 * 
 * This module provides a function to open Google Maps with driving directions from the user's
 * current location to a specified carpark.
 */

/**
 * Handles the process of obtaining directions from the user's current location to a specified carpark.
 * 
 * This function uses the browser's geolocation API to get the user's current location (latitude and longitude),
 * and then opens Google Maps in a new tab with driving directions to the carpark's location.
 * 
 * If geolocation is not supported by the browser, an alert is shown to the user.
 * 
 * @param {Object} carpark - The carpark object containing the latitude and longitude of the destination.
 * @param {number} carpark.lat - The latitude of the carpark.
 * @param {number} carpark.lng - The longitude of the carpark.
 * 
 * @returns {void} This function does not return any value.
 * 
 * @example
 * const carpark = { lat: 1.3521, lng: 103.8198 };
 * handleGetDirections(carpark); // Opens Google Maps with directions from the user's location to the carpark.
 */
export const handleGetDirections = (carpark) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const destination = `${carpark.lat},${carpark.lng}`;

      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}&travelmode=driving`,
        "_blank"
      );
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

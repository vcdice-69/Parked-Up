import { useEffect, useState } from 'react';

/**
 * Custom Hook for handling geolocation functionality.
 * 
 * This hook uses the browser's geolocation API to retrieve the user's current position
 * and returns the coordinates as `center`. If geolocation is not available, it defaults
 * to Singapore's latitude and longitude.
 * 
 * @returns {Object} An object containing:
 * - `center` (Object): The current coordinates of the user.
 *   - `lat` (number): The latitude of the user's current location.
 *   - `lng` (number): The longitude of the user's current location.
 * - `setCenter` (function): A setter function to manually update the `center` state.
 */
export const useGeolocation = () => {
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 }); // Default to Singapore

  /**
   * Attempts to get the current geolocation of the user using the browser's geolocation API.
   * If successful, updates the `center` state with the user's current coordinates.
   * If there is an error or geolocation is unavailable, an error is logged in the console.
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    }
  }, []);

  return { center, setCenter };
};

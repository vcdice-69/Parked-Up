import { useEffect, useState } from 'react';
import { fetchCarparkDataWithAvailability } from '../CarparkDataFormatter';

/**
 * Custom Hook for fetching and managing carpark data with availability.
 * 
 * This hook fetches carpark data, including availability, from an external source 
 * and stores it in the state. It runs the fetch operation once when the component is mounted.
 * 
 * @returns {Array} An array of carpark objects, each containing details such as location,
 *                  carpark number, address, available lots, and gantry height.
 */
export const useCarparks = () => {
  const [carparks, setCarparks] = useState([]);

  /**
   * Fetches carpark data with availability and updates the state with the result.
   * This effect runs only once when the component is mounted (on initial render).
   */
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCarparkDataWithAvailability();
      setCarparks(data);
    };

    fetchData();
  }, []);

  return carparks;
};

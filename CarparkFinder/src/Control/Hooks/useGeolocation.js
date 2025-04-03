import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 }); // Default to Singapore

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

  return {center, setCenter};
};

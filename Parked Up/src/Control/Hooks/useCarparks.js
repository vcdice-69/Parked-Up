import { useEffect, useState } from 'react';
import { fetchCarparkDataWithAvailability } from '../CarparkDataFormatter';

export const useCarparks = () => {
  const [carparks, setCarparks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCarparkDataWithAvailability();
      setCarparks(data);
    };

    fetchData();
  }, []);

  return carparks;
};

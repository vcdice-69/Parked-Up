import { useState, useEffect } from "react";

export const useSearch = (carparks) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCarparksBySearch, setFilteredCarparksBySearch] = useState(carparks);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCarparksBySearch(
        carparks.filter(carpark =>
          carpark.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCarparksBySearch(carparks);
    }
  }, [searchQuery, carparks]);

  return { searchQuery, setSearchQuery, filteredCarparksBySearch };
};

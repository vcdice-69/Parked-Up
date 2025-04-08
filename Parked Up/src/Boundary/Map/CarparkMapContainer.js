import React, { useState, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useGeolocation } from '../../Control/Hooks/useGeolocation';
import { useCarparks } from '../../Control/Hooks/useCarparks';
import { useFavourites } from '../../Control/Hooks/useFavourites';
import { useCarparkFilter } from '../../Control/Hooks/useCarparkFilter'; // ✅ Import carpark filter hook
import MapView from './CarparkMapDisplay';
import CarparkFiltersPanel from '../CarparkFiltersPanel';
import CarparkSearch from '../CarparkSearch';

const MapViewComponent = ({ user }) => {
  const { center, setCenter } = useGeolocation();
  const carparks = useCarparks();
  const [selectedCarpark, setSelectedCarpark] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { userFavourites, handleFavouriteToggle } = useFavourites(user);

  // ✅ Integrate the filtering system
  const {
    filteredCarparks, // Carparks after applying filters
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  } = useCarparkFilter(carparks, center, 100);

  // ✅ Apply address search filter *after* other filters
  const [filteredCarparksByAddress, setFilteredCarparksByAddress] = useState(filteredCarparks);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCarparksByAddress(
        filteredCarparks.filter((carpark) =>
          carpark.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCarparksByAddress(filteredCarparks);
    }
  }, [searchQuery, filteredCarparks]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
        {/* ✅ Filter Toggle Button */}
        <img
          src="../Assets/filter-icon.jpg"
          alt="Filter"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            zIndex: 1000,
            borderRadius: '50%',
            boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
          }}
        />

        {/* ✅ Pass correct filter states & functions to CarparkFiltersPanel */}
        {showFilters && (
          <CarparkFiltersPanel
            availableLotsFilter={availableLotsFilter}
            setAvailableLotsFilter={setAvailableLotsFilter}
            gantryHeightFilter={gantryHeightFilter}
            setGantryHeightFilter={setGantryHeightFilter}
            selectedCarparkTypes={selectedCarparkTypes}
            toggleCarparkType={toggleCarparkType}
          />
        )}

        {/* ✅ Address Search Input */}
        <CarparkSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCarparksByAddress={filteredCarparksByAddress}
          setCenter={setCenter} // Pass setCenter for re-centering map
          setSelectedCarpark={setSelectedCarpark}
        />

        {/* ✅ Pass correctly filtered carparks to MapView */}
        <MapView
          center={center}
          filteredCarparks={filteredCarparksByAddress}
          setSelectedCarpark={setSelectedCarpark}
          selectedCarpark={selectedCarpark}
          user={user}
          handleFavouriteToggle={handleFavouriteToggle}
          userFavourites={userFavourites}
        />
      </div>
    </LoadScript>
  );
};

export default MapViewComponent;

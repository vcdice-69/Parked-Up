import React, { useEffect, useState } from "react";
import { getCarparks } from "../Control/CarparkService";
import { getUserFavourites, toggleFavourite } from "../Control/FavouritesService";
import { useGeolocation } from "../Control/useGeolocation";
import { useCarparkList } from "../Control/useCarparkList";
import { useCarparkFilter } from "../Entity/CarparkFilterService";
import CarparkFiltersPanel from "./CarparkFiltersPanel"; // Import the CarparkFiltersPanel

const ListViewComponent = ({ user }) => {
  const [carparks, setCarparks] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [expandedCarpark, setExpandedCarpark] = useState(null); // This keeps track of the carpark number that's expanded
  const [showFilters, setShowFilters] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(10);

  const { center: userLocation } = useGeolocation();
  
  // Filters
  const {
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  } = useCarparkFilter(carparks);

  // Use carpark list with filters applied
  const { filteredCarparks, searchTerm, setSearchTerm } = useCarparkList(
    carparks,
    userLocation,
    distanceFilter,
    availableLotsFilter,
    gantryHeightFilter,
    selectedCarparkTypes
  );

  useEffect(() => {
    const fetchData = async () => {
      setCarparks(await getCarparks());
      if (user?.email) {
        setFavourites(await getUserFavourites(user.email));
      }
    };
    fetchData();
  }, [user]);

  const handleFavouriteToggle = async (carparkNumber) => {
    if (!user) {
      alert("Please log in to manage favourites.");
      return;
    }
    const updatedFavourites = await toggleFavourite(user.email, carparkNumber, favourites);
    setFavourites(updatedFavourites);
  };

  // Handle expanding the carpark item to show more details
  const handleExpandCarpark = (carparkNumber) => {
    setExpandedCarpark(expandedCarpark === carparkNumber ? null : carparkNumber);
  };

  return (
    <div className="list-view-container">
      {/* Filter Button */}
      <img
        src="../Assets/filter-icon.jpg"
        alt="Filter"
        onClick={() => setShowFilters(!showFilters)} // Toggle showFilters state
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          cursor: "pointer",
        }}
      />

      {/* Filters Panel (CarparkFiltersPanel) */}
      {showFilters && (
        <div className="filters-panel">
          <h3>Filters</h3>
          {/* Max Distance Filter */}
          <label>Max Distance (km):
            <input
              type="range"
              min="1"
              max="50"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
            />
            <span>{distanceFilter} km</span>
          </label>

          {/* Carpark Filter Panel */}
          <CarparkFiltersPanel
            availableLotsFilter={availableLotsFilter}
            setAvailableLotsFilter={setAvailableLotsFilter}
            gantryHeightFilter={gantryHeightFilter}
            setGantryHeightFilter={setGantryHeightFilter}
            selectedCarparkTypes={selectedCarparkTypes}
            toggleCarparkType={toggleCarparkType}
          />
        </div>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by address"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* List of Carparks */}
      <ul className="carpark-list">
        {filteredCarparks.map((carpark) => (
          <li key={carpark.carparkNumber} className="carpark-item">
            <div className="carpark-summary" onClick={() => handleExpandCarpark(carpark.carparkNumber)}>
              <span>{carpark.address}</span>
              <span>{carpark.availableLots} lots available</span>
              <span>{carpark.distance ? carpark.distance.toFixed(2) + " km away" : "Distance unavailable"}</span>
              <button onClick={() => handleFavouriteToggle(carpark.carparkNumber)}>
                {favourites.includes(carpark.carparkNumber) ? "❤️" : "♡"}
              </button>
            </div>

            {/* Expandable Carpark Details */}
            {expandedCarpark === carpark.carparkNumber && (
              <div className="carpark-details">
                <p><strong>Carpark Number:</strong> {carpark.carparkNumber}</p>
                <p><strong>Address:</strong> {carpark.address}</p>
                <p><strong>Available Lots:</strong> {carpark.availableLots}</p>
                <p><strong>Gantry Height:</strong> {carpark.gantryHeight ? carpark.gantryHeight + "m" : "N/A"}</p>
                <p><strong>Carpark Type:</strong> {carpark.carparkType}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListViewComponent;

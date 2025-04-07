import React, { useEffect, useState } from "react";
import { getCarparks } from "../../Control/CarparkController";
import { getUserFavourites, toggleFavourite } from "../../Control/FavouritesService";
import { useGeolocation } from "../../Control/Hooks/useGeolocation";
import { useCarparkList } from "../../Control/Hooks/useCarparkList";
import { useCarparkFilter } from "../../Control/Hooks/useCarparkFilter";
import CarparkFiltersPanel from "../CarparkFiltersPanel"; 
import CarparkSearch from "../CarparkSearch"; // ✅ Import CarparkSearch
import { handleGetDirections } from "../../Control/DirectionsService";

const ListViewComponent = ({ user }) => {
  const [carparks, setCarparks] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [expandedCarpark, setExpandedCarpark] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { center: userLocation, setCenter } = useGeolocation();

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
  const { filteredCarparks } = useCarparkList(
    carparks,
    userLocation,
    distanceFilter,
    availableLotsFilter,
    gantryHeightFilter,
    selectedCarparkTypes
  );

  // Apply search filter after other filters
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

  const handleExpandCarpark = (carparkNumber) => {
    setExpandedCarpark(expandedCarpark === carparkNumber ? null : carparkNumber);
  };

  return (
    <div className="list-view-container">
      {/* ✅ Integrate CarparkSearch */}
      <CarparkSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCarparksByAddress={filteredCarparksByAddress}
        setCenter={setCenter} 
        setSelectedCarpark={() => {}}
      />

      {/* Filter Button */}
      <img
        src="../Assets/filter-icon.jpg"
        alt="Filter"
        onClick={() => setShowFilters(!showFilters)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          cursor: "pointer",
        }}
      />

      {/* Filters Panel */}
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

      {/* List of Carparks */}
      <ul className="carpark-list">
        {filteredCarparksByAddress.map((carpark) => (
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
                <button onClick={() => handleGetDirections(carpark)}>Directions</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListViewComponent;

import React, { useEffect, useState } from "react";
import { fetchCarparkDataWithAvailability } from "../Services/CarparkDataService";
import { useCarparkFilter } from "../Services/CarparkFilterService";

const ListView = () => {
  const [carparks, setCarparks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCarpark, setExpandedCarpark] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(10); // Default distance filter (in km)

  // Filters
  const {
    filteredCarparks,
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  } = useCarparkFilter(carparks);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => console.error("Geolocation permission denied. Using default location.")
      );
    }

    const fetchCarparks = async () => {
      const data = await fetchCarparkDataWithAvailability();
      setCarparks(data);
    };

    fetchCarparks();
  }, []);

  // Function to calculate distance between user and carpark
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
  };

  // Sort carparks by distance and apply filters
  const sortedCarparks = userLocation
    ? filteredCarparks
        .map((carpark) => ({
          ...carpark,
          distance: getDistance(userLocation.lat, userLocation.lng, carpark.lat, carpark.lng),
        }))
        .filter((carpark) => carpark.distance <= distanceFilter) // Filter by distance
        .sort((a, b) => a.distance - b.distance)
    : filteredCarparks;

  return (
    <div className="list-view-container">
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
          zIndex: 1000,
          borderRadius: "50%",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
        }}
      />

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <h3>Filters</h3>
          <label>
            Max Distance (km):
            <input
              type="range"
              min="1"
              max="50"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
            />
            <span>{distanceFilter} km</span>
          </label>

          <label>
            Min Available Lots:
            <input
              type="range"
              min="0"
              max="100"
              value={availableLotsFilter}
              onChange={(e) => setAvailableLotsFilter(Number(e.target.value))}
            />
            <span>{availableLotsFilter}</span>
          </label>

          <label>
            Min Gantry Height (m):
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={gantryHeightFilter}
              onChange={(e) => setGantryHeightFilter(Number(e.target.value))}
            />
            <span>{gantryHeightFilter}m</span>
          </label>

          <label>Carpark Types:</label>
          {["BASEMENT CAR PARK", "MULTI-STOREY CAR PARK", "SURFACE CAR PARK", "MECHANISED CAR PARK", "MECHANISED AND SURFACE CAR PARK"].map((type) => (
            <div key={type}>
              <input
                type="checkbox"
                checked={selectedCarparkTypes.includes(type)}
                onChange={() => toggleCarparkType(type)}
              />
              <span>{type}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by address"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* List of Carparks */}
      <ul className="carpark-list">
        {sortedCarparks
          .filter((carpark) => carpark.address.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((carpark) => (
            <li key={carpark.carparkNumber} className="carpark-item">
              <div className="carpark-summary" onClick={() => setExpandedCarpark(expandedCarpark === carpark.carparkNumber ? null : carpark.carparkNumber)}>
                <span>{carpark.address}</span>
                <span>{carpark.availableLots} lots available</span>
                <span>{carpark.distance ? carpark.distance.toFixed(2) + " km away" : "Distance unavailable"}</span>
              </div>

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

export default ListView;

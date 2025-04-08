import React, { useEffect, useState } from "react";
import { getCarparks } from "../../Control/CarparkController";
import { getUserFavourites, toggleFavourite } from "../../Control/FavouritesService";
import { useGeolocation } from "../../Control/Hooks/useGeolocation";
import { useCarparkList } from "../../Control/Hooks/useCarparkList";
import { useCarparkFilter } from "../../Control/Hooks/useCarparkFilter";
import CarparkFiltersPanel from "../CarparkFiltersPanel";
import CarparkSearch from "../CarparkSearch";
import { handleGetDirections } from "../../Control/DirectionsService";

const ListViewComponent = ({ user }) => {
  const [carparks, setCarparks] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [expandedCarpark, setExpandedCarpark] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { center: userLocation, setCenter } = useGeolocation();

  const {
    availableLotsFilter,
    setAvailableLotsFilter,
    gantryHeightFilter,
    setGantryHeightFilter,
    selectedCarparkTypes,
    toggleCarparkType,
  } = useCarparkFilter(); // ✅ Just manages state

  const { filteredCarparks } = useCarparkList(
    carparks,
    userLocation,
    distanceFilter,
    availableLotsFilter,
    gantryHeightFilter,
    selectedCarparkTypes
  );

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
    <div className="list-view-container" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Search box */}
      <div style={{
        position: "absolute",
        top: "101px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        textAlign: "center"
      }}>
        <CarparkSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCarparksByAddress={filteredCarparksByAddress}
          setCenter={setCenter}
          setSelectedCarpark={() => {}}
        />
      </div>

      {/* Filter toggle icon */}
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
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}
      />

      {/* Filters Panel */}
      {showFilters && (
        <div
          className="filters-panel"
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            marginBottom: "20px"
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Filters</h3>
          <label style={{ display: "block", marginBottom: "10px" }}>
            Max Distance (km): {distanceFilter} km
            <input
              type="range"
              min="1"
              max="50"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </label>

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

      {/* Carpark List */}
      <ul className="carpark-list" style={{ listStyleType: "none", padding: 0 }}>
        {filteredCarparksByAddress.map((carpark) => (
          <li
            key={carpark.carparkNumber}
            className="carpark-item"
            style={{
              background: "#f9f9f9",
              marginBottom: "15px",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease-in-out"
            }}
          >
            <div
              className="carpark-summary"
              onClick={() => handleExpandCarpark(carpark.carparkNumber)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <div style={{ textAlign: "left" }}>
                <strong>{carpark.address}</strong><br />
                <span style={{ fontSize: "13px", color: "#555" }}>
                  {carpark.availableLots} lots available
                </span><br />
                <span style={{ fontSize: "13px", color: "#777" }}>
                  {carpark.distance ? `${carpark.distance.toFixed(2)} km away` : "Distance unavailable"}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavouriteToggle(carpark.carparkNumber);
                }}
                style={{
                  fontSize: "20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: favourites.includes(carpark.carparkNumber) ? "red" : "gray"
                }}
              >
                {favourites.includes(carpark.carparkNumber) ? "❤️" : "♡"}
              </button>
            </div>

            {/* Expand Details */}
            {expandedCarpark === carpark.carparkNumber && (
              <div
                className="carpark-details"
                style={{
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid #ddd",
                  fontSize: "14px"
                }}
              >
                <p><strong>Carpark Number:</strong> {carpark.carparkNumber}</p>
                <p><strong>Address:</strong> {carpark.address}</p>
                <p><strong>Available Lots:</strong> {carpark.availableLots}</p>
                <p><strong>Gantry Height:</strong> {carpark.gantryHeight ? `${carpark.gantryHeight}m` : "N/A"}</p>
                <p><strong>Carpark Type:</strong> {carpark.carparkType}</p>
                <button
                  onClick={() => handleGetDirections(carpark)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#4285F4",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Directions
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListViewComponent;

import React from 'react';

/**
 * CarparkSearch Component
 * 
 * This component provides a search input field that allows users to search for carparks by address.
 * It displays a list of matching carparks based on the search query and allows the user to select
 * a carpark from the list. Upon selection, the map center is updated to the selected carpark's location,
 * and the search query is cleared.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.searchQuery - The current search query for filtering carparks by address.
 * @param {function} props.setSearchQuery - A function to update the search query state.
 * @param {Array} props.filteredCarparksByAddress - A list of carparks that match the search query.
 * @param {function} props.setCenter - A function to update the map center when a carpark is selected.
 * @param {function} props.setSelectedCarpark - A function to update the selected carpark state.
 * 
 * @returns {JSX.Element} The rendered CarparkSearch component.
 */
const CarparkSearch = ({ searchQuery, setSearchQuery, filteredCarparksByAddress, setCenter, setSelectedCarpark }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
      width: "80%",
      maxWidth: "500px",
      textAlign: "center",
    }}
  >
    <input
      type="text"
      placeholder="Search for carparks by address..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        padding: "8px",
        fontSize: "14px",
        borderRadius: "4px",
        boxSizing: "border-box",
        width: "100%",
        boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
      }}
    />
    {searchQuery && (
      <ul
        style={{
          listStyleType: "none",
          padding: "0",
          margin: "0",
          backgroundColor: "white",
          maxHeight: "200px",
          overflowY: "auto",
          borderRadius: "4px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "100%",
        }}
      >
        {filteredCarparksByAddress.map((carpark) => (
          <li
            key={carpark.id}
            onClick={() => {
              setCenter({ lat: carpark.lat, lng: carpark.lng });
              setSelectedCarpark(carpark);
              setSearchQuery(""); // Clear search query after selection
            }}
            style={{
              cursor: "pointer",
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {carpark.address}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default CarparkSearch;

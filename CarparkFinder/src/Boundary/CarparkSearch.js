import React from 'react';

const CarparkSearch = ({ searchQuery, setSearchQuery, filteredCarparksByAddress, setCenter, setSelectedCarpark }) => (
  <div
    style={{
      position: "absolute",
      top: "20px",
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

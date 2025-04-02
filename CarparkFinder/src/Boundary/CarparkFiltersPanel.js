import React from "react";

const CarparkFiltersPanel = ({
  availableLotsFilter,
  setAvailableLotsFilter,
  gantryHeightFilter,
  setGantryHeightFilter,
  selectedCarparkTypes = [], // Default to an empty array to prevent undefined errors
  toggleCarparkType,
}) => {
  const carparkTypes = [
    "BASEMENT CAR PARK",
    "MULTI-STOREY CAR PARK",
    "SURFACE CAR PARK",
    "MECHANISED CAR PARK",
    "MECHANISED AND SURFACE CAR PARK",
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: "20px",
        bottom: "80px",
        width: "300px",
        padding: "15px",
        background: "#fff",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        transition: "left 0.3s ease-in-out",
        zIndex: 999,
      }}
    >
      <h3>Filters</h3>

      <label><strong>Available Lots: {availableLotsFilter}+</strong></label>
      <input
        type="range"
        min="0"
        max="100"
        value={availableLotsFilter}
        onChange={(e) => setAvailableLotsFilter(parseInt(e.target.value))}
        style={{ width: "100%" }}
      />

      <label><strong>Gantry Height: {gantryHeightFilter}m+</strong></label>
      <input
        type="range"
        min="0"
        max="2.5"
        step="0.1"
        value={gantryHeightFilter}
        onChange={(e) => setGantryHeightFilter(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />

      <h4>Carpark Type</h4>
      {carparkTypes.map((type) => (
        <div key={type}>
          <input
            type="checkbox"
            checked={selectedCarparkTypes?.includes(type) || false} // Use optional chaining to prevent undefined errors
            onChange={() => toggleCarparkType(type)}
          />
          <label>{type}</label>
        </div>
      ))}
    </div>
  );
};

export default CarparkFiltersPanel;

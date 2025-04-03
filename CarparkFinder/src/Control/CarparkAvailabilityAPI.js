export const fetchAvailability = async () => {
  try {
    const response = await fetch("https://api.data.gov.sg/v1/transport/carpark-availability");
    const apiData = await response.json();
    const availabilityMap = {};

    apiData.items[0].carpark_data.forEach((carpark) => {
      const carparkNumber = carpark.carpark_number;
      const availableLots = carpark.carpark_info.reduce((sum, lot) => sum + parseInt(lot.lots_available, 10), 0);
      availabilityMap[carparkNumber] = availableLots;
    });

    return availabilityMap;
  } catch (error) {
    console.error("Error fetching API data:", error);
    return {};
  }
};
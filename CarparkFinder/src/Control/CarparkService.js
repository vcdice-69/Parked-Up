import { fetchCarparkDataWithAvailability } from "../Entity/CarparkDataService";

export const getCarparks = async () => {
  return await fetchCarparkDataWithAvailability();
};

export const filterCarparksByAddress = (carparks, query) => {
  return carparks.filter(carpark =>
    carpark.address.toLowerCase().includes(query.toLowerCase())
  );
};

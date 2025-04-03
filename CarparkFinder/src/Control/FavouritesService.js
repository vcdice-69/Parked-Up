import { addFavourite, removeFavourite, fetchFavourites } from "./FavouritesAPI";

export const toggleFavourite = async (email, carparkNo, userFavourites) => {
  if (userFavourites.includes(carparkNo)) {
    const response = await removeFavourite(email, carparkNo);
    if (response.success) {
      return userFavourites.filter((fav) => fav !== carparkNo);
    }
  } else {
    const response = await addFavourite(email, carparkNo);
    if (response.success) {
      return [...userFavourites, carparkNo];
    }
  }
  return userFavourites;
};

export const getUserFavourites = async (email) => {
  const data = await fetchFavourites(email);
  return data.success ? data.favourites : [];
};

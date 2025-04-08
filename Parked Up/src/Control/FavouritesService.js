/**
 * @module FavouritesService
 * 
 * This module provides services to manage a user's favourite carparks. It interacts with the `FavouritesAPI` to
 * allow adding, removing, and fetching favourites for a user. The service helps users toggle between their favourites
 * and retrieve their current favourite carparks.
 * 
 * The main functionality includes:
 * - Toggling a carpark as a favourite or removing it from favourites.
 * - Retrieving a user's list of favourite carparks.
 */

import { addFavourite, removeFavourite, fetchFavourites } from "./FavouritesAPI";

/**
 * Toggles a carpark as a favourite for the user.
 * 
 * This method checks whether a carpark is already in the user's list of favourites. If it is, the carpark is removed
 * from the favourites list; otherwise, it is added. The method returns the updated list of favourites if the operation
 * is successful.
 * 
 * @param {string} email - The email address of the user whose favourites are being modified.
 * @param {string} carparkNo - The carpark number to be added or removed from favourites.
 * @param {Array<string>} userFavourites - The current list of carparks the user has marked as favourites.
 * 
 * @returns {Promise<Array<string>>} A promise that resolves to the updated list of favourite carparks.
 * 
 * @throws {Error} If the API request to add or remove a favourite fails.
 * 
 * @example
 * const updatedFavourites = await toggleFavourite("user@example.com", "C123", ["C001", "C002"]);
 * console.log(updatedFavourites); // The updated list of favourites after toggling.
 */
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

/**
 * Retrieves the list of favourites for a user.
 * 
 * This method fetches the user's list of favourite carparks from the backend API using the user's email address.
 * It returns an array of carpark numbers that are currently marked as favourites.
 * 
 * @param {string} email - The email address of the user whose favourites are being fetched.
 * 
 * @returns {Promise<Array<string>>} A promise that resolves to an array of carpark numbers that are favourites.
 * 
 * @throws {Error} If the API request to fetch favourites fails.
 * 
 * @example
 * const favourites = await getUserFavourites("user@example.com");
 * console.log(favourites); // The list of the user's current favourite carparks.
 */
export const getUserFavourites = async (email) => {
  const data = await fetchFavourites(email);
  return data.success ? data.favourites : [];
};

import { useState, useEffect } from 'react';
import { fetchFavourites, addFavourite, removeFavourite } from '../FavouritesAPI';

/**
 * Custom Hook for managing user favourites.
 * 
 * This hook fetches the list of user favourites from the API, stores them in a Set
 * for efficient lookup, and allows toggling the user's favourites with optimistic UI updates.
 * 
 * @param {Object} user - The user object, which should contain the `email` property.
 * @returns {Object} An object containing:
 * - `userFavourites` (Set): A set of carpark numbers that the user has marked as favourites.
 * - `handleFavouriteToggle` (function): A function to toggle the favourite status of a carpark.
 */
export const useFavourites = (user) => {
  const [userFavourites, setUserFavourites] = useState(new Set()); // Use Set for better performance

  /**
   * Fetches the user's favourites from the API and updates the state.
   * This effect runs whenever the `user` object changes.
   */
  useEffect(() => {
    if (user?.email) {
      const fetchData = async () => {
        try {
          const response = await fetchFavourites(user.email);
          setUserFavourites(new Set(response.favourites || [])); // Store as a Set
        } catch (error) {
          console.error('Error fetching favourites:', error);
          setUserFavourites(new Set()); // Fallback to empty set
        }
      };

      fetchData();
    }
  }, [user]);

  /**
   * Toggles the favourite status of a given carpark.
   * 
   * This function updates the local state optimistically before sending the API request.
   * If the API request fails, it reverts the local state.
   * 
   * @param {string} carparkNo - The carpark number to be toggled as favourite or unfavourite.
   */
  const handleFavouriteToggle = async (carparkNo) => {
    if (!user?.email) {
      console.error("User not logged in.");
      return;
    }

    // Optimistic update: Modify state before making API request
    setUserFavourites((prevFavourites) => {
      const newFavourites = new Set(prevFavourites);
      if (newFavourites.has(carparkNo)) {
        newFavourites.delete(carparkNo);
      } else {
        newFavourites.add(carparkNo);
      }
      return newFavourites;
    });

    try {
      if (userFavourites.has(carparkNo)) {
        await removeFavourite(user.email, carparkNo);
      } else {
        await addFavourite(user.email, carparkNo);
      }
    } catch (error) {
      console.error('Error handling favourite toggle:', error);

      // If the API call fails, revert the change
      setUserFavourites((prevFavourites) => {
        const newFavourites = new Set(prevFavourites);
        if (newFavourites.has(carparkNo)) {
          newFavourites.delete(carparkNo);
        } else {
          newFavourites.add(carparkNo);
        }
        return newFavourites;
      });
    }
  };

  return { userFavourites, handleFavouriteToggle };
};

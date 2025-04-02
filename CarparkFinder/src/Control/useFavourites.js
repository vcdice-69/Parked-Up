import { useState, useEffect } from 'react';
import { fetchFavourites, addFavourite, removeFavourite } from '../Entity/FavouritesBackendInteraction';

export const useFavourites = (user) => {
  const [userFavourites, setUserFavourites] = useState(new Set()); // Use Set for better performance

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

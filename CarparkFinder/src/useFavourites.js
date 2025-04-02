import { useEffect, useState } from "react";
import { addFavourite, removeFavourite, fetchFavourites } from "../Services/FavouritesService";

const useFavourites = (user) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetchFavourites(user.email).then((data) => {
        if (data.success) {
          setFavourites(data.favourites);
        }
      });
    }
  }, [user]);

  const handleFavouriteToggle = async (carparkNo) => {
    if (!user?.email) {
      alert("Please login to manage favourites");
      return;
    }

    if (favourites.includes(carparkNo)) {
      await removeFavourite(user.email, carparkNo);
      setFavourites((prev) => prev.filter((fav) => fav !== carparkNo));
    } else {
      await addFavourite(user.email, carparkNo);
      setFavourites((prev) => [...prev, carparkNo]);
    }
  };

  return { favourites, handleFavouriteToggle };
};

export default useFavourites;

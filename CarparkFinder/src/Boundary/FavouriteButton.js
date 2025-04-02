import React from 'react';

const FavouriteButton = ({ isFavourited, onToggleFavourite }) => {
  return (
    <button
      onClick={onToggleFavourite}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        color: isFavourited ? 'red' : 'gray',
      }}
    >
      {isFavourited ? '❤️' : '♡'}
    </button>
  );
};

export default FavouriteButton;
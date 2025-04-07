export const handleGetDirections = (carpark) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destination = `${carpark.lat},${carpark.lng}`;
  
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}&travelmode=driving`,
          "_blank"
        );
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
};
  
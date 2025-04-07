import proj4 from 'proj4';

// Define the EPSG:3414 projection for Singapore
const singaporeProjection = '+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1.0 +x_0=28001.642 +y_0=38744.572 +datum=WGS84';

// Convert to WGS84 (latitude, longitude)
export function convertCoordToLatLong(x, y) {
  const [longitude, latitude] = proj4(singaporeProjection, 'WGS84', [x, y]);
  return { latitude, longitude };
}

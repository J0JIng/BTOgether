import { getDistanceFromLatLonInKm } from "../utils/GetDistanceFromLatLonInKm";

export const getAmenities = (chosenJson, data) => {

  if (chosenJson) {
    return fetch(chosenJson)
      .then((response) => response.json())
      .then((dat) => {
        const newMarkers = dat.features
          .map((feature) => {
            const { Description } = feature.properties;
            const { coordinates } = feature.geometry;
            const [lng, lat] = coordinates; // Leaflet uses [lat, lng]
            return {
              geocode: [lat, lng],
              popUp: Description, // Assuming Description contains HTML content
            };
          })
          // Filter markers by distance
          .filter((marker) => {
            if (!data.latitude || !data.longitude)
              return true; // Show all if no home marker is set
            const distanceFromHome = getDistanceFromLatLonInKm(
              data.latitude, data.longitude, marker.geocode[0], marker.geocode[1]);
            return distanceFromHome <= 1; // 1 for 1km
          });
        return newMarkers.length; // Return the count of newMarkers
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
        return 0; // Return 0 if there's an error
      });
  }
};
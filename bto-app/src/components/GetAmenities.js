import { getDistanceFromLatLonInKm } from "../utils/GetDistanceFromLatLonInKm";

/**
 *
 * @param {GeoJSON} chosenJson - The GEOJson file for which amenities are in the search radius
 * @param {Object} data - The center of the radius to search from, in the format { latitude, longitude }
 * @returns {int} - The number of amenities in 1km radius of data's coordinates
 */

export const getAmenities = async (chosenJson, data, radius) => {
  try {
    if (chosenJson) {
      const response = await fetch(chosenJson);
      const dat = await response.json();

      const newMarkers = dat.features.map((feature) => {
        const { Description } = feature.properties;
        const { coordinates } = feature.geometry;
        const [lng, lat] = coordinates; // Leaflet uses [lat, lng]
        return {
          geocode: [lat, lng],
          popUp: Description, // Assuming Description contains HTML content
        };
      });

      // Filter markers by distance
      const filteredMarkers = newMarkers.filter((marker) => {
        if (!data.latitude || !data.longitude) return true; // Show all if no home marker is set
        const distanceFromHome = getDistanceFromLatLonInKm(
          data.latitude,
          data.longitude,
          marker.geocode[0],
          marker.geocode[1]
        );
        return distanceFromHome <= radius; // 1 for 1km
      });

      return filteredMarkers.length; // Return the count of filtered markers
    }
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return 0; // Return 0 if there's an error
  }
};

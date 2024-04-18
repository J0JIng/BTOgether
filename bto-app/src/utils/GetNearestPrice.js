import { getDistanceFromLatLonInKm } from "./GetDistanceFromLatLonInKm";

/**
 * Get the nearest amenities from a coordinate in the GeoJSON data, filtered by distance and another condition.
 *
 * @param {string} chosenJson - The URL of the GeoJSON file.
 * @param {object} data - An object containing latitude and longitude of the point to measure from.
 * @returns {object} nearest - An object containing the nearest amenity, distance, and properties.
 */
export function GetNearestPrice(chosenJson, data , type , year) {
  let nearest = { obj: null, dist: null, properties: null };
  if (chosenJson) {
    return fetch(chosenJson)
      .then((response) => response.json())
      .then((dat) => {
        const newMarkers = dat.features
          .map((feature) => {
            const { coordinates } = feature.geometry;
            const [lng, lat] = coordinates; // Leaflet uses [lat, lng]
            return {
              geocode: [lat, lng],
              properties: feature.properties, // Include all properties
            };
          })
          // Filter markers by distance and another condition
          .filter((marker) => {
            if (!data.latitude || !data.longitude) return true; // Show all if no home marker is set
            
            // Add your additional condition here (example: flat type)
            const flatTypeCondition = marker.properties.flat_type === type+" ROOM";

            const yearCondition = marker.properties.year === year;

            // Calculate distance from home
            const distanceFromHome = getDistanceFromLatLonInKm(
              data.latitude,
              data.longitude,
              marker.geocode[1], // SWAP because data different
              marker.geocode[0]
            );

            // Update nearest if the marker meets the conditions and is closer than the current nearest
            if (yearCondition && flatTypeCondition && (distanceFromHome <= nearest.dist || nearest.dist === null)) {
              nearest = {
                obj: marker,
                dist: distanceFromHome,
                properties: marker.properties,
              };
            }

            // Return true to keep the marker if it meets the conditions
            return flatTypeCondition;
          });

        return nearest; // Return the nearest marker
      })
      .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
        return null; // Return null if there's an error
      });
  }
}
